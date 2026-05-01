export default {
  nav: { home: 'Главная', analyze: 'Анализ', history: 'История', howItWorks: 'Как работает', comparison: 'Сравнение', about: 'О программе' },
  footer: { diploma: 'Дипломный проект', author: 'Автор' },
  home: {
    title: 'OSINT Анализатор', subtitle: 'Инструменты разведки из открытых источников для этичного исследования кибербезопасности', description: 'Мощный инструмент разведки для анализа целей с использованием публично доступной информации.',
    startAnalysis: 'Начать анализ', viewHistory: 'История',
    features: { title: 'Возможности', dns: { title: 'DNS-разведка', desc: 'Разрешение доменов, MX, NS и обратный DNS' }, portScan: { title: 'Сканирование портов', desc: 'Обнаружение открытых портов и сервисов' }, geoip: { title: 'Геолокация IP', desc: 'Определение местоположения, провайдера и организации' }, whois: { title: 'WHOIS-запрос', desc: 'Получение данных регистрации домена' }, risk: { title: 'Оценка рисков', desc: 'Автоматическая оценка уровня безопасности' }, report: { title: 'Отчёты', desc: 'Экспорт результатов в JSON, HTML и печать' } },
    stats: { targetsAnalyzed: 'Целей проанализировано', portsScanned: 'Портов просканировано', threatsIdentified: 'Угроз выявлено', reportGenerated: 'Отчётов создано' }
  },
  analyze: {
    title: 'OSINT Анализ', subtitle: 'Введите IP-адрес или домен для комплексного анализа',
    targetPlaceholder: 'Введите IP или домен (например google.com)', analyzeBtn: 'Анализировать', analyzing: 'Анализ...',
    results: { title: 'Результаты анализа', summary: 'Сводка', dns: 'DNS', ping: 'Ping', portScan: 'Порты', whois: 'WHOIS', geo: 'Геолокация', security: 'Безопасность' },
    risk: { score: 'Оценка риска', level: 'Уровень риска', low: 'НИЗКИЙ', medium: 'СРЕДНИЙ', high: 'ВЫСОКИЙ', critical: 'КРИТИЧЕСКИЙ' },
    sections: { openPorts: 'Открытые порты', issues: 'Проблемы безопасности', warnings: 'Предупреждения', recommendations: 'Рекомендации' },
    progress: { dns: 'DNS-разрешение', ping: 'Ping-тест', geo: 'Геолокация', ports: 'Сканирование портов', whois: 'WHOIS-запрос', risk: 'Оценка рисков', complete: 'Завершено' }
  },
  history: {
    title: 'История анализов', subtitle: 'Предыдущие результаты',
    columns: { date: 'Дата', target: 'Цель', ip: 'IP', risk: 'Риск', ports: 'Порты', actions: 'Действия' },
    noHistory: 'Нет истории', clearAll: 'Очистить',
    stats: { total: 'Всего анализов', avgRisk: 'Средний риск', highRisk: 'Высокий риск', countries: 'Стран' },
    riskDistribution: 'Распределение рисков'
  },
  howItWorks: {
    title: 'Как работает OSINT-анализ', subtitle: 'Процесс сбора и анализа разведданных',
    steps: { step1: { title: 'Ввод цели', desc: 'Введите IP-адрес или доменное имя для анализа' }, step2: { title: 'DNS-разрешение', desc: 'Получение IP-адресов, MX и NS записей' }, step3: { title: 'Ping и сканирование', desc: 'Проверка доступности и сканирование портов' }, step4: { title: 'Сбор информации', desc: 'WHOIS-запрос и определение геолокации' }, step5: { title: 'Оценка рисков', desc: 'Автоматическая оценка безопасности и рекомендации' } },
    faq: { q1: { question: 'Что такое OSINT?', answer: 'OSINT (Open Source Intelligence) — разведка из открытых источников, сбор информации из публично доступных данных.' }, q2: { question: 'Это легально?', answer: 'Да, OSINT использует только публично доступную информацию. Сканирование портов следует выполнять только на своих системах или с разрешения.' }, q3: { question: 'Нужен ли интернет?', answer: 'Для DNS, Ping и GeoIP нужен интернет. Сканирование портов работает в локальной сети.' }, q4: { question: 'Какие порты сканируются?', answer: '28 наиболее распространённых портов: FTP, SSH, SMTP, DNS, HTTP, HTTPS, MySQL, RDP, PostgreSQL и другие.' } }
  },
  comparison: {
    title: 'Сравнение инструментов', subtitle: 'OSINT.AI vs другие инструменты',
    features: { feature: 'Функция', ourTool: 'OSINT.AI', shodan: 'Shodan', censys: 'Censys', nmap: 'Nmap' },
    criteria: { dnsLookup: 'DNS-запрос', portScan: 'Сканирование портов', geoip: 'Геолокация', whois: 'WHOIS', riskAssess: 'Оценка рисков', webInterface: 'Веб-интерфейс', free: 'Бесплатно', noInstall: 'Без установки', offline: 'Оффлайн', reporting: 'Отчёты' }
  },
  about: {
    title: 'Об OSINT.AI', subtitle: 'Разведка из открытых источников для кибербезопасности', description: 'Дипломный проект — инструмент OSINT для анализа IP-адресов и доменов с DNS, сканированием портов, WHOIS и геолокацией.',
    author: { title: 'Автор', name: 'Сулейман Акмухаммедов', project: 'Дипломный проект', topic: 'OSINT — разведка из открытых источников в кибербезопасности', topicTk: 'Kiberhowpsuzlykda OSINT – Açyk çeşmelerden maglumat ýygnamak we derňemek' }
  },
  export: { title: 'Экспорт отчёта', json: 'Скачать JSON', html: 'Скачать HTML', print: 'Печать' },
  common: { loading: 'Загрузка...', error: 'Ошибка', success: 'Успешно', warning: 'Предупреждение', cancel: 'Отмена', confirm: 'Подтвердить', back: 'Назад', close: 'Закрыть' }
}
