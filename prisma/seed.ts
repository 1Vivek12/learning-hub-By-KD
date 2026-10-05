import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  
  if (process.env.NODE_ENV === 'production') {
    console.log('Production environment detected. Seeding is disabled.');
    return;
  }

  // 1. Categories
  const categoryExcel = await prisma.category.upsert({
    where: { name: 'Microsoft Excel' },
    update: {},
    create: { name: 'Microsoft Excel', description: 'Spreadsheet Engineering and Analytics' },
  });

  const categorySql = await prisma.category.upsert({
    where: { name: 'SQL' },
    update: {},
    create: { name: 'SQL', description: 'Database Engineering' },
  });

  // 2. Instructors
  const inst1 = await prisma.instructor.upsert({
    where: { id: 'inst-1' },
    update: {},
    create: {
      id: 'inst-1',
      name: 'Vikramaditya Sharma',
      titleEn: 'Principal Data Architect & Ex-Microsoft',
      bioEn: 'Over 14 years architecting petabyte-scale analytics.',
      company: 'Ex-Microsoft',
      rating: 4.96,
      studentsCount: 38400,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
    },
  });

  const inst2 = await prisma.instructor.upsert({
    where: { id: 'inst-3' },
    update: {},
    create: {
      id: 'inst-3',
      name: 'Rohan Deshmukh',
      titleEn: 'Senior VP of Financial Analytics',
      bioEn: 'Former Goldman Sachs Quantitative Analyst.',
      company: 'Ex-Goldman Sachs',
      rating: 4.92,
      studentsCount: 29500,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
    },
  });

  // 3. Development Users
  const adminPassword = await bcrypt.hash(process.env.TEST_ADMIN_PASS || 'DevAdmin@123!', 10);
  const studentPassword = await bcrypt.hash(process.env.TEST_STUDENT_PASS || 'DevStudent@123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@learninghub.dev' },
    update: {},
    create: {
      email: 'admin@learninghub.dev',
      name: 'Dev Admin',
      passwordHash: adminPassword,
      role: 'SUPER_ADMIN',
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@learninghub.dev' },
    update: {},
    create: {
      email: 'student@learninghub.dev',
      name: 'Dev Student',
      passwordHash: studentPassword,
      role: 'STUDENT',
    },
  });

  // 4. Courses
  const excelCourse = await prisma.course.upsert({
    where: { slug: 'microsoft-excel-mastery-vba-automation' },
    update: {},
    create: {
      slug: 'microsoft-excel-mastery-vba-automation',
      titleEn: 'Master Microsoft Excel: Advanced Formulas, Power Query & VBA',
      descShortEn: 'Go from Excel beginner to enterprise analyst.',
      descLongEn: 'Designed by former Wall Street quants, this masterclass unlocks Excel capabilities.',
      level: 'All Levels',
      language: 'English + Hinglish',
      durationHours: 28,
      price: 3499,
      originalPrice: 8999,
      instructorId: inst2.id,
      categoryId: categoryExcel.id,
      status: 'PUBLISHED',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    },
  });

  const sqlCourse = await prisma.course.upsert({
    where: { slug: 'production-sql-for-data-analytics-warehousing' },
    update: {},
    create: {
      slug: 'production-sql-for-data-analytics-warehousing',
      titleEn: 'Production SQL Mastery: CTEs, Window Functions & Warehousing',
      descShortEn: 'Master high-performance SQL querying with PostgreSQL & Snowflake.',
      descLongEn: 'Real analytical engineering requires more than SELECT * FROM table.',
      level: 'Intermediate',
      language: 'English + Hinglish',
      durationHours: 32,
      price: 3999,
      instructorId: inst1.id,
      categoryId: categorySql.id,
      status: 'PUBLISHED',
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    },
  });

  // 5. Modules & Lessons
  const excelMod1 = await prisma.courseModule.create({
    data: {
      titleEn: 'Foundation: Modern Dynamic Arrays & Modern Formulas',
      order: 1,
      courseId: excelCourse.id,
    }
  });

  await prisma.lesson.create({
    data: {
      titleEn: 'Welcome & Enterprise Architecture Overview',
      slug: 'excel-welcome',
      descriptionEn: 'How modern Fortune 500 teams leverage Excel as an analytical powerhouse.',
      durationMinutes: 14,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      isFreePreview: true,
      order: 1,
      moduleId: excelMod1.id,
    }
  });

  await prisma.lesson.create({
    data: {
      titleEn: 'XLOOKUP, FILTER, UNIQUE & SORT',
      slug: 'excel-xlookup',
      descriptionEn: 'Replacing legacy VLOOKUP.',
      durationMinutes: 28,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      isFreePreview: true,
      order: 2,
      moduleId: excelMod1.id,
    }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
