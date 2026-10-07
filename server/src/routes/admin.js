import express from 'express';
import prisma from '../db.js';
import { requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Apply auth protection to all admin routes
router.use(requireAdmin);

// ==================== DASHBOARD OVERVIEW ====================
router.get('/overview', async (req, res) => {
  try {
    const [
      projectCount,
      serviceCount,
      techCount,
      messageCount,
      unreadMessageCount,
      testimonialCount,
      recentMessages,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.service.count(),
      prisma.technology.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.testimonial.count(),
      prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return res.json({
      metrics: {
        projects: projectCount,
        services: serviceCount,
        technologies: techCount,
        messages: messageCount,
        unreadMessages: unreadMessageCount,
        testimonials: testimonialCount,
      },
      recentMessages,
    });
  } catch (error) {
    console.error('Error fetching admin overview:', error);
    return res.status(500).json({ error: 'Failed to load dashboard overview.' });
  }
});

// ==================== FILE / MEDIA UPLOADER ====================
router.post('/upload', (req, res) => {
  upload.any()(req, res, (err) => {
    if (err) {
      console.error('Single upload multer error:', err);
      return res.status(400).json({ error: err.message || 'Upload error' });
    }
    const file = req.files && req.files[0];
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    const isVideo = file.mimetype.startsWith('video/') || /\.(mp4|webm|mov|ogg|mkv)$/i.test(file.filename);
    const fileUrl = `/uploads/${req.file ? req.file.filename : file.filename}`;
    return res.json({
      success: true,
      url: fileUrl,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      isVideo,
    });
  });
});

router.post('/upload-multiple', (req, res) => {
  upload.array('files', 20)(req, res, (err) => {
    if (err) {
      console.error('Multi upload multer error:', err);
      return res.status(400).json({ error: err.message || 'Multiple upload error' });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }
    const uploaded = req.files.map(file => {
      const isVideo = file.mimetype.startsWith('video/') || /\.(mp4|webm|mov|ogg|mkv)$/i.test(file.filename);
      return {
        url: `/uploads/${file.filename}`,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        isVideo,
      };
    });
    return res.json({
      success: true,
      files: uploaded,
      urls: uploaded.map(f => f.url),
    });
  });
});

// ==================== HERO MANAGEMENT ====================
router.get('/hero', async (req, res) => {
  try {
    const hero = await prisma.hero.findFirst({ where: { id: 1 } });
    const stats = await prisma.heroStat.findMany({ orderBy: { order: 'asc' } });
    return res.json({ hero, stats });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load hero.' });
  }
});

router.put('/hero', async (req, res) => {
  try {
    const {
      name,
      highlightedName,
      title,
      description,
      availabilityText,
      location,
      remoteText,
      techLabels,
      primaryBtnText,
      primaryBtnUrl,
      secondaryBtnText,
      secondaryBtnUrl,
      clientProofText,
      heroImage,
      bgImage,
    } = req.body;

    const hero = await prisma.hero.upsert({
      where: { id: 1 },
      update: {
        name,
        highlightedName,
        title,
        description,
        availabilityText,
        location,
        remoteText,
        techLabels: Array.isArray(techLabels) ? techLabels : techLabels ? techLabels.split(',').map(s => s.trim()) : [],
        primaryBtnText,
        primaryBtnUrl,
        secondaryBtnText,
        secondaryBtnUrl,
        clientProofText,
        heroImage,
        bgImage,
      },
      create: {
        id: 1,
        name,
        highlightedName,
        title,
        description,
        availabilityText,
        location,
        remoteText,
        techLabels: Array.isArray(techLabels) ? techLabels : [],
        primaryBtnText,
        primaryBtnUrl,
        secondaryBtnText,
        secondaryBtnUrl,
        clientProofText,
        heroImage,
        bgImage,
      },
    });

    return res.json({ success: true, hero });
  } catch (error) {
    console.error('Hero update error:', error);
    return res.status(500).json({ error: 'Failed to update hero section.' });
  }
});

// ==================== HERO STATS ====================
router.get('/stats', async (req, res) => {
  try {
    const stats = await prisma.heroStat.findMany({ orderBy: { order: 'asc' } });
    return res.json(stats);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load stats.' });
  }
});

router.post('/stats', async (req, res) => {
  try {
    const { value, label, order, isActive } = req.body;
    const stat = await prisma.heroStat.create({
      data: {
        value,
        label,
        order: Number(order) || 0,
        isActive: isActive !== false,
      },
    });
    return res.status(201).json(stat);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create statistic.' });
  }
});

router.put('/stats/:id', async (req, res) => {
  try {
    const { value, label, order, isActive } = req.body;
    const stat = await prisma.heroStat.update({
      where: { id: Number(req.params.id) },
      data: {
        value,
        label,
        order: Number(order) || 0,
        isActive: isActive !== false,
      },
    });
    return res.json(stat);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update statistic.' });
  }
});

router.delete('/stats/:id', async (req, res) => {
  try {
    await prisma.heroStat.delete({ where: { id: Number(req.params.id) } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete statistic.' });
  }
});

// ==================== TECH ECOSYSTEM ====================
router.get('/tech-ecosystem', async (req, res) => {
  try {
    let ecosystem = await prisma.techEcosystem.findFirst({ where: { id: 1 } });
    if (!ecosystem) {
      ecosystem = await prisma.techEcosystem.create({
        data: { id: 1 },
      });
    }
    return res.json(ecosystem);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load tech ecosystem settings.' });
  }
});

router.put('/tech-ecosystem', async (req, res) => {
  try {
    const {
      eyebrow,
      heading,
      subtitle,
      description,
      buttonText,
      buttonUrl,
      terminalHeader,
      systemStatusText,
      systemStatusActive,
    } = req.body;

    const ecosystem = await prisma.techEcosystem.upsert({
      where: { id: 1 },
      update: {
        eyebrow,
        heading,
        subtitle,
        description,
        buttonText,
        buttonUrl,
        terminalHeader,
        systemStatusText,
        systemStatusActive: systemStatusActive !== false,
      },
      create: {
        id: 1,
        eyebrow,
        heading,
        subtitle,
        description,
        buttonText,
        buttonUrl,
        terminalHeader,
        systemStatusText,
        systemStatusActive: systemStatusActive !== false,
      },
    });
    return res.json({ success: true, ecosystem });
  } catch (error) {
    console.error('Ecosystem update error:', error);
    return res.status(500).json({ error: 'Failed to update tech ecosystem settings.' });
  }
});

// ==================== PROCESS / HOW I BUILD ====================
router.get('/process', async (req, res) => {
  try {
    const [setting, steps] = await Promise.all([
      prisma.processSetting.findFirst({ where: { id: 1 } }),
      prisma.processStep.findMany({ orderBy: { order: 'asc' } }),
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

router.put('/process/settings', async (req, res) => {
  try {
    const { eyebrow, heading, description } = req.body;
    const setting = await prisma.processSetting.upsert({
      where: { id: 1 },
      update: { eyebrow, heading, description },
      create: { id: 1, eyebrow, heading, description },
    });
    return res.json({ success: true, setting });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update process settings.' });
  }
});

router.post('/process/steps', async (req, res) => {
  try {
    const { stepNumber, title, description, icon, order, isActive } = req.body;
    if (!stepNumber || !title || !description) {
      return res.status(400).json({ error: 'Step number, title, and description are required.' });
    }
    const step = await prisma.processStep.create({
      data: {
        stepNumber,
        title,
        description,
        icon: icon || 'Search',
        order: Number(order) || 0,
        isActive: isActive !== false,
      },
    });
    return res.status(201).json(step);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create process step.' });
  }
});

router.put('/process/steps/:id', async (req, res) => {
  try {
    const { stepNumber, title, description, icon, order, isActive } = req.body;
    const step = await prisma.processStep.update({
      where: { id: Number(req.params.id) },
      data: {
        stepNumber,
        title,
        description,
        icon,
        order: Number(order) || 0,
        isActive: isActive !== false,
      },
    });
    return res.json(step);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update process step.' });
  }
});

router.delete('/process/steps/:id', async (req, res) => {
  try {
    await prisma.processStep.delete({ where: { id: Number(req.params.id) } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete process step.' });
  }
});

// ==================== TECHNOLOGIES ====================
router.get('/technologies', async (req, res) => {
  try {
    const technologies = await prisma.technology.findMany({ orderBy: { order: 'asc' } });
    return res.json(technologies);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load technologies.' });
  }
});

router.post('/technologies', async (req, res) => {
  try {
    const {
      name,
      category,
      logoUrl,
      position,
      animationDelay,
      order,
      isActive,
      isHero,
      version,
      description,
      showInTerminal,
      terminalVersion,
    } = req.body;

    if (!name || !logoUrl) {
      return res.status(400).json({ error: 'Name and Logo URL/image are required.' });
    }

    const tech = await prisma.technology.create({
      data: {
        name,
        category: category || 'Core',
        logoUrl,
        position: position || 'floating',
        animationDelay: parseFloat(animationDelay) || 0.0,
        order: Number(order) || 0,
        isActive: isActive !== false,
        isHero: isHero !== false,
        version: version || 'latest',
        description: description || null,
        showInTerminal: showInTerminal === true,
        terminalVersion: terminalVersion || version || 'latest',
      },
    });
    return res.status(201).json(tech);
  } catch (error) {
    console.error('Create technology error:', error);
    return res.status(500).json({ error: 'Failed to create technology.' });
  }
});

router.put('/technologies/:id', async (req, res) => {
  try {
    const {
      name,
      category,
      logoUrl,
      position,
      animationDelay,
      order,
      isActive,
      isHero,
      version,
      description,
      showInTerminal,
      terminalVersion,
    } = req.body;

    const tech = await prisma.technology.update({
      where: { id: Number(req.params.id) },
      data: {
        name,
        category,
        logoUrl,
        position,
        animationDelay: parseFloat(animationDelay) || 0.0,
        order: Number(order) || 0,
        isActive: isActive !== false,
        isHero: isHero !== false,
        version: version !== undefined ? version : 'latest',
        description: description !== undefined ? description : null,
        showInTerminal: showInTerminal === true,
        terminalVersion: terminalVersion !== undefined ? terminalVersion : (version || 'latest'),
      },
    });
    return res.json(tech);
  } catch (error) {
    console.error('Update technology error:', error);
    return res.status(500).json({ error: 'Failed to update technology.' });
  }
});

router.delete('/technologies/:id', async (req, res) => {
  try {
    await prisma.technology.delete({ where: { id: Number(req.params.id) } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete technology.' });
  }
});

// ==================== PROJECTS ====================
router.get('/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });
    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load projects.' });
  }
});

router.post('/projects', async (req, res) => {
  try {
    const {
      title,
      slug,
      tagline,
      description,
      imageUrl,
      videoUrl,
      media,
      category,
      techStack,
      liveUrl,
      githubUrl,
      featured,
      order,
      isActive,
    } = req.body;

    if (!title || !description || !imageUrl) {
      return res.status(400).json({ error: 'Title, description, and image URL are required.' });
    }

    const projectSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const project = await prisma.project.create({
      data: {
        title,
        slug: projectSlug,
        tagline,
        description,
        imageUrl,
        videoUrl: videoUrl || null,
        media: Array.isArray(media) ? media : typeof media === 'string' ? media.split(',').map(s => s.trim()).filter(Boolean) : [],
        category: category || 'Full-Stack',
        techStack: Array.isArray(techStack) ? techStack : typeof techStack === 'string' ? techStack.split(',').map(s => s.trim()) : [],
        liveUrl,
        githubUrl,
        featured: Boolean(featured),
        order: Number(order) || 0,
        isActive: isActive !== false,
      },
    });
    return res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({ error: 'Failed to create project.' });
  }
});

router.put('/projects/:id', async (req, res) => {
  try {
    const {
      title,
      slug,
      tagline,
      description,
      imageUrl,
      videoUrl,
      media,
      category,
      techStack,
      liveUrl,
      githubUrl,
      featured,
      order,
      isActive,
    } = req.body;

    const project = await prisma.project.update({
      where: { id: Number(req.params.id) },
      data: {
        title,
        slug,
        tagline,
        description,
        imageUrl,
        videoUrl: videoUrl !== undefined ? (videoUrl || null) : undefined,
        media: media !== undefined ? (Array.isArray(media) ? media : typeof media === 'string' ? media.split(',').map(s => s.trim()).filter(Boolean) : []) : undefined,
        category,
        techStack: Array.isArray(techStack) ? techStack : typeof techStack === 'string' ? techStack.split(',').map(s => s.trim()) : [],
        liveUrl,
        githubUrl,
        featured: Boolean(featured),
        order: Number(order) || 0,
        isActive: isActive !== false,
      },
    });
    return res.json(project);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update project.' });
  }
});

router.delete('/projects/:id', async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: Number(req.params.id) } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete project.' });
  }
});

// ==================== SERVICES ====================
router.get('/services', async (req, res) => {
  try {
    const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
    return res.json(services);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load services.' });
  }
});

router.post('/services', async (req, res) => {
  try {
    const { title, description, icon, technologies, order, isActive } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }
    const service = await prisma.service.create({
      data: {
        title,
        description,
        icon: icon || 'Code2',
        technologies: Array.isArray(technologies) ? technologies : typeof technologies === 'string' ? technologies.split(',').map(s => s.trim()) : [],
        order: Number(order) || 0,
        isActive: isActive !== false,
      },
    });
    return res.status(201).json(service);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create service.' });
  }
});

router.put('/services/:id', async (req, res) => {
  try {
    const { title, description, icon, technologies, order, isActive } = req.body;
    const service = await prisma.service.update({
      where: { id: Number(req.params.id) },
      data: {
        title,
        description,
        icon,
        technologies: Array.isArray(technologies) ? technologies : typeof technologies === 'string' ? technologies.split(',').map(s => s.trim()) : [],
        order: Number(order) || 0,
        isActive: isActive !== false,
      },
    });
    return res.json(service);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update service.' });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    await prisma.service.delete({ where: { id: Number(req.params.id) } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete service.' });
  }
});

// ==================== ABOUT & EXPERIENCE & SKILLS ====================
router.get('/about', async (req, res) => {
  try {
    const about = await prisma.about.findFirst({ where: { id: 1 } });
    const skills = await prisma.skill.findMany({ orderBy: { order: 'asc' } });
    const experiences = await prisma.experience.findMany({ orderBy: { order: 'asc' } });
    const socialLinks = await prisma.socialLink.findMany({ orderBy: { order: 'asc' } });
    return res.json({ about, skills, experiences, socialLinks });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load about data.' });
  }
});

router.put('/about', async (req, res) => {
  try {
    const { heading, bio, profileImage, resumeUrl, location, email, phone, yearsExperience } = req.body;
    const about = await prisma.about.upsert({
      where: { id: 1 },
      update: {
        heading,
        bio,
        profileImage,
        resumeUrl,
        location,
        email,
        phone,
        yearsExperience,
      },
      create: {
        id: 1,
        heading,
        bio,
        profileImage,
        resumeUrl,
        location,
        email,
        phone,
        yearsExperience,
      },
    });
    return res.json({ success: true, about });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update about section.' });
  }
});

// Skills
router.post('/skills', async (req, res) => {
  try {
    const { name, level, category, order, isActive } = req.body;
    const skill = await prisma.skill.create({
      data: {
        name,
        level: Number(level) || 85,
        category: category || 'Frontend',
        order: Number(order) || 0,
        isActive: isActive !== false,
      },
    });
    return res.status(201).json(skill);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create skill.' });
  }
});

router.put('/skills/:id', async (req, res) => {
  try {
    const { name, level, category, order, isActive } = req.body;
    const skill = await prisma.skill.update({
      where: { id: Number(req.params.id) },
      data: {
        name,
        level: Number(level) || 85,
        category,
        order: Number(order) || 0,
        isActive: isActive !== false,
      },
    });
    return res.json(skill);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update skill.' });
  }
});

router.delete('/skills/:id', async (req, res) => {
  try {
    await prisma.skill.delete({ where: { id: Number(req.params.id) } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete skill.' });
  }
});

// Experiences
router.post('/experiences', async (req, res) => {
  try {
    const { role, company, location, startDate, endDate, description, technologies, order, isActive } = req.body;
    const exp = await prisma.experience.create({
      data: {
        role,
        company,
        location: location || 'Remote',
        startDate,
        endDate: endDate || 'Present',
        description,
        technologies: Array.isArray(technologies) ? technologies : typeof technologies === 'string' ? technologies.split(',').map(s => s.trim()) : [],
        order: Number(order) || 0,
        isActive: isActive !== false,
      },
    });
    return res.status(201).json(exp);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create experience.' });
  }
});

router.put('/experiences/:id', async (req, res) => {
  try {
    const { role, company, location, startDate, endDate, description, technologies, order, isActive } = req.body;
    const exp = await prisma.experience.update({
      where: { id: Number(req.params.id) },
      data: {
        role,
        company,
        location,
        startDate,
        endDate,
        description,
        technologies: Array.isArray(technologies) ? technologies : typeof technologies === 'string' ? technologies.split(',').map(s => s.trim()) : [],
        order: Number(order) || 0,
        isActive: isActive !== false,
      },
    });
    return res.json(exp);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update experience.' });
  }
});

router.delete('/experiences/:id', async (req, res) => {
  try {
    await prisma.experience.delete({ where: { id: Number(req.params.id) } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete experience.' });
  }
});

// ==================== TESTIMONIALS ====================
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } });
    return res.json(testimonials);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load testimonials.' });
  }
});

router.post('/testimonials', async (req, res) => {
  try {
    const { clientName, clientRole, company, avatarUrl, content, rating, order, isActive } = req.body;
    if (!clientName || !content) {
      return res.status(400).json({ error: 'Client name and testimonial content are required.' });
    }
    const testimonial = await prisma.testimonial.create({
      data: {
        clientName,
        clientRole: clientRole || 'Client',
        company: company || '',
        avatarUrl,
        content,
        rating: Number(rating) || 5,
        order: Number(order) || 0,
        isActive: isActive !== false,
      },
    });
    return res.status(201).json(testimonial);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create testimonial.' });
  }
});

router.put('/testimonials/:id', async (req, res) => {
  try {
    const { clientName, clientRole, company, avatarUrl, content, rating, order, isActive } = req.body;
    const testimonial = await prisma.testimonial.update({
      where: { id: Number(req.params.id) },
      data: {
        clientName,
        clientRole,
        company,
        avatarUrl,
        content,
        rating: Number(rating) || 5,
        order: Number(order) || 0,
        isActive: isActive !== false,
      },
    });
    return res.json(testimonial);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update testimonial.' });
  }
});

router.delete('/testimonials/:id', async (req, res) => {
  try {
    await prisma.testimonial.delete({ where: { id: Number(req.params.id) } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete testimonial.' });
  }
});

// ==================== MESSAGES ====================
router.get('/messages', async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load messages.' });
  }
});

router.patch('/messages/:id/read', async (req, res) => {
  try {
    const { isRead } = req.body;
    const message = await prisma.contactMessage.update({
      where: { id: Number(req.params.id) },
      data: { isRead: isRead !== false },
    });
    return res.json(message);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update message status.' });
  }
});

router.delete('/messages/:id', async (req, res) => {
  try {
    await prisma.contactMessage.delete({ where: { id: Number(req.params.id) } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete message.' });
  }
});

// ==================== SETTINGS ====================
router.get('/settings', async (req, res) => {
  try {
    const settings = await prisma.siteSetting.findFirst({ where: { id: 1 } });
    return res.json(settings || {});
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load settings.' });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const { siteTitle, metaDescription, ogImage, contactEmail, contactPhone, footerText } = req.body;
    const settings = await prisma.siteSetting.upsert({
      where: { id: 1 },
      update: {
        siteTitle,
        metaDescription,
        ogImage,
        contactEmail,
        contactPhone,
        footerText,
      },
      create: {
        id: 1,
        siteTitle,
        metaDescription,
        ogImage,
        contactEmail,
        contactPhone,
        footerText,
      },
    });
    return res.json({ success: true, settings });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update settings.' });
  }
});

export default router;
