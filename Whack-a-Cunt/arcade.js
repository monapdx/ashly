'use strict';
const $ = selector => document.querySelector(selector);
const holes = [...document.querySelectorAll('.hole')];
const character = document.body.dataset.character;
const regularFace = { amy: 'mole.png', brett: 'brett.png', clarence: 'clarence.png' }[character];
const BONUS_EVERY = 25, BONUS_SECONDS = 20, BONUS_VALUE = 3;
let score = 0, best = 0, regularHits = 0, active = null, timer, countdown;
let playing = false, mode = 'regular', muted = false, audio;
let bonusHits = 0, bonusRemaining = BONUS_SECONDS * 1000, bonusDeadline = 0;
const format = n => String(n).padStart(3, '0');
function setFace(file) { document.body.style.setProperty('--face', `url('${file}')`); }
setFace(regularFace);
document.querySelector(`[data-pick="${character}"]`).setAttribute('aria-current', 'page');
// Preload the bonus sprite before it is needed.
const bonusSprite = new Image(); bonusSprite.src = 'trump.png';
try {
  best = Number(localStorage.getItem('wac-best')) || 0;
  muted = localStorage.getItem('wac-muted') === 'true';
} catch {}
$('#best').textContent = format(best);
function soundUI() {
  $('#sound').textContent = muted ? 'SOUND OFF' : 'SOUND ON';
  $('#sound').setAttribute('aria-pressed', String(!muted));
}
soundUI();
function unlock() {
  try {
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === 'suspended') audio.resume().catch(() => {});
  } catch {}
}
function tone(freq, end, duration, type = 'sine', volume = .12, delay = 0) {
  if (muted || !audio || audio.state !== 'running') return;
  const t = audio.currentTime + delay, o = audio.createOscillator(), g = audio.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(end, t + duration);
  g.gain.setValueAtTime(volume, t);
  g.gain.exponentialRampToValueAtTime(.001, t + duration);
  o.connect(g).connect(audio.destination); o.start(t); o.stop(t + duration + .01);
}
function fanfare() {
  [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, f, .22, 'triangle', .13, i * .09));
}
function hitSound() {
  tone(170, 42, .14, 'triangle', .3);
  tone(850 + Math.random() * 150, 600, .075, 'square', .045, .025);
  tone(1100, 1500, .13, 'sine', .12, .075);
  if (mode === 'bonus') tone(1568, 2100, .18, 'triangle', .1, .12);
  else if (regularHits % 5 === 0) [1320, 1660, 1980].forEach((f, i) => tone(f, f, .18, 'triangle', .12, .12 + i * .075));
}
$('#sound').onclick = () => {
  muted = !muted; unlock(); soundUI();
  try { localStorage.setItem('wac-muted', muted); } catch {}
  if (!muted) tone(700, 1100, .15);
};
function hide() {
  if (active) active.classList.remove('active');
  active = null;
}
function stop() {
  playing = false; clearTimeout(timer); clearInterval(countdown); hide();
  document.body.classList.remove('playing');
  $('#pause').disabled = true;
}
function overlay(seal, title, description, action) {
  $('#curtain .seal').textContent = seal;
  $('#curtain h2').textContent = title;
  $('#curtain p').textContent = description;
  $('#start').textContent = action;
  $('#curtain').hidden = false;
  $('#start').focus({ preventScroll: true });
}
function progress() {
  const hitsToGo = BONUS_EVERY - regularHits % BONUS_EVERY;
  $('#bonus-label').textContent = 'TRUMP BONUS';
  $('#bonus-value').textContent = `${hitsToGo} HITS TO UNLOCK`;
  $('#bonus-meter').value = regularHits % BONUS_EVERY;
  $('#bonus-meter').max = BONUS_EVERY;
  $('#bonus-meter').setAttribute('aria-label', 'Regular hits toward the Trump bonus round');
}
progress();
function beginBonusIntro() {
  stop(); mode = 'intro'; bonusHits = 0; bonusRemaining = BONUS_SECONDS * 1000;
  document.body.classList.add('bonus'); setFace('trump.png');
  $('#bonus-label').textContent = '✦ CONTEMPT OF COURT ✦';
  $('#bonus-value').textContent = 'BONUS ROUND UNLOCKED';
  $('#bonus-meter').max = BONUS_SECONDS * 1000; $('#bonus-meter').value = bonusRemaining;
  $('#bonus-meter').setAttribute('aria-label', 'Bonus time remaining');
  $('#status').textContent = 'GOLD MALLET. ZERO IMMUNITY.';
  overlay('✦ THE GOLDEN BONUS ROUND ✦', 'CONTEMPT OF COURT', '20 seconds. Trump gets faster with every hit. Each hit earns +3 points. Gold mallet included.', 'OVERTURN IMMUNITY →');
  fanfare();
}
function remaining() { return Math.max(0, bonusDeadline - performance.now()); }
function tick() {
  if (!playing || mode !== 'bonus') return;
  bonusRemaining = remaining();
  $('#bonus-value').textContent = `${(bonusRemaining / 1000).toFixed(1)}s · ${bonusHits} HITS`;
  $('#bonus-meter').value = bonusRemaining;
  document.body.classList.toggle('urgent', bonusRemaining <= 5000);
  if (bonusRemaining <= 0) finishBonus();
}
function finishBonus() {
  stop(); mode = 'results'; bonusRemaining = 0;
  document.body.classList.remove('urgent');
  $('#bonus-meter').value = 0;
  $('#bonus-value').textContent = `+${bonusHits * BONUS_VALUE} BONUS POINTS`;
  $('#status').textContent = 'THE PEOPLE HAVE RULED.';
  overlay('✦ BONUS ROUND COMPLETE ✦', 'YOUR APPROVAL RATING: 0%', `${bonusHits} hits. +${bonusHits * BONUS_VALUE} bonus points. Total contempt: ${score}. Back to the bench?`, 'BACK TO COURT →');
  [784, 659, 523, 392].forEach((f, i) => tone(f, f, .25, 'triangle', .13, i * .12));
}
function cycle(delay) {
  clearTimeout(timer); hide();
  if (!playing) return;
  const bonus = mode === 'bonus';
  if (bonus && remaining() <= 0) { finishBonus(); return; }
  const downTime = delay ?? (bonus ? Math.max(100, 310 - bonusHits * 15) + Math.random() * 120 : 450 + Math.random() * 800);
  timer = setTimeout(() => {
    if (!playing) return;
    if (mode === 'bonus' && remaining() <= 0) { finishBonus(); return; }
    const candidates = holes.filter(h => !h.classList.contains('hit'));
    active = candidates[Math.floor(Math.random() * candidates.length)];
    active.classList.add('active');
    timer = setTimeout(() => {
      if (!playing) return;
      if (mode === 'bonus' && remaining() <= 0) { finishBonus(); return; }
      if (mode === 'bonus' && active) burst(active, 'TOTAL IMMUNITY!', false);
      hide();
      $('#status').textContent = mode === 'bonus' ? 'TOTAL IMMUNITY! CATCH HIM NEXT TIME.' : 'OVERRULED. TRY THE NEXT ONE.';
      cycle();
    }, bonus ? Math.max(330, 850 - bonusHits * 35) : 750);
  }, downTime);
}
function pause() {
  if (!playing) return;
  if (mode === 'bonus') bonusRemaining = remaining();
  if (mode === 'bonus' && bonusRemaining <= 0) { finishBonus(); return; }
  stop();
  overlay(mode === 'bonus' ? '✦ EVEN IMMUNITY NEEDS A BREAK ✦' : '✦ ORDER! ORDER! ✦', 'Court is in recess.', mode === 'bonus' ? `${(bonusRemaining / 1000).toFixed(1)} seconds left. Your bonus timer is paused.` : 'Your points are right where you left them.', 'RESUME →');
}
$('#start').onclick = () => {
  unlock();
  if (mode === 'results') {
    mode = 'regular'; document.body.classList.remove('bonus'); setFace(regularFace); progress();
  } else if (mode === 'intro') { mode = 'bonus'; fanfare(); }
  playing = true; $('#curtain').hidden = true;
  document.body.classList.add('playing'); $('#pause').disabled = false;
  $('#pause').focus({ preventScroll: true });
  $('#status').textContent = mode === 'bonus' ? 'OVERTURN HIS IMMUNITY. +3 PER HIT.' : 'THE COURT IS IN SESSION.';
  tone(420, 840, .15, 'triangle');
  if (mode === 'bonus') {
    bonusDeadline = performance.now() + bonusRemaining;
    clearInterval(countdown); countdown = setInterval(tick, 50); tick();
  }
  cycle(350);
};
$('#pause').onclick = pause;
document.addEventListener('visibilitychange', () => { if (document.hidden && playing) pause(); });
function burst(h, message, particles = true) {
  const box = $('.arena').getBoundingClientRect(), r = h.getBoundingClientRect();
  const x = r.left - box.left + r.width / 2, y = r.top - box.top + r.height / 2;
  const b = document.createElement('span'); b.className = particles ? 'burst' : 'burst escape'; b.textContent = message;
  // Clamp callouts away from board edges so long labels remain readable on phones.
  b.style.left = `${Math.max(90, Math.min(box.width - 90, x))}px`; b.style.top = `${y}px`;
  $('#effects').append(b); setTimeout(() => b.remove(), 720);
  if (!particles) return;
  for (let i = 0; i < 10; i++) {
    const s = document.createElement('i'); s.className = 'spark';
    s.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(i * 6.28 / 10) * (40 + Math.random() * 55)}px;--dy:${Math.sin(i * 6.28 / 10) * (40 + Math.random() * 55)}px;background:${i % 2 ? '#fff5dd' : mode === 'bonus' ? '#ffd85c' : '#d9ff68'}`;
    $('#effects').append(s); setTimeout(() => s.remove(), 650);
  }
}
function updateScore() {
  $('#score').textContent = format(score);
  $('#score').classList.remove('score-pop'); void $('#score').offsetWidth; $('#score').classList.add('score-pop');
  if (score > best) {
    best = score; $('#best').textContent = format(best);
    try { localStorage.setItem('wac-best', best); } catch {}
  }
}
function whack(h) {
  if (!playing) return;
  if (mode === 'bonus' && remaining() <= 0) { finishBonus(); return; }
  unlock(); swing();
  if (!h || h !== active) { tone(110, 65, .08, 'triangle', .07); return; }
  clearTimeout(timer);
  const bonus = mode === 'bonus';
  if (bonus) { bonusHits++; score += BONUS_VALUE; }
  else { regularHits++; score++; progress(); }
  updateScore(); hitSound();
  burst(h, bonus ? 'OVERTURNED! +3' : regularHits % 5 === 0 ? 'CONTEMPT! +1' : ['THWACK! +1', 'BONK! +1', 'OVERRULED! +1', 'WHAM! +1'][Math.floor(Math.random() * 4)]);
  hide(); h.classList.add('hit'); setTimeout(() => h.classList.remove('hit'), 260);
  $('#status').textContent = bonus ? `IMMUNITY OVERTURNED. +${bonusHits * BONUS_VALUE} BONUS POINTS.` : regularHits % 5 === 0 ? 'SUSTAINED. KEEP IT COMING.' : 'ONE POINT. NO APPEAL.';
  if (!bonus && regularHits % BONUS_EVERY === 0) beginBonusIntro();
  else cycle();
}
$('.grid').addEventListener('pointerdown', e => {
  const h = e.target.closest('.hole'); if (h) { e.preventDefault(); whack(h); }
});
$('.grid').addEventListener('click', e => {
  if (e.detail === 0) { const h = e.target.closest('.hole'); if (h) whack(h); }
});
document.addEventListener('keydown', e => {
  if (e.repeat || e.altKey || e.ctrlKey || e.metaKey) return;
  if (/^[1-9]$/.test(e.key) && playing) { e.preventDefault(); whack(holes[Number(e.key) - 1]); }
  if (e.key === 'Escape' && playing) pause();
});
const mallet = $('#mallet');
function swing() { mallet.classList.remove('swing'); void mallet.offsetWidth; mallet.classList.add('swing'); }
$('.arena').addEventListener('pointermove', e => {
  if (e.pointerType === 'touch') return;
  mallet.style.left = e.clientX + 'px'; mallet.style.top = e.clientY + 'px'; mallet.classList.add('visible');
});
$('.arena').addEventListener('pointerleave', () => mallet.classList.remove('visible'));
