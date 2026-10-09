/*
 * Строка поиска: разбор префиксов, подсказка об активном поисковике,
 * переход по Enter, горячие клавиши.
 *
 * Публичный API (StartPage.features.search):
 *   analyze(text) -> { text, engineKey, engine, prefix, query }
 *   resolve(text) -> { label, url } | null
 *
 * События (bus):
 *   emits  search:input   { value }     - пользователь ввёл текст
 *   emits  search:keydown KeyboardEvent - для навигации по подсказкам
 *   emits  search:blur
 *   emits  search:submit  payload       - слушатели могут подставить payload.text / payload.url
 *   listens search:request-submit       - отправить форму программно
 */
StartPage.register('search', function (app) {
  'use strict';
  const { $, el } = app.dom;
  const cfg = app.config;
  const form = $('search'), input = $('q'), hint = $('hint');

  $('prompt').textContent = cfg.user + '@' + cfg.host + ':~$';

  const defaultHint = 'префиксы: ' + Object.keys(cfg.engines).join(', ');
  hint.textContent = defaultHint;

  function analyze(value) {
    const text = value.trim();
    const parts = text.split(/\s+/);
    const key = parts[0].toLowerCase();
    const engine = cfg.engines[key];
    if (text && engine && parts.length > 1) {
      return { text, engineKey: key, engine, prefix: parts[0] + ' ', query: parts.slice(1).join(' ') };
    }
    return { text, engineKey: null, engine: null, prefix: '', query: text };
  }

  function resolve(value) {
    const a = analyze(value);
    if (!a.text) return null;
    if (a.engine) return { label: a.engine[0], url: a.engine[1] + encodeURIComponent(a.query) };
    if (/^https?:\/\//i.test(a.text)) return { label: 'адрес', url: a.text };
    if (/^[^\s]+\.[a-z]{2,}(\/[^\s]*)?$/i.test(a.text)) return { label: 'адрес', url: 'https://' + a.text };
    return { label: cfg.defaultEngine[0], url: cfg.defaultEngine[1] + encodeURIComponent(a.text) };
  }

  // Подсказка «→ GitHub» над карточками
  let lastLabel = '';
  input.addEventListener('input', () => {
    const r = resolve(input.value);
    if (!r) { hint.textContent = defaultHint; lastLabel = ''; }
    else if (r.label !== lastLabel) {
      hint.replaceChildren('→ ', el('em', { text: r.label }));
      lastLabel = r.label;
    }
    app.bus.emit('search:input', { value: input.value });
  });
  input.addEventListener('keydown', e => app.bus.emit('search:keydown', e));
  input.addEventListener('blur', () => app.bus.emit('search:blur'));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const payload = { text: input.value, url: null };
    app.bus.emit('search:submit', payload);          // подсказки могут изменить payload
    if (payload.text !== input.value) input.value = payload.text;
    const target = payload.url || (resolve(payload.text) || {}).url;
    if (target) location.href = target;
  });
  app.bus.on('search:request-submit', () => form.requestSubmit());

  // Любая печатная клавиша возвращает фокус в строку поиска
  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (document.activeElement !== input && (e.key.length === 1 || e.key === '/')) {
      input.focus();
      if (e.key === '/') e.preventDefault();
    }
  });

  return { analyze, resolve };
});
