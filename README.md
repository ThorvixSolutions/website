# forrentech-portfolio

Codeforge studio site, rebuilt from the Framer original (<https://enchanting-concept-819846.framer.app/>) in Next.js + React + GSAP + Lenis.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Structure

```text
src/
  ui/          primitives: Button, Eyebrow, Heading, Icons
  components/  site chrome: Header, Footer, Loader, PageTransition, SmoothScroll
  sections/    page sections, one folder per page (sections/home/Hero.tsx …)
  app/         pages (routes) that compose sections
  data/cms.ts  all content: site, services, work, team, reviews, plans, faq, posts
  lib/         hooks, the gsap-driven frame ticker, the WebGL cube, text helpers
  styles/      base.css (shared) + sections/*.css (one per section)
```

## How it fits together

- **One frame loop.** `lib/ticker.ts` runs every scroll-driven effect from `gsap.ticker`; Lenis steps in the same frame (`components/SmoothScroll.tsx`).
- **Scroll progress.** Pinned sections (Services, Work, Process) read `--sp` / `--pp` CSS variables written by `useScrollProgress`.
- **Entrances.** `useReveal` adds `is-on` when a section enters the viewport; the CSS does the animation. The loader and page transition hold entrances until the page is uncovered (`cg-hold-*` classes on `<html>`, set before paint by `lib/boot.ts`).
- **Hero / CTA cube.** A raymarched WebGL shader in `lib/cube.ts`.
- **Links are plain `<a>`.** `PageTransition` intercepts internal clicks, plays the block wipe, then routes with `router.push`.
- **Content.** Edit `src/data/cms.ts`; the field names (`f1`…`f14`) follow the original CMS columns.
