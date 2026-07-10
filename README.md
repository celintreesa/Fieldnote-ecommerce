# Fieldnote — Stationery Store

A small e-commerce frontend built with **Next.js** and **React**, demonstrating:

- Reusable components (product grid, cart drawer, checkout form)
- API-style data fetching with a loading state (`fetchProducts()` in
  `components/FieldnoteStore.jsx` — swap this for a real `fetch("/api/products")`
  call and nothing else changes)
- Client-side state management (cart, quantities, filters) with `useState` / `useMemo`
- Form handling and validation (checkout form)
- Responsive, mobile-friendly layout

## Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Deploy

Push this repo to GitHub, then import it at [vercel.com/new](https://vercel.com/new)
for a free, live URL — useful for the "Portfolio / Personal Website Link" field
on job applications.

## Project structure

```
fieldnote-nextjs/
├── app/
│   ├── layout.js      # Root layout
│   └── page.js         # Home page, renders the store
├── components/
│   └── FieldnoteStore.jsx   # Main store component
├── package.json
└── next.config.js
```
