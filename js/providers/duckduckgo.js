/* Провайдер подсказок: DuckDuckGo (запасной). Контракт - как в google.js. */
StartPage.providers.push({
  id: 'duckduckgo',
  fetch(query, ctx) {
    return StartPage.jsonp(cb =>
      'https://duckduckgo.com/ac/?q=' + encodeURIComponent(query) + '&callback=' + cb, ctx.timeout
    ).then(data => data.map(x => x.phrase));
  }
});
