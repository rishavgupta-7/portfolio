import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@stark.dev';
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'StarkAdmin2026!';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: 'Rishav Gupta',
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: 'Rishav Gupta',
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin seeded: ${admin.email}`);

  // 2. Seed Hero
  const hero = await prisma.hero.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Rishav Gupta',
      highlightedName: 'Rishav',
      title: 'Full-Stack & Shopify Developer',
      description: 'Architecting scalable web applications, modern headless commerce, and high-performance digital experiences tailored for ambitious brands and enterprise teams.',
      availabilityText: 'Available for freelance work',
      location: 'India',
      remoteText: 'Remote Worldwide',
      techLabels: ['Full-Stack Development', 'Shopify Plus', 'React Ecosystem', 'Node.js & APIs'],
      primaryBtnText: 'Start a Project',
      primaryBtnUrl: '/contact',
      secondaryBtnText: 'Explore Work',
      secondaryBtnUrl: '/work',
      clientProofText: '5.0 Rating • 100% Client Satisfaction Worldwide',
      heroImage: '/uploads/hero-developer.png',
      bgImage: null,
    },
  });
  console.log('✅ Hero section seeded');

  // 3. Seed Hero Stats
  const existingStats = await prisma.heroStat.count();
  if (existingStats === 0) {
    await prisma.heroStat.createMany({
      data: [
        { value: '10+', label: 'Projects Completed', order: 1, isActive: true },
        { value: '2+', label: 'Years Building', order: 2, isActive: true },
        { value: '15+', label: 'Happy Clients', order: 3, isActive: true },
        { value: '99.9%', label: 'Uptime & Reliability', order: 4, isActive: true },
      ],
    });
    console.log('✅ Hero stats seeded');
  }

  // 4. Seed Technologies
  const existingTech = await prisma.technology.count();
  if (existingTech === 0) {
    await prisma.technology.createMany({
      data: [
        {
          name: 'React',
          category: 'Frontend',
          logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
          position: 'top-left',
          animationDelay: 0.0,
          order: 1,
          isActive: true,
          isHero: true,
        },
        {
          name: 'Node.js',
          category: 'Backend',
          logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
          position: 'top-right',
          animationDelay: 0.8,
          order: 2,
          isActive: true,
          isHero: true,
        },
        {
          name: 'Shopify',
          category: 'E-commerce',
          logoUrl: 'https://cdn.worldvectorlogo.com/logos/shopify.svg',
          position: 'center-right',
          animationDelay: 1.4,
          order: 3,
          isActive: true,
          isHero: true,
        },
        {
          name: 'PostgreSQL',
          category: 'Database',
          logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
          position: 'bottom-right',
          animationDelay: 2.1,
          order: 4,
          isActive: true,
          isHero: true,
        },
        {
          name: 'JavaScript',
          category: 'Frontend',
          logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
          position: 'bottom-left',
          animationDelay: 2.7,
          order: 5,
          isActive: true,
          isHero: true,
        },
        {
          name: 'Tailwind CSS',
          category: 'Frontend',
          logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
          position: 'floating',
          animationDelay: 3.2,
          order: 6,
          isActive: true,
          isHero: false,
        },
        {
          name: 'TypeScript',
          category: 'Core',
          logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
          position: 'floating',
          animationDelay: 3.8,
          order: 7,
          isActive: true,
          isHero: false,
        },
        {
          name: 'Next.js',
          category: 'Frontend',
          logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
          position: 'floating',
          animationDelay: 4.2,
          order: 8,
          isActive: true,
          isHero: false,
        },
      ],
    });
    console.log('✅ Technologies seeded');
  }

  // 5. Seed Projects
  const existingProjects = await prisma.project.count();
  if (existingProjects === 0) {
    await prisma.project.createMany({
      data: [
        {
          title: 'Apex Luxury E-Commerce',
          slug: 'apex-luxury-ecommerce',
          tagline: 'High-conversion bespoke Shopify Plus storefront',
          description: 'Custom Shopify Plus storefront with Liquid, Hydrogen headless checkout, 3D product previews, and sub-second load times resulting in a 42% conversion bump.',
          imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
          category: 'Shopify',
          techStack: ['Shopify Plus', 'Liquid', 'Tailwind CSS', 'JavaScript', 'GraphQL'],
          liveUrl: 'https://example.com/apex',
          githubUrl: 'https://github.com/example/apex-shopify',
          featured: true,
          order: 1,
          isActive: true,
        },
        {
          title: 'Nexus Cloud Analytics Dashboard',
          slug: 'nexus-analytics-dashboard',
          tagline: 'Real-time telemetry and metrics for microservices',
          description: 'A full-stack monitoring suite with live streaming charts, JWT role-based access control, PostgreSQL data aggregation, and dark futuristic UI.',
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
          category: 'Full-Stack',
          techStack: ['React', 'Vite', 'Node.js', 'Express', 'PostgreSQL', 'Prisma'],
          liveUrl: 'https://example.com/nexus',
          githubUrl: 'https://github.com/example/nexus-cloud',
          featured: true,
          order: 2,
          isActive: true,
        },
        {
          title: 'Pulse Commerce Headless Store',
          slug: 'pulse-commerce-headless',
          tagline: 'Next-gen headless storefront with instant search',
          description: 'Headless e-commerce architecture utilizing React and Node REST APIs with instant faceted filtering, Algolia search integration, and automated inventory sync.',
          imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
          category: 'Full-Stack',
          techStack: ['React', 'Shopify Storefront API', 'Node.js', 'Tailwind CSS'],
          liveUrl: 'https://example.com/pulse',
          githubUrl: 'https://github.com/example/pulse-store',
          featured: true,
          order: 3,
          isActive: true,
        },
        {
          title: 'Aura Protocol Cyber Portfolio',
          slug: 'aura-protocol-portfolio',
          tagline: 'Dark futuristic Web3 showcase & mint terminal',
          description: 'Interactive portfolio and decentralized application interface featuring particle simulations, Web3 wallet connect, and glowing glassmorphic elements.',
          imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
          category: 'React/Next.js',
          techStack: ['React', 'Tailwind CSS', 'Vite', 'Ethers.js'],
          liveUrl: 'https://example.com/aura',
          githubUrl: 'https://github.com/example/aura-web3',
          featured: false,
          order: 4,
          isActive: true,
        },
      ],
    });
    console.log('✅ Projects seeded');
  }

  // 6. Seed Services
  const existingServices = await prisma.service.count();
  if (existingServices === 0) {
    await prisma.service.createMany({
      data: [
        {
          title: 'Full-Stack Web Development',
          description: 'Engineering responsive, high-performance web applications with React, modern component libraries, Node.js REST APIs, and scalable PostgreSQL schemas.',
          icon: 'Code2',
          technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Prisma'],
          order: 1,
          isActive: true,
        },
        {
          title: 'Shopify & Headless E-Commerce',
          description: 'Building custom Shopify themes, private app integrations, Liquid optimizations, and headless Hydrogen commerce that skyrocket sales conversion.',
          icon: 'ShoppingBag',
          technologies: ['Shopify Plus', 'Liquid', 'Storefront API', 'Hydrogen'],
          order: 2,
          isActive: true,
        },
        {
          title: 'RESTful API & Backend Systems',
          description: 'Designing rock-solid APIs, authentication pipelines, microservice integrations, and optimized database queries with automated migrations.',
          icon: 'Server',
          technologies: ['Node.js', 'Express', 'JWT Auth', 'PostgreSQL', 'Prisma'],
          order: 3,
          isActive: true,
        },
        {
          title: 'Speed Tuning & Core Web Vitals',
          description: 'Auditing and revamping sluggish websites to hit 95+ Google Lighthouse scores, eliminating render bottlenecks and maximizing SEO rank.',
          icon: 'Zap',
          technologies: ['Vite', 'Code Splitting', 'Image CDN', 'SEO Architecture'],
          order: 4,
          isActive: true,
        },
      ],
    });
    console.log('✅ Services seeded');
  }

  // 7. Seed About
  await prisma.about.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heading: 'Crafting Scalable Code & High-Conversion E-Commerce',
      bio: 'I am Rishav Gupta, a Full-Stack & Shopify developer dedicated to building polished, futuristic digital products. Over the past 2+ years, I have architected high-throughput web applications and bespoke Shopify stores that blend striking visual aesthetics with uncompromising performance.',
      location: 'India • Available for Remote Worldwide',
      email: 'rishavgupta@example.com',
      yearsExperience: '2+',
      resumeUrl: '#',
      profileImage: '/uploads/hero-developer.png',
    },
  });
  console.log('✅ About seeded');

  // 8. Seed Skills
  const existingSkills = await prisma.skill.count();
  if (existingSkills === 0) {
    await prisma.skill.createMany({
      data: [
        { name: 'React / Vite', level: 95, category: 'Frontend', order: 1, isActive: true },
        { name: 'JavaScript (ES6+)', level: 95, category: 'Frontend', order: 2, isActive: true },
        { name: 'Tailwind CSS', level: 90, category: 'Frontend', order: 3, isActive: true },
        { name: 'Shopify / Liquid', level: 92, category: 'E-commerce', order: 4, isActive: true },
        { name: 'Node.js / Express', level: 90, category: 'Backend', order: 5, isActive: true },
        { name: 'PostgreSQL & Prisma', level: 88, category: 'Backend', order: 6, isActive: true },
        { name: 'REST APIs & JWT Auth', level: 92, category: 'Backend', order: 7, isActive: true },
        { name: 'Git & Deployment', level: 85, category: 'DevOps', order: 8, isActive: true },
      ],
    });
    console.log('✅ Skills seeded');
  }

  // 9. Seed Experiences
  const existingExp = await prisma.experience.count();
  if (existingExp === 0) {
    await prisma.experience.createMany({
      data: [
        {
          role: 'Lead Full-Stack & Shopify Developer',
          company: 'Freelance & Agency Collaborations',
          location: 'Remote',
          startDate: '2023',
          endDate: 'Present',
          description: 'Delivering end-to-end full-stack web applications and custom high-volume Shopify themes for international clientele.',
          technologies: ['React', 'Shopify Plus', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
          order: 1,
          isActive: true,
        },
        {
          role: 'Frontend & E-Commerce Engineer',
          company: 'Digital Commerce Studio',
          location: 'Remote',
          startDate: '2022',
          endDate: '2023',
          description: 'Developed responsive storefronts, speed optimizations, and interactive React user interfaces with seamless API integrations.',
          technologies: ['React', 'JavaScript', 'Liquid', 'REST APIs'],
          order: 2,
          isActive: true,
        },
      ],
    });
    console.log('✅ Experiences seeded');
  }

  // 10. Seed Testimonials
  const existingTestimonials = await prisma.testimonial.count();
  if (existingTestimonials === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          clientName: 'Alexander Vance',
          clientRole: 'CEO',
          company: 'Vance Digital US',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          content: 'Rishav completely transformed our web store. His mastery of both Shopify Liquid and modern React helped us double our checkout conversion rate.',
          rating: 5,
          order: 1,
          isActive: true,
        },
        {
          clientName: 'Elena Rostova',
          clientRole: 'Product Director',
          company: 'Hyperion Labs',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          content: 'The custom dashboard Rishav built is stunning, blazing fast, and handles millions of records smoothly. Truly a world-class engineer.',
          rating: 5,
          order: 2,
          isActive: true,
        },
      ],
    });
    console.log('✅ Testimonials seeded');
  }

  // 11. Seed Social Links
  const existingSocials = await prisma.socialLink.count();
  if (existingSocials === 0) {
    await prisma.socialLink.createMany({
      data: [
        { platform: 'GitHub', url: 'https://github.com', icon: 'Github', order: 1, isActive: true },
        { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin', order: 2, isActive: true },
        { platform: 'Twitter / X', url: 'https://x.com', icon: 'Twitter', order: 3, isActive: true },
        { platform: 'Email', url: 'mailto:rishavgupta@example.com', icon: 'Mail', order: 4, isActive: true },
      ],
    });
    console.log('✅ Social links seeded');
  }

  // 12. Seed Site Settings
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteTitle: 'Rishav Gupta | Full-Stack & Shopify Developer',
      metaDescription: 'Portfolio of Rishav Gupta - Full-Stack Developer & Shopify Specialist delivering high-performance web applications and sleek e-commerce solutions.',
      contactEmail: 'rishavgupta@example.com',
      contactPhone: '+91 98765 43210',
      footerText: 'Engineered with React, Node.js, Prisma & Tailwind CSS. Designed for tomorrow.',
    },
  });
  console.log('✅ Site settings seeded');

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
