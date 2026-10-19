# THE FAKE OF LOYAL — Realistic 3D Virtual Book
> **An Emotional Story of Friendship**  
> *Written by Sanjay*  
> *“Some people stay in our hearts even when they are no longer a part of our lives.”*

A photorealistic, interactive 3D virtual reading experience for the complete 30-page original novel **The Fake of Loyal**, featuring dynamic paper deformation, realistic cream page edges, golden spine embossing, cinematic desk lighting, Web Audio sound synthesis, bookmarks, and multi-mode reading (3D Virtual Book, 2D Flipbook, and Original PDF).

---

## 📖 Features

- **Photorealistic 3D Paperback Book**:
  - Original dark navy cover with the boy silhouette, starry rainy night city lights, and gold foil typography.
  - Visible 3D book spine with golden author and title lettering.
  - Authentic layered cream-colored paper block edges.
  - Physically convincing dynamic page stacking (left stack grows as you read; right stack diminishes).
  - Center spine crease shadow and ambient occlusion.
  - Silk golden ribbon bookmark draped between pages.
- **Dynamic 3D Page Turning**:
  - Parametric paper curl deformation using segmented mesh physics.
  - Smooth page curvature, corner droop, and elevation during flips.
  - Double-sided rendering: recto front page and verso reverse page.
  - Dynamic page drop shadow moving underneath the turning sheet.
  - Interactive mouse dragging / touch swiping to turn pages.
  - Clickable page corners and page edges.
- **Atmospheric 3D Environment**:
  - Warm cinematic study desk with dark wood grain reflections.
  - Directional warm reading lamp with soft contact shadows.
  - Floating golden dust particles dancing in the light cone.
  - Lighting theme switcher: **Warm Desk Lamp**, **Midnight Sky**, and **Studio**.
  - **3D Free Inspect Mode**: 360° orbital camera control to inspect the book from any angle.
- **Interactive Reading Suite**:
  - Complete original 30 pages preserved in exact sequence.
  - Full Table of Contents drawer with all 6 chapters, Disclaimer, and *A Thought To Keep* quotes.
  - Interactive page scrubber slider with progress percentage badge.
  - LocalStorage progress saving & bookmarking (persists reading state locally).
  - Synthesized Web Audio paper-turn sound effects (zero audio assets required, 100% offline).
  - Ambient relaxing study drone soundscape (disabled by default, toggleable).
  - Confetti celebration upon finishing the final note on Page 30.
- **Multiple Reading Modes & Fallbacks**:
  - **3D Virtual Book**: Full WebGL 3D simulation.
  - **2D Flipbook**: Responsive dual-page reader for mobile or low-spec devices.
  - **Original PDF Reader**: Embedded high-fidelity viewer with direct PDF download.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **3D Engine**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
- **3D Helpers**: [@react-three/drei](https://github.com/pmndrs/drei)
- **Audio**: Web Audio API (Synthesized physical paper rustle & ambient sound)
- **Effects**: canvas-confetti
- **Styling**: Vanilla CSS with design tokens, glassmorphism, and responsive layout

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/SANJAYR0107/BOOK.git
cd BOOK

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Building for Production

```bash
npm run build
```

The optimized static production bundle will be generated in the `dist/` folder.

---

## 🌐 Free Static Deployment Guide

### Option 1: Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New Project** and select `SANJAYR0107/BOOK`.
3. Vercel automatically detects **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. Your site will be live on a `*.vercel.app` URL with automatic SSL.

### Option 2: Netlify Drop / Git

1. Go to [app.netlify.com](https://app.netlify.com).
2. Click **Add new site** → **Import an existing project** → select GitHub repo `SANJAYR0107/BOOK`.
3. Set:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click **Deploy BOOK**.

### Option 3: GitHub Pages

1. In the repository settings, go to **Settings** → **Pages**.
2. Under **Build and deployment**, select **GitHub Actions**.
3. Use the standard static Vite GitHub Actions workflow to deploy directly from the `main` branch.

---

## 📜 Story & Chapters

- **Cover**: Page 1
- **Disclaimer**: Page 3
- **Contents**: Page 5
- **Chapter 1 — The Innocence of Trust**: Pages 6–10
- **Chapter 2 — The Connection He Believed In**: Pages 11–16
- **Chapter 3 — When Efforts Became One Sided**: Pages 17–20
- **Chapter 4 — When Trust Finally Broke**: Pages 21–24
- **Chapter 5 — No More Begging for a Place**: Pages 25–27
- **Chapter 6 — What She Lost**: Pages 28–29
- **A Final Note**: Page 30

---

## 📄 License & Credits

- Written and Authored by **Sanjay**.
- 3D Virtual Book Experience engineered with React Three Fiber.
