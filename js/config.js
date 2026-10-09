/*
 * Все пользовательские настройки. Остальной код менять не нужно.
 */
StartPage.config = {
  user: 'dev',
  host: 'mac',
  locale: 'ru-RU',   // формат даты
  lang: 'ru',        // язык подсказок

  // [название, адрес поиска]. Ключ - префикс в строке поиска: «gh react»
  defaultEngine: ['Google', 'https://www.google.com/search?q='],
  engines: {
    gh:   ['GitHub',         'https://github.com/search?q='],
    yt:   ['YouTube',        'https://www.youtube.com/results?search_query='],
    mdn:  ['MDN',            'https://developer.mozilla.org/en-US/search?q='],
    so:   ['Stack Overflow', 'https://stackoverflow.com/search?q='],
    habr: ['Хабр',           'https://habr.com/ru/search/?q='],
    g:    ['Google',         'https://www.google.com/search?q=']
  },

  // Подсказки: providers - порядок опроса (id из js/providers), первый ответивший побеждает
  suggestions: {
    providers: ['google', 'duckduckgo'],
    max: 7,
    debounceMs: 120,
    timeoutMs: 2000
  },

  // Папка -> [[название, адрес, подпись], ...]
  links: {
    '~/code': [
      ['github', 'https://github.com', 'репозитории'],
      ['stackoverflow', 'https://stackoverflow.com', 'вопросы'],
      ['mdn', 'https://developer.mozilla.org', 'справочник по вебу']
    ],
    '~/read': [
      ['hacker-news', 'https://news.ycombinator.com', 'новости'],
      ['habr', 'https://habr.com/ru/feed/', 'статьи']
    ],
    '~/misc': [
      ['claude', 'https://claude.ai', 'чат'],
      ['youtube', 'https://www.youtube.com', 'видео'],
      ['mail', 'https://mail.google.com', 'почта']
    ]
  }
};
