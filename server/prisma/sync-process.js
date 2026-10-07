import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Syncing Process settings and steps...');

  // 1. ProcessSetting
  const setting = await prisma.processSetting.upsert({
    where: { id: 1 },
    update: {
      eyebrow: 'MY PROCESS',
      heading: 'How I Develop',
      description: 'A simple and transparent process to turn your ideas into a successful digital product.',
    },
    create: {
      id: 1,
      eyebrow: 'MY PROCESS',
      heading: 'How I Develop',
      description: 'A simple and transparent process to turn your ideas into a successful digital product.',
    },
  });
  console.log('✅ ProcessSetting ready:', setting.heading);

  // 2. The four process stages
  const defaultSteps = [
    {
      stepNumber: '01',
      title: 'Discover',
      icon: 'Search',
      description: 'Understand your goals, requirements and target audience.',
      order: 1,
      isActive: true,
    },
    {
      stepNumber: '02',
      title: 'Design',
      icon: 'FileText',
      description: 'Create a detailed plan, wireframes and modern UI/UX design.',
      order: 2,
      isActive: true,
    },
    {
      stepNumber: '03',
      title: 'Develop',
      icon: 'Code',
      description: 'Develop with clean, scalable and maintainable code.',
      order: 3,
      isActive: true,
    },
    {
      stepNumber: '04',
      title: 'Deploy',
      icon: 'Rocket',
      description: 'Launch and provide ongoing support and improvements.',
      order: 4,
      isActive: true,
    },
  ];

  for (const step of defaultSteps) {
    const existing = await prisma.processStep.findFirst({
      where: {
        OR: [
          { stepNumber: step.stepNumber },
          { title: { equals: step.title, mode: 'insensitive' } },
        ],
      },
    });

    if (existing) {
      await prisma.processStep.update({
        where: { id: existing.id },
        data: {
          stepNumber: step.stepNumber,
          title: step.title,
          icon: step.icon,
          description: step.description,
          order: step.order,
          isActive: true,
        },
      });
      console.log(`Updated step ${step.stepNumber} - ${step.title}`);
    } else {
      await prisma.processStep.create({
        data: step,
      });
      console.log(`Created step ${step.stepNumber} - ${step.title}`);
    }
  }

  console.log('✨ Process sync complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
