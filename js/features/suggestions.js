/*
 * Выпадающий список подсказок: свои ярлыки + внешние провайдеры (js/providers).
 * С остальной страницей общается только через bus (см. search.js).
 */
StartPage.register('suggestions', function (app) {
  'use strict';
  const { $, el } = app.dom;
  const cfg = app.config;
  const opts = cfg.suggestions;
  const input = $('q'), list = $('sugg');
  const search = app.features.search;

  const localLinks = Object.keys(cfg.links).reduce((all, dir) =>
    all.concat(cfg.links[dir].map(([name, url, note]) => ({ name, url, note }))), []);

  let items = [], selected = -1, requestId = 0, timer;

  // ---- данные ----

  async function fetchRemote(query, engineKey) {
    const ctx = { engine: engineKey, lang: cfg.lang, timeout: opts.timeoutMs };
    for (const id of opts.providers) {
      const provider = app.providers.find(p => p.id === id);
      if (!provider) continue;
      try { return await provider.fetch(query, ctx); } catch (_) { /* пробуем следующего */ }
    }
    return [];
  }

  function localMatches(text) {
    const low = text.toLowerCase();
    return localLinks
      .filter(l => l.name.toLowerCase().includes(low))
      .slice(0, 3)
      .map(l => ({ kind: 'link', label: l.name, typed: text, url: l.url, note: l.note }));
  }

  // ---- отрисовка ----

  function label(item) {
    const typed = item.typed.toLowerCase();
    if (!item.label.toLowerCase().startsWith(typed)) return el('span', { className: 'txt', text: item.label });
    return el('span', { className: 'txt' },
      el('span', { className: 'tp', text: item.label.slice(0, typed.length) }),
      el('span', { className: 'rest', text: item.label.slice(typed.length) })
    );
  }

  function close() {
    list.classList.remove('open');
    list.replaceChildren();
    input.setAttribute('aria-expanded', 'false');
    items = []; selected = -1;
  }

  function select(i) {
    selected = i;
    [...list.children].forEach((li, k) => li.classList.toggle('on', k === i));
  }

  function render(next) {
    items = next; selected = -1;
    if (!next.length) { close(); return; }
    list.replaceChildren(...next.map((item, i) => el('li', {
        className: item.kind,
        attrs: { role: 'option' },
        on: {
          mousemove: () => select(i),
          mousedown: e => { e.preventDefault(); select(i); app.bus.emit('search:request-submit'); }
        }
      },
      el('span', { className: 'ico', text: item.kind === 'link' ? '↗' : '⌕' }),
      label(item),
      item.note ? el('span', { className: 'note', text: item.note }) : null
    )));
    list.classList.add('open');
    input.setAttribute('aria-expanded', 'true');
  }

  // ---- логика ----

  function update() {
    const a = search.analyze(input.value);
    if (!a.text) { close(); return; }

    const local = a.engine ? [] : localMatches(a.text);
    render(local);                                  // свои ярлыки - мгновенно

    const id = ++requestId;
    fetchRemote(a.query, a.engineKey).then(found => {
      if (id !== requestId) return;                 // ответ устарел
      const seen = new Set();
      const remote = found
        .filter(s => s && !seen.has(s) && seen.add(s))
        .slice(0, opts.max)
        .map(s => ({ kind: 'q', label: a.prefix + s, typed: a.text, value: a.prefix + s }));
      render(local.concat(remote));
    });
  }

  app.bus.on('search:input', () => {
    clearTimeout(timer);
    timer = setTimeout(update, opts.debounceMs);
  });

  app.bus.on('search:keydown', e => {
    if (!items.length) return;
    if (e.key === 'ArrowDown')      { e.preventDefault(); select((selected + 1) % items.length); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); select((selected - 1 + items.length) % items.length); }
    else if (e.key === 'Escape')    { close(); }
    else if (e.key === 'Tab' && selected >= 0 && items[selected].kind === 'q') {
      e.preventDefault();
      input.value = items[selected].value;
      update();
    }
  });

  app.bus.on('search:blur', () => setTimeout(close, 120));

  // Enter при выбранной подсказке: подменяем то, что отправит search.js
  app.bus.on('search:submit', payload => {
    const item = selected >= 0 ? items[selected] : null;
    if (!item) return;
    if (item.kind === 'link') payload.url = item.url;
    else payload.text = item.value;
  });
});
