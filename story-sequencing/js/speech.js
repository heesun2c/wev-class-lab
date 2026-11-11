/* ============================================================
   Speech Controller — Web Speech API
   Magic Tree House Story Sequencing
   ============================================================ */

const Speech = (() => {
  const synth = window.speechSynthesis;

  let currentUtterance = null;
  let currentBtn       = null;
  let isPlaying        = false;

  // ── Voice selection ─────────────────────────────────────
  // Prefer en-US female voice; fallback to any English voice
  function getVoice() {
    const voices = synth.getVoices();
    const preferred = [
      v => v.name.includes('Samantha'),       // macOS
      v => v.name.includes('Google US English'),
      v => v.lang === 'en-US' && !v.name.includes('compact'),
      v => v.lang.startsWith('en'),
    ];
    for (const test of preferred) {
      const found = voices.find(test);
      if (found) return found;
    }
    return voices[0] || null;
  }

  // ── Play ─────────────────────────────────────────────────
  function play(text, btn) {
    // If same button clicked again → stop
    if (isPlaying && currentBtn === btn) {
      stop();
      return;
    }
    // Stop any previous
    stop();

    // Clean text (remove \n → space)
    const clean = text.replace(/\n/g, ' ').trim();

    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang  = 'en-US';
    utter.rate  = 0.88;   // slightly slower for learners
    utter.pitch = 1.0;

    // Assign voice after voices are loaded
    const voice = getVoice();
    if (voice) utter.voice = voice;

    utter.onstart = () => {
      isPlaying = true;
      currentBtn = btn;
      setPlaying(btn, true);
    };

    utter.onend = () => {
      isPlaying = false;
      currentBtn = null;
      setPlaying(btn, false);
    };

    utter.onerror = () => {
      isPlaying = false;
      currentBtn = null;
      setPlaying(btn, false);
    };

    currentUtterance = utter;
    synth.speak(utter);
  }

  // ── Stop ─────────────────────────────────────────────────
  function stop() {
    if (synth.speaking) synth.cancel();
    isPlaying = false;
    if (currentBtn) {
      setPlaying(currentBtn, false);
      currentBtn = null;
    }
    currentUtterance = null;
  }

  // ── Button state ─────────────────────────────────────────
  function setPlaying(btn, playing) {
    if (!btn) return;
    btn.classList.toggle('playing', playing);
    const icon = btn.querySelector('.audio-icon');
    if (icon) icon.textContent = playing ? '⏹' : '🔊';
    btn.title = playing ? 'Stop' : 'Listen';
    btn.setAttribute('aria-label', playing ? 'Stop audio' : 'Play audio');
  }

  // ── Check support ─────────────────────────────────────────
  function isSupported() {
    return 'speechSynthesis' in window;
  }

  // ── Public ─────────────────────────────────────────────────
  return { play, stop, isSupported };
})();

// Ensure voices are loaded (Chrome quirk)
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {};
  // Trigger voice load
  window.speechSynthesis.getVoices();
}
