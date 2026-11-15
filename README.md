# Nestmate Suite — 100% Free, Privacy-First Daily Utility Ecosystem

> **Empowering everyday work with high-precision web utilities.**  
> Zero Logins. Zero Paywalls. Zero Server Tracking. Pure In-Browser Execution.

---

## 🌟 Overview

**Nestmate** is an independent suite of production-grade web applications designed for freelancers, contractors, marketers, students, and businesses. Unlike traditional online utility websites that lock downloads behind paywalls, watermark exports, and force account creation, every tool in the Nestmate ecosystem operates **100% free, client-side in your browser, with zero server tracking**.

---

## 🚀 The Flagship Product Suite

### 1. 📄 QuoteCraft — Online Quotation Maker & Proposal Designer
* **Target Audience:** Freelancers, contractors, agencies, and small businesses.
* **Core Capabilities:**
  * **Automated Precision Engine:** Calculates itemized rates, tiered discounts, multi-currency formatting (`USD $`, `EUR €`, `GBP £`, `INR ₹`, `CAD $`, `AUD $`), and custom taxes (GST or VAT) down to sub-cent precision.
  * **14+ Curated Industry Templates:** Professional designs optimized for Creative Agencies, Software & DevOps, Construction & Trades, Legal & Management Consulting, and Photography.
  * **Company Branding:** Custom logo embedding, digital QR verification stamps, and custom commercial payment terms.
  * **Client-Side Privacy:** Operates with offline support and local data persistence in browser storage (`IndexedDB` / `localStorage`).
  * **Export Pipeline:** Instantly generates clean, multi-page, high-resolution vector PDF quotations with **zero paywalls or watermarks**.

### 2. 📱 QR Studio — QR Code Generator & Barcode Toolkit
* **Target Audience:** Businesses, freelancers, marketers, restaurants, and event organizers.
* **Core Capabilities:**
  * **10 Distinct QR Payload Types:** Website URLs, instant Wi-Fi access (WPA2/WPA3 auto-connect), WhatsApp direct chat, vCard 3.0 digital business cards, calendar events (`.ics`), email (`mailto`), phone numbers (`tel`), SMS, plain text notes, and cryptocurrency addresses.
  * **Bespoke Design Suite:** Gradient color palettes, custom dot & corner eye patterns, company logo badge embedding, and "Scan Me" custom call-to-action frames.
  * **Real-time WCAG Contrast Validation:** Built-in accessibility validator measuring foreground-to-background contrast ratios to guarantee 100% scan reliability in all lighting conditions.
  * **In-Browser Batch & Bulk Generation:** Instant processing of bulk spreadsheet files (CSV and Excel) without uploading data to remote servers.
  * **Permanent & Scalable Exports:** Permanent, non-expiring barcodes exported in print-ready vector SVG, Ultra-HD PNG (up to 2048px), and printable PDF with zero subscriptions or watermarks.

### 3. 🧮 OmniCalc — All-in-One Computational Suite
* **Target Audience:** Students, engineers, finance professionals, businesses, and everyday users.
* **Core Capabilities:**
  * **78+ Verified Tools across 12 Categories:** Loan EMI & amortization schedules, GST & salary tax breakdowns, construction estimation, fitness metrics (BMI, BMR, TDEE), unit & scientific conversions, and live ECB-backed currency exchange rates.
  * **Interactive Visualizations:** Client-side HTML5 canvas donut charts, amortization repayment curves, and ratio breakdown graphs.
  * **Command Palette (⌘K / Ctrl+K):** Instant keyboard search indexing all 78+ computational tools with 0ms evaluation latency.
  * **Private On-Device Persistence:** 100% client-side execution with calculation history and bookmarking stored strictly on your local device.

---

## 🛡️ The Nestmate Open Utility Manifesto

1. **Zero Barrier to Entry:** You never have to give an email, verify a phone number, or create a password.
2. **Privacy by Physics:** Your data never leaves your browser RAM. 0 bytes are stored on remote servers.
3. **Commercial-Grade Precision:** Clean multi-page PDFs, vector SVGs, and verified mathematical models.
4. **Forever Free:** No bait-and-switch ("3 free exports then $19/mo"). Free means free forever.

---

## 🛠️ Project Structure

```
nestmate/
├── index.html          # Main application & showcase website
├── css/
│   └── styles.css      # Design system, glassmorphism, responsive styles & animations
├── js/
│   ├── qrcode.min.js   # Zero-dependency, offline QR code generator engine
│   └── app.js          # Interactive sandboxes (Quote builder, QR canvas, Loan EMI, ⌘K)
├── assets/             # Media and icon assets
├── server.js           # Built-in lightweight Node.js HTTP server
├── package.json        # NPM metadata and convenience scripts
└── README.md           # Documentation & product overview
```

---

## ⚡ Quick Start

### Option A: Run with Node.js
```bash
npm start
# or: node server.js
```
Then open your browser at **`http://localhost:3000`**.

### Option B: Standalone / Direct File Open
You can also open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari) by double-clicking the file! Everything runs 100% client-side without requiring a backend server.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `⌘K` or `Ctrl+K` | Open Instant Command Palette & Tool Search |
| `ESC` | Close active modal or search palette |

---

## 🔮 Future Roadmap (Upcoming Tools)

* **Business Card Generator (IN PROGRESS):** Design double-sided business cards with scannable QR codes, custom typography, company logos, and high-resolution vector PDF export with zero sign-ups.
* **Images to PDF Converter (PLANNED):** In-browser batch image converter to merge JPG, PNG, WEBP, and HEIC images into clean, compressed, multi-page PDF documents with zero cloud uploads.
* **DocuShield (PLANNED):** Client-side PDF merger, splitter & compressor with local WebAssembly. Zero uploads.

---

## 📬 Bug Reports & Technical Support

For bug reports, feature requests, or technical support, please contact the Nestmate Group engineering team directly:
* **Email:** [nestmategroup@gmail.com](mailto:nestmategroup@gmail.com)
* **Subject line suggestion:** `Nestmate Bug Report / Support - [Tool Name]`

---

## 💰 Google AdSense Integration Guide

1. **Sign Up:** Register your live domain (e.g., `nestmate.tools`) at [Google AdSense](https://www.google.com/adsense/).
2. **Add Header Script:** In [index.html](file:///c:/Users/lenovo/Desktop/nestmate/index.html), uncomment the script tag in `<head>` and replace `ca-pub-XXXXXXXXXXXXXXXX` with your AdSense Publisher ID.
3. **Configure ads.txt:** Open [ads.txt](file:///c:/Users/lenovo/Desktop/nestmate/ads.txt) and replace `pub-XXXXXXXXXXXXXXXX` with your 16-digit publisher ID.
4. **Ad Slots:** Two non-intrusive banner slots (`.ad-container`) are pre-configured between the hero and product catalog, and before the comparison section. Replace the placeholder comment with your ad unit snippet.
5. **Policy Compliance:** A full GDPR & DoubleClick compliant **Privacy & Advertising Policy** modal is included in the footer to ensure quick AdSense review approval.


