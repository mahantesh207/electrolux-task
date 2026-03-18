# Electrolux Product Catalog Task

A React + TypeScript storefront that lists products from the DummyJSON API, supports search and filtering, and lets users review product details and manage a cart.

## What This App Does

- Browse a paginated product catalog
- Search products with a debounced query
- Filter products by price range and discount
- Load more results with infinite scroll
- Open a product detail page with gallery and zoom interactions
- Add items to the cart, update quantities, and place an order
- Show toast feedback for cart and checkout actions

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Redux Toolkit + React Redux
- TanStack Query
- Bootstrap 5
- Font Awesome
- Vitest + Testing Library

## Routes

- `/`: product catalog
- `/products/:productId`: product detail page
- `/cart`: shopping cart

## Data Source

The app reads product data from the public DummyJSON API:

- `https://dummyjson.com/products`
- `https://dummyjson.com/products/search`
- `https://dummyjson.com/products/:id`

The current implementation uses a page size of `12` products per request.

## Getting Started

### Prerequisites

- A recent Node.js LTS version
- npm

### Install

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

The Vite dev server URL will be shown in the terminal.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm test
npm run test:watch
npm run test:ui
npm run test:coverage
```

### Script Details

- `npm run dev`: start the local development server
- `npm run build`: type-check and create a production build
- `npm run preview`: preview the production build locally
- `npm run lint`: run ESLint
- `npm test`: run the Vitest suite once
- `npm run test:watch`: run tests in watch mode
- `npm run test:ui`: open the Vitest UI with coverage enabled
- `npm run test:coverage`: generate terminal and HTML coverage reports

Coverage output is written to `coverage/index.html` after running `npm run test:coverage`.

## Project Structure

```text
src/
  api/           API request helpers
  components/    Reusable UI components
  hooks/         Query and UI behavior hooks
  pages/         Route-level screens
  providers/     App-level providers
  router/        Route definitions
  store/         Redux store and cart slice
  test/          Shared test setup, fixtures, and helpers
  types/         Shared TypeScript types
  utils/         Formatting and mapping helpers
```

## Architecture Notes

- Server data is handled with TanStack Query in `useProducts` and `useProduct`.
- Catalog shaping and filter logic live in `useCatalogProducts`.
- Infinite loading is driven by `useInfiniteScroll` and `IntersectionObserver`.
- Cart state is managed in Redux Toolkit under `src/store/cart`.
- Toast notifications are rendered globally through `AppToast`.

## Testing

The project includes unit and component tests for hooks, API helpers, store logic, and route-level UI behavior.

Useful commands:

```bash
npm test
npm run test:ui
npm run test:coverage
```

## Current Assumptions

- No environment variables are required for local development in the current setup.
- The cart is stored in application state only and is not persisted across page reloads.
- Prices are displayed in INR formatting in the UI.

## Notes

- If you deploy this app, add the deployment URL and any environment-specific setup here.
