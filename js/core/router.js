/* Hash router: ''(home) | #tool (upload) | #player.
   To add a screen: add <section id="x"> + css, then handle it in show(). */
Weirddit.register('router', function (W) {
  function show() {
    var h = location.hash;
    if (h === '#player' && !W.state.objUrl) { location.hash = 'tool'; return; }
    document.body.classList.toggle('in-tool', h === '#tool');
    document.body.classList.toggle('in-player', h === '#player');
    W.emit('screen:change', h.replace('#', ''));   // '' | 'tool' | 'player'
    window.scrollTo(0, 0);
  }
  W.go = function (name) { location.hash = name; };
  W.router = { show: show };
  window.addEventListener('hashchange', show);
});
