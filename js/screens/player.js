/* Player screen: video element, Play/Pause, range-stop logic.
   Emits: 'video:loaded', 'video:tick' (every frame while playing + on seek/time events).
   API:   W.player.jumpTo(t), W.player.playRange(start, end) */
Weirddit.register('player', function (W) {
  var video = W.el.video, btn = W.el.playBtn, lbl = W.el.playLbl;
  var p = W.player = { stopAt: null, segStart: 0 };

  video.loop = true;

  // Icon + label swap (CSS shows the right icon via .is-playing)
  function setBtn(playing) {
    btn.classList.toggle('is-playing', playing);
    lbl.textContent = playing ? 'Pause' : 'Play';
    btn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  }

  function checkStop() {
    if (p.stopAt === null) return;
    var t = video.currentTime;
    if (t >= p.stopAt - 0.03 || t < p.segStart - 0.2) {
      var e = p.stopAt; p.stopAt = null; video.pause();
      video.currentTime = Math.min(e, video.duration || e);
    }
  }
  function tick() {
    checkStop(); W.emit('video:tick');
    if (!video.paused && !video.ended) requestAnimationFrame(tick);
  }

  // Seek and pause (used by timeline clicks)
  p.jumpTo = function (t) {
    p.segStart = t; p.stopAt = null; video.pause(); video.currentTime = t;
    W.emit('video:tick');
  };
  // Play from start and auto-stop at end (hook for future features)
  p.playRange = function (start, end) {
    p.segStart = start; p.stopAt = end; video.currentTime = start; video.play();
  };

  btn.addEventListener('click', function () {
    p.stopAt = null;
    if (video.paused) video.play(); else video.pause();
  });
  video.addEventListener('play', function () { setBtn(true); });
  video.addEventListener('pause', function () { setBtn(false); });
  video.addEventListener('ended', function () { setBtn(false); });
  video.addEventListener('play', tick);
  ['timeupdate', 'seeked', 'loadedmetadata', 'ended'].forEach(function (e) {
    video.addEventListener(e, function () { checkStop(); W.emit('video:tick'); });
  });
  video.addEventListener('loadedmetadata', function () { W.emit('video:loaded', video.duration); });

  W.on('video:selected', function () { setBtn(false); });
  W.on('screen:change', function (name) { if (name !== 'player') video.pause(); });
});
