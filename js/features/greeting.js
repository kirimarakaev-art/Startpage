/* Приветствие по времени суток; «печатается» CSS-анимацией. */
StartPage.register('greeting', function (app) {
  'use strict';
  const h = new Date().getHours();
  const word = h < 5 ? 'доброй ночи' : h < 12 ? 'доброе утро' : h < 18 ? 'добрый день' : 'добрый вечер';
  const text = '"' + word + ', ' + app.config.user + '"';

  const node = app.dom.$('greeting');
  node.textContent = text;
  node.style.setProperty('--n', text.length);   // число символов для steps()
});
