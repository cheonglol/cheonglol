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
    label: "Full-Stack Engineer",
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
      "Full-stack generalist. Left corporate banking to build software for small businesses — where what you ship actually reaches users and they talk to you directly. TypeScript-dominant. Runs everything on Railway with Fastify + PostgreSQL. Lays groundwork for sustainable additions so changes stay cheap.",
  },
  work: [
    {
      name: "Self-employed",
      position: "Freelance Software Engineer",
      startDate: "2024-12",
      highlights: [
        "3 paying clients. Delivered a Telegram-based order management system (24-26 daily users, PostgreSQL, role-based access, CRON reports)",
        "Built an AI photobooth for live events using Replicate AI",
        "Built a restaurant PWA with digital menu, seasonal banners, and offline-first service worker",
        "Sole operator on all systems: CI/CD, monitoring, on-call, infrastructure",
        "All production backends deployed on Railway (Fastify, PostgreSQL, zero-downtime deploys)",
      ],
    },
    {
      name: "OCBC Bank",
      position: "API Developer, Digital Channels & OpenBanking",
      startDate: "2023-04",
      endDate: "2024-09",
      highlights: [
        "OpenBanking API development. Owned partner onboarding pipeline: spec review, implementation, regression testing, production release",
        "Managed change tickets through banking-grade release gates",
        "Zero rollback incidents",
        "Mentored IGNITE apprentices on an internal portal (React, Spring)",
      ],
    },
    {
      name: "OCBC Bank",
      position: "IGNITE Apprenticeship, OpenBanking & Partnerships",
      startDate: "2022-03",
      endDate: "2023-03",
      highlights: [
        "Built a Node.js CLI that parses Postman collections, auto-generates assertion tests, and renders results on a dashboard",
        "Replaced manual QA for the team's API regression suite",
        "Won Rookie of the Year",
        "Taught JavaScript to secondary school students via Code@OCBC",
      ],
    },
    {
      name: "SG Bike",
      position: "IoT Lock Technician",
      startDate: "2018-11",
      endDate: "2020-08",
      highlights: [
        "Shared-mobility startup. Trained 3 interns",
        "Wrote the team's first troubleshooting documentation",
        "Reverse-engineered a competitor's lock firmware acquired through M&A (no keys provided) to integrate into fleet operations",
      ],
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
        "AI-powered platform for invoice management, collections, and payment reconciliation. Temporal.io for durable workflow orchestration, Mastra AI agents, Xero/Stripe integrations.",
      highlights: [
        "Over-engineered for the problem and never shipped. A lesson in scoping",
      ],
    },
  ],
};
