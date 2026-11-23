/* Weirddit core: global namespace, event bus, module registry.
   MUST be loaded first. */
(function (global) {
  var handlers = {}, modules = [];

  var W = {
    config: {},            // filled by core/config.js
    state: { objUrl: null, file: null },   // shared app state
    el: {},                // DOM refs, filled by core/dom.js

    /* Event bus: W.on('video:tick', fn) / W.emit('video:tick', data) */
    on: function (evt, fn) { (handlers[evt] = handlers[evt] || []).push(fn); },
    emit: function (evt, data) { (handlers[evt] || []).slice().forEach(function (fn) { fn(data); }); },

    /* Each module registers an init(W) function; start() runs them in load order. */
    register: function (name, init) { modules.push({ name: name, init: init }); },
    start: function () { modules.forEach(function (m) { m.init(W); }); }
  };

  global.Weirddit = W;
})(window);
