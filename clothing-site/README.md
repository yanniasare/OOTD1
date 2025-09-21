# Clothing‑Site (React + Vite + Tailwind)

Clothing‑Site is a simple, modern, and responsive e‑commerce web application built with React and Tailwind CSS. It lets users browse products, view details, add to cart, and check a size guide. An Admin panel is included to manage the inventory (add, edit, delete products). All data is persisted in the browser via LocalStorage.

## Features

- __Browse products__: Clean grid with category filters (Dresses, Clothes)
- __Product details__: Image, description, sizes, add‑to‑cart
- __Cart__: Update quantities, remove items, clear cart
- __Size guide__: Modal for sizing reference
- __Admin__: CRUD inventory management (name, category, price, sizes, stock, image, description)
- __Search & sort__: Find products and sort by name/price
- __Toasts__: Lightweight notifications for actions
- __Dark mode__: Toggle in the header (persisted)

## Tech Stack

- __Frontend__: React + React Router
- __Styling__: Tailwind CSS
- __State__: React Context API (`CartContext`, `ProductsContext`, `ToastContext`, `ThemeContext`)
- __Build__: Vite (v5)
- __Persistence__: LocalStorage

## Project Structure

```
clothing-site/
  public/
    index.html
  src/
    components/
      Header.jsx
      Footer.jsx
      ProductCard.jsx
      ProductGrid.jsx
      SizeGuide.jsx
      Toaster.jsx
      ui/
        Button.jsx
        Card.jsx
    pages/
      Home.jsx
      Shop.jsx
      ProductDetail.jsx
      Cart.jsx
      Admin.jsx
      NotFound.jsx
    context/
      CartContext.jsx
      ProductsContext.jsx
      ToastContext.jsx
      ThemeContext.jsx
    data/
      products.js
    App.jsx
    main.jsx
    index.css
  package.json
  tailwind.config.js
  postcss.config.js
  README.md
```

## Getting Started

Prereqs: Node.js 18+

Install dependencies:

```
npm install
```

Start dev server:

```
npm run dev
```

Build for production:

```
npm run build
```

Preview production build:

```
npm run preview
```

## Notes

- Inventory and cart state persist in LocalStorage. Clear browser storage to reset data.
- Placeholder images use Unsplash; replace with your own assets as needed.
- Tailwind dark mode is class‑based. The toggle stores the preference under `theme` in LocalStorage.

## Roadmap

- Hook up a real backend (Node/Firebase) for inventory and auth
- Mini‑cart drawer and checkout flow
- Tests with Vitest + Testing Library


## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
