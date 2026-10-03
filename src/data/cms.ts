// Content mirrored from thorvix.com. Field names (f1…f14) follow the CMS columns.

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
    "f1": "Thorvix",
    "f2": "AI · Engineering · Automation",
    "f3": "The Stormbreaker to Your Problems. AI-powered engineering, deployed fast.",
    "f4": "hello@thorvix.com",
    "f5": "+92 3284477845",
    "f6": "Lahore",
    "f7": "Asia/Karachi",
    "f8": "https://calendar.app.google/Nf4EChguFQjtbnCy7",
    "f9": "",
    "f10": "Team deploy in 48h",
    "f11": "Lahore, PK / Global Remote",
    "f12": "",
    "f13": "",
    "n1": "1"
  }
];

// f8–f14 (challenge, solution, results, quote, timeline, stack) are blank: case detail pages are pending.
// Images are template placeholders; thorvix.com has none for these cases.
export const work: WorkRow[] = [
  {
    "slug": "real-estate-lead-ops",
    "f1": "Real Estate",
    "f2": "Real Estate",
    "f3": "The AI handles 80% of our inbound without us touching it.",
    "f4": "+40%",
    "f5": "Lead Conversion Rate",
    "f6": "Thorvix automated our property descriptions and follow-up sequences. The AI handles 80% of our inbound without us touching it.",
    "f7": "Lead Ops",
    "img": "/images/work/wayfare.webp",
    "f8": "",
    "f9": "",
    "f10": "",
    "f11": "",
    "f12": "",
    "f13": "",
    "f14": "",
    "n1": "1"
  },
  {
    "slug": "ecommerce-customer-support",
    "f1": "E-commerce",
    "f2": "E-commerce",
    "f3": "Their custom AI agent handles our entire Tier-1 support volume.",
    "f4": "−60%",
    "f5": "Ticket Resolution Time",
    "f6": "Their custom AI agent handles our entire Tier-1 support volume. CSAT went up, team headcount stayed the same.",
    "f7": "Customer Support",
    "img": "/images/work/stockroom.webp",
    "f8": "",
    "f9": "",
    "f10": "",
    "f11": "",
    "f12": "",
    "f13": "",
    "f14": "",
    "n1": "2"
  },
  {
    "slug": "saas-engineering",
    "f1": "SaaS",
    "f2": "SaaS",
    "f3": "The dedicated React/Node team integrated perfectly within 48 hours.",
    "f4": "3×",
    "f5": "Faster Feature Shipping",
    "f6": "The dedicated React/Node team integrated perfectly within 48 hours. They shipped features our in-house team had queued for months.",
    "f7": "Engineering",
    "img": "/images/work/ledgerly.webp",
    "f8": "",
    "f9": "",
    "f10": "",
    "f11": "",
    "f12": "",
    "f13": "",
    "f14": "",
    "n1": "3"
  }
];

// The five Solutions panels from thorvix.com, rendered by the Faq terminal section.
export const solutions: FaqRow[] = [
  {
    "slug": "s1",
    "f1": "Customer Support",
    "f2": "24/7 Autonomous Resolution\nContext-aware agents that resolve Tier-1 and Tier-2 tickets independently with your exact brand voice, product knowledge, and escalation logic built in.\n\nUSER  My order hasn’t arrived in 12 days.\nAGENT  Checking order #TH-88421...\nAGENT  Found: delayed at customs. ETA Jun 14.\nAGENT  Issuing $15 credit to your account.\n→ Ticket resolved. CSAT: ★★★★★ [0 humans involved]",
    "f3": "home",
    "n1": "1"
  },
  {
    "slug": "s2",
    "f1": "Lead Generation",
    "f2": "Qualify. Route. Convert.\nIntelligent agents that engage visitors, qualify intent, score leads against your ICP, and route hot prospects directly to your sales team with full context.\n\nVISITOR  Looking for enterprise pricing.\nAGENT  Team size and primary use case?\nVISITOR  200 seats, B2B SaaS automation.\nAGENT  ICP MATCH: HIGH → Routing to AE...\n→ Meeting booked. Pipeline value: $48,000/yr",
    "f3": "home",
    "n1": "2"
  },
  {
    "slug": "s3",
    "f1": "Internal Assistants",
    "f2": "Your Team’s Private Brain\nSecure, private knowledge bases that give your team instant answers from internal docs, SOPs, CRM data, and codebases without ever leaving your infrastructure.\n\nTEAM  What’s our refund policy for SaaS plans?\nASSIST  From Policy Doc v3.2 (Apr 2026):\nASSIST  Pro: 14-day full refund. Enterprise: custom.\nASSIST  See §4.1 for exceptions. [Source linked]\n→ Grounded. Private. Zero hallucination risk.",
    "f3": "home",
    "n1": "3"
  },
  {
    "slug": "s4",
    "f1": "Workflow Automation",
    "f2": "Connect Everything.\nWe wire your CRMs, databases, Slack, email, and APIs into unified automated pipelines, eliminating the manual handoffs that silently drain your team’s capacity.\n\nTRIGGER  New deal closed in HubSpot.\nAUTO  → Slack: #sales-wins notified\nAUTO  → Jira: onboarding epic created\nAUTO  → Email: welcome sequence started\n→ 3 tools synced. 0 human actions.",
    "f3": "home",
    "n1": "4"
  },
  {
    "slug": "s5",
    "f1": "Data Analysis",
    "f2": "Instant Insight. Any Dataset.\nNatural language queries against your databases, dashboards, and CSVs. Ask business questions, get precise answers. No SQL required. No analyst bottleneck.\n\nQUERY  Which product had highest churn Q1?\nRESULT  Plan B: 34% churn (↑12% vs Q4 2025)\nRESULT  Primary driver: onboarding drop-off Day 3.\nSUGGEST  A/B test: email + in-app at Day 2?\n→ Analyzed 1.2M rows in 1.4 seconds.",
    "f3": "home",
    "n1": "5"
  }
];

// PENDING — not on thorvix.com yet, unused while its section is commented out. See PENDING_FEATURES.md.
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

// PENDING — not on thorvix.com yet, unused while its section is commented out. See PENDING_FEATURES.md.
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
    "f1": "Thorvix didn’t just write code, they understood our business logic and built around it. The AI integration was seamless, the team was senior, and the results were immediate.",
    "f2": "Marketing Head",
    "f3": "Lahore, Pakistan",
    "f4": "Ren Solutions",
    "img": "",
    "n1": "1"
  },
  {
    "slug": "r2",
    "f1": "The team moved fast, communicated clearly, and shipped exactly what we needed. We saw value from the first week.",
    "f2": "Operations Lead",
    "f3": "Dubai, UAE",
    "f4": "NovaCore",
    "img": "",
    "n1": "2"
  },
  {
    "slug": "r3",
    "f1": "They made a complicated process feel simple. The product quality and follow-through were both excellent.",
    "f2": "Founder",
    "f3": "London, UK",
    "f4": "Apex Studio",
    "img": "",
    "n1": "3"
  },
  {
    "slug": "r4",
    "f1": "Outstanding execution across the board. Their AI agents increased our support capacity by 3× without adding headcount.",
    "f2": "VP Customer Success",
    "f3": "San Francisco, USA",
    "f4": "TechFlow",
    "img": "",
    "n1": "4"
  },
  {
    "slug": "r5",
    "f1": "We needed a dedicated team fast, and they delivered production-ready engineers in 48 hours. Game changer for us.",
    "f2": "CTO",
    "f3": "Toronto, Canada",
    "f4": "InnovateLabs",
    "img": "",
    "n1": "5"
  },
  {
    "slug": "r6",
    "f1": "The process automation they built saved us 20+ hours per week in manual data entry. ROI was immediate.",
    "f2": "Head of Operations",
    "f3": "Berlin, Germany",
    "f4": "DataCore",
    "img": "",
    "n1": "6"
  }
];

export const team: TeamRow[] = [
  {
    "slug": "syed-ahmed-iqbal",
    "f1": "Syed Ahmed Iqbal",
    "f2": "CTO",
    "f3": "Technical strategy, AI architecture, and scalable full-stack solutions.",
    "img": "https://res.cloudinary.com/dlktkucvl/image/upload/v1791048367/syed-ahmed-iqbal_lnwwhb.jpg",
    "n1": "1"
  },
  {
    "slug": "shoaib-ahmed-sheikh",
    "f1": "Shoaib Ahmed Sheikh",
    "f2": "CEO",
    "f3": "Business strategy and operations.",
    "img": "https://res.cloudinary.com/dlktkucvl/image/upload/v1791048367/shoaib-ahmed-sheikh_mm4lpq.jpg",
    "n1": "2"
  },
  {
    "slug": "mujtaba-asif",
    "f1": "Mujtaba Asif",
    "f2": "UI & UX Expert",
    "f3": "Premium SaaS interfaces and human-computer interaction design.",
    "img": "https://res.cloudinary.com/dlktkucvl/image/upload/v1791048366/mujtaba-asif_xt5k71.jpg",
    "n1": "3"
  },
  {
    "slug": "alisha-kanwal",
    "f1": "Alisha Kanwal",
    "f2": "AI Engineer · Full-Stack",
    "f3": "Scalable agentic architecture and workflows.",
    "img": "https://res.cloudinary.com/dlktkucvl/image/upload/v1791048243/IMG-20260802-WA0042_fdjbz3.jpg",
    "n1": "4"
  }
];

// PENDING — not on thorvix.com yet, unused while its section is commented out. See PENDING_FEATURES.md.
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

// f3/f4 (stat), f6 (stack), f7–f9 (detail, steps, included) and f10 (price) are blank: not on thorvix.com yet.
export const services: ServiceRow[] = [
  {
    "slug": "ai-automation",
    "f1": "AI Automation",
    "f2": "Replace repetitive workflows with intelligent systems that learn, adapt, and execute at machine speed. Reduction in ops costs, guaranteed.",
    "f3": "",
    "f4": "",
    "f5": "automation",
    "f6": "",
    "f7": "",
    "f8": "",
    "f9": "",
    "f10": "",
    "n1": "1"
  },
  {
    "slug": "ai-agents-chatbots",
    "f1": "AI Agents & Chatbots",
    "f2": "Context-aware LLM-powered agents that handle support, qualify leads, and operate 24/7 with your brand’s exact voice.",
    "f3": "",
    "f4": "",
    "f5": "flagship",
    "f6": "",
    "f7": "",
    "f8": "",
    "f9": "",
    "f10": "",
    "n1": "2"
  },
  {
    "slug": "dedicated-dev-teams",
    "f1": "Dedicated Dev Teams",
    "f2": "Senior full-stack engineers and AI architects embedded directly into your workflow: no recruitment, no HR overhead.",
    "f3": "",
    "f4": "",
    "f5": "engineering",
    "f6": "",
    "f7": "",
    "f8": "",
    "f9": "",
    "f10": "",
    "n1": "3"
  },
  {
    "slug": "staff-augmentation",
    "f1": "Staff Augmentation",
    "f2": "Scale engineering capacity on demand. Ramp up for a sprint, ramp down after launch. Pure flexibility, zero commitment bloat.",
    "f3": "",
    "f4": "",
    "f5": "flex",
    "f6": "",
    "f7": "",
    "f8": "",
    "f9": "",
    "f10": "",
    "n1": "4"
  },
  {
    "slug": "custom-software",
    "f1": "Custom Software",
    "f2": "Robust, scalable architectures from database schema to deployed frontend. We own the full stack and the full outcome.",
    "f3": "",
    "f4": "",
    "f5": "build",
    "f6": "",
    "f7": "",
    "f8": "",
    "f9": "",
    "f10": "",
    "n1": "5"
  },
  {
    "slug": "process-optimization",
    "f1": "Process Optimization",
    "f2": "Data-driven bottleneck mapping and elimination. We don’t fix symptoms, we redesign the system that causes them.",
    "f3": "",
    "f4": "",
    "f5": "optimize",
    "f6": "",
    "f7": "",
    "f8": "",
    "f9": "",
    "f10": "",
    "n1": "6"
  }
];
