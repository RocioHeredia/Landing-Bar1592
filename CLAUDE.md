# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is **not** a deployable Astro project. It is a **landing page factory**: a template + automation system for generating production-grade Astro landing pages for hospitality clients.

- `skills/` — Reusable reference docs used to build new projects
- `desing/` — Completed static HTML mockup of the 1592 Bar landing page (the reference design)

The `desing/desing.html` file is pure HTML + Tailwind CDN—it requires no build step and is a visual reference only.

## Building a new landing page

When invoked via the `build-landing` skill, follow `skills/build-landing.md` which defines a 3-phase workflow:

1. **Business questions** (10 questions: name, product, audience, sections, copy, images)
2. **Design questions** (7 questions: palette, style, fonts, radius, logo, animation level, references)
3. **Build phase** (scaffold all Astro files per `skills/ARCHITECTURE_REFERENCE.md`, then `npm run build`)

```bash
npm create astro@latest <project-name>
cd <project-name>
npm install @tailwindcss/vite tailwindcss
npm install --save-dev sharp
# Optional:
npm install gsap        # Animation levels b/c
npm install three       # Animation level d

npm run dev             # Dev server
npm run build           # Production build (static output)
npm run preview         # Preview built site locally
```

## Architecture of generated projects

All generated projects follow `skills/ARCHITECTURE_REFERENCE.md` strictly. Key patterns:

### Structure
- One `.astro` component per visual section (Nav, Hero, Services, Atmosphere, Location, Footer)
- `BaseLayout.astro` wraps all pages (metadata, fonts, global styles)
- Typed data in `src/data/*.ts` — lists (menu items, hours, team) never hardcoded in components
- Design tokens as CSS variables in `:root` — all colors, spacing, effects centralized there

### Styling
- **Tailwind CSS 4.x** via Vite plugin (no PostCSS). Mobile-first: no prefix = mobile, `md:` and `lg:` for larger breakpoints.
- **Fluid typography** with `clamp()` — never use breakpoint-based font scaling.
- No React/Vue/Svelte — all interactivity is vanilla JS.

### Animation levels (pick one per project)
| Level | What it is |
|-------|-----------|
| a | Static, no JS animations |
| b | GSAP ScrollTrigger fade-in on scroll |
| c | CSS-only marquee (4× DOM copies, `translate(-25%)` loop) |
| d | Three.js 3D canvas, lazy-loaded via IntersectionObserver, `devicePixelRatio` capped at 2 |

All animations must respect `prefers-reduced-motion`.

### Images
- Hero only: `loading="eager"` — everything else `loading="lazy"`
- Always use Astro `<Image>` component for optimization (WebP output via Sharp)

### Navigation
- Fixed header, `z-50`, transparent by default
- At 80px scroll: add `backdrop-filter: blur()` + semi-transparent bg (vanilla JS scroll listener)
- Active section detected via `IntersectionObserver` with root margin `-40% 0px -40% 0px`

### Forms
- Vanilla JS `fetch` to Formspree — no form libraries
- Three states: `idle → enviando → enviado/error`
- `aria-live="polite"` on status message

### Astro config
```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  output: 'static',
  vite: { plugins: [tailwindcss()] },
});
```

```json
// tsconfig.json — extends astro/tsconfigs/strict (no implicit any, strict null checks)
{ "extends": "astro/tsconfigs/strict" }
```

## Design reference (1592 Bar)

The completed mockup in `desing/` was the visual reference. The final built project lives in `site/`.

## Proyecto 1592 Bar — Build completado ✓

**Ubicación del proyecto:** `site/` — Astro 5 + Tailwind CSS 4, output estático, build exitoso.

```bash
cd site
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción → dist/
npm run preview   # Preview del build en localhost:4321
```

### Decisiones tomadas en este proyecto

| Decisión | Valor |
|---|---|
| **Nombre** | 1592 Quince Noventa Y Dos |
| **Tagline** | Food, Drinks & Music |
| **Idioma** | Español argentino |
| **Colores** | Gold `#F59E0B` · Wine `#99181B` · Brown `#451A03` · Black `#050505` |
| **Fuentes** | Playfair Display (títulos) + Inter (cuerpo) — Google Fonts |
| **Animaciones** | Nivel c — marquee CSS, fade-in IntersectionObserver, hover scale |
| **Logo** | `public/logo.jpeg` — actualizado por el cliente |
| **Estilo** | Secciones alternas negro/vino oscuro, dorado como acento |

### Secciones del sitio

`Nav` → `HeroSection` → `MarqueeStrip` → `AboutSection` → `MenuSection` → `GallerySection` → `EventsSection` → `LocationSection` → `FooterSection`

- **Nav:** Fixed, fondo negro sólido `#010101` siempre (sin transparencia), borde dorado sutil, sin botón CTA (removido por el cliente)
- **Hero:** Fullscreen sin botón CTA ni scroll indicator (removidos por el cliente)
- **MarqueeStrip:** Franja dorada animada entre Hero y About
- **MenuSection:** Fondo vino, CTA "Ver Carta Completa" → `https://menu.fu.do/1592/qr-menu`
- **EventsSection:** 3 cards — After Office, Happy Hour, Noches de DJ
- **LocationSection:** Horarios + Google Maps embed
- **FooterSection:** Logo + nav links + Instagram + Maps icon, copyright dinámico

### Imágenes (src/assets/images/)

Todas convertidas a WebP automáticamente por Sharp en build:

| Archivo | Sección |
|---|---|
| `hero-bg.jpeg` | Hero background (único `loading="eager"`) |
| `about-day.jpeg` + `about-night.jpeg` | About — grid 2 columnas |
| `gallery-cocktails/food-1/food-2/crowd.jpeg` | Gallery grid |
| `events-happy-hour/dj/outdoor.jpeg` | Eventos cards |

### Datos tipados
- `src/data/events.ts` — array `eventos[]` con interfaz `Evento` (id, titulo, descripcion, horario, dias)
