import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Создаём первого администратора
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@maxnews.ru' },
    update: {},
    create: {
      email: 'admin@maxnews.ru',
      name: 'Admin',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log(`✅ Created admin user: ${admin.email}`);

  // Создаём категории
  const categories = [
    { name: 'Технологии', slug: 'tech' },
    { name: 'Бизнес', slug: 'business' },
    { name: 'Политика', slug: 'politics' },
    { name: 'Наука', slug: 'science' },
    { name: 'Спорт', slug: 'sport' },
    { name: 'Культура', slug: 'culture' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log(`✅ Created ${categories.length} categories`);

  // Создаём шаблоны
  const templates = [
    {
      name: 'Короткая новость',
      structure: '{emoji} {заголовок}\n\n{ключевые факты списком}\n\n{контекст 1-2 предложения}\n\n{CTA}\n\n{хештеги}',
      example: '🍎 Apple представила MacBook Pro на M5\n\n• +40% производительности\n• До 128 ГБ памяти\n• От $2,499\n\nСамый мощный ноутбук Apple.\n\n#Apple #MacBook',
    },
    {
      name: 'Аналитика / Важная новость',
      structure: '{emoji} {заголовок}\n\n{суть новости}\n\n{детали и контекст}\n\n{почему это важно}\n\n{CTA}\n\n{хештеги}',
      example: '🤖 GPT-5 — революция в AI!\n\nOpenAI выпустила новую модель...\n\nЭто важно, потому что...\n\n#AI #OpenAI',
    },
    {
      name: 'Срочная / Эмоциональная',
      structure: '{emoji} {заголовок В КАПСЕ}!\n\n{главное событие}\n\n{детали}\n\n{эмоциональный CTA}\n\n{хештеги}',
      example: '🏒 МЫ В ФИНАЛЕ!\n\nРоссия 4:2 Швеция!\n\n⚡ Кучеров — 2 шайбы\n\nСтавьте ❤️!\n\n#хоккей',
    },
  ];

  for (const template of templates) {
    await prisma.publicationTemplate.create({
       template,
    });
  }

  console.log(`✅ Created ${templates.length} templates`);

  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📝 Login credentials:');
  console.log('   Email: admin@maxnews.ru');
  console.log('   Password: admin123');
  console.log('');
  console.log('⚠️  IMPORTANT: Change the admin password after first login!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
