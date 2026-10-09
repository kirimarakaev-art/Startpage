/*
 * Ядро: глобальный объект StartPage, реестр фич и шина событий.
 * Подключается первым. Остальные файлы только регистрируют себя здесь.
 *
 *   StartPage.register(name, init)  - добавить фичу; init(app) вызывается при старте
 *   StartPage.bus.on / emit         - события между фичами (без прямых зависимостей)
 *   StartPage.providers             - список источников подсказок (см. js/providers)
 *   StartPage.features[name]        - публичный API фичи (то, что вернул её init)
 */
(function (w) {
  'use strict';

  const features = [];
  const listeners = {};

  const StartPage = {
    config: null,
    dom: null,
    providers: [],
    features: {},

    bus: {
      on(event, fn) {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(fn);
      },
      emit(event, payload) {
        (listeners[event] || []).forEach(fn => fn(payload));
      }
    },

    register(name, init) {
      features.push({ name, init });
    },

    start() {
      for (const f of features) {
        // Сбой одной фичи не должен ронять всю страницу
        try {
          const api = f.init(StartPage);
          if (api) StartPage.features[f.name] = api;
        } catch (err) {
          console.error('[startpage] фича «' + f.name + '» не запустилась:', err);
        }
      }
    }
  };

  w.StartPage = StartPage;
})(window);
