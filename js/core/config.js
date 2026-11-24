/* All tunable numbers in one place. */
Weirddit.config = {
  SEG_LEN: 3,          // length (sec) of each lettered segment (A, B, C...)
  PATTERN_END: 0.5,    // Pattern Interrupt: 0 -> 0.5s
  HOOK_END: 3,         // Hook: 0.5 -> 3s (lettered segments start here)
  LOOP_START: 27,      // segment starting here is labelled "Loop"
  MAX_LEN: 30,         // Shorts max length; anything after is greyed out
  PREVIEW_SRC: 'assets/shorts_preview.mp4',  // 3s intro clip for "Shorts Preview"
  SWIPE_MS: 450,       // swipe-up animation duration (ms)
  ZONE_SAFE_PCT: 88    // Zone overlay: left 88% green (safe), remaining right 12% red (danger)
};
