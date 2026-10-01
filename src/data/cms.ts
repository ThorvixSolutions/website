// Content mirrored from the Forrentech Framer CMS. Field names (f1…f14) follow the CMS columns.

export type SiteRow = { slug: string; f1: string; f2: string; f3: string; f4: string; f5: string; f6: string; f7: string; f8: string; f9: string; f10: string; f11: string; f12: string; f13: string; n1: string };
export type WorkRow = { slug: string; f1: string; f2: string; f3: string; f4: string; f5: string; f6: string; f7: string; img: string; f8: string; f9: string; f10: string; f11: string; f12: string; f13: string; f14: string; n1: string };
export type FaqRow = { slug: string; f1: string; f2: string; f3: string; n1: string };
export type PlanRow = { slug: string; f1: string; f2: string; f3: string; f4: string; f5: string; f6: string; f7: string; n1: string };
export type ReviewRow = { slug: string; f1: string; f2: string; f3: string; f4: string; img: string; n1: string };
export type TeamRow = { slug: string; f1: string; f2: string; f3: string; img: string; n1: string };
export type PostRow = { slug: string; f1: string; f2: string; f3: string; f4: string; f5: string; f6: string; f7: string; img: string; n1: string };
export type ServiceRow = { slug: string; f1: string; f2: string; f3: string; f4: string; f5: string; f6: string; f7: string; f8: string; f9: string; f10: string; n1: string };

export const site: SiteRow[] = [
  {
    "slug": "site",
    "f1": "Forrentech",
    "f2": "Software development studio",
    "f3": "A software development team for startups and growing companies: web apps, mobile apps and AI features, designed, built and shipped in two-week sprints.",
    "f4": "hello@Forrentech.dev",
    "f5": "+1 512 555 0142",
    "f6": "Austin",
    "f7": "America/Chicago",
    "f8": "/contact",
    "f9": "X:https://x.com, LinkedIn:https://linkedin.com, GitHub:https://github.com, Dribbble:https://dribbble.com",
    "f10": "Now booking Q4 builds · 2 slots left",
    "f11": "1100 S Congress Ave, Austin, TX 78704",
    "f12": "Mon–Fri 09:00–18:00 CT",
    "f13": "1-5 09:00-18:00",
    "n1": "1"
  }
];

export const work: WorkRow[] = [
  {
    "slug": "wayfare",
    "f1": "Wayfare",
    "f2": "Travel",
    "f3": "A booking platform that lifts bookings 38%",
    "f4": "+38%",
    "f5": "bookings in 90 days",
    "f6": "A new web app for weekend trips: search, dynamic pricing and one-page checkout, rebuilt in twelve weeks.",
    "f7": "Web app",
    "img": "/images/work/wayfare.webp",
    "f8": "The old site took nine seconds to load and lost half its visitors at checkout.",
    "f9": "A Next.js platform with edge caching, a new search, Stripe checkout and a design system for the marketing team.",
    "f10": "+38% bookings;1.1 s page load;−52% checkout drop-off",
    "f11": "They rebuilt the whole product without a single day of downtime.",
    "f12": "Sofia Marchetti, CEO at Wayfare",
    "f13": "12 weeks",
    "f14": "Next.js, Stripe, Postgres, Vercel",
    "n1": "1"
  },
  {
    "slug": "pulse",
    "f1": "Pulse",
    "f2": "Health & fitness",
    "f3": "A running app with 120k downloads in its first year",
    "f4": "120k",
    "f5": "downloads in year one",
    "f6": "An iOS and Android app that plans runs, tracks them offline and coaches with AI.",
    "f7": "Mobile app",
    "img": "/images/work/pulse.webp",
    "f8": "A founder with a coaching method and no app, and a launch date set by a marathon.",
    "f9": "A React Native app with offline GPS tracking, HealthKit sync and an AI coach that adapts the plan each week.",
    "f10": "120k downloads;4.8★ store rating;41% weekly active",
    "f11": "We launched on time for race day, and the reviews did our marketing.",
    "f12": "Jordan Hale, founder of Pulse",
    "f13": "16 weeks",
    "f14": "React Native, Firebase, OpenAI, HealthKit",
    "n1": "2"
  },
  {
    "slug": "ledgerly",
    "f1": "Ledgerly",
    "f2": "Fintech",
    "f3": "An AI finance dashboard that saves 9 hours a week",
    "f4": "9 h",
    "f5": "saved per accountant weekly",
    "f6": "Bank feeds, invoice reading and month-end reports in one dashboard, with an assistant that answers finance questions.",
    "f7": "AI dashboard",
    "img": "/images/work/ledgerly.webp",
    "f8": "Accountants spent Mondays copying numbers between five tools.",
    "f9": "A dashboard that reads invoices with AI, reconciles bank feeds and writes the month-end summary for review.",
    "f10": "9 h saved a week;98.7% extraction accuracy;3x faster close",
    "f11": "Month-end used to take a week. Now it takes a morning.",
    "f12": "Rahul Mehta, Head of Finance at Ledgerly",
    "f13": "10 weeks",
    "f14": "Python, pgvector, Anthropic, React",
    "n1": "3"
  },
  {
    "slug": "carehub",
    "f1": "Carehub",
    "f2": "Healthcare",
    "f3": "A patient app that cut no-shows by 44%",
    "f4": "−44%",
    "f5": "missed appointments",
    "f6": "Booking, reminders, video visits and secure messaging for a network of 30 clinics.",
    "f7": "Patient app",
    "img": "/images/work/carehub.webp",
    "f8": "Phone-only booking and paper reminders meant one visit in five was missed.",
    "f9": "A HIPAA-ready patient app and clinic portal with smart reminders, rebooking and video visits.",
    "f10": "−44% no-shows;30 clinics live;4.9★ patient rating",
    "f11": "Our front desks finally stopped living on the phone.",
    "f12": "Dr. Nia Adeyemi, COO at Carehub",
    "f13": "20 weeks",
    "f14": "React Native, Node, AWS, Twilio",
    "n1": "4"
  },
  {
    "slug": "stockroom",
    "f1": "Stockroom",
    "f2": "Retail",
    "f3": "A commerce platform that handles 5x holiday traffic",
    "f4": "5x",
    "f5": "peak traffic, zero downtime",
    "f6": "Storefront, inventory and point of sale on one system for a retailer with 18 stores.",
    "f7": "Commerce platform",
    "img": "/images/work/stockroom.webp",
    "f8": "Online and in-store stock never matched, and the site fell over every Black Friday.",
    "f9": "A headless storefront with one inventory service shared by the website, the tills and the warehouse.",
    "f10": "5x peak traffic;0 minutes down;+22% online revenue",
    "f11": "First holiday season in years where nobody got paged.",
    "f12": "Elena Rossi, CTO at Stockroom",
    "f13": "14 weeks",
    "f14": "Shopify Hydrogen, Node, Redis, AWS",
    "n1": "5"
  }
];

export const faq: FaqRow[] = [
  {
    "slug": "q1",
    "f1": "How much does it cost to build an app?",
    "f2": "Most MVPs land between $18k and $60k, depending on platforms and integrations. After a free scoping call we send a fixed quote for the first release, so the number does not move.",
    "f3": "home",
    "n1": "1"
  },
  {
    "slug": "q2",
    "f1": "How fast can you start?",
    "f2": "Usually within two weeks. We keep a bench of senior engineers so a new project never waits for hiring.",
    "f3": "home",
    "n1": "2"
  },
  {
    "slug": "q3",
    "f1": "Who owns the code?",
    "f2": "You do, from the first commit. Everything lives in your GitHub, your cloud account and your App Store listing.",
    "f3": "home",
    "n1": "3"
  },
  {
    "slug": "q4",
    "f1": "Do you work with startups or bigger companies?",
    "f2": "Both. About half our clients are funded startups building a first product; the rest are growing companies that need more engineering hands.",
    "f3": "home",
    "n1": "4"
  },
  {
    "slug": "q5",
    "f1": "What tech stack do you use?",
    "f2": "React and Next.js on the web, React Native or native Swift and Kotlin on mobile, Node or Python on the backend, and AWS or GCP in the cloud. We pick what fits your product and team.",
    "f3": "home",
    "n1": "5"
  },
  {
    "slug": "q6",
    "f1": "How do we stay in the loop?",
    "f2": "A shared Slack channel, a demo of working software every two weeks and a live board of what is in progress. No surprises at the end.",
    "f3": "home",
    "n1": "6"
  },
  {
    "slug": "q7",
    "f1": "Can you take over an existing codebase?",
    "f2": "Yes. We start with a one-week code audit, fix what is risky and then keep shipping features on top.",
    "f3": "home",
    "n1": "7"
  },
  {
    "slug": "q8",
    "f1": "What happens after launch?",
    "f2": "We stay on for monitoring, fixes and new features on a monthly retainer, or hand everything over to your team with documentation and training.",
    "f3": "home",
    "n1": "8"
  }
];

export const plans: PlanRow[] = [
  {
    "slug": "mvp-sprint",
    "f1": "MVP Sprint",
    "f2": "$18,000",
    "f3": "fixed price",
    "f4": "Launch your first product in 8 weeks",
    "f5": "Discovery and scope;Design of the core flows;Web or mobile MVP;Launch and 30 days of support",
    "f6": "",
    "f7": "Plan my MVP",
    "n1": "1"
  },
  {
    "slug": "product-team",
    "f1": "Product Team",
    "f2": "$14,500",
    "f3": "per month",
    "f4": "A senior squad that owns your roadmap",
    "f5": "2 senior engineers;Product lead and designer;Two-week sprints with demos;Cancel with 30 days notice",
    "f6": "yes",
    "f7": "Book a team",
    "n1": "2"
  },
  {
    "slug": "scale-retainer",
    "f1": "Scale Retainer",
    "f2": "$6,000",
    "f3": "per month",
    "f4": "Keep a live product fast and secure",
    "f5": "Maintenance and updates;Monitoring and on-call;Performance and security;40 engineering hours",
    "f6": "",
    "f7": "Start the retainer",
    "n1": "3"
  }
];

export const reviews: ReviewRow[] = [
  {
    "slug": "r1",
    "f1": "Forrentech felt like our own engineering team from week one. They shipped every two weeks and told us the truth about scope.",
    "f2": "Sofia Marchetti",
    "f3": "CEO",
    "f4": "Wayfare",
    "img": "/images/reviews/r1.webp",
    "n1": "1"
  },
  {
    "slug": "r2",
    "f1": "We went from a Figma file to 120k downloads in a year. The app is fast, stable and our users love it.",
    "f2": "Jordan Hale",
    "f3": "Founder",
    "f4": "Pulse",
    "img": "/images/reviews/r2.webp",
    "n1": "2"
  },
  {
    "slug": "r3",
    "f1": "The AI features actually work in production. They measured quality before launch, not after complaints.",
    "f2": "Hannah Cole",
    "f3": "Head of Product",
    "f4": "Ledgerly",
    "img": "/images/reviews/r3.webp",
    "n1": "3"
  },
  {
    "slug": "r4",
    "f1": "Clean code, real documentation and a handover so good our new hires learned the system in a week.",
    "f2": "David Brooks",
    "f3": "VP Engineering",
    "f4": "Carehub",
    "img": "/images/reviews/r4.webp",
    "n1": "4"
  },
  {
    "slug": "r5",
    "f1": "They rebuilt our store before the holidays and it held five times the traffic. Nobody got paged.",
    "f2": "Elena Rossi",
    "f3": "CTO",
    "f4": "Stockroom",
    "img": "/images/reviews/r5.webp",
    "n1": "5"
  }
];

export const team: TeamRow[] = [
  {
    "slug": "daniel-reyes",
    "f1": "Daniel Reyes",
    "f2": "Founder & CEO",
    "f3": "Built two startups as CTO before starting Forrentech to build products the right way for others.",
    "img": "/images/team/daniel-reyes.webp",
    "n1": "1"
  },
  {
    "slug": "aisha-karim",
    "f1": "Aisha Karim",
    "f2": "Head of Engineering",
    "f3": "Leads our engineers and the AI practice. Ex-staff engineer at a fintech unicorn.",
    "img": "/images/team/aisha-karim.webp",
    "n1": "2"
  },
  {
    "slug": "tom-becker",
    "f1": "Tom Becker",
    "f2": "Lead Mobile Engineer",
    "f3": "Has shipped 30+ apps to the App Store, and still tests every release on an old phone.",
    "img": "/images/team/tom-becker.webp",
    "n1": "3"
  },
  {
    "slug": "mei-tanaka",
    "f1": "Mei Tanaka",
    "f2": "Design Director",
    "f3": "Turns complicated software into screens people understand on the first try.",
    "img": "/images/team/mei-tanaka.webp",
    "n1": "4"
  }
];

export const posts: PostRow[] = [
  {
    "slug": "how-much-does-an-mvp-cost",
    "f1": "How much does an MVP really cost in 2026?",
    "f2": "Guide",
    "f3": "8 min",
    "f4": "The real numbers behind 40 MVPs we shipped, and the three decisions that move the price most.",
    "f5": "## Start with the one flow that matters\n\nEvery MVP has one flow that proves the idea. Build that well and cut the rest.\n\n## Web first or mobile first\n\nA web app is faster to ship and change. Go mobile first only when the phone is the product.\n\n## Fixed scope, fixed price\n\nWe price the first release as a fixed quote so the budget never drifts.",
    "f6": "Daniel Reyes",
    "f7": "Sep 12, 2026",
    "img": "/images/posts/how-much-does-an-mvp-cost.webp",
    "n1": "1"
  },
  {
    "slug": "ai-features-that-ship",
    "f1": "AI features that make it to production",
    "f2": "Engineering",
    "f3": "6 min",
    "f4": "Why most AI prototypes never launch, and the evaluation habit that fixes it.",
    "f5": "## Measure before you launch\n\nWrite 100 real test questions before writing the prompt.\n\n## Keep a human in the loop\n\nThe best AI features draft, the user decides.",
    "f6": "Aisha Karim",
    "f7": "Aug 28, 2026",
    "img": "/images/posts/ai-features-that-ship.webp",
    "n1": "2"
  },
  {
    "slug": "two-week-sprints",
    "f1": "Why we ship every two weeks, no matter what",
    "f2": "Process",
    "f3": "5 min",
    "f4": "Small releases, demo days and the one rule that keeps projects on time.",
    "f5": "## Working software every sprint\n\nEvery two weeks the client clicks through something real.\n\n## Scope moves, dates do not\n\nWhen something takes longer, we cut scope, not the demo.",
    "f6": "Tom Becker",
    "f7": "Aug 10, 2026",
    "img": "/images/posts/two-week-sprints.webp",
    "n1": "3"
  }
];

export const services: ServiceRow[] = [
  {
    "slug": "web-apps",
    "f1": "Web apps",
    "f2": "Fast, secure web platforms and SaaS products, from the first MVP to the version that serves a million users.",
    "f3": "12 ms",
    "f4": "median server response",
    "f5": "web",
    "f6": "React, Next.js, TypeScript, Node, Postgres",
    "f7": "We build the product your customers log into every day: dashboards, marketplaces, booking flows and admin tools, with tests, monitoring and a clean handover.",
    "f8": "Scope the MVP;Design the flows;Build in two-week sprints;Launch and monitor",
    "f9": "Product architecture;Frontend and backend;Payments and auth;Analytics and monitoring",
    "f10": "$18k",
    "n1": "1"
  },
  {
    "slug": "mobile-apps",
    "f1": "Mobile apps",
    "f2": "Native-quality iOS and Android apps from one codebase, shipped to the App Store and Google Play.",
    "f3": "4.8★",
    "f4": "average store rating",
    "f5": "mobile",
    "f6": "React Native, Swift, Kotlin, Expo, Firebase",
    "f7": "Apps people keep on their home screen: offline mode, push notifications, in-app payments and a release process that never blocks your team.",
    "f8": "Prototype on real phones;Build the core flows;Beta with real users;Store launch",
    "f9": "iOS and Android;Push and in-app payments;Offline sync;Store submission",
    "f10": "$24k",
    "n1": "2"
  },
  {
    "slug": "ai-features",
    "f1": "AI features",
    "f2": "AI that does real work inside your product: search, assistants, document processing and smart automation.",
    "f3": "9 h",
    "f4": "saved per user each week",
    "f5": "ai",
    "f6": "OpenAI, Anthropic, LangChain, pgvector, Python",
    "f7": "We add AI where it earns its keep: assistants trained on your data, document extraction, recommendations and workflows that run on their own, with evaluation so quality stays high.",
    "f8": "Find the use case;Prototype with your data;Evaluate and harden;Ship behind a flag",
    "f9": "Model selection;Retrieval on your data;Evaluation suite;Cost controls",
    "f10": "$12k",
    "n1": "3"
  },
  {
    "slug": "product-design",
    "f1": "Product design",
    "f2": "UX research, interface design and design systems that make complex software feel simple.",
    "f3": "+31%",
    "f4": "activation after redesign",
    "f5": "design",
    "f6": "Figma, FigJam, Maze, Framer",
    "f7": "Designers who sit in the same sprint as the engineers: research, flows, high-fidelity screens and a design system your team can grow.",
    "f8": "Research and audit;Flows and wireframes;Visual design;Design system",
    "f9": "User research;Wireframes and prototypes;UI design;Component library",
    "f10": "$9k",
    "n1": "4"
  },
  {
    "slug": "cloud-devops",
    "f1": "Cloud & DevOps",
    "f2": "Infrastructure, CI/CD and monitoring so every release is boring, and every outage is short.",
    "f3": "99.98%",
    "f4": "uptime across client apps",
    "f5": "cloud",
    "f6": "AWS, GCP, Docker, Terraform, GitHub Actions",
    "f7": "We set up the pipeline, the environments and the alerts, then cut your cloud bill. Deploys go out many times a day without anyone holding their breath.",
    "f8": "Audit the setup;Automate deploys;Add monitoring;Tune costs",
    "f9": "CI/CD pipelines;Infrastructure as code;Monitoring and alerts;Cost optimisation",
    "f10": "$6k",
    "n1": "5"
  },
  {
    "slug": "dedicated-teams",
    "f1": "Dedicated teams",
    "f2": "A full squad of senior engineers, a designer and a product lead who join your roadmap as if they were in-house.",
    "f3": "2 wk",
    "f4": "to a working team",
    "f5": "team",
    "f6": "Linear, Slack, GitHub, Notion",
    "f7": "For companies that need more hands than hiring allows: a stable team that owns a product area, joins your rituals and ships every sprint.",
    "f8": "Match the team;Onboard in a week;Own a roadmap area;Scale up or down",
    "f9": "Senior engineers;Product lead;Designer on demand;Weekly demos",
    "f10": "$14k / month",
    "n1": "6"
  }
];

