/* Zone: eye button next to the video toggles a colour overlay on the video.
   Safe (green) area = left ZONE_SAFE_PCT% of the width, between ZONE_TOP_PCT% and
   ZONE_BOTTOM_PCT% from the top/bottom. Everything else = red (danger).
   Eye open = zone visible, eye closed (slashed) = hidden. Starts hidden.
   Overlay is hidden automatically while the Shorts Preview clip runs (see css/zone.css). */
Weirddit.register('zone', function (W) {
  var el = W.el, btn = el.zoneBtn, zone = el.zone;

  var c = W.config;
  zone.style.setProperty('--zone-safe', c.ZONE_SAFE_PCT + '%');
  zone.style.setProperty('--zone-top', c.ZONE_TOP_PCT + '%');
  zone.style.setProperty('--zone-bottom', c.ZONE_BOTTOM_PCT + '%');

  function set(on) {
    zone.classList.toggle('show', on);
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? 'Hide zone' : 'Show zone');
  }

  btn.addEventListener('click', function () { set(!zone.classList.contains('show')); });
  set(false);
});
