# SmartStock — Inventory & Sales Management Web App

**[Live demo](https://smartstock-inventory-six.vercel.app)** · [Source code](https://github.com/Yerb0l-hub/SmartStock)

**Status:** deployed prototype; initial inventory and sales flow tested. Barcode camera support and printable receipts require device/browser testing.

A lightweight, responsive inventory and sales management app for small shops. Built using Vite, vanilla JavaScript, Vercel and Supabase.

## Features
- Dashboard showing product count, quantity, inventory cost value and low-stock alerts
- Product CRUD (name, SKU, category, sale price, purchase cost, low-stock threshold)
- Stock corrections/replenishment, sales recording with automatic stock deduction
- Sales history and searchable inventory
- Sales analytics: revenue, units sold, top products, period filters, daily revenue chart, and estimated gross profit
- CSV export of product and sales records
- Barcode/SKU search with browser camera support where available, plus manual input fallback
- Printable transaction summaries using the browser's **Print / Save as PDF** option (not fiscal receipts)
- Offline-friendly local demo mode with sample **fictional** inventory
- Supabase Auth (email/password, optional Google) and per-user private inventory
- Database-side atomic sales and adjustments to prevent overselling

## Run locally

```bash
npm install
npm run dev
```

Without environment variables the app starts in **Demo workspace**. Data lives in the browser's localStorage. Demo mode is for testing only. No real shop accounts or data should be used in this mode. Open `http://localhost:5173`.

## Connect Supabase (separate project from UNISearch)

1. Create a NEW Supabase project in your own account.
2. Paste `supabase/schema.sql` into its SQL Editor and run it. It creates two private tables and atomic sale/stock functions. Apply it once to the new project. Test with a disposable account first.
3. Copy `.env.example` to `.env.local`, set the Supabase Project URL and publishable key. **Never use the database password or service_role key in Vite env vars.**
4. In Supabase Authentication > URL Configuration set Site URL to the deployed Vercel URL, and add your local development URL as a redirect URL.
5. For optional Google Login, configure Google provider in Supabase, create a Google OAuth client and set the Supabase callback URL shown in Supabase authentication providers. Keep Google secret in Supabase/Google Console.
6. `npm run dev`, create a test account, confirm email as applicable, add a product, replenish stock and record a sale.

## Vercel deployment

1. Push the repository root (including `src/`, `supabase/`, `package.json` and `index.html`) to GitHub.
2. In Vercel, import the repo as a new project. Framework preset: Vite. Root directory: `./`. Build: `npm run build`. Output: `dist`.
3. For a live, private workspace add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` environment variables in Vercel, then redeploy.
4. Configure the production Vercel URL in Supabase Authentication URL Configuration.
5. Test on a mobile phone and with **two separate accounts**. Verify that accounts cannot see each other's products or sales.

## Safety & limitations

- The demo inventory and prices are illustrative, not real JJJ Market data. No personal or business data is included.
- The project is a **pilot**: it is not accounting/tax software and has no returns, VAT reporting, fiscal receipts, or staff roles. Barcode scanning depends on browser support, and printable receipts are not official fiscal documents.
- Stock updates and sales use server-side Postgres functions and row locks; client input is validated, and cross-user access is protected with row-level security. For larger businesses, add audit logs, role-based permissions and reports before using in production.
- Currency is hard-coded to KZT for this MVP.
- Only claim actual users or business impact in your CV after testing and deployment.

## Deployment status
The app is deployed to [Vercel](https://smartstock-inventory-six.vercel.app), and the GitHub repository is active. Supabase authentication has been configured; the owner reported a successful test of adding 20 units, selling 3, and seeing 17 remaining. Barcode scanning and printable receipts were implemented but are not yet confirmed with end-to-end user tests. Do not use real store data until cross-account privacy and inventory workflows have been independently verified.
