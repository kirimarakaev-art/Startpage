/*
 * JSONP-запрос. Страница открыта как file://, и fetch к чужим сайтам
 * браузер блокирует (CORS), а подключение <script> разрешено.
 *
 * StartPage.jsonp(name => 'https://…&callback=' + name, timeoutMs) -> Promise
 */
StartPage.jsonp = (function () {
  'use strict';
  let counter = 0;

  return function jsonp(buildUrl, timeout) {
    return new Promise((resolve, reject) => {
      const name = '__sp_cb' + (++counter);
      const script = document.createElement('script');

      const finish = (settle, value) => {
        clearTimeout(timer);
        window[name] = function () {};   // запоздавший ответ не должен ничего ломать
        script.remove();
        settle(value);
      };
      const timer = setTimeout(() => finish(reject, new Error('timeout')), timeout || 2000);

      window[name] = data => finish(resolve, data);
      script.onerror = () => finish(reject, new Error('network'));
      script.src = buildUrl(name);
      document.head.append(script);
    });
  };
})();
