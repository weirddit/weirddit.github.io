/* Small pure helpers shared by all modules. */
(function (W) {
  W.utils = {
    fmt: function (t) {
      t = Math.max(0, t || 0);
      var m = Math.floor(t / 60), s = Math.floor(t % 60);
      return m + ':' + (s < 10 ? '0' : '') + s;
    },
    isVideo: function (f) {
      return f.type.indexOf('video/') === 0 ||
        /\.(mp4|mov|m4v|webm|mkv|avi|3gp|mpg|mpeg|wmv)$/i.test(f.name);
    },
    clamp: function (v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  };
})(Weirddit);
