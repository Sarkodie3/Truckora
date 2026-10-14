# TRUCKORA — Commercial Truck Spare Parts E-Commerce Platform

> **Truck Parts. Trusted Supply.**

TRUCKORA is a high-performance, production-oriented truck spare-parts e-commerce platform engineered specifically for the European commercial vehicle transport sector — serving fleet operators, logistics companies, commercial vehicle repair workshops, truck dealers, and independent mechanics.

---

## 1. Brand Identity & Design System

* **Brand Name**: TRUCKORA
* **Tagline**: *Truck Parts. Trusted Supply.*
* **Primary Palette**:
  * Navy Blue (`#142B46`): Primary buttons, header elements, headings, and authority accents.
  * Industrial Safety Orange (`#F28C28`): High-conversion CTAs, stock badges, highlights.
  * Canvas Slate (`#F3F5F7`): Main application background.
  * Surface White (`#FFFFFF`): Cards, modals, and product containers.
  * Charcoal Dark (`#182230`): Primary typography.
  * Secondary Text (`#667085`): Muted technical captions.
  * Crisp Border (`#E2E7ED`): High-definition section dividers.
* **Original Motif**: Geometric mechanical heavy tractor profile with technical gear teeth.

---

## 2. Technology Stack

* **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Components & Client Boundaries)
* **Language**: [TypeScript 5.8](https://www.typescriptlang.org/) (Strict Mode)
* **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) with custom European automotive B2B design tokens
* **Icons**: [Lucide React](https://lucide.dev/)
* **Database & Auth**: [Supabase PostgreSQL](https://supabase.com/) with Row Level Security (RLS) policies
* **Monetary Representation**: Integer minor units (cents) preventing floating-point rounding drift
* **Testing**: Node.js 24 test runner (`node:test` and `tsx --test`)

---

## 3. Implemented Routes & Architecture

### Public Routes
1. `/` — Homepage (Hero, OEM search, 7 core truck makes, 13 categories, certified stock, technical support)
2. `/products` — Product catalogue with multi-facet sidebar filters (OEM, brand, category, condition, price range, stock)
3. `/products/[slug]` — Product detail page (gallery, specs, verified vehicle fitment table, VIN enquiry modal, related products, JSON-LD Schema)
4. `/search` — Dedicated search handler (supports query strings `?q=...&oem=...&brand=...`)
5. `/categories` & `/categories/[slug]` — 13 specialized parts categories (Engines, Gearboxes, Brakes, Clutch, etc.)
6. `/manufacturers` & `/manufacturers/[slug]` — European truck makes (DAF, Volvo, Scania, Mercedes-Benz, MAN, IVECO, Renault)
7. `/condition/new` & `/condition/used` — Condition segmentation (Brand New vs. Tested Used & Factory Refurbished)
8. `/cart` — Shopping cart with real-time quantity modifiers, stock verification, coupon discount calculation, and freight calculation
9. `/checkout` — B2B checkout with automatic EU intra-community reverse-charge VAT zero-rating (0%), shipping calculation, and test payment mode
10. `/order-confirmation/[orderId]` — Historical order snapshot, line items, VAT breakdown, and freight waybill tracking
11. `/account` — Customer B2B portal with order history, pro-forma invoices, company tax profile, and VIN enquiry tickets
12. `/auth/login`, `/auth/register`, `/auth/forgot-password` — Authentication workflows
13. Information & Legal pages:
    * `/about` — Warehouse and distribution hub background
    * `/contact` — Commercial dispatch desk, hotline, and contact form
    * `/faq` — Technical knowledgebase
    * `/shipping` — European freight zones and pallet transit schedule
    * `/returns` — 14-day return right and reman core exchange policy
    * `/warranty` — 6 to 24 months tiered warranty coverage
    * `/privacy` — GDPR compliance, data controller info, and VIN data protection
    * `/cookies` — Interactive cookie consent management
    * `/terms` — General conditions of sale and retention of title
14. SEO & Diagnostics:
    * `/sitemap.xml` — Dynamic XML sitemap
    * `/robots.txt` — Search engine crawling directives
    * `/_not-found` — Branded 404 handler
    * `error.tsx` — Resilient fault-tolerant error boundary

### Administrative Routes
1. `/admin` — Executive dashboard (revenue metrics, pending fulfilments, low stock alarms, open VIN tickets)
2. `/admin/products` — Product manager (create new parts, edit specs/OEM numbers, adjust stock counts, delete items)
3. `/admin/orders` — Order fulfilment workflow (transition order status, assign carrier waybills and live tracking links)
4. `/admin/enquiries` — Review workshop VIN compatibility tickets and dispatch technical EPC recommendations

---

## 4. Database Schema & Supabase Migrations

The database is architected across 21 normalized relational tables in `supabase/migrations/`:

* `20261014000000_truckora_initial_schema.sql`:
  * `profiles` & `user_roles`
  * `truck_manufacturers` & `truck_models`
  * `categories` & `suppliers`
  * `products` & `product_images`
  * `product_vehicle_compatibility`
  * `inventory_movements`
  * `carts` & `cart_items`
  * `addresses` & `orders` & `order_items`
  * `payments` & `shipments`
  * `coupons` & `customer_enquiries`
  * `newsletter_subscriptions` & `audit_logs`
  * Complete Row Level Security (RLS) policies safeguarding private orders and restricting administrative mutations to staff.
* `20261014000001_seed_truckora_catalogue.sql`:
  * Seed data for DAF, Volvo, Scania, Mercedes-Benz, MAN, IVECO, and Renault Trucks
  * 13 standard truck spare parts categories
  * Realistic products with genuine OEM part references (e.g. DAF 1853604, Volvo 21543897, Scania 1934322, etc.)
  * Vehicle fitment compatibility links and coupon codes (`TRUCKORA10`, `FLEET50`)

---

## 5. Local Setup & Execution Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` and populate your credentials:
```bash
cp .env.example .env.local
```
*(Note: TRUCKORA includes an out-of-the-box local data service layer, so the entire site functions with 100% fidelity even before live Supabase credentials are connected).*

### 3. Run Automated Tests
```bash
npm test
```
Executes 16 test suites covering OEM lookup, multi-facet filtering, monetary rounding safety, EU reverse-charge VAT, order stock validation, and 17-digit VIN checking.

### 4. Run TypeScript Check
```bash
npm run typecheck
```

### 5. Run Next.js Production Build
```bash
npm run build
```

### 6. Start the Application
```bash
npm run dev
# Or for production:
npm run start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Demo Account Credentials

* **Customer Portal**:
  * Email: `purchasing@trans-rhine.de`
  * Access: Customer order history, pro-forma invoices, address book
* **Administrative Portal**:
  * Email: `admin@truckora.eu`
  * Access: Full admin control center (`/admin`), product catalogue management, order fulfilment, and VIN tickets

---

## 7. Status & Acceptance Criteria Checklist

- [x] **Brand Identity**: Original TRUCKORA name, tagline, color tokens (`#142B46`, `#F28C28`), and SVG truck motif.
- [x] **Public Pages**: All 27 required pages and responsive layouts implemented.
- [x] **Catalogue Search**: Multi-facet filters, keyword search, and OEM number normalization.
- [x] **Product Detail**: High-res gallery, condition tags, verified vehicle compatibility table, and VIN enquiry modal.
- [x] **Authentication & Account**: Customer profile, order history, address management, and session handling.
- [x] **Cart & Checkout**: Real-time stock validation, decimal-safe minor unit calculations, coupon support, and automated EU reverse-charge VAT zero-rating.
- [x] **Order Fulfilment**: Historical order item snapshots, status workflows, and freight waybill tracking.
- [x] **Admin Operations**: Product creation/edit, inventory adjustments, order status transitions, and enquiry dispatch.
- [x] **Database & Security**: Relational PostgreSQL schema with RLS policies and seed migrations.
- [x] **SEO & Performance**: Dynamic XML sitemap, robots.txt, OpenGraph tags, and Schema.org Product/Organization JSON-LD.
- [x] **Testing & Build**: 16 automated tests passing (`npm test`), strict TypeScript typecheck clean (`npm run typecheck`), and Next.js production build (`npm run build`) verified with zero errors.
