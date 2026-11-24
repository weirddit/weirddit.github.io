/* Zone: eye button next to the video toggles a colour overlay on the video.
   Left ZONE_SAFE_PCT% = green (safe), the rest on the right = red (danger).
   Eye open = zone visible, eye closed (slashed) = hidden. Starts hidden.
   Overlay is hidden automatically while the Shorts Preview clip runs (see css/zone.css). */
Weirddit.register('zone', function (W) {
  var el = W.el, btn = el.zoneBtn, zone = el.zone;

  zone.style.setProperty('--zone-safe', W.config.ZONE_SAFE_PCT + '%');

  function set(on) {
    zone.classList.toggle('show', on);
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? 'Hide zone' : 'Show zone');
  }

  btn.addEventListener('click', function () { set(!zone.classList.contains('show')); });
  set(false);
});
