import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// GET /api/portfolio - Combined optimized payload for lightning-fast initial load
router.get('/portfolio', async (req, res) => {
  try {
    const [
      hero,
      heroStats,
      technologies,
      projects,
      services,
      about,
      skills,
      experiences,
      testimonials,
      socialLinks,
      settings,
      techEcosystem,
      processSetting,
      processSteps,
    ] = await Promise.all([
      prisma.hero.findFirst({ where: { id: 1 } }),
      prisma.heroStat.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
      prisma.technology.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
      prisma.project.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
      prisma.service.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
      prisma.about.findFirst({ where: { id: 1 } }),
      prisma.skill.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
      prisma.experience.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
      prisma.testimonial.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
      prisma.socialLink.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
      prisma.siteSetting.findFirst({ where: { id: 1 } }),
      prisma.techEcosystem.findFirst({ where: { id: 1 } }),
      prisma.processSetting.findFirst({ where: { id: 1 } }),
      prisma.processStep.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
    ]);

    return res.json({
      hero: hero || {},
      heroStats: heroStats || [],
      technologies: technologies || [],
      projects: projects || [],
      services: services || [],
      about: about || {},
      skills: skills || [],
      experiences: experiences || [],
      testimonials: testimonials || [],
      socialLinks: socialLinks || [],
      settings: settings || {},
      techEcosystem: techEcosystem || {
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
      processSetting: processSetting || {
        eyebrow: 'MY PROCESS',
        heading: 'How I Build',
        description: 'A simple and transparent process to turn your ideas into a successful digital product.',
      },
      processSteps: processSteps || [],
    });
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return res.status(500).json({ error: 'Failed to load portfolio content.' });
  }
});

// GET /api/process
router.get('/process', async (req, res) => {
  try {
    const [setting, steps] = await Promise.all([
      prisma.processSetting.findFirst({ where: { id: 1 } }),
      prisma.processStep.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
    ]);
    return res.json({
      setting: setting || {
        eyebrow: 'MY PROCESS',
        heading: 'How I Build',
        description: 'A simple and transparent process to turn your ideas into a successful digital product.',
      },
      steps: steps || [],
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load process data.' });
  }
});

// GET /api/tech-ecosystem
router.get('/tech-ecosystem', async (req, res) => {
  try {
    let ecosystem = await prisma.techEcosystem.findFirst({ where: { id: 1 } });
    if (!ecosystem) {
      ecosystem = {
        eyebrow: 'SKILLS & TECHNOLOGIES',
        heading: 'My Tech Ecosystem',
        subtitle: 'Technologies I use to build modern and scalable applications.',
        description: 'A combination of modern tools, frameworks and best practices to build high-performance web applications and e-commerce solutions.',
        buttonText: 'View Full Stack →',
        buttonUrl: '/stack',
        terminalHeader: "~/rishav's dev --stack",
        systemStatusText: 'All Systems Operational',
        systemStatusActive: true,
      };
    }
    const technologies = await prisma.technology.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return res.json({ ecosystem, technologies });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load tech ecosystem.' });
  }
});


// GET /api/hero
router.get('/hero', async (req, res) => {
  try {
    const [hero, stats, technologies] = await Promise.all([
      prisma.hero.findFirst({ where: { id: 1 } }),
      prisma.heroStat.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
      prisma.technology.findMany({ where: { isActive: true, isHero: true }, orderBy: { order: 'asc' } }),
    ]);
    return res.json({ hero, stats, technologies });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load hero section.' });
  }
});

// GET /api/technologies
router.get('/technologies', async (req, res) => {
  try {
    const technologies = await prisma.technology.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return res.json(technologies);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load technologies.' });
  }
});

// GET /api/projects
router.get('/projects', async (req, res) => {
  try {
    const { category, featured } = req.query;
    const where = { isActive: true };
    if (category && category !== 'All') {
      where.category = category;
    }
    if (featured === 'true') {
      where.featured = true;
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { order: 'asc' },
    });
    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load projects.' });
  }
});

// GET /api/services
router.get('/services', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return res.json(services);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load services.' });
  }
});

// GET /api/about
router.get('/about', async (req, res) => {
  try {
    const [about, skills, experiences] = await Promise.all([
      prisma.about.findFirst({ where: { id: 1 } }),
      prisma.skill.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
      prisma.experience.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
    ]);
    return res.json({ about, skills, experiences });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load about details.' });
  }
});

// GET /api/testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return res.json(testimonials);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load testimonials.' });
  }
});

// GET /api/settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await prisma.siteSetting.findFirst({ where: { id: 1 } });
    return res.json(settings || {});
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load site settings.' });
  }
});

// POST /api/contact - Public contact message submission
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        subject: subject ? subject.trim() : 'Project Inquiry',
        message: message.trim(),
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. I will get back to you shortly.',
      id: contactMessage.id,
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    return res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

export default router;
