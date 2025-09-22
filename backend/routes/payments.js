import express from 'express';
import axios from 'axios';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';
import Order from '../models/Order.js';

const router = express.Router();

// Paystack configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Helper function to make Paystack API calls
const paystackAPI = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
});

// @route   POST /api/payments/initialize
// @desc    Initialize Paystack payment
// @access  Public
router.post('/initialize', [
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('amount').isNumeric().withMessage('Valid amount is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { orderId, email, amount } = req.body;

    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify email matches order customer
    if (order.customer.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: 'Email does not match order customer'
      });
    }

    // Convert amount to kobo (Paystack uses kobo for GHS)
    const amountInKobo = Math.round(amount * 100);

    // Initialize payment with Paystack
    const paymentData = {
      email,
      amount: amountInKobo,
      currency: 'GHS',
      reference: `OOTD_${order.orderNumber}_${Date.now()}`,
      callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
      metadata: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        customerName: `${order.customer.firstName} ${order.customer.lastName}`,
        custom_fields: [
          {
            display_name: 'Order Number',
            variable_name: 'order_number',
            value: order.orderNumber
          },
          {
            display_name: 'Customer Name',
            variable_name: 'customer_name',
            value: `${order.customer.firstName} ${order.customer.lastName}`
          }
        ]
      },
      channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
    };

    const response = await paystackAPI.post('/transaction/initialize', paymentData);

    if (response.data.status) {
      // Update order with payment reference
      order.paymentDetails.paystackReference = response.data.data.reference;
      await order.save();

      res.json({
        success: true,
        message: 'Payment initialized successfully',
        data: {
          authorizationUrl: response.data.data.authorization_url,
          accessCode: response.data.data.access_code,
          reference: response.data.data.reference
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to initialize payment',
        error: response.data.message
      });
    }

  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during payment initialization',
      error: error.response?.data?.message || error.message
    });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify Paystack payment
// @access  Public
router.post('/verify', [
  body('reference').notEmpty().withMessage('Payment reference is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { reference } = req.body;

    // Verify payment with Paystack
    const response = await paystackAPI.get(`/transaction/verify/${reference}`);

    if (response.data.status && response.data.data.status === 'success') {
      const paymentData = response.data.data;

      // Find order by reference
      const order = await Order.findOne({
        'paymentDetails.paystackReference': reference
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found for this payment'
        });
      }

      // Update order payment status
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      order.paymentDetails.transactionId = paymentData.id;
      order.paymentDetails.authorizationCode = paymentData.authorization?.authorization_code;

      await order.save();

      res.json({
        success: true,
        message: 'Payment verified successfully! Your order has been confirmed. 🎉',
        data: {
          order: order.summary,
          payment: {
            amount: paymentData.amount / 100, // Convert back from kobo
            currency: paymentData.currency,
            paidAt: paymentData.paid_at,
            channel: paymentData.channel
          }
        }
      });

    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        error: response.data.data?.gateway_response || 'Payment not successful'
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during payment verification',
      error: error.response?.data?.message || error.message
    });
  }
});

// @route   POST /api/payments/webhook
// @desc    Handle Paystack webhook
// @access  Public (but verified with Paystack signature)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }

    const event = req.body;

    switch (event.event) {
      case 'charge.success':
        await handleSuccessfulPayment(event.data);
        break;
      case 'charge.failed':
        await handleFailedPayment(event.data);
        break;
      default:
        console.log(`Unhandled webhook event: ${event.event}`);
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing error'
    });
  }
});

// Helper function to handle successful payment
async function handleSuccessfulPayment(paymentData) {
  try {
    const order = await Order.findOne({
      'paymentDetails.paystackReference': paymentData.reference
    });

    if (order && order.paymentStatus !== 'paid') {
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      order.paymentDetails.transactionId = paymentData.id;
      order.paymentDetails.authorizationCode = paymentData.authorization?.authorization_code;

      await order.save();

      // TODO: Send confirmation email
      console.log(`Payment confirmed for order ${order.orderNumber}`);
    }
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

// Helper function to handle failed payment
async function handleFailedPayment(paymentData) {
  try {
    const order = await Order.findOne({
      'paymentDetails.paystackReference': paymentData.reference
    });

    if (order) {
      order.paymentStatus = 'failed';
      await order.save();

      console.log(`Payment failed for order ${order.orderNumber}`);
    }
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}

// @route   GET /api/payments/banks
// @desc    Get list of banks for bank transfer
// @access  Public
router.get('/banks', async (req, res) => {
  try {
    const response = await paystackAPI.get('/bank?country=ghana');

    if (response.data.status) {
      res.json({
        success: true,
        data: response.data.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to fetch banks'
      });
    }

  } catch (error) {
    console.error('Fetch banks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching banks'
    });
  }
});

// @route   POST /api/payments/mobile-money
// @desc    Initialize mobile money payment
// @access  Public
router.post('/mobile-money', [
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('phone').matches(/^(\+233|0)[0-9]{9}$/).withMessage('Valid Ghana phone number is required'),
  body('provider').isIn(['mtn', 'vodafone', 'airteltigo']).withMessage('Valid mobile money provider is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { orderId, phone, provider, email } = req.body;

    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify email matches order customer (if provided)
    if (email && order.customer.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: 'Email does not match order customer'
      });
    }

    // Convert amount to kobo
    const amountInKobo = Math.round(order.total * 100);

    // Initialize mobile money payment
    const paymentData = {
      email: order.customer.email,
      amount: amountInKobo,
      currency: 'GHS',
      reference: `OOTD_MM_${order.orderNumber}_${Date.now()}`,
      mobile_money: {
        phone: phone,
        provider: provider
      },
      metadata: {
        orderId: order._id,
        orderNumber: order.orderNumber
      }
    };

    const response = await paystackAPI.post('/charge', paymentData);

    if (response.data.status) {
      // Update order with mobile money details
      order.paymentMethod = 'mobile_money';
      order.paymentDetails.paystackReference = response.data.data.reference;
      order.paymentDetails.mobileMoneyNumber = phone;
      await order.save();

      res.json({
        success: true,
        message: 'Mobile money payment initiated. Please check your phone for the prompt.',
        data: {
          reference: response.data.data.reference,
          status: response.data.data.status
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to initiate mobile money payment',
        error: response.data.message
      });
    }

  } catch (error) {
    console.error('Mobile money payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during mobile money payment',
      error: error.response?.data?.message || error.message
    });
  }
});

export default router;
