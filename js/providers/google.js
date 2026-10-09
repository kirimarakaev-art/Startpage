/*
 * Провайдер подсказок: Google.
 * Контракт провайдера: { id, fetch(query, ctx) -> Promise<string[]> }
 * ctx = { engine: ключ префикса или null, lang, timeout }
 */
StartPage.providers.push({
  id: 'google',
  fetch(query, ctx) {
    const ds = ctx.engine === 'yt' ? '&ds=yt' : '';
    return StartPage.jsonp(cb =>
      'https://suggestqueries.google.com/complete/search?client=youtube&hl=' + ctx.lang + ds +
      '&q=' + encodeURIComponent(query) + '&callback=' + cb, ctx.timeout
    ).then(data => data[1].map(x => Array.isArray(x) ? x[0] : x));
  }
});
