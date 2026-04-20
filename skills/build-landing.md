# Skill: build-landing

> Invoca este skill para construir una landing page de alto rendimiento desde cero.
> El agente hace preguntas guiadas, luego construye todo usando la arquitectura de referencia.

---

## Como usar este skill

Cuando el usuario invoque `/build-landing` o pida construir una landing page, seguí exactamente este flujo:

1. **Fase 1 — Preguntas de negocio** (hacer todas antes de escribir una línea de código)
2. **Fase 2 — Preguntas de diseño** (completar el sistema visual)
3. **Fase 3 — Build** (construir siguiendo ARCHITECTURE_REFERENCE.md)

---

## FASE 1: Preguntas de Negocio

Hacer estas preguntas una sección a la vez. No bombardear al usuario con todo junto.

### Bloque A — Identidad del negocio

Preguntar:

```
1. ¿Cuál es el nombre del negocio/marca?
2. ¿Qué hace o vende? (1-2 oraciones simples)
3. ¿Cuál es el público objetivo? (edad, perfil, contexto)
4. ¿Qué idioma/s usamos? (español AR, inglés, etc.)
5. ¿Hay un tagline o claim ya definido?
```

### Bloque B — Contenido y secciones

Preguntar:

```
6. ¿Qué secciones necesita la landing? Ejemplos:
   - Hero con llamado a la acción
   - Sobre nosotros / Historia
   - Servicios o productos destacados
   - Galería o portfolio
   - Ubicación o locales
   - Testimonios
   - Formulario de contacto / reserva
   - Footer

7. ¿Tiene imágenes propias para usar, o usamos placeholders por ahora?
   (Si tiene, listar qué imágenes y en qué sección van)

8. ¿Necesita links externos? (Instagram, WhatsApp, Mercado Pago, etc.)

9. ¿Hay un formulario o CTA principal? ¿A dónde va? (Formspree, WhatsApp, email)
```

### Bloque C — Contenido real

Preguntar:

```
10. ¿Tenés el copy (textos) para cada sección, o necesitás que lo genere yo?
    Para cada sección con contenido propio, ¿qué debería decir?
```

---

## FASE 2: Preguntas de Diseño

### Bloque D — Estética general

Preguntar:

```
11. ¿Qué paleta de colores tenés? (hex o descripción: ej. "verde oscuro y dorado")
    - Color primario / acento
    - Color de fondo
    - Color de texto

12. ¿Qué estilo visual buscás? Elegir el más cercano:
    a) Minimalista editorial (tipografía grande, mucho espacio, b&n con 1 acento)
    b) Dark & premium (fondo negro/oscuro, detalles metálicos o neón)
    c) Clean & moderno (blanco, UI tipo app, sombras suaves)
    d) Orgánico & cálido (beige, tierras, texturas)
    e) Bold & expresivo (colores saturados, energía, juventud)
    f) Otro (describir)

13. ¿Tiene fuentes propias (.woff2/.otf), o usamos fuentes de Google Fonts / sistema?
    - Si tiene: ¿cuáles y para qué uso? (display / body)
    - Si no: ¿qué estilo tipográfico preferís? (serif elegante, sans-serif moderna, condensada, etc.)
```

### Bloque E — Detalles visuales

Preguntar:

```
14. ¿Bordes redondeados o esquinas rectas? (afecta cards, botones, imágenes)

15. ¿Tiene logo? ¿En qué formato? (SVG preferido)

16. ¿Animaciones? Elegir nivel:
    a) Sin animaciones (estático, máximo performance)
    b) Sutiles (fade-in al hacer scroll, suaves)
    c) Con personalidad (marquee, parallax leve, hover effects)
    d) Intenso (3D, partículas, GSAP pesado)

17. ¿Hay referencias visuales que admires? (URLs de sitios, screenshots)
    (opcional pero muy útil)
```

---

## FASE 3: Build Instructions

Una vez recopilada toda la información, construir el proyecto siguiendo estrictamente **ARCHITECTURE_REFERENCE.md**.

### Checklist de construcción

#### Setup inicial
- [ ] Crear proyecto Astro con `npm create astro@latest`
- [ ] Configurar output: 'static' en astro.config.mjs
- [ ] Instalar Tailwind CSS 4 con `@tailwindcss/vite`
- [ ] Instalar Sharp para optimización de imágenes
- [ ] Si hay animaciones nivel c/d: instalar GSAP
- [ ] Si hay animaciones nivel d: instalar Three.js

#### Foundations (hacer primero, antes de cualquier componente)
- [ ] `src/styles/global.css` con tokens de diseño:
  - Variables CSS para cada color de la paleta
  - `@font-face` para fuentes propias (o import de Google Fonts en `<head>`)
  - Font-display: swap en todos los `@font-face`
  - Reset: `* { box-sizing: border-box; margin: 0; padding: 0; }`
  - Smooth scroll: `html { scroll-behavior: smooth; }`
  - Clase `.dark` en `<html>` si es tema oscuro
  - Grain overlay si el diseño lo requiere (WebP, fixed, pointer-events: none)

#### Layout base
- [ ] `src/layouts/BaseLayout.astro`:
  - Preload del font display crítico (woff2) en `<head>`
  - Meta tags completos (title, description, og:image, og:title, og:description)
  - Favicon SVG
  - Viewport tag
  - Import de global.css
  - Slot para contenido

#### Componentes por sección
Para cada sección confirmada en Fase 1:

**Nav:**
- Fixed, z-50
- Logo + links de anchor + CTA externo
- Scroll behavior: transparente → blur+bg al pasar 80px
- Si hay secciones con colores distintos: IntersectionObserver para color swap del nav
- Mobile: menú hamburger o links ocultos < md

**Hero:**
- Imagen de fondo: formato WebP, `loading="eager"` (único eager en el site)
- Headline grande con clamp: `font-size: clamp(3.5rem, 8vw, 8rem)`
- CTA principal con anchor o link externo
- Si tiene 3D/canvas: lazy load con IntersectionObserver (threshold: 0.1)

**Secciones de contenido:**
- Cada sección: `id="nombre-seccion"` para anchor links del nav
- Imágenes: Astro `<Image>` component + `loading="lazy"`
- Imágenes con grayscale por defecto si el estilo lo permite: `filter: grayscale(1)` → `grayscale(0)` on hover

**Sección con formulario / reserva:**
- Vanilla JS fetch a Formspree (o WhatsApp link si es más simple)
- Estados: idle → enviando → enviado/error
- Validación básica en cliente (campos required)
- Clase `aria-modal`, `aria-labelledby` si es modal

**Marquee (si aplica):**
- 4 copias del contenido en DOM
- CSS animation `-25%` translate en loop
- `will-change: transform`
- Duración: 20-30s según densidad

**Footer:**
- Logo + links principales + redes sociales
- Copyright dinámico: `new Date().getFullYear()`

#### Optimizaciones obligatorias
- [ ] Todas las imágenes bajo fold: `loading="lazy"`
- [ ] Solo hero image: `loading="eager"`
- [ ] Preload del font principal en `<head>`: `<link rel="preload" as="font" type="font/woff2" href="..." crossorigin>`
- [ ] `font-display: swap` en todos los `@font-face`
- [ ] Scripts pesados (Three.js, GSAP) en dynamic import dentro de IntersectionObserver
- [ ] `prefers-reduced-motion`: deshabilitar todas las animaciones JS si está activo
- [ ] `devicePixelRatio` capped a 2x en canvas si hay WebGL
- [ ] `will-change: transform` solo en elementos que realmente animan

#### Accesibilidad mínima
- [ ] `alt` descriptivo en todas las imágenes
- [ ] `aria-label` en botones sin texto visible
- [ ] Navegación por teclado en modales (ESC para cerrar)
- [ ] `lang="es"` (o idioma correspondiente) en `<html>`
- [ ] Semántica: `<header>`, `<main>`, `<nav>`, `<footer>`, `<section>`, `<article>`

#### Build final
- [ ] `npm run build` sin errores
- [ ] `npm run preview` — verificar en mobile y desktop
- [ ] Verificar que no hay CLS (Cumulative Layout Shift) visible
- [ ] Verificar que fuentes cargan sin flash de texto invisible

---

## Reglas de oro

1. **Mobile-first.** Tailwind sin prefijo = mobile. `md:` y `lg:` para desktop.
2. **Cero frameworks JS de UI.** No React, no Vue. Solo Astro + vanilla JS.
3. **Un solo eager load** (hero image). Todo lo demás es lazy.
4. **Los tokens de diseño van en CSS vars**, nunca hardcodeados en componentes.
5. **Separar datos de presentación.** Si hay listas (productos, ubicaciones, equipo), van en `src/data/*.ts`.
6. **TypeScript estricto.** `extends: "astro/tsconfigs/strict"` en tsconfig.json.
7. **No inventar copy.** Si el usuario no lo dio, usar placeholders marcados con `[PLACEHOLDER: descripción]`.
8. **No agregar features no pedidas.** Si no se mencionó un filtro o una galería, no agregarla.

---

## Referencia

Ver **ARCHITECTURE_REFERENCE.md** para el detalle técnico completo de cada patrón.
