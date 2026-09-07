# Akshay Garments - Premium School Uniform & Institutional Apparel Website

A modern, responsive, interactive, and production-ready web application for **Akshay Garments** (School Uniform Manufacturer & Supplier), ready for one-click deployment to **Netlify**.

---

## 🌟 Key Highlights & Features

- **🎨 Premium Visual Identity**: Deep navy, royal cobalt, warm gold, and slate tones with glassmorphism, subtle gradients, and Outfit / Plus Jakarta Sans typography.
- **🔍 Global Instant Search (`Ctrl+K`)**: Live search across garments, fabric blends, and uniform models with category grouping.
- **🧵 Side-by-Side Fabric Comparison**: Compare up to 3 fabrics with technical specifications (GSM, yarn blend, air permeability, durability rating, wash care).
- **🎽 Interactive Uniform Cost Estimator**: Calculate ballpark annual bulk uniform costs based on student strength, included kit items, and fabric grade.
- **📐 Standardized Size Guide**: Interactive measurement charts in both **Inches (")** and **Centimeters (cm)** for boys, girls, primary tunics, and blazers.
- **❤️ LocalStorage Wishlist / Favorites**: Save favorite items and request a batch institutional quotation in 1 click.
- **💬 Floating WhatsApp Concierge**: Instant WhatsApp connect with pre-filled message templates for bulk quotes, sample swatch boxes, sizing fit camps, and custom embroidery.
- **📄 Digital Interactive Catalog**: Category lookbook with a print-ready clean export for school management review.
- **📋 Netlify Forms Ready**: Pre-configured forms for bulk school quotes and physical fabric sample requests with celebratory confetti feedback.

---

## 📁 Project Structure

```text
AkshayGarments/
├── public/
│   └── _redirects                # Netlify SPA routing rules
├── src/
│   ├── config/
│   │   └── siteConfig.js         # Centralized company details, phone, email & branding
│   ├── context/
│   │   ├── FavoritesContext.jsx  # LocalStorage wishlist state
│   │   ├── ComparisonContext.jsx # Fabric comparison dock state
│   │   └── QuoteModalContext.jsx # Global quote popup state
│   ├── data/
│   │   ├── products.js           # 14+ School uniform products (Shirts, Trousers, Skirts, Blazers, etc.)
│   │   ├── fabrics.js            # 8+ Certified fabrics (Poly-Viscose, Poly-Cotton, Combed Cotton, Tartans)
│   │   ├── uniformModels.js      # Complete ensembles (Boys, Girls, Sports, Winter, Primary)
│   │   ├── categories.js         # Navigation categories & school levels
│   │   ├── testimonials.js       # Principal and procurement head testimonials
│   │   ├── gallery.js            # Categorized uniform photography
│   │   └── faqs.js               # Institutional FAQs
│   ├── components/
│   │   ├── Navbar.jsx            # Sticky navbar with mobile menu, search trigger & favorites badge
│   │   ├── Footer.jsx            # Multi-column institutional footer
│   │   ├── ProductCard.jsx       # Card with color swatches, quick view, wishlist & quote CTA
│   │   ├── FabricCard.jsx        # Fabric card with GSM pill, durability score & compare trigger
│   │   ├── UniformModelCard.jsx  # Uniform model card with ensemble components
│   │   ├── GlobalSearchModal.jsx # Ctrl+K global search popup
│   │   ├── ProductQuickViewModal.jsx # Detail popup with zoom, size picker & size chart trigger
│   │   ├── FabricDetailModal.jsx # Technical spec profile & sample swatch request
│   │   ├── FabricComparisonDrawer.jsx # Side-by-side comparison modal & dock
│   │   ├── QuoteRequestModal.jsx # Netlify form modal with confetti feedback
│   │   ├── WhatsAppFloatingWidget.jsx # Pulsing WhatsApp quick-selector
│   │   ├── ImageLightboxModal.jsx# Fullscreen image viewer with keyboard navigation
│   │   ├── SizeGuideModal.jsx    # Tabbed size charts with inch/cm switcher
│   │   └── UniformEstimator.jsx  # Interactive cost calculator
│   ├── pages/
│   │   ├── Home.jsx              # Hero, Why Choose Us, Models, Fabrics, Gallery, Estimator, Testimonials
│   │   ├── Fabrics.jsx           # Filterable fabric catalog & comparison
│   │   ├── UniformModels.jsx     # Categorized uniform ensemble gallery
│   │   ├── Products.jsx          # Instant search, multi-filter & sorting products
│   │   ├── Catalog.jsx           # Digital lookbook & printable PDF view
│   │   ├── About.jsx             # Story, craftsmanship, animated counters & values
│   │   ├── Contact.jsx           # Contact cards, Netlify form & interactive FAQs
│   │   ├── Favorites.jsx         # Wishlist page with batch quote trigger
│   │   └── NotFound.jsx          # Custom 404 page
│   ├── App.jsx
│   ├── index.css                 # Tailwind CSS styles, custom scrollbars & glassmorphism
│   └── main.jsx
├── index.html                    # SEO Meta, Google Fonts & Netlify form template
├── netlify.toml                  # Netlify deployment configuration & security headers
├── tailwind.config.js            # Tailwind configuration with custom brand palette
├── vite.config.js                # Vite build configuration
└── package.json
```

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
```
This generates the optimized static files in the `dist` folder.

---

## 🌐 Deploying to Netlify

This project is pre-configured for Netlify deployment out of the box:

### Option A: Netlify CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### Option B: Git Push (GitHub / GitLab / Bitbucket)
1. Push this repository to GitHub/GitLab.
2. Log into [Netlify](https://app.netlify.com/) and click **"Add new site" > "Import an existing project"**.
3. Set:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Netlify will automatically detect `netlify.toml` and `public/_redirects` for zero-configuration SPA routing.

---

## ⚙️ Brand & Business Customization

All contact details, phone numbers, WhatsApp numbers, email addresses, and company information can be changed from a single configuration file:

👉 `src/config/siteConfig.js`
