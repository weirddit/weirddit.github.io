/* Upload screen: drag & drop / file picker. Emits 'video:selected'. */
Weirddit.register('upload', function (W) {
  var el = W.el, video = el.video;

  function setDz(main, sub) { el.dzMain.textContent = main; el.dzSub.textContent = sub; }

  function pick(f) {
    if (!f) return;
    if (!W.utils.isVideo(f)) { setDz('Please choose a video file', ''); return; }
    setDz('Drag & drop your video here', 'or click to choose a video');
    if (W.state.objUrl) URL.revokeObjectURL(W.state.objUrl);
    W.state.objUrl = URL.createObjectURL(f);
    W.state.file = f;
    video.src = W.state.objUrl;
    W.emit('video:selected', f);
    W.go('player');
  }

  el.back.onclick = function () { W.go(''); };
  el.fileIn.addEventListener('change', function () { pick(el.fileIn.files[0]); el.fileIn.value = ''; });

  function onTool() { return location.hash === '#tool'; }
  window.addEventListener('dragover', function (ev) { ev.preventDefault(); if (onTool()) el.drop.classList.add('dragging'); });
  window.addEventListener('dragleave', function (ev) { if (!ev.relatedTarget) el.drop.classList.remove('dragging'); });
  window.addEventListener('drop', function (ev) {
    ev.preventDefault(); el.drop.classList.remove('dragging');
    if (!onTool()) return;
    var f = ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files[0];
    if (f) pick(f);
  });

  // Unplayable format -> back to upload with a message
  video.addEventListener('error', function () {
    if (!W.state.objUrl) return;
    URL.revokeObjectURL(W.state.objUrl); W.state.objUrl = null; W.state.file = null;
    video.removeAttribute('src');
    setDz("This video format can't be played here", 'Try an MP4 (H.264) file');
    W.go('tool');
  });
});
