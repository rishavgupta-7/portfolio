import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Syncing Tech Ecosystem settings and technologies...');

  // 1. Upsert TechEcosystem settings
  const ecosystem = await prisma.techEcosystem.upsert({
    where: { id: 1 },
    update: {
      eyebrow: 'SKILLS & TECHNOLOGIES',
      heading: 'My Tech Ecosystem',
      subtitle: 'Technologies I use to build modern and scalable applications.',
      description: 'A combination of modern tools, frameworks and best practices to build high-performance web applications and e-commerce solutions.',
      buttonText: 'View Full Stack →',
      buttonUrl: '/stack',
      terminalHeader: "~/rishav's dev --stack",
      systemStatusText: 'All Systems Operational',
      systemStatusActive: true,
    },
    create: {
      id: 1,
      eyebrow: 'SKILLS & TECHNOLOGIES',
      heading: 'My Tech Ecosystem',
      subtitle: 'Technologies I use to build modern and scalable applications.',
      description: 'A combination of modern tools, frameworks and best practices to build high-performance web applications and e-commerce solutions.',
      buttonText: 'View Full Stack →',
      buttonUrl: '/stack',
      terminalHeader: "~/rishav's dev --stack",
      systemStatusText: 'All Systems Operational',
      systemStatusActive: true,
    },
  });
  console.log('✅ TechEcosystem settings ready:', ecosystem.heading);

  // 2. Define standard technologies with category, versions and terminal flags
  const ecosystemTechs = [
    // Frontend Card
    {
      name: 'React.js',
      category: 'Frontend',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      version: 'v19',
      showInTerminal: true,
      terminalVersion: 'v19',
      order: 1,
      position: 'top-left',
      isHero: true,
      isActive: true,
    },
    {
      name: 'Next.js',
      category: 'Frontend',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
      version: 'latest',
      showInTerminal: true,
      terminalVersion: 'latest',
      order: 2,
      position: 'floating',
      isHero: false,
      isActive: true,
    },
    {
      name: 'Tailwind CSS',
      category: 'Frontend',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
      version: 'latest',
      showInTerminal: true,
      terminalVersion: 'latest',
      order: 3,
      position: 'floating',
      isHero: false,
      isActive: true,
    },

    // Backend Card
    {
      name: 'Node.js',
      category: 'Backend',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      version: 'v22',
      showInTerminal: true,
      terminalVersion: 'v22',
      order: 4,
      position: 'top-right',
      isHero: true,
      isActive: true,
    },
    {
      name: 'Express.js',
      category: 'Backend',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
      version: 'latest',
      showInTerminal: true,
      terminalVersion: 'latest',
      order: 5,
      position: 'floating',
      isHero: false,
      isActive: true,
    },
    {
      name: 'REST APIs',
      category: 'Backend',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
      version: 'v2',
      showInTerminal: false,
      terminalVersion: 'latest',
      order: 6,
      position: 'floating',
      isHero: false,
      isActive: true,
    },

    // Database Card
    {
      name: 'PostgreSQL',
      category: 'Database',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      version: 'v17',
      showInTerminal: true,
      terminalVersion: 'v17',
      order: 7,
      position: 'bottom-right',
      isHero: true,
      isActive: true,
    },
    {
      name: 'MongoDB',
      category: 'Database',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      version: 'latest',
      showInTerminal: true,
      terminalVersion: 'latest',
      order: 8,
      position: 'floating',
      isHero: false,
      isActive: true,
    },

    // Tools & Others Card
    {
      name: 'Git',
      category: 'Tools & Others',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      version: 'v2.4',
      showInTerminal: false,
      terminalVersion: 'latest',
      order: 9,
      position: 'floating',
      isHero: false,
      isActive: true,
    },
    {
      name: 'Docker',
      category: 'Tools & Others',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      version: 'v27',
      showInTerminal: false,
      terminalVersion: 'latest',
      order: 10,
      position: 'floating',
      isHero: false,
      isActive: true,
    },
    {
      name: 'Prisma',
      category: 'Tools & Others',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg',
      version: 'latest',
      showInTerminal: true,
      terminalVersion: 'latest',
      order: 11,
      position: 'floating',
      isHero: false,
      isActive: true,
    },
    {
      name: 'Socket.io',
      category: 'Tools & Others',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg',
      version: 'v4.8',
      showInTerminal: false,
      terminalVersion: 'latest',
      order: 12,
      position: 'floating',
      isHero: false,
      isActive: true,
    },
    {
      name: 'Cloudinary',
      category: 'Tools & Others',
      logoUrl: 'https://res.cloudinary.com/demo/image/upload/v1631776949/cloudinary_icon.png',
      version: 'v2.0',
      showInTerminal: false,
      terminalVersion: 'latest',
      order: 13,
      position: 'floating',
      isHero: false,
      isActive: true,
    },

    // E-commerce Card
    {
      name: 'Shopify',
      category: 'E-commerce',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/shopify.svg',
      version: 'Plus',
      showInTerminal: false,
      terminalVersion: 'latest',
      order: 14,
      position: 'center-right',
      isHero: true,
      isActive: true,
    },
    {
      name: 'Liquid',
      category: 'E-commerce',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/shopify.svg',
      version: 'v5.4',
      showInTerminal: false,
      terminalVersion: 'latest',
      order: 15,
      position: 'floating',
      isHero: false,
      isActive: true,
    },
    {
      name: 'Storefront API',
      category: 'E-commerce',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/graphql.svg',
      version: '2026-01',
      showInTerminal: false,
      terminalVersion: 'latest',
      order: 16,
      position: 'floating',
      isHero: false,
      isActive: true,
    },
  ];

  for (const item of ecosystemTechs) {
    // Check if technology exists by name or similar name (e.g., React vs React.js)
    const existing = await prisma.technology.findFirst({
      where: {
        OR: [
          { name: { equals: item.name, mode: 'insensitive' } },
          { name: { equals: item.name.replace('.js', ''), mode: 'insensitive' } },
        ],
      },
    });

    if (existing) {
      await prisma.technology.update({
        where: { id: existing.id },
        data: {
          name: item.name,
          category: item.category,
          logoUrl: existing.logoUrl || item.logoUrl,
          version: item.version,
          showInTerminal: item.showInTerminal,
          terminalVersion: item.terminalVersion,
          order: item.order,
          isActive: true,
        },
      });
      console.log(`Updated technology: ${item.name}`);
    } else {
      await prisma.technology.create({
        data: item,
      });
      console.log(`Created technology: ${item.name}`);
    }
  }

  console.log('✨ Tech Ecosystem synchronization complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
