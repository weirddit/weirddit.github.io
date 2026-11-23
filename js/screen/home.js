/* Home screen: logo, avatar, "Access Tool". */
Weirddit.register('home', function (W) {
  W.el.access.onclick = function () { W.go('tool'); };
});
