/* One place for all DOM element lookups. Add new ids here. */
(function (W) {
  var $ = function (id) { return document.getElementById(id); };
  W.$ = $;
  W.el = {
    // home
    access: $('access'),
    // upload
    back: $('back'), drop: $('drop'), fileIn: $('file'),
    dzMain: $('dz-main'), dzSub: $('dz-sub'),
    // player
    video: $('video'), playBtn: $('playbtn'), playLbl: $('playlbl'),
    // shorts preview
    stage: $('stage'), pvideo: $('pvideo'), previewBtn: $('previewbtn'),
    // timeline
    strip: $('strip'), tiles: $('tiles'), over: $('over'),
    playhead: $('playhead'), time: $('time')
  };
})(Weirddit);
