/* Shorts Preview: plays the 3s intro clip, swipes up (like the Shorts feed), then the
   user's video starts playing. While it runs, Play/Pause + timeline segments are disabled
   (body.locked); they unlock the moment the user's video actually starts playing.
   Emits: 'preview:start', 'preview:end'. */
Weirddit.register('preview', function (W) {
  var el = W.el, video = el.video, pv = el.pvideo, stage = el.stage;
  var btn = el.previewBtn, playBtn = el.playBtn, c = W.config;
  var running = false, timer = null;

  pv.src = c.PREVIEW_SRC;
  stage.style.setProperty('--swipe', c.SWIPE_MS + 'ms');

  // Lock/unlock Play-Pause + timeline
  function lock(on) {
    document.body.classList.toggle('locked', on);
    playBtn.disabled = on;
  }

  // Timeline clicks are swallowed while locked (capture on the parent runs before the strip's own handler)
  el.strip.parentNode.addEventListener('click', function (e) {
    if (document.body.classList.contains('locked')) { e.stopPropagation(); e.preventDefault(); }
  }, true);

  function onPlaying() { video.removeEventListener('playing', onPlaying); lock(false); }

  function cleanup() {
    clearTimeout(timer);
    video.removeEventListener('playing', onPlaying);
    stage.classList.remove('previewing', 'animating', 'swiped');
    pv.pause();
    running = false;
    btn.disabled = false;
    W.emit('preview:end');
  }

  // Preview clip finished -> swipe up, user's video starts playing as the swipe begins
  function swipe() {
    if (!running || stage.classList.contains('swiped')) return;
    stage.classList.add('animating', 'swiped');
    video.addEventListener('playing', onPlaying);
    var pr = video.play();
    if (pr && pr.catch) pr.catch(function () { lock(false); });   // autoplay blocked -> never leave the tool locked
    timer = setTimeout(cleanup, c.SWIPE_MS + 80);
  }

  function start() {
    if (running || !W.state.objUrl || !isFinite(video.duration)) return;
    running = true;
    btn.disabled = true; lock(true);
    W.player.jumpTo(0);                                  // user's video: paused at 0:00
    stage.classList.remove('animating', 'swiped');
    stage.classList.add('previewing');
    pv.currentTime = 0;
    W.emit('preview:start');
    var pr = pv.play();
    if (pr && pr.catch) pr.catch(swipe);                 // preview clip can't play -> skip straight to the swipe
  }

  // Stop everything (screen change / new upload)
  function abort() {
    if (!running) return;
    cleanup(); lock(false);
  }

  btn.addEventListener('click', start);
  pv.addEventListener('ended', swipe);
  pv.addEventListener('error', swipe);
  W.on('screen:change', function (name) { if (name !== 'player') abort(); });
  W.on('video:selected', abort);
});
