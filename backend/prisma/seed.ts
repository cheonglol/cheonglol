let prisma: any = null;
try {
  // lazy-require so the file can be read without installing deps during static analysis
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch (err) {
  // runtime: developer must run `prisma generate` before running this seed.
  // eslint-disable-next-line no-console
  console.warn('Prisma client not available; run `bun --cwd backend prisma generate` first');
}

async function main() {
  await prisma.post.upsert({
    where: { slug: 'cheonglol-reset' },
    update: {},
    create: {
      title: 'Why I removed the old cheonglol/cheonglol repo',
      slug: 'cheonglol-reset',
      summary: 'Rebuilding this workspace as an experiment in DX and AI-assisted development.',
      categories: ['announcement', 'meta'],
      content:
        'The original cheonglol/cheonglol repo was deleted. This workspace will be used to experiment with developer experience and building with AI. Future posts will explore automating blog posting via Telegram and oRPC-driven workflows.',
      publishedAt: new Date(),
    },
  });
}

if (prisma) {
  main()
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
} else {
  // eslint-disable-next-line no-console
  console.warn('Skipping seed: @prisma/client not available.');
}
