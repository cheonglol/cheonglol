/**
 * JSON Resume schema — single source of truth for resume PDF.
 * Edit this file to update your resume. AI-friendly, no layout code.
 * See: https://jsonresume.org/schema/
 */

export interface Resume {
  basics: {
    name: string;
    label: string;
    image?: string;
    email: string;
    phone?: string;
    url?: string;
    summary: string;
    location?: {
      address?: string;
      postalCode?: string;
      city?: string;
      countryCode?: string;
      region?: string;
    };
    profiles?: {
      network: string;
      username: string;
      url?: string;
    }[];
  };
  work?: {
    name: string;
    position: string;
    url?: string;
    startDate: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
  }[];
  education?: {
    institution: string;
    url?: string;
    area?: string;
    studyType?: string;
    startDate?: string;
    endDate?: string;
  }[];
  skills?: {
    name: string;
    level?: string;
    keywords?: string[];
  }[];
  projects?: {
    name: string;
    description: string;
    highlights?: string[];
    url?: string;
  }[];
}

export const resume: Resume = {
  basics: {
    name: "Lester Cheong",
    label: "AI-augmented Software Engineer",
    email: "lestercheong70@outlook.com",
    url: "https://cheonglol.github.io/cheonglol",
    location: {
      city: "Singapore",
      countryCode: "SG",
    },
    profiles: [
      {
        network: "GitHub",
        username: "cheonglol",
        url: "https://github.com/cheonglol",
      },
    ],
    summary:
      "I'm a generalist: I work across the stack instead of deep in one area, and I use AI agents to cover the depth I don't have. Applied software — how things actually get built and used — interests me more than the computer science behind it. I care about the science too, and I've been going deeper as the years pass, but I'm not the math or CS-theory kind of person. I haven't formally attended university, but that doesn't lower the bar: what I build must be smooth and serve its users well. I enjoy experimenting, and my homelab has been my favorite pastime since 2024. I serve small businesses end to end; the same person who ships is the one on-call.",
  },
  work: [
    {
      name: "Self-employed",
      position: "Freelance Software Engineer",
      startDate: "2025-01",
      highlights: [
        "3 paying clients. Delivered a Telegram-based order management system (24-26 daily users, PostgreSQL, role-based access, CRON reports) with real-time SSE push notifications to sales dashboard and message queue throttling with coalescing to respect Telegram rate limits and acknowledge user messages during busy periods",
        "Built a full event activation platform for a local marketing company (SvelteKit, Fastify, PostgreSQL, Redis, Replicate AI, Twilio) — consulted, delivered, maintained, and decommissioned. 9 interactive stations including Snake, claw machine, spot-the-difference, AI avatar passport kiosk, SMS authentication, QR check-in, and admin dashboard. Deployed live with on-site support throughout event duration. Optimized AI generation pipeline during the event via parallel model execution and streaming downloads — reduced generation time by ~67%.",
        "Delivered static display sites (company landing page + restaurant PWA) alongside larger projects",
        "Sole operator on all systems: CI/CD, monitoring, on-call, infrastructure",
        "All production backends deployed on Railway (Fastify, PostgreSQL, zero-downtime deploys)",
      ],
    },
    {
      name: "OCBC Bank",
      position: "API Developer, Digital Channels & OpenBanking",
      startDate: "2022-03",
      endDate: "2024-09",
      highlights: [
        "Started as IGNITE apprentice — built a Node.js CLI that parses Postman collections, auto-generates assertion tests, and displays results on a dashboard, adopted by QA team. Won Rookie of the Year.",
        "Investigated and resolved integration issues for partners onboarded on Connect2OCBC API store",
        "Managed change/management tickets, improving team productivity",
        "Assisted with digital certificate renewals for UAT server, documented renewal practices and implemented database housekeeping in UAT environment",
        "Created Swagger documentation and added APIs to sandbox portal via Wso2 carbon",
        "Taught JavaScript to secondary school students via Code@OCBC",
      ],
    },
    {
      name: "SG Bike",
      position: "IoT Lock Technician",
      startDate: "2019-11",
      endDate: "2021-10",
      highlights: [
        "Performed physical smart bike lock repairs and firmware upgrades, wrote troubleshooting documentation",
        "Reverse-engineered competitor's smart lock debugging software via dnspy decompilation — bypassed access restrictions, handed over as a cost-effective internal tool",
      ],
    },
  ],
  education: [
    {
      institution: "Ngee Ann Polytechnic",
      area: "Information Technology",
      studyType: "Higher National Diploma",
      startDate: "2020-04",
      endDate: "2023-04",
    },
    {
      institution: "Institute of Technical Education",
      area: "Web Applications",
      studyType: "Nitec",
      startDate: "2018-01",
      endDate: "2019-12",
    },
  ],
  skills: [
    {
      name: "Languages & Frameworks",
      keywords: ["TypeScript", "JavaScript", "React", "SvelteKit", "Python"],
    },
    {
      name: "Backend & Infrastructure",
      keywords: [
        "Fastify",
        "Prisma",
        "PostgreSQL",
        "Redis",
        "Railway",
        "Docker",
        "Bun",
        "CI/CD",
        "Cloudflare",
        "Linux",
      ],
    },
    {
      name: "Integrations & APIs",
      keywords: [
        "Stripe",
        "Xero API",
        "Azure AD",
        "grammY",
        "Temporal.io",
        "oRPC",
        "Zod",
      ],
    },
    {
      name: "AI & Emerging",
      keywords: [
        "LangChain",
        "LangGraph",
        "Mastra AI",
        "Replicate AI",
        "MCP Servers",
        "DeepSeek",
        "RAG Applications",
      ],
    },
  ],
  projects: [
    {
      name: "Sales Consolidator: Order Pipeline",
      description:
        "Replaced manual spreadsheet workflow with a structured order pipeline. Salespersons submit orders via Telegram. PostgreSQL source of truth. Role-based admin flows, CRON-triggered daily summaries.",
      highlights: [
        "Zero data loss since launch",
        "AI product catalog intake: upload transcripts, DeepSeek AI structures them into product rows",
      ],
    },
    {
      name: "Valentino Houseparty: AI Avatar & Interactive Arcade",
      description:
        "4-station beauty brand event activation. AI pixel art avatar (Replicate flux-kontext-pro), Snake game, video stations, prize claim system. Built as SvelteKit 5 SPA with Fastify 5 API.",
      highlights: [
        "Deployed at live event. Client was happy, event ran live",
        "Retro Windows 98 UI with 98.css",
      ],
    },
    {
      name: "Themelios: AI Accounts Receivables Platform",
      description:
        "AI-powered platform for invoice management, collections, and payment reconciliation. Temporal.io for durable workflow orchestration, Mastra AI agents, Xero/Stripe integrations. Startup attempt that failed — scrapped after partner fallout.",
      highlights: [
        "Over-engineered for the problem and never shipped. A lesson in scoping",
        "Startup discontinued after co-founder fallout",
        "Built CI/CD pipeline with change-detection and self-hosted runners — environment-aware Prisma migrations with production safety guards, auto-healing GitHub issue tracking on failure. Deployed 6-service Railway stack (PostgreSQL, self-hosted Temporal, API, Workers, Frontend, Jump Server) with private networking and service-to-service communication.",
      ],
    },
  ],
};
