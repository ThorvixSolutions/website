# Pending features

Everything here exists in the code but is commented out, because thorvix.com has no content for it yet.
Nothing was deleted. Search the code for `PENDING` to find each spot. To restore a feature, supply the
content, then uncomment.

## Pages (routes return 404)

Each file has a short stub at the top and the original page in a block comment below it.
To restore: delete the stub, uncomment the block.

| Route | File | Needs |
|---|---|---|
| `/services/[slug]` | `src/app/services/[slug]/page.tsx` | Per service: long description, steps, deliverables, headline stat, stack, starting price (`services` rows `f3`, `f4`, `f6`–`f10` in `src/data/cms.ts`) |
| `/work/[slug]` | `src/app/work/[slug]/page.tsx` | Per case: client name, challenge, solution, results, quote attribution, timeline, stack, images (`work` rows `f8`–`f14`) |
| `/pricing` | `src/app/pricing/page.tsx` | Real plans and prices (`plans` rows are template placeholders) |
| `/blog`, `/blog/[slug]` | `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx` | Real articles (`posts` rows are template placeholders) |

Links that pointed at these pages were repointed, with the old `href` left in a comment beside each:

- Service detail links now go to `/services#svc-<slug>` (home Services, header menu, mobile menu, footer).
- Case detail links now go to `/work` (home Work cards, header featured case). Cards on `/work` are not links.
- When `/services/[slug]` returns, also update `RELATED` in `src/sections/services/ServiceDetail.tsx`: it is keyed by the old layer names (`web`, `mobile`, `ai`, …).

## Home page sections (`src/app/page.tsx`)

| Section | Component | Needs |
|---|---|---|
| Commit heatmap and stats | `src/sections/home/Impact.tsx` | Real delivery numbers. Also commented out on `/process`. |
| Tech stack | `src/sections/home/Stack.tsx` | The actual stack list. Also commented out on `/services`. |
| Pricing | `src/sections/home/Pricing.tsx` | Real plans |
| Blog teaser | `src/sections/home/Insights.tsx` | Real articles |
| FAQ | `src/sections/home/Faq.tsx` | Real questions and answers. The `faq` rows are template placeholders. |

The FAQ terminal is currently reused for the **Solutions** panels (`solutions` in `src/data/cms.ts`).
When the FAQ returns, Solutions needs a component of its own; switch the import at the top of `Faq.tsx` back to `faq`.

## Pieces inside live sections

| Where | What is commented out | Needs |
|---|---|---|
| `src/sections/home/Services.tsx`, `src/components/Header.tsx` | Per-service stat and stack chips | `services` `f3`, `f4`, `f6` |
| `src/sections/services/ServicesList.tsx` | Long description, "Included" list, stat, "From" price, stack, "Explore the service" button | `services` `f3`, `f4`, `f6`, `f7`, `f9`, `f10` |
| `src/sections/home/Process.tsx` | "Week 01 / 08" counter, board intro line, the template's four week-based columns | A real timeline, if there is one |
| `src/sections/home/Clients.tsx` | Intro paragraph | Copy |
| `src/sections/home/Work.tsx` | Intro paragraph, "Read the case" button | Copy; case detail pages |
| `src/sections/home/Reviews.tsx` | Intro paragraph | Copy |
| `src/sections/home/Studio.tsx` | Photo tiles in the headline (add `[1]`, `[2]`, `[3]` markers back into `TEXT` to restore them) | Real office or work photos |
| `src/sections/about/About.tsx` | Origin story, studio photo, company timeline, template stats and rules | Company history, a real photo |
| `src/sections/contact/Contact.tsx` | Budget chips, timeline select | Decide whether the booking form should ask for these |
| `src/sections/home/Cta.tsx` | Email field that prefilled `/contact` (the button now opens the booking calendar) | Decide whether to capture an email before booking |
| `src/components/Footer.tsx` | Social links column | Real social URLs (`site` `f9`) |
| `src/components/Header.tsx`, `src/components/Footer.tsx` | Pricing and Blog nav links | Those pages |

## Content gaps to fill

- **Case study images** — thorvix.com has none. The three cases reuse template images (`public/images/work/wayfare.webp`, `stockroom.webp`, `ledgerly.webp`) so the layout holds. Replace them.
- **Alisha Kanwal's photo** — the image URL on thorvix.com returns 404, so her card has no photo. Add `public/images/team/alisha-kanwal.jpg` and set `img` in the `team` rows.
- **Client logos** — Ren Solutions, GAJET, Ash Official and Redvyn show as text wordmarks. thorvix.com has logo images for the first three; Redvyn is not on thorvix.com and has no hover tag yet (add it to `RESULTS` in `src/sections/home/Clients.tsx`).
- **Reviewer photos and names** — thorvix.com gives role, company and city only. Avatars are generated initials.
- **Case study client names** — the cases are anonymous on thorvix.com (industry only).
- **Privacy and Terms** — the links on thorvix.com go nowhere. The pages keep the template's generic text; have it reviewed.
- **Contact form delivery** — the form posts to Web3Forms (key in `src/sections/contact/Contact.tsx`). The template's `mailto:` code is commented out in the same function.
- **Template images now unused** — `public/images/about`, `posts`, `reviews`, `studio`, and the old `team/*.webp` are still on disk.
- **`README.md` and `package.json`** still say "forrentech".
