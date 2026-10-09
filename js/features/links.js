/* Карточки быстрых ссылок, сгруппированные по «папкам» из config.links. */
StartPage.register('links', function (app) {
  'use strict';
  const { $, el } = app.dom;
  const ACCENTS = ['var(--purple)', 'var(--pink)', 'var(--cyan)', 'var(--green)', 'var(--orange)'];
  const root = $('links');
  let n = 0;

  for (const dir in app.config.links) {
    root.append(el('p', { className: 'term-line dir rise', style: { '--i': 5 + n } },
      el('b', { text: '$' }), ' ls ', el('i', { text: dir })
    ));

    const grid = el('div', { className: 'cards' });
    for (const [name, url, note] of app.config.links[dir]) {
      grid.append(el('a', {
          className: 'card rise',
          attrs: { href: url },
          style: { '--c': ACCENTS[n % ACCENTS.length], '--i': 6 + n }
        },
        el('div', { className: 'badge', text: name[0].toUpperCase() }),
        el('div', { className: 'meta' },
          el('strong', { text: name }),
          el('span', { text: note || new URL(url).hostname })
        )
      ));
      n++;
    }
    root.append(grid);
  }
});
