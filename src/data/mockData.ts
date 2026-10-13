import { Source, Publication, PreparedPublication, PublicationTemplate, PublicationSchedule, Category, DashboardStats } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Технологии', slug: 'tech' },
  { id: '2', name: 'Бизнес', slug: 'business' },
  { id: '3', name: 'Политика', slug: 'politics' },
  { id: '4', name: 'Наука', slug: 'science' },
  { id: '5', name: 'Спорт', slug: 'sport' },
  { id: '6', name: 'Культура', slug: 'culture' },
];

export const sources: Source[] = [
  {
    id: '1', externalId: 'max_ch_001', name: 'ТехноНовости', url: 'https://max.app/technonews',
    avatarUrl: 'https://api.dicebear.com/72/techno.png', description: 'Последние новости из мира технологий',
    categoryId: '1', language: 'ru', status: 'ACTIVE', priority: 'HIGH',
    followersCount: 125000, postsCount: 3420, engagementRate: 4.2, growthRate: 2.1,
    pollingIntervalMin: 15, lastPostAt: '2026-01-15T10:30:00Z', lastCheckedAt: '2026-01-15T10:45:00Z',
    addedBy: 'admin', notes: 'Основной источник технологических новостей',
    createdAt: '2025-06-01T00:00:00Z', updatedAt: '2026-01-15T10:45:00Z'
  },
  {
    id: '2', externalId: 'max_ch_002', name: 'Бизнес Инсайдер', url: 'https://max.app/bizinsider',
    avatarUrl: 'https://api.dicebear.com/72/biz.png', description: 'Аналитика бизнес-процессов',
    categoryId: '2', language: 'ru', status: 'ACTIVE', priority: 'HIGH',
    followersCount: 89000, postsCount: 2100, engagementRate: 3.8, growthRate: 1.5,
    pollingIntervalMin: 30, lastPostAt: '2026-01-15T09:15:00Z', lastCheckedAt: '2026-01-15T10:30:00Z',
    addedBy: 'admin', notes: '',
    createdAt: '2025-07-15T00:00:00Z', updatedAt: '2026-01-15T10:30:00Z'
  },
  {
    id: '3', externalId: 'max_ch_003', name: 'Наука и Факты', url: 'https://max.app/scifact',
    avatarUrl: 'https://api.dicebear.com/72/science.png', description: 'Научные открытия и исследования',
    categoryId: '4', language: 'ru', status: 'ACTIVE', priority: 'MEDIUM',
    followersCount: 67000, postsCount: 1800, engagementRate: 5.1, growthRate: 3.2,
    pollingIntervalMin: 60, lastPostAt: '2026-01-15T08:00:00Z', lastCheckedAt: '2026-01-15T10:00:00Z',
    addedBy: 'admin', notes: 'Высокий ER, хороший источник',
    createdAt: '2025-08-01T00:00:00Z', updatedAt: '2026-01-15T10:00:00Z'
  },
  {
    id: '4', externalId: 'max_ch_004', name: 'Мир Политики', url: 'https://max.app/polworld',
    avatarUrl: 'https://api.dicebear.com/72/policy.png', description: 'Политические новости и аналитика',
    categoryId: '3', language: 'ru', status: 'PAUSED', priority: 'MEDIUM',
    followersCount: 210000, postsCount: 5600, engagementRate: 2.9, growthRate: 0.8,
    pollingIntervalMin: 10, lastPostAt: '2026-01-14T22:00:00Z', lastCheckedAt: '2026-01-15T06:00:00Z',
    addedBy: 'admin', notes: 'Приостановлен на время выборов',
    createdAt: '2025-05-01T00:00:00Z', updatedAt: '2026-01-14T22:00:00Z'
  },
  {
    id: '5', externalId: 'max_ch_005', name: 'Спорт Live', url: 'https://max.app/sportlive',
    avatarUrl: 'https://api.dicebear.com/72/sport.png', description: 'Спортивные события в реальном времени',
    categoryId: '5', language: 'ru', status: 'ACTIVE', priority: 'LOW',
    followersCount: 45000, postsCount: 8900, engagementRate: 6.3, growthRate: 4.1,
    pollingIntervalMin: 5, lastPostAt: '2026-01-15T10:50:00Z', lastCheckedAt: '2026-01-15T10:55:00Z',
    addedBy: 'editor', notes: 'Быстрый источник, высокий ER',
    createdAt: '2025-09-01T00:00:00Z', updatedAt: '2026-01-15T10:55:00Z'
  },
  {
    id: '6', externalId: 'max_ch_006', name: 'AI & ML Daily', url: 'https://max.app/aimldaily',
    avatarUrl: 'https://api.dicebear.com/72/ai.png', description: 'Ежедневные новости искусственного интеллекта',
    categoryId: '1', language: 'ru', status: 'ACTIVE', priority: 'HIGH',
    followersCount: 34000, postsCount: 1200, engagementRate: 7.8, growthRate: 8.5,
    pollingIntervalMin: 20, lastPostAt: '2026-01-15T10:20:00Z', lastCheckedAt: '2026-01-15T10:40:00Z',
    addedBy: 'admin', notes: 'Растущий канал, отличный контент',
    createdAt: '2025-10-15T00:00:00Z', updatedAt: '2026-01-15T10:40:00Z'
  },
];

export const publications: Publication[] = [
  {
    id: '1', sourceId: '1', sourceName: 'ТехноНовости', externalPostId: 'post_001',
    title: 'Apple представила новый MacBook Pro с чипом M5 Ultra',
    bodyText: 'Компания Apple официально представила новый MacBook Pro на базе чипа M5 Ultra. Новый процессор обеспечивает на 40% большую производительность по сравнению с предыдущим поколением. Ноутбук будет доступен в конфигурациях с 32, 64 и 128 ГБ унифицированной памяти. Стартовая цена — $2499. Поставки начнутся в конце февраля.',
    summary: 'Apple представила MacBook Pro на M5 Ultra с приростом производительности 40%',
    publishedAt: '2026-01-15T09:00:00Z', collectedAt: '2026-01-15T09:15:00Z',
    contentHash: 'abc123', viewCount: 45000, likeCount: 3200, commentCount: 890, shareCount: 1200,
    category: 'tech', tags: ['apple', 'macbook', 'm5', 'технологии'], importanceScore: 9.2, status: 'ACTIVE',
    media: [{ type: 'image', url: 'https://example.com/macbook.jpg' }]
  },
  {
    id: '2', sourceId: '6', sourceName: 'AI & ML Daily', externalPostId: 'post_002',
    title: 'OpenAI выпустила GPT-5 с мультимодальным reasoning',
    bodyText: 'OpenAI анонсировала GPT-5 — новую модель с продвинутыми возможностями мультимодального рассуждения. Модель способна одновременно обрабатывать текст, изображения, видео и аудио, выстраивая сложные логические цепочки. GPT-5 показывает результаты на уровне экспертов в задачах программирования, математики и научного анализа. Доступна через API с сегодняшнего дня.',
    summary: 'OpenAI выпустила GPT-5 с мультимодальным reasoning на уровне экспертов',
    publishedAt: '2026-01-15T08:30:00Z', collectedAt: '2026-01-15T08:50:00Z',
    contentHash: 'def456', viewCount: 78000, likeCount: 5600, commentCount: 2100, shareCount: 3400,
    category: 'tech', tags: ['openai', 'gpt5', 'ai', 'ml'], importanceScore: 9.8, status: 'ACTIVE',
    media: [{ type: 'image', url: 'https://example.com/gpt5.jpg' }]
  },
  {
    id: '3', sourceId: '2', sourceName: 'Бизнес Инсайдер', externalPostId: 'post_003',
    title: 'ЦБ снизил ключевую ставку до 16%',
    bodyText: 'Центральный банк России принял решение снизить ключевую ставку на 100 базисных пунктов — до 16% годовых. Решение принято на фоне замедления инфляции и стабилизации экономической ситуации. Регулятор отметил, что дальнейшие шаги будут зависеть от динамики ценовых показателей. Аналитики ожидали снижение на 50-100 п.п.',
    summary: 'ЦБ РФ снизил ключевую ставку до 16% на фоне замедления инфляции',
    publishedAt: '2026-01-15T07:00:00Z', collectedAt: '2026-01-15T07:15:00Z',
    contentHash: 'ghi789', viewCount: 120000, likeCount: 4500, commentCount: 3200, shareCount: 5600,
    category: 'business', tags: ['цб', 'ставка', 'экономика', 'финансы'], importanceScore: 8.5, status: 'ACTIVE',
  },
  {
    id: '4', sourceId: '3', sourceName: 'Наука и Факты', externalPostId: 'post_004',
    title: 'Учёные обнаружили воду в атмосфере экзопланеты в обитаемой зоне',
    bodyText: 'Международная группа астрономов с помощью телескопа James Webb обнаружила признаки водяного пара в атмосфере экзопланеты Kepler-442b, находящейся в обитаемой зоне своей звезды. Это первый случай достоверного обнаружения воды на планете земного типа за пределами Солнечной системы. Планета расположена в 1200 световых годах от Земли.',
    summary: 'James Webb обнаружил водяной пар на экзопланете в обитаемой зоне',
    publishedAt: '2026-01-15T06:00:00Z', collectedAt: '2026-01-15T06:30:00Z',
    contentHash: 'jkl012', viewCount: 95000, likeCount: 8900, commentCount: 4500, shareCount: 7800,
    category: 'science', tags: ['космос', 'экзопланета', 'james webb', 'вода'], importanceScore: 9.5, status: 'ACTIVE',
    media: [{ type: 'image', url: 'https://example.com/exoplanet.jpg' }]
  },
  {
    id: '5', sourceId: '5', sourceName: 'Спорт Live', externalPostId: 'post_005',
    title: 'Россия вышла в финал чемпионата мира по хоккею',
    bodyText: 'Сборная России по хоккею обыграла команду Швеции со счётом 4:2 в полуфинале чемпионата мира. Решающие шайбы забросили Никита Кучеров (2) и Александр Овечкин. В финале россияне встретятся с командой Канады. Матч состоится в воскресенье.',
    summary: 'Сборная России по хоккею вышла в финал ЧМ, обыграв Швецию 4:2',
    publishedAt: '2026-01-15T10:00:00Z', collectedAt: '2026-01-15T10:05:00Z',
    contentHash: 'mno345', viewCount: 230000, likeCount: 15000, commentCount: 8900, shareCount: 12000,
    category: 'sport', tags: ['хоккей', 'сборная', 'чм', 'финал'], importanceScore: 8.0, status: 'ACTIVE',
  },
  {
    id: '6', sourceId: '1', sourceName: 'ТехноНовости', externalPostId: 'post_006',
    title: 'Telegram запустил блокчейн-платформу TON Space',
    bodyText: 'Мессенджер Telegram официально запустил TON Space — интегрированную блокчейн-платформу для управления цифровыми активами. Сервис позволяет хранить, обменивать и отправлять криптовалюту прямо в чате. Поддерживается более 50 токенов. Платформа доступна пользователям из 150 стран.',
    summary: 'Telegram запустил встроенную блокчейн-платформу TON Space',
    publishedAt: '2026-01-14T18:00:00Z', collectedAt: '2026-01-14T18:15:00Z',
    contentHash: 'pqr678', viewCount: 67000, likeCount: 4200, commentCount: 2800, shareCount: 3100,
    category: 'tech', tags: ['telegram', 'ton', 'blockchain', 'crypto'], importanceScore: 7.5, status: 'ACTIVE',
  },
];

export const preparedPublications: PreparedPublication[] = [
  {
    id: '1', originalPublicationId: '1', sourceId: '1', sourceName: 'ТехноНовости',
    adaptedText: '🍎 Apple удивила всех: новый MacBook Pro на M5 Ultra уже здесь!\n\nЧто нового:\n• +40% производительности vs M4 Ultra\n• До 128 ГБ унифицированной памяти\n• Старт продаж — конец февраля\n• Цена от $2,499\n\nЭто самый мощный ноутбук Apple за всю историю. Для профессионалов, которым нужна максимальная мощность без компромиссов.\n\n#Apple #MacBook #M5Ultra #технологии',
    title: 'Apple представила MacBook Pro на M5 Ultra',
    media: [{ type: 'image', url: 'https://example.com/macbook.jpg' }],
    templateId: '1', customHashtags: ['Apple', 'MacBook', 'M5Ultra', 'технологии'],
    ctaText: 'А вы ждали новый MacBook? 👇',
    status: 'APPROVED', moderatorId: 'admin', moderationComment: 'Отличный пост, публикуем',
    createdAt: '2026-01-15T09:30:00Z', updatedAt: '2026-01-15T10:00:00Z'
  },
  {
    id: '2', originalPublicationId: '2', sourceId: '6', sourceName: 'AI & ML Daily',
    adaptedText: '🤖 GPT-5 — революция в AI уже здесь!\n\nOpenAI выпустила модель нового поколения:\n✅ Мультимодальный reasoning (текст + фото + видео + аудио)\n✅ Уровень эксперта в программировании и математике\n✅ Доступна через API прямо сейчас\n\nЭто не просто обновление — это качественный скачок. GPT-5 реально «думает» над сложными задачами, а не просто генерирует текст.\n\n#GPT5 #OpenAI #AI #нейросети',
    title: 'GPT-5 от OpenAI: мультимодальный reasoning',
    media: [{ type: 'image', url: 'https://example.com/gpt5.jpg' }],
    templateId: '2', customHashtags: ['GPT5', 'OpenAI', 'AI', 'нейросети'],
    ctaText: 'Уже тестируете GPT-5? Делитесь впечатлениями! 💬',
    status: 'DRAFT', createdAt: '2026-01-15T09:00:00Z', updatedAt: '2026-01-15T09:00:00Z'
  },
  {
    id: '3', originalPublicationId: '4', sourceId: '3', sourceName: 'Наука и Факты',
    adaptedText: '🔭 СЕНСАЦИЯ: Вода найдена на другой планете!\n\nТелескоп James Webb обнаружил водяной пар в атмосфере экзопланеты Kepler-442b — она находится в ОБИТАЕМОЙ ЗОНЕ своей звезды!\n\n📍 1200 световых лет от Земли\n🌍 Планета земного типа\n💧 Первое достоверное обнаружение воды за пределами Солнечной\n\nЭто может стать величайшим открытием в истории астрономии. Вопрос «Одни ли мы во Вселенной?» стал ближе к ответу.\n\n#космос #JamesWebb #экзопланета #наука',
    title: 'Вода обнаружена на экзопланете в обитаемой зоне',
    media: [{ type: 'image', url: 'https://example.com/exoplanet.jpg' }],
    templateId: '2', customHashtags: ['космос', 'JamesWebb', 'экзопланета', 'наука'],
    ctaText: 'Как думаете, найдём жизнь? 🛸',
    status: 'SCHEDULED', moderatorId: 'admin', moderationComment: 'Топ контент!',
    createdAt: '2026-01-15T07:00:00Z', updatedAt: '2026-01-15T08:00:00Z'
  },
  {
    id: '4', originalPublicationId: '5', sourceId: '5', sourceName: 'Спорт Live',
    adaptedText: '🏒 МЫ В ФИНАЛЕ! Россия 4:2 Швеция!\n\nПолуфинал ЧМ по хоккею:\n⚡ Кучеров — 2 шайбы\n⚡ Овечкин — 1 шайба\n🇷🇺 СБОРНАЯ В ФИНАЛЕ!\n\nВ воскресенье играем с Канадой за ЗОЛОТО! 🥇\n\nПоддержим наших! Ставьте ❤️ если болеете за Россию!\n\n#хоккей #сборная #ЧМ #Россия',
    title: 'Россия в финале ЧМ по хоккею!',
    media: [],
    templateId: '3', customHashtags: ['хоккей', 'сборная', 'ЧМ', 'Россия'],
    ctaText: 'Ставьте ❤️ если болеете за Россию!',
    status: 'PUBLISHED', moderatorId: 'editor', moderationComment: 'Быстро опубликовали',
    createdAt: '2026-01-15T10:10:00Z', updatedAt: '2026-01-15T10:15:00Z'
  },
  {
    id: '5', originalPublicationId: '3', sourceId: '2', sourceName: 'Бизнес Инсайдер',
    adaptedText: '💰 ЦБ снизил ставку до 16% — что это значит?\n\nКлючевые факты:\n📉 Снижение на 100 п.п. (ожидали 50-100)\n📊 Причина: замедление инфляции\n🏦 Влияние: кредиты станут дешевле\n📈 Рынок реагирует позитивно\n\nЧто это значит для вас:\n• Ипотека может стать доступнее\n• Вклады — менее доходные\n• Бизнесу легче брать кредиты\n\n#ЦБ #ставка #экономика #финансы',
    title: 'ЦБ снизил ключевую ставку до 16%',
    media: [],
    templateId: '1', customHashtags: ['ЦБ', 'ставка', 'экономика', 'финансы'],
    ctaText: 'Как планируете распорядиться сэкономленным? 💸',
    status: 'REJECTED', moderatorId: 'admin', moderationComment: 'Нужно добавить больше конкретики по влиянию на граждан',
    createdAt: '2026-01-15T07:30:00Z', updatedAt: '2026-01-15T08:00:00Z'
  },
];

export const templates: PublicationTemplate[] = [
  {
    id: '1', name: 'Короткая новость',
    structure: '{emoji} {заголовок}\n\n{ключевые факты списком}\n\n{контекст 1-2 предложения}\n\n{CTA}\n\n{хештеги}',
    example: '🍎 Apple представила MacBook Pro на M5\n\n• +40% производительности\n• До 128 ГБ памяти\n• От $2,499\n\nСамый мощный ноутбук Apple.\n\n#Apple #MacBook',
    isActive: true, createdAt: '2025-06-01T00:00:00Z'
  },
  {
    id: '2', name: 'Аналитика / Важная новость',
    structure: '{emoji} {заголовок}\n\n{суть новости}\n\n{детали и контекст}\n\n{почему это важно}\n\n{CTA}\n\n{хештеги}',
    example: '🤖 GPT-5 — революция в AI!\n\nOpenAI выпустила новую модель...\n\nЭто важно, потому что...\n\n#AI #OpenAI',
    isActive: true, createdAt: '2025-06-01T00:00:00Z'
  },
  {
    id: '3', name: 'Срочная / Эмоциональная',
    structure: '{emoji} {заголовок В КАПСЕ}!\n\n{главное событие}\n\n{детали}\n\n{эмоциональный CTA}\n\n{хештеги}',
    example: '🏒 МЫ В ФИНАЛЕ!\n\nРоссия 4:2 Швеция!\n\n⚡ Кучеров — 2 шайбы\n\nСтавьте ❤️!\n\n#хоккей',
    isActive: true, createdAt: '2025-07-01T00:00:00Z'
  },
  {
    id: '4', name: 'Дайджест',
    structure: '📰 Дайджест за {дата}\n\n{список из 5-7 новостей с кратким описанием}\n\n💬 Что запомнилось больше всего?\n\n{хештеги}',
    example: '📰 Дайджест за 15 января\n\n1. Apple представила M5...\n2. GPT-5 вышла...\n3. ЦБ снизил ставку...\n\n💬 Что запомнилось?\n\n#дайджест',
    isActive: true, createdAt: '2025-08-01T00:00:00Z'
  },
];

export const schedules: PublicationSchedule[] = [
  {
    id: '1', preparedPublicationId: '1', scheduledAt: '2026-01-15T13:00:00Z',
    status: 'SCHEDULED', retryCount: 0
  },
  {
    id: '2', preparedPublicationId: '3', scheduledAt: '2026-01-15T18:00:00Z',
    status: 'SCHEDULED', retryCount: 0
  },
  {
    id: '3', preparedPublicationId: '4', scheduledAt: '2026-01-15T10:15:00Z',
    status: 'PUBLISHED', retryCount: 0, publishedAt: '2026-01-15T10:15:00Z'
  },
];

export const dashboardStats: DashboardStats = {
  totalSources: 6,
  activeSources: 4,
  publicationsToday: 12,
  publicationsWeek: 67,
  pendingModeration: 3,
  scheduledToday: 2,
  publishedToday: 1,
  totalReach: 456000,
};

export const analyticsData = [
  { date: '09.01', views: 120000, likes: 8500, comments: 3200, shares: 5600 },
  { date: '10.01', views: 145000, likes: 9800, comments: 4100, shares: 6200 },
  { date: '11.01', views: 98000, likes: 6200, comments: 2800, shares: 3900 },
  { date: '12.01', views: 167000, likes: 11200, comments: 5600, shares: 8100 },
  { date: '13.01', views: 134000, likes: 9100, comments: 3900, shares: 5400 },
  { date: '14.01', views: 189000, likes: 13400, comments: 6200, shares: 9800 },
  { date: '15.01', views: 210000, likes: 15000, comments: 7800, shares: 11200 },
];

export const sourceMetricsData = [
  { date: '09.01', followers: 120000, engagement: 4.0, growth: 1.8 },
  { date: '10.01', followers: 121500, engagement: 4.1, growth: 1.9 },
  { date: '11.01', followers: 122000, engagement: 3.9, growth: 1.7 },
  { date: '12.01', followers: 123200, engagement: 4.3, growth: 2.0 },
  { date: '13.01', followers: 124100, engagement: 4.2, growth: 2.1 },
  { date: '14.01', followers: 124800, engagement: 4.4, growth: 2.2 },
  { date: '15.01', followers: 125000, engagement: 4.2, growth: 2.1 },
];
