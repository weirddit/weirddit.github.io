/* Timeline strip: draws tiles from W.segments.build(), playhead, over-30s overlay,
   click-to-seek. Emits 'timeline:built' (parts). API: W.timeline.{parts, timeToFrac, fracToTime} */
Weirddit.register('timeline', function (W) {
  var el = W.el, video = el.video, tilesEl = el.tiles, c = W.config;
  var parts = [], totalW = 1;

  function timeToFrac(t) {
    if (!parts.length) return 0;
    var acc = 0;
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (t <= p.e || i === parts.length - 1) {
        var r = W.utils.clamp((t - p.s) / (p.e - p.s), 0, 1);
        return (acc + r * p.w) / totalW;
      }
      acc += p.w;
    }
    return 1;
  }
  function fracToTime(f) {
    if (!parts.length) return 0;
    var x = f * totalW, acc = 0;
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (x <= acc + p.w || i === parts.length - 1) {
        var r = W.utils.clamp((x - acc) / p.w, 0, 1);
        return p.s + r * (p.e - p.s);
      }
      acc += p.w;
    }
    return parts[parts.length - 1].e;
  }

  function updatePlayhead() {
    var d = video.duration, ok = isFinite(d) && d > 0;
    el.playhead.style.left = (ok ? timeToFrac(video.currentTime) * 100 : 0) + '%';
    el.time.textContent = W.utils.fmt(video.currentTime) + ' / ' + W.utils.fmt(ok ? d : 0);
  }
  function fitLabels() {
    var n = tilesEl.children.length, w = tilesEl.getBoundingClientRect().width;
    tilesEl.classList.toggle('nolabel', !!(n && w && w / n < 30));
  }
  function checkLength() {
    var d = video.duration;
    if (isFinite(d) && d > c.MAX_LEN + 0.5) {
      el.over.style.left = (timeToFrac(c.MAX_LEN) * 100) + '%'; el.over.style.display = 'block';
    } else {
      el.over.style.display = 'none';
    }
  }

  function build() {
    var d = video.duration;
    tilesEl.innerHTML = ''; parts = []; W.timeline.parts = parts;
    if (!isFinite(d) || d <= 0) { updatePlayhead(); return; }
    parts = W.segments.build(d);
    totalW = 0;
    parts.forEach(function (p) {
      totalW += p.w;
      var t = document.createElement('div'); t.className = 'tile ' + p.cls;
      t.style.flex = p.w + ' 0 0';
      var lab = document.createElement('span'); lab.textContent = p.label;
      t.appendChild(lab); tilesEl.appendChild(t);
    });
    W.timeline.parts = parts;
    fitLabels(); checkLength(); updatePlayhead();
    W.emit('timeline:built', parts);
  }

  W.timeline = { parts: parts, timeToFrac: timeToFrac, fracToTime: fracToTime };

  el.strip.addEventListener('click', function (e) {
    var d = video.duration; if (!isFinite(d) || !parts.length) return;
    var r = el.strip.getBoundingClientRect();
    var f = W.utils.clamp((e.clientX - r.left) / r.width, 0, 1);
    var t = fracToTime(f), seg = parts[parts.length - 1];
    for (var i = 0; i < parts.length; i++) { if (t < parts[i].e) { seg = parts[i]; break; } }
    W.player.jumpTo(seg.s);
    W.emit('segment:click', seg);
  });

  W.on('video:loaded', build);
  W.on('video:tick', updatePlayhead);
  W.on('screen:change', function (name) { if (name === 'player') requestAnimationFrame(fitLabels); });
  window.addEventListener('resize', fitLabels);
});
