# Architecture Reference — High-Performance Astro Landing Page

Referencia técnica completa para construir landings de alto rendimiento.
Basada en producción real de JuanaWeb (2025-2026).

---

## Stack

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Astro | 5.x |
| CSS | Tailwind CSS | 4.x (vite plugin) |
| Tipado | TypeScript | strict |
| Imágenes | Sharp (via Astro) | latest |
| Animaciones ligeras | GSAP ScrollTrigger | 3.x (opcional) |
| Animaciones 3D | Three.js | 3.x (opcional) |
| Optimización fuentes | @fontsource/* | latest (opcional) |

---

## Estructura de carpetas

```
project-root/
├── public/
│   ├── assets/
│   │   ├── fonts/          # Fuentes propias (.woff2, .woff, .otf)
│   │   └── pdf/            # PDFs públicos si hay
│   └── favicon.svg         # Favicon SVG
├── src/
│   ├── assets/
│   │   └── images/         # Imágenes importadas (optimizadas por Astro)
│   ├── components/         # Componentes Astro por sección
│   │   ├── Nav.astro
│   │   ├── HeroSection.astro
│   │   ├── [Seccion]Section.astro  (uno por sección)
│   │   └── FooterSection.astro
│   ├── data/
│   │   └── [entidad].ts    # Arrays de datos tipados (productos, ubicaciones, etc.)
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   └── index.astro     # Landing page principal
│   ├── scripts/
│   │   ├── scroll-animations.ts   # GSAP (si aplica)
│   │   └── hero-canvas.ts         # Three.js (si aplica)
│   └── styles/
│       └── global.css      # Design tokens + fuentes + reset
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

---

## tsconfig.json

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

---

## package.json (dependencias clave)

```json
{
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "sharp": "^0.34.0"
  }
}
```

Opcionales según nivel de animación:
```json
"gsap": "^3.14.0",
"three": "^0.174.0"
```

---

## global.css — Patrón

```css
@import "tailwindcss";

/* ===== DESIGN TOKENS ===== */
:root {
  --color-primary:     #HEXCODE;   /* acento principal */
  --color-secondary:   #HEXCODE;   /* acento secundario (si hay) */
  --color-surface:     #HEXCODE;   /* fondo principal */
  --color-surface-low: #HEXCODE;   /* fondo alternativo */
  --color-surface-high:#HEXCODE;   /* bordes / separadores */
  --color-on-surface:  #HEXCODE;   /* texto principal */
  --color-error:       #HEXCODE;

  /* Efectos opcionales */
  --nav-blur: 20px;
  --glow-blur: 30px;
}

/* ===== FUENTES PROPIAS ===== */
@font-face {
  font-family: 'NombreFuente';
  src: url('/assets/fonts/fuente-normal.woff2') format('woff2'),
       url('/assets/fonts/fuente-normal.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;  /* OBLIGATORIO para evitar FOIT */
}

@font-face {
  font-family: 'NombreFuente';
  src: url('/assets/fonts/fuente-bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* ===== RESET ===== */
*, *::before, *::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-surface);
  color: var(--color-on-surface);
  font-family: 'NombreFuente', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ===== GRAIN OVERLAY (opcional) ===== */
/* Agregar en BaseLayout sobre el slot si el diseño lo requiere */
.grain-overlay {
  position: fixed;
  inset: 0;
  background-image: url('/assets/images/grain.webp');
  opacity: 0.04;
  pointer-events: none;
  z-index: 100;
  mix-blend-mode: overlay;
}
```

---

## BaseLayout.astro — Patrón

```astro
---
interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
}

const {
  title = 'Nombre del Negocio',
  description = 'Descripción del negocio.',
  ogImage = '/og-image.jpg',
} = Astro.props;
---
<!doctype html>
<html lang="es" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />

    <!-- OG Tags -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:type" content="website" />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- Preload fuente crítica (SOLO la display font en woff2) -->
    <link
      rel="preload"
      href="/assets/fonts/display-normal.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />

    <!-- CSS global -->
    <link rel="stylesheet" href="/src/styles/global.css" />
    <!-- Astro inyecta el CSS via import en el layout, no como link tag -->
  </head>
  <body>
    <slot />
  </body>
</html>

<style is:global>
  /* estilos críticos de body que no van en global.css */
</style>
```

---

## Nav.astro — Patrón

```astro
---
const navLinks = [
  { href: '/#seccion1', label: 'Label 1' },
  { href: '/#seccion2', label: 'Label 2' },
  { href: '/pagina', label: 'Página' },
];
---

<header id="main-nav" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
  <nav class="flex items-center justify-between px-6 py-4 max-w-screen-xl mx-auto">
    <a href="/" class="text-xl font-bold" aria-label="Inicio">
      <!-- Logo SVG o texto -->
      LOGO
    </a>

    <!-- Links desktop (ocultos en mobile) -->
    <ul class="hidden md:flex gap-8">
      {navLinks.map(link => (
        <li>
          <a href={link.href} class="text-sm uppercase tracking-wider hover:opacity-60 transition-opacity">
            {link.label}
          </a>
        </li>
      ))}
    </ul>

    <!-- CTA / Red social -->
    <a
      href="https://instagram.com/..."
      target="_blank"
      rel="noopener noreferrer"
      class="text-sm uppercase tracking-wider"
    >
      Instagram
    </a>
  </nav>
</header>

<script>
  const nav = document.getElementById('main-nav');

  // Scroll blur effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Section color swap (opcional — si hay secciones con fondo distinto)
  const sections = document.querySelectorAll('[data-nav-color]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const color = entry.target.getAttribute('data-nav-color');
        nav?.setAttribute('data-section', color ?? '');
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(s => observer.observe(s));
</script>

<style>
  #main-nav {
    background: transparent;
  }
  #main-nav.scrolled {
    background: color-mix(in srgb, var(--color-surface) 80%, transparent);
    backdrop-filter: blur(var(--nav-blur));
  }
  /* Color swap de logo/links según sección */
  #main-nav[data-section="light"] {
    color: var(--color-surface);
  }
</style>
```

---

## Imágenes — Reglas

### Astro Image component (imágenes importadas)

```astro
---
import { Image } from 'astro:assets';
import miImagen from '../assets/images/foto.jpg';
---

<!-- Hero: eager (única excepción) -->
<Image src={miImagen} alt="Descripción" loading="eager" />

<!-- Todas las demás: lazy -->
<Image src={miImagen} alt="Descripción" loading="lazy" />
```

### Imágenes externas / placeholders

```astro
<!-- Placeholder con seed consistente -->
<img
  src={`https://picsum.photos/seed/${item.id}/800/600`}
  alt={item.nombre}
  loading="lazy"
  width="800"
  height="600"
/>
```

### Grayscale hover pattern (opcional)

```css
.img-card {
  filter: grayscale(1);
  transition: filter 0.4s ease;
}
.img-card:hover {
  filter: grayscale(0);
}
```

---

## Tipografía responsiva — Patrón

```css
/* Fluid type con clamp */
.heading-display { font-size: clamp(3.5rem, 8vw, 8rem); }
.heading-xl      { font-size: clamp(2.5rem, 5vw, 5rem); }
.heading-lg      { font-size: clamp(1.75rem, 3vw, 3rem); }
.heading-md      { font-size: clamp(1.25rem, 2vw, 2rem); }
.body-lg         { font-size: clamp(1rem, 1.5vw, 1.25rem); }
```

---

## Animaciones — Niveles

### Nivel b: Fade-in al scroll (GSAP ScrollTrigger)

```typescript
// src/scripts/scroll-animations.ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray<Element>('.fade-in').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
    });
  });
}
```

Importar en la página:
```astro
<script>
  import('../scripts/scroll-animations');
</script>
```

### Nivel c: Marquee puro CSS

```astro
<div class="marquee-wrapper">
  <!-- 4 copias del contenido para loop perfecto -->
  {[0,1,2,3].map(() => (
    <div class="marquee-track">
      {items.map(item => <span class="marquee-item">{item}</span>)}
    </div>
  ))}
</div>

<style>
  .marquee-wrapper {
    display: flex;
    overflow: hidden;
    gap: 2rem;
  }
  .marquee-track {
    display: flex;
    gap: 2rem;
    flex-shrink: 0;
    animation: marquee 28s linear infinite;
    will-change: transform;
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-25%); }
  }
  @media (prefers-reduced-motion: reduce) {
    .marquee-track { animation: none; }
  }
</style>
```

### Nivel d: Three.js canvas (lazy)

```astro
<div id="canvas-container" style="width:100%;height:100%"></div>

<script>
  // Lazy load: solo cuando el canvas entra en viewport
  const container = document.getElementById('canvas-container');
  const observer = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting) {
      observer.disconnect();
      const { initCanvas } = await import('../scripts/hero-canvas');
      initCanvas(container);
    }
  }, { threshold: 0.1 });
  if (container) observer.observe(container);
</script>
```

En `hero-canvas.ts`:
```typescript
export function initCanvas(container: Element | null) {
  if (!container) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Limitar pixel ratio
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ResizeObserver para canvas responsivo
  const resizeObserver = new ResizeObserver(() => {
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
  resizeObserver.observe(container);

  // Cleanup en caso de navegación SPA
  return () => {
    resizeObserver.disconnect();
    renderer.dispose();
  };
}
```

---

## Modal — Patrón vanilla JS

```astro
<!-- Trigger -->
<button id="open-modal" aria-haspopup="dialog">Abrir</button>

<!-- Modal -->
<div
  id="my-modal"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  class="modal-overlay hidden"
>
  <div class="modal-content">
    <button id="close-modal" aria-label="Cerrar">&times;</button>
    <h2 id="modal-title">Título</h2>
    <!-- contenido -->
  </div>
</div>

<script>
  const modal = document.getElementById('my-modal');
  const openBtn = document.getElementById('open-modal');
  const closeBtn = document.getElementById('close-modal');

  function openModal() {
    modal?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal?.classList.add('hidden');
    document.body.style.overflow = '';
  }

  openBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
</script>

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.8);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal-overlay.hidden { display: none; }
</style>
```

---

## Formulario con Formspree — Patrón

```astro
<form id="contact-form">
  <input type="text" name="nombre" placeholder="Tu nombre" required />
  <input type="email" name="email" placeholder="Tu email" required />
  <textarea name="mensaje" placeholder="Mensaje" required></textarea>
  <button type="submit" id="submit-btn">ENVIAR</button>
  <p id="form-status" aria-live="polite"></p>
</form>

<script>
  const form = document.getElementById('contact-form') as HTMLFormElement;
  const btn = document.getElementById('submit-btn');
  const status = document.getElementById('form-status');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!btn || !status) return;

    btn.textContent = 'ENVIANDO...';
    btn.setAttribute('disabled', '');

    try {
      const res = await fetch('https://formspree.io/f/TU_ID', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        btn.textContent = 'ENVIADO ✓';
        status.textContent = 'Mensaje recibido. Te respondemos pronto.';
        form.reset();
      } else {
        throw new Error('Error en servidor');
      }
    } catch {
      btn.textContent = 'ENVIAR';
      btn.removeAttribute('disabled');
      status.textContent = 'Hubo un error. Intentá de nuevo.';
    }
  });
</script>
```

---

## Datos tipados — Patrón

```typescript
// src/data/productos.ts

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio?: number;
  imageSeed: number;    // para picsum.photos/seed/N
  categoria: string;
}

export const productos: Producto[] = [
  {
    id: 'producto-1',
    nombre: 'Nombre del producto',
    descripcion: 'Descripción breve.',
    precio: 15000,
    imageSeed: 42,
    categoria: 'categoria-a',
  },
  // ...
];
```

---

## Accesibilidad — Checklist rápido

```
[ ] lang="es" (o el idioma correcto) en <html>
[ ] <title> único y descriptivo
[ ] Alt en TODAS las imágenes (vacío "" solo para imágenes decorativas)
[ ] aria-label en botones con solo íconos
[ ] aria-modal="true" + aria-labelledby en modales
[ ] role="dialog" en modales
[ ] aria-live="polite" en mensajes de estado de formularios
[ ] Navegación por teclado en modales (ESC para cerrar)
[ ] Suficiente contraste de color (mínimo 4.5:1 texto normal, 3:1 texto grande)
[ ] prefers-reduced-motion respetado en TODAS las animaciones JS
```

---

## Performance — Checklist rápido

```
[ ] Una sola imagen con loading="eager" (hero)
[ ] Todas las demás imágenes: loading="lazy"
[ ] Preload de font display (woff2) en <head>
[ ] font-display: swap en todos los @font-face
[ ] Scripts pesados: dynamic import() dentro de IntersectionObserver
[ ] canvas WebGL: devicePixelRatio capped a 2
[ ] Marquee: will-change: transform
[ ] Elementos animados con JS: will-change: transform (solo los que realmente animan)
[ ] Sharp instalado como devDependency (Astro Image lo usa)
[ ] npm run build sin warnings de imágenes no optimizadas
```

---

## Comandos de setup

```bash
# 1. Crear proyecto
npm create astro@latest nombre-proyecto
# Elegir: Empty project, TypeScript strict

# 2. Instalar dependencias core
cd nombre-proyecto
npm install @tailwindcss/vite tailwindcss
npm install --save-dev sharp

# 3. Opcionales (animaciones)
npm install gsap          # nivel b/c
npm install three         # nivel d
npm install @types/three  # si usás TypeScript con Three.js

# 4. Dev
npm run dev

# 5. Build
npm run build
npm run preview   # verificar producción local
```
