export default {
  app: { title: 'Анализатор безопасности Android', subtitle: 'Профессиональный инструмент анализа APK', language: 'Язык' },
  nav: { home: 'Главная', analyze: 'Анализ', history: 'История', test: 'Тест', about: 'О программе', comparison: 'Сравнение' },
  home: {
    hero: { title: 'Анализ безопасности Android-приложений', subtitle: 'Загрузите APK для обнаружения уязвимостей, опасных разрешений и рисков конфиденциальности', uploadBtn: 'Начать анализ', demoBtn: 'Демо' },
    features: {
      title: 'Возможности',
      permission: { title: 'Анализ разрешений', desc: 'Детальный анализ всех запрашиваемых разрешений с оценкой рисков' },
      manifest: { title: 'Инспекция манифеста', desc: 'Глубокая проверка AndroidManifest.xml на флаги безопасности' },
      security: { title: 'Оценка безопасности', desc: 'Комплексная оценка с рекомендациями' },
      report: { title: 'Детальные отчёты', desc: 'Генерация подробных отчётов со всеми находками' }
    },
    stats: { permissions: 'Разрешений проанализировано', categories: 'Категорий риска', checks: 'Проверок безопасности' }
  },
  analyze: {
    title: 'Анализ безопасности APK',
    upload: { title: 'Загрузка APK', dropzone: 'Перетащите APK сюда или нажмите для выбора', hint: 'Формат: .apk (макс. 500МБ)', analyzing: 'Анализ APK...', progress: 'Обработка' },
    result: { title: 'Результаты анализа', basicInfo: 'Основная информация', permissions: 'Разрешения', security: 'Безопасность', signature: 'Подпись', manifest: 'Манифест' },
    signature: { title: 'Подпись APK', status: 'Статус подписи', signed: 'Подписан', unsigned: 'Не подписан', schemes: 'Схемы подписи', certificates: 'Сертификаты', certName: 'Имя сертификата', algorithm: 'Алгоритм', fingerprint: 'Отпечаток SHA-256', issuer: 'Издатель', warnings: 'Предупреждения' },
    basicInfo: { fileName: 'Имя файла', packageName: 'Имя пакета', version: 'Версия', size: 'Размер', minSdk: 'Мин. SDK', targetSdk: 'Целевой SDK', dexFiles: 'DEX-файлы', nativeLibs: 'Нативные библиотеки' },
    permissions: { title: 'Анализ разрешений', total: 'Всего', critical: 'Критические', high: 'Высокий риск', medium: 'Средний риск', low: 'Низкий риск', riskScore: 'Оценка риска', category: 'Категория', permission: 'Разрешение', risk: 'Уровень риска', description: 'Описание' },
    security: { title: 'Оценка безопасности', overallRisk: 'Общий уровень риска', issues: 'Проблемы', warnings: 'Предупреждения', recommendations: 'Рекомендации', noIssues: 'Критических проблем нет', noWarnings: 'Предупреждений нет', severity: { critical: 'Критический', high: 'Высокий', medium: 'Средний', low: 'Низкий' } },
    manifest: { activities: 'Активности', services: 'Сервисы', receivers: 'Приёмники', providers: 'Провайдеры', flags: 'Флаги безопасности', debuggable: 'Отладка', allowBackup: 'Резервное копирование', exportedComponents: 'Экспортированные компоненты' },
    actions: { newAnalysis: 'Новый анализ', downloadReport: 'Скачать отчёт', share: 'Поделиться' }
  },
  about: {
    title: 'Об анализаторе Android',
    description: 'Профессиональный инструмент для анализа безопасности Android-приложений. Помогает разработчикам и исследователям понять потенциальные риски APK-файлов.',
    author: { title: 'Разработчик', name: 'Байрам Гочмырадов', role: 'Инженер-программист', university: 'Туркменский государственный институт экономики и управления', department: 'Информационные системы' },
    howItWorks: {
      title: 'Как это работает',
      step1: { title: 'Загрузка APK', desc: 'Загрузите APK-файл для анализа' },
      step2: { title: 'Автоматический анализ', desc: 'Система извлекает и анализирует AndroidManifest.xml' },
      step3: { title: 'Проверка разрешений', desc: 'Все разрешения классифицируются по уровню риска' },
      step4: { title: 'Отчёт', desc: 'Детальный отчёт с находками и рекомендациями' }
    },
    whyUse: { title: 'Почему этот инструмент?', benefits: ['Бесплатное решение', 'Данные не хранятся на серверах', 'Комплексный анализ разрешений', 'Понятные уровни риска', 'Рекомендации по безопасности', 'Мультиязычность'] },
    technology: { title: 'Технологии', frontend: 'Фронтенд', backend: 'Бэкенд', features: 'Ключевые технологии' }
  },
  comparison: {
    title: 'Сравнение инструментов', subtitle: 'Сравнение с другими инструментами анализа',
    features: { feature: 'Функция', ourTool: 'Наш инструмент', virusTotal: 'VirusTotal', mobSF: 'MobSF', exodus: 'Exodus Privacy' },
    criteria: { permissionAnalysis: 'Анализ разрешений', riskAssessment: 'Оценка рисков', manifestInspection: 'Инспекция манифеста', multilingual: 'Мультиязычность', freeToUse: 'Бесплатно', noRegistration: 'Без регистрации', privacyFocused: 'Конфиденциальность', localAnalysis: 'Локальный анализ', detailedReports: 'Детальные отчёты', easeOfUse: 'Удобство' },
    legend: { yes: 'Да', no: 'Нет', partial: 'Частично', excellent: 'Отлично', good: 'Хорошо', average: 'Средне' },
    advantages: { title: 'Наши преимущества', items: [{ title: 'Конфиденциальность', desc: 'Анализ выполняется локально. APK не загружается на серверы.' }, { title: 'Простота', desc: 'Перетащите файл — технические знания не нужны.' }, { title: 'Полнота', desc: 'Анализ разрешений, манифеста и рекомендации.' }, { title: 'Мультиязычность', desc: 'Доступен на туркменском, русском и английском.' }] }
  },
  test: {
    title: 'Тест анализа APK', subtitle: 'Узнайте как работает анализ APK', howItWorks: 'Как работает', technicalDetails: 'Технические детали', sampleApks: 'Примеры APK', sampleApksDesc: 'Нажмите на пример для демонстрации', analyze: 'Анализировать',
    flow: { step1: { title: '1. APK = ZIP-архив', desc: 'APK — стандартный ZIP с расширением .apk' }, step2: { title: '2. Структура APK', desc: 'Внутри — ресурсы, код и манифест' }, step3: { title: '3. Парсинг бинарного XML', desc: 'AndroidManifest.xml в бинарном формате. Извлекаем разрешения.' }, step4: { title: '4. Анализ рисков', desc: 'Сравниваем разрешения с базой данных' } },
    manifest: { title: 'AndroidManifest.xml', desc: 'Каждое приложение содержит манифест с:', items: ['Имя пакета', 'Разрешения', 'Компоненты (Activities, Services, Receivers)', 'Минимальная версия Android'] },
    binaryXml: { title: 'Бинарный XML', desc: 'В APK манифест хранится в бинарном формате. Наш анализатор:', items: ['Читает бинарные данные', 'Извлекает строки', 'Находит шаблоны разрешений', 'Парсит имя пакета и версии'] },
    permissionDb: { title: 'База разрешений', desc: 'База содержит 70+ Android-разрешений с оценкой риска:', critical: 'SMS, звонки, камера', high: 'контакты, хранилище', medium: 'интернет, bluetooth', low: 'вибрация, уведомления' }
  },
  footer: { description: 'Профессиональный инструмент анализа безопасности APK', rights: 'Все права защищены', disclaimer: 'Инструмент предназначен для образовательных и исследовательских целей.' },
  history: { title: 'История анализов', subtitle: 'Предыдущие анализы APK', stats: { totalAnalyses: 'Всего анализов', avgRisk: 'Средний риск', issuesFound: 'Проблем найдено', warnings: 'Предупреждений' }, riskDistribution: 'Распределение рисков', riskBreakdown: 'Разбивка рисков', recentAnalyses: 'Последние анализы', clearAll: 'Очистить', noHistory: 'Нет истории', noHistoryDesc: 'Начните анализировать APK файлы', startAnalysis: 'Начать анализ' },
  export: { title: 'Экспорт отчёта', json: 'Скачать JSON', html: 'Скачать HTML', print: 'Печать' },
  common: { loading: 'Загрузка...', error: 'Ошибка', success: 'Успешно', cancel: 'Отмена', confirm: 'Подтвердить', back: 'Назад', next: 'Далее', close: 'Закрыть', yes: 'Да', no: 'Нет', search: 'Поиск', filter: 'Фильтр', all: 'Все' }
}
