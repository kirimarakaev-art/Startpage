/* Часы и дата. Обновляются раз в секунду. */
StartPage.register('clock', function (app) {
  'use strict';
  const { $ } = app.dom;
  const pad = n => String(n).padStart(2, '0');
  const hh = $('hh'), mm = $('mm'), ss = $('ss'), date = $('date');

  function tick() {
    const d = new Date();
    hh.textContent = pad(d.getHours());
    mm.textContent = pad(d.getMinutes());
    ss.textContent = pad(d.getSeconds());
    ss.classList.remove('flash'); void ss.offsetWidth; ss.classList.add('flash');
    date.textContent = '# ' + d.toLocaleDateString(app.config.locale, {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  tick();
  setInterval(tick, 1000);
});
