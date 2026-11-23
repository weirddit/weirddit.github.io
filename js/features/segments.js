/* Segment logic ONLY (no DOM): decides how a video of duration d is divided.
   Returns [{s, e, w, label, cls}] where w = relative tile width.
   Change labels / rules here; timeline.js just draws whatever this returns. */
Weirddit.register('segments', function (W) {
  var c = W.config;

  W.segments = {
    build: function (d) {
      var parts = [];
      parts.push({ s: 0, e: Math.min(c.PATTERN_END, d), w: 1.3, label: 'Pattern Interrupt', cls: 'special' });
      if (d > c.PATTERN_END)
        parts.push({ s: c.PATTERN_END, e: Math.min(c.HOOK_END, d), w: 2, label: 'Hook', cls: 'special hook' });

      var start = c.HOOK_END, letterIdx = 0;
      while (start < d - 0.001) {
        var end = Math.min(start + c.SEG_LEN, d);
        if (d - end < 0.5) end = d;
        var isLoop = (start === c.LOOP_START && end <= c.MAX_LEN + 0.001);
        var lbl;
        if (isLoop) { lbl = 'Loop'; } else { lbl = String.fromCharCode(65 + (letterIdx % 26)); letterIdx++; }
        parts.push({ s: start, e: end, w: (end - start) / c.SEG_LEN, label: lbl, cls: isLoop ? 'special loop' : '' });
        start += c.SEG_LEN;
        if (end === d) break;
      }
      return parts;
    }
  };
});
