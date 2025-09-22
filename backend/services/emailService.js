import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email templates
const emailTemplates = {
  orderConfirmation: (order, customer) => ({
    subject: `🛍️ Order Confirmed - ${order.orderNumber} | OOTD Ghana`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #000; margin: 0;">OOTD Ghana</h1>
          <p style="color: #666; margin: 5px 0;">Easy brunch outfits for the modern Ghanaian woman</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #000; margin-top: 0;">Order Confirmed! 🎉</h2>
          <p>Hi ${customer.firstName},</p>
          <p>Thank you for your order! Your brunch outfit is being prepared and will be with you soon.</p>
        </div>
        
        <div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #000;">Order Details</h3>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Total:</strong> GHS ${order.total.toFixed(2)}</p>
          
          <h4 style="color: #000;">Items Ordered:</h4>
          ${order.items.map(item => `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
              <p style="margin: 0;"><strong>${item.name}</strong></p>
              <p style="margin: 5px 0; color: #666;">Size: ${item.size} | Quantity: ${item.quantity}</p>
              <p style="margin: 0; color: #666;">GHS ${item.price.toFixed(2)} each</p>
            </div>
          `).join('')}
        </div>
        
        <div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #000;">Shipping Address</h3>
          <p style="margin: 0;">
            ${order.shipping.address.firstName} ${order.shipping.address.lastName}<br>
            ${order.shipping.address.street}<br>
            ${order.shipping.address.city}, ${order.shipping.address.region}<br>
            ${order.shipping.address.country}<br>
            Phone: ${order.shipping.address.phone}
          </p>
        </div>
        
        <div style="background: #000; color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <h3 style="margin-top: 0;">What's Next?</h3>
          <p>We'll send you tracking information once your order ships. Expected delivery: 2-5 business days.</p>
          <p style="margin-bottom: 0;">Questions? Reply to this email or call us at +233 XX XXX XXXX</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
          <p>Follow us for brunch outfit inspiration:</p>
          <p>Instagram: @theootd.brand | Website: theootd.brand</p>
          <p>© 2024 OOTD Ghana. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  orderShipped: (order, customer, trackingNumber) => ({
    subject: `📦 Your Order is On Its Way - ${order.orderNumber} | OOTD Ghana`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #000; margin: 0;">OOTD Ghana</h1>
          <p style="color: #666; margin: 5px 0;">Easy brunch outfits for the modern Ghanaian woman</p>
        </div>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #000; margin-top: 0;">Your Order Has Shipped! 📦</h2>
          <p>Hi ${customer.firstName},</p>
          <p>Great news! Your brunch outfit is on its way to you.</p>
        </div>
        
        <div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #000;">Tracking Information</h3>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
          <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : '2-3 business days'}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Track Your Package
          </a>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #000;">Delivery Instructions</h3>
          <p>• Please ensure someone is available to receive the package</p>
          <p>• Have your ID ready for verification</p>
          <p>• Contact us immediately if there are any delivery issues</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
          <p>Questions about your delivery? Contact us:</p>
          <p>Email: support@theootd.brand | Phone: +233 XX XXX XXXX</p>
          <p>© 2024 OOTD Ghana. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  welcomeEmail: (user) => ({
    subject: `Welcome to OOTD Ghana! 🇬🇭 Your Brunch Style Journey Begins`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #000; margin: 0;">Welcome to OOTD Ghana! 🇬🇭</h1>
          <p style="color: #666; margin: 5px 0;">Easy brunch outfits for the modern Ghanaian woman</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
          <h2 style="color: #000; margin-top: 0;">Hi ${user.firstName}! ✨</h2>
          <p style="color: #333; font-size: 18px; margin-bottom: 0;">Ready to elevate your brunch style?</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #000;">What makes OOTD Ghana special?</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 20px;">
            <div style="flex: 1; min-width: 250px; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
              <h4 style="color: #000; margin-top: 0;">🥂 Brunch Perfect</h4>
              <p style="color: #666; margin-bottom: 0;">Curated outfits perfect for Ghana's brunch culture and social scene.</p>
            </div>
            <div style="flex: 1; min-width: 250px; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
              <h4 style="color: #000; margin-top: 0;">🌡️ Climate Conscious</h4>
              <p style="color: #666; margin-bottom: 0;">Breathable fabrics and styles perfect for Ghana's tropical weather.</p>
            </div>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #000; margin-top: 0;">Start Your Style Journey</h3>
          <p>🛍️ <strong>Shop by Category:</strong> Brunch Dresses, Casual Wear, Accessories</p>
          <p>📱 <strong>Follow Us:</strong> @theootd.brand for daily outfit inspiration</p>
          <p>💝 <strong>First Order:</strong> Use code WELCOME10 for 10% off your first purchase</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}" style="background: #000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Start Shopping
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
          <p>Need help? We're here for you!</p>
          <p>Email: support@theootd.brand | Phone: +233 XX XXX XXXX</p>
          <p>© 2024 OOTD Ghana. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  adminOrderAlert: (order, customer) => ({
    subject: `🔔 New Order Alert - ${order.orderNumber} | OOTD Admin`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #000; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0;">New Order Received! 🛍️</h2>
          <p style="margin: 10px 0 0 0;">Order #${order.orderNumber}</p>
        </div>
        
        <div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">Customer Information</h3>
          <p><strong>Name:</strong> ${customer.firstName} ${customer.lastName}</p>
          <p><strong>Email:</strong> ${customer.email}</p>
          <p><strong>Phone:</strong> ${customer.phone}</p>
        </div>
        
        <div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">Order Summary</h3>
          <p><strong>Total:</strong> GHS ${order.total.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          
          <h4>Items:</h4>
          ${order.items.map(item => `
            <p>• ${item.name} (Size: ${item.size}, Qty: ${item.quantity}) - GHS ${item.price.toFixed(2)}</p>
          `).join('')}
        </div>
        
        <div style="text-align: center;">
          <a href="${process.env.FRONTEND_URL}/admin" style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View in Admin Dashboard
          </a>
        </div>
      </div>
    `
  })
};

// Email service functions
export const emailService = {
  // Send order confirmation email
  async sendOrderConfirmation(order) {
    try {
      const template = emailTemplates.orderConfirmation(order, order.customer);
      
      await transporter.sendMail({
        from: `"OOTD Ghana" <${process.env.EMAIL_USER}>`,
        to: order.customer.email,
        subject: template.subject,
        html: template.html
      });

      console.log(`✅ Order confirmation email sent to ${order.customer.email}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending order confirmation email:', error);
      return false;
    }
  },

  // Send order shipped notification
  async sendOrderShipped(order, trackingNumber) {
    try {
      const template = emailTemplates.orderShipped(order, order.customer, trackingNumber);
      
      await transporter.sendMail({
        from: `"OOTD Ghana" <${process.env.EMAIL_USER}>`,
        to: order.customer.email,
        subject: template.subject,
        html: template.html
      });

      console.log(`✅ Order shipped email sent to ${order.customer.email}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending order shipped email:', error);
      return false;
    }
  },

  // Send welcome email to new users
  async sendWelcomeEmail(user) {
    try {
      const template = emailTemplates.welcomeEmail(user);
      
      await transporter.sendMail({
        from: `"OOTD Ghana" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: template.subject,
        html: template.html
      });

      console.log(`✅ Welcome email sent to ${user.email}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      return false;
    }
  },

  // Send admin alert for new orders
  async sendAdminOrderAlert(order) {
    try {
      const template = emailTemplates.adminOrderAlert(order, order.customer);
      
      await transporter.sendMail({
        from: `"OOTD Ghana System" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: template.subject,
        html: template.html
      });

      console.log(`✅ Admin order alert sent for order ${order.orderNumber}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending admin order alert:', error);
      return false;
    }
  },

  // Send custom email
  async sendCustomEmail(to, subject, htmlContent, textContent = '') {
    try {
      await transporter.sendMail({
        from: `"OOTD Ghana" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent,
        text: textContent
      });

      console.log(`✅ Custom email sent to ${to}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending custom email:', error);
      return false;
    }
  },

  // Test email configuration
  async testEmailConfig() {
    try {
      await transporter.verify();
      console.log('✅ Email configuration is valid');
      return true;
    } catch (error) {
      console.error('❌ Email configuration error:', error);
      return false;
    }
  }
};

export default emailService;
