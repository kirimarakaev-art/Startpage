/* Мелкие помощники для DOM. */
StartPage.dom = (function () {
  'use strict';

  const $ = id => document.getElementById(id);

  /**
   * el('a', { className, text, attrs, style, on }, ...children)
   * Собирает элемент без innerHTML: текст всегда экранируется.
   */
  function el(tag, opts, ...children) {
    const o = opts || {};
    const node = document.createElement(tag);
    if (o.className) node.className = o.className;
    if (o.text != null) node.textContent = o.text;
    if (o.attrs) for (const k in o.attrs) node.setAttribute(k, o.attrs[k]);
    if (o.style) for (const k in o.style) node.style.setProperty(k, o.style[k]);
    if (o.on) for (const k in o.on) node.addEventListener(k, o.on[k]);
    node.append(...children.filter(Boolean));
    return node;
  }

  return { $, el };
})();
