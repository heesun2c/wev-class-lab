/* ============================================================
   Story Sequencing · Presentation Mode  v2
   Magic Tree House #2 — Chapters 1–2

   슬라이드 흐름 (라운드당):
     1. round-overview  — 라운드 소개
     2. cards           — 5개 카드 한 화면 (읽기 전용, 섞인 순서)
     3. sequence        — 제목+Key Phrase 카드에 순서 번호 배정
     4. answer          — 정답 공개 (내 선택 vs 정답)
     5. review × 5      — 장면별 원문 + Key Phrase + Clue 딥다이브
   ============================================================ */

const $ = id => document.getElementById(id);

// ── Speech ──────────────────────────────────────────────────
const speechOK = (typeof Speech !== 'undefined') && Speech.isSupported();
function stopAudio() { if (speechOK) Speech.stop(); }

// ── 상태 ────────────────────────────────────────────────────
const state = {
  curSlide : 0,
  slides   : [],
  // { sceneId: chosenOrder(1~5) }  — 라운드별로 독립
  answers  : {},
  // 라운드별 셔플 결과 저장 (cards/sequence 공유)
  shuffled : {},
};

// ── DOM ─────────────────────────────────────────────────────
const ctrlBar          = $('ctrlBar');
const presProgress     = $('presProgress');
const presProgressFill = $('presProgressFill');
const slideArea        = $('slideArea');
const slidesContainer  = $('slidesContainer');
const bottomCtrl       = $('bottomCtrl');
const titleScreen      = $('titleScreen');
const doneScreen       = $('doneScreen');
const btnNext          = $('btnNext');
const btnPrev          = $('btnPrev');
const stepInfo         = $('stepInfo');
const sceneCounter     = $('sceneCounter');
const roundBadge       = $('roundBadge');

// ── 유틸 ────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function audioAttr(text) {
  return speechOK
    ? `data-audio="${text.replace(/"/g, '&quot;').replace(/\n/g, ' ')}"`
    : '';
}

function audioBtn(text, label = '듣기', cls = 'sc-audio-btn') {
  if (!speechOK) return '';
  return `<button class="${cls}" ${audioAttr(text)} aria-label="${label}"><span>🔊</span> ${label}</button>`;
}

// ══════════════════════════════════════════════════════════
//  슬라이드 데이터 빌드
// ══════════════════════════════════════════════════════════
function buildSlideData() {
  state.slides  = [];
  state.answers = {};
  state.shuffled = {};

  GAME_DATA.rounds.forEach(round => {
    const scenes = getScenesByRound(round.id);
    // 라운드별 한 번만 셔플 (cards·sequence 동일 순서 공유)
    state.shuffled[round.id] = shuffle(scenes);

    state.slides.push({ type: 'round-overview', round });
    state.slides.push({ type: 'cards',          round, scenes: state.shuffled[round.id] });
    state.slides.push({ type: 'sequence',       round, scenes: state.shuffled[round.id] });
    state.slides.push({ type: 'answer',         round, scenes });

    const sorted = [...scenes].sort((a, b) => a.order - b.order);
    sorted.forEach(scene => {
      state.slides.push({ type: 'review', scene, round });
    });
  });

  state.slides.push({ type: 'done' });
}

// ══════════════════════════════════════════════════════════
//  슬라이드 HTML 빌더
// ══════════════════════════════════════════════════════════

// ── 1. Round Overview ───────────────────────────────────────
function buildRoundOverviewHTML({ round }) {
  const r = round.id;
  const tags = round.focus_tags.map(t => `<span class="pres-tag">${t}</span>`).join('');
  return `
    <div class="slide-inner slide-overview r${r}">
      <div class="ov-badge">Round ${r} of 3</div>
      <h2 class="ov-title">${round.title}</h2>
      <p class="ov-goal">${round.goal}</p>
      <div class="ov-tags">${tags}</div>
      <div class="ov-steps">
        <div class="ov-step"><span class="ov-step-num">1</span><span>5개 장면 카드 읽기</span></div>
        <div class="ov-step-arrow">→</div>
        <div class="ov-step"><span class="ov-step-num">2</span><span>순서 번호 배정</span></div>
        <div class="ov-step-arrow">→</div>
        <div class="ov-step"><span class="ov-step-num">3</span><span>정답 확인 &amp; 리뷰</span></div>
      </div>
      <div class="ov-hint">▶ 클릭하면 카드 읽기가 시작됩니다</div>
    </div>`;
}

// ── 2. Cards (5개 카드 한 화면) ─────────────────────────────
function buildCardsHTML({ round, scenes }) {
  const r = round.id;
  const labels = ['A', 'B', 'C', 'D', 'E'];
  const cards = scenes.map((scene, idx) => {
    const chunkHtml = scene.chunk.replace(/\n/g, '<br>');
    return `
      <div class="card-item r${r}-border">
        <div class="card-item-header">
          <span class="card-item-num r${r}-bg">${labels[idx]}</span>
        </div>
        <div class="card-item-chunk">${chunkHtml}</div>
        ${audioBtn(scene.chunk, '듣기', 'card-audio-btn')}
      </div>`;
  }).join('');

  return `
    <div class="slide-inner slide-cards">
      <div class="cards-header r${r}">
        <div class="cards-header-badge">Round ${r} · 읽기</div>
        <h2 class="cards-header-title">5개 장면을 읽어보세요</h2>
        <p class="cards-header-sub">순서는 섞여 있습니다. 먼저 각 카드를 읽고, 다음 단계에서 순서를 맞춰보세요.</p>
      </div>
      <div class="cards-grid">${cards}</div>
      <p class="cards-hint">▶ 다 읽었으면 클릭해서 순서 맞추기로 이동하세요</p>
    </div>`;
}

// ── 3. Sequence (순서 번호 배정) ────────────────────────────
function buildSequenceHTML({ round, scenes }) {
  const r = round.id;
  // 번호 배지 생성 (1~5, 배정 가능)
  const items = scenes.map(scene => {
    const sceneId = scene.id;
    return `
      <div class="seq-item" id="seqItem-${sceneId}">
        <div class="seq-item-body">
          <div class="seq-scene-title">${scene.scene_title}</div>
          <div class="seq-kp">"${scene.key_phrase}"</div>
        </div>
        <div class="seq-picker" id="seqPicker-${sceneId}">
          ${[1,2,3,4,5].map(n =>
            `<button class="seq-num-btn r${r}" data-scene-id="${sceneId}" data-order="${n}">${n}</button>`
          ).join('')}
        </div>
      </div>`;
  }).join('');

  return `
    <div class="slide-inner slide-sequence">
      <div class="seq-header r${r}">
        <div class="seq-header-badge">Round ${r} · 순서 맞추기</div>
        <h2 class="seq-header-title">각 장면의 순서를 선택하세요</h2>
        <p class="seq-header-sub">이야기에서 몇 번째에 해당하는 장면인지 번호를 눌러주세요.</p>
      </div>
      <div class="seq-list">${items}</div>
      <div class="seq-footer">
        <span class="seq-footer-info" id="seqFooterInfo">0 / 5 선택됨</span>
        <button class="seq-submit-btn r${r}-bg" id="seqSubmit" disabled>정답 확인 →</button>
      </div>
    </div>`;
}

// ── 4. Answer ───────────────────────────────────────────────
function buildAnswerHTML({ round, scenes }) {
  const r = round.id;
  const sorted = [...scenes].sort((a, b) => a.order - b.order);

  const rows = sorted.map(scene => {
    const correct = scene.order - (r - 1) * 5;
    const chosen  = state.answers[scene.id];
    const ok      = chosen === correct;
    const badge   = chosen != null
      ? `<span class="ans-badge ${ok ? 'correct' : 'wrong'}">${chosen}번 선택 → ${ok ? '✓ 정답' : `✗ 정답: ${correct}번`}</span>`
      : `<span class="ans-badge no-ans">미응답 → 정답: ${correct}번</span>`;
    return `
      <div class="ans-row ${ok ? 'correct' : 'wrong'}">
        <div class="ans-num r${r}-bg">${correct}</div>
        <div class="ans-body">
          <div class="ans-title">${scene.scene_title}</div>
          <div class="ans-kp">"${scene.key_phrase}"</div>
        </div>
        <div class="ans-result">${badge}</div>
      </div>`;
  }).join('');

  return `
    <div class="slide-inner slide-answer">
      <div class="ans-header r${r}">
        <div class="ans-header-badge">Round ${r} · 정답 공개</div>
        <h2 class="ans-header-title">이야기 순서 확인</h2>
      </div>
      <div class="ans-list">${rows}</div>
      <p class="ans-hint">▶ 클릭하면 각 장면 심화 리뷰를 시작합니다</p>
    </div>`;
}

// ── 5. Review ───────────────────────────────────────────────
function buildReviewHTML({ scene, round }) {
  const r = round.id;
  const correct   = scene.order - (r - 1) * 5;
  const chunkHtml = scene.chunk.replace(/\n/g, '<br>');

  return `
    <div class="slide-inner slide-review">
      <div class="rv-left r${r}">
        <div class="rv-order-badge">Scene ${correct} of 5</div>
        <div class="rv-scene-title">${scene.scene_title}</div>
        <div class="rv-kp-label">Key Expression</div>
        <div class="rv-kp">"${scene.key_phrase}"</div>
        ${audioBtn(scene.key_phrase, '🔊 듣기')}
        ${scene.support_phrase ? `<div class="rv-support">+ "${scene.support_phrase}"</div>` : ''}
        <div class="rv-clue-label">📌 Clue</div>
        <div class="rv-clue">${scene.clue_text}</div>
      </div>
      <div class="rv-right">
        <div class="rv-chunk-label">📄 Scene Summary</div>
        <div class="rv-chunk r${r}-border-left">${chunkHtml}</div>
        ${audioBtn(scene.chunk, '🔊 원문 듣기')}
        <div class="rv-why-label">🔗 Why here?</div>
        <div class="rv-why">${scene.why_here}</div>
        <div class="rv-retell-label">🗣 Retelling Prompt</div>
        <div class="rv-retell">${scene.retelling_prompt}</div>
      </div>
    </div>`;
}

// ── Done ────────────────────────────────────────────────────
function buildDoneHTML() {
  return `
    <div class="slide-inner slide-done">
      <div class="done-emoji">🏆</div>
      <h2 class="done-h2">Story Sequencing 완료!</h2>
      <p class="done-p">챕터 1–2의 전체 이야기를<br>함께 읽고 순서를 맞췄습니다.</p>
    </div>`;
}

// ══════════════════════════════════════════════════════════
//  슬라이드 DOM 빌드
// ══════════════════════════════════════════════════════════
function buildSlideEl(slide, idx) {
  const el = document.createElement('div');
  el.className   = 'pres-slide';
  el.dataset.idx = idx;
  switch (slide.type) {
    case 'round-overview': el.innerHTML = buildRoundOverviewHTML(slide); break;
    case 'cards':          el.innerHTML = buildCardsHTML(slide);         break;
    case 'sequence':       el.innerHTML = buildSequenceHTML(slide);      break;
    case 'answer':         el.innerHTML = buildAnswerHTML(slide);        break;
    case 'review':         el.innerHTML = buildReviewHTML(slide);        break;
    case 'done':           el.innerHTML = buildDoneHTML();               break;
  }
  return el;
}

function buildAllSlides() {
  slidesContainer.innerHTML = '';
  state.slides.forEach((slide, idx) => {
    slidesContainer.appendChild(buildSlideEl(slide, idx));
  });
}

// ══════════════════════════════════════════════════════════
//  화면 전환
// ══════════════════════════════════════════════════════════
function showUI() {
  titleScreen.style.display  = 'none';
  doneScreen.style.display   = 'none';
  ctrlBar.style.display      = 'flex';
  presProgress.style.display = 'block';
  slideArea.style.display    = 'flex';
  bottomCtrl.style.display   = 'flex';
}
function showTitle() {
  titleScreen.style.display  = 'flex';
  doneScreen.style.display   = 'none';
  ctrlBar.style.display      = 'none';
  presProgress.style.display = 'none';
  slideArea.style.display    = 'none';
  bottomCtrl.style.display   = 'none';
}
function showDone() {
  titleScreen.style.display  = 'none';
  doneScreen.style.display   = 'flex';
  ctrlBar.style.display      = 'none';
  presProgress.style.display = 'none';
  slideArea.style.display    = 'none';
  bottomCtrl.style.display   = 'none';
}

// ══════════════════════════════════════════════════════════
//  렌더
// ══════════════════════════════════════════════════════════
function renderSlide() {
  document.querySelectorAll('.pres-slide').forEach(el => el.classList.remove('active'));
  const curEl = document.querySelector(`.pres-slide[data-idx="${state.curSlide}"]`);
  if (curEl) curEl.classList.add('active');

  const slide = state.slides[state.curSlide];
  if (!slide) return;

  if (slide.type === 'done') { showDone(); return; }

  updateCtrlBar(slide);
  updateBottomBar(slide);

  const pct = Math.round((state.curSlide / (state.slides.length - 1)) * 100);
  presProgressFill.style.width = pct + '%';
}

// ── Ctrl Bar 업데이트 ───────────────────────────────────────
function updateCtrlBar(slide) {
  const r = slide.round?.id;
  const rLabels  = { 1: 'Round 1 · Recall', 2: 'Round 2 · Movement', 3: 'Round 3 · Magic' };
  const rClasses = { 1: 'rbr1', 2: 'rbr2', 3: 'rbr3' };

  roundBadge.textContent = r ? rLabels[r] : '완료';
  roundBadge.className   = 'round-badge-bar ' + (r ? rClasses[r] : '');

  const typeLabels = {
    'round-overview': 'Overview',
    'cards':          '읽기',
    'sequence':       '순서 맞추기',
    'answer':         '정답 공개',
    'review':         '',
    'done':           '',
  };

  if (slide.type === 'review' && r) {
    const rRevs = state.slides.filter(s => s.type === 'review' && s.round?.id === r);
    const pos   = rRevs.findIndex(s => s.scene?.id === slide.scene?.id) + 1;
    sceneCounter.textContent = `Review ${pos} / 5`;
  } else {
    sceneCounter.textContent = typeLabels[slide.type] ?? '';
  }

  // 상단 오디오 버튼
  const audioBtn = $('btnAudioChunk');
  if (speechOK && (slide.type === 'review')) {
    audioBtn.style.display = 'block';
    audioBtn.dataset.audio = slide.scene.chunk.replace(/\n/g, ' ');
  } else {
    audioBtn.style.display = 'none';
    delete audioBtn.dataset.audio;
  }
}

// ── Bottom Bar 업데이트 ─────────────────────────────────────
function updateBottomBar(slide) {
  btnPrev.disabled = state.curSlide === 0;
  const isLastReview = state.curSlide === state.slides.length - 2;

  const map = {
    'round-overview': ['▶ 클릭하면 카드 읽기가 시작됩니다', '카드 읽기 →'],
    'cards':          ['5개 장면을 모두 읽은 후 다음으로 넘어가세요', '순서 맞추기 →'],
    'sequence':       ['각 장면에 순서 번호를 모두 선택하세요', ''],
    'answer':         ['▶ 클릭하면 장면별 리뷰를 시작합니다', '리뷰 →'],
    'review':         ['핵심 표현과 단서를 확인하세요', isLastReview ? '✓ 완료' : '다음 →'],
  };
  const [info, next] = map[slide.type] || ['', '다음 →'];
  stepInfo.textContent = info;

  // sequence 슬라이드는 "정답 확인" 버튼이 슬라이드 안에 있으므로
  // 하단 next 버튼은 비활성
  if (slide.type === 'sequence') {
    btnNext.textContent = '정답 확인 →';
    btnNext.disabled    = true;  // seqSubmit 버튼이 활성화되면 같이 바뀜
  } else {
    btnNext.textContent = next;
    btnNext.disabled    = false;
  }
}

// ══════════════════════════════════════════════════════════
//  네비게이션
// ══════════════════════════════════════════════════════════
function goNext() {
  stopAudio();
  if (state.curSlide >= state.slides.length - 1) { showDone(); return; }
  state.curSlide++;
  // answer 슬라이드 진입 시 최신 answers 반영해 재생성
  if (state.slides[state.curSlide].type === 'answer') {
    rebuildSlide(state.curSlide);
  }
  renderSlide();
}
function goPrev() {
  stopAudio();
  if (state.curSlide > 0) { state.curSlide--; renderSlide(); }
}

function rebuildSlide(idx) {
  const slide = state.slides[idx];
  const el    = document.querySelector(`.pres-slide[data-idx="${idx}"]`);
  if (!el) return;
  switch (slide.type) {
    case 'answer':   el.innerHTML = buildAnswerHTML(slide);   break;
    case 'sequence': el.innerHTML = buildSequenceHTML(slide); break;
  }
}

// ══════════════════════════════════════════════════════════
//  Sequence 슬라이드 — 선택 로직
// ══════════════════════════════════════════════════════════
function handleSeqBtn(btn) {
  const sceneId = btn.dataset.sceneId;
  const chosen  = parseInt(btn.dataset.order);
  const slide   = state.slides[state.curSlide];
  if (slide?.type !== 'sequence') return;

  const r = slide.round.id;

  // 같은 장면 내 다른 버튼 선택 해제
  const picker = $(`seqPicker-${sceneId}`);
  if (picker) {
    picker.querySelectorAll('.seq-num-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  }

  // 상태 저장
  state.answers[sceneId] = chosen;

  // 선택 카운트 업데이트
  const scenes       = slide.scenes;
  const selectedCount = scenes.filter(sc => state.answers[sc.id] != null).length;
  const footerInfo   = $('seqFooterInfo');
  const submitBtn    = $('seqSubmit');
  if (footerInfo) footerInfo.textContent = `${selectedCount} / 5 선택됨`;
  if (submitBtn) {
    const allDone = selectedCount === 5;
    submitBtn.disabled = !allDone;
    // 하단 next 버튼도 동기화
    btnNext.disabled   = !allDone;
  }
}

// ══════════════════════════════════════════════════════════
//  클릭 이벤트 (단일 위임)
// ══════════════════════════════════════════════════════════
slideArea.addEventListener('click', e => {

  // ① 오디오
  const audioEl = e.target.closest('[data-audio]');
  if (audioEl && speechOK) {
    Speech.play(audioEl.dataset.audio, audioEl);
    return;
  }

  // ② sequence 번호 버튼
  const seqBtn = e.target.closest('.seq-num-btn');
  if (seqBtn) { handleSeqBtn(seqBtn); return; }

  // ③ sequence 정답 확인 버튼
  const submitBtn = e.target.closest('#seqSubmit');
  if (submitBtn && !submitBtn.disabled) { goNext(); return; }

  // ④ sequence 슬라이드 — 배경 클릭 무시 (버튼 조작 중)
  const slide = state.slides[state.curSlide];
  if (slide?.type === 'sequence') return;

  // ⑤ 그 외 → 다음 슬라이드
  goNext();
});

// ══════════════════════════════════════════════════════════
//  전역 이벤트
// ══════════════════════════════════════════════════════════
$('btnStart').addEventListener('click', () => {
  buildSlideData();
  buildAllSlides();
  state.curSlide = 0;
  showUI();
  renderSlide();
});

btnNext.addEventListener('click', () => {
  // sequence 슬라이드에서는 seqSubmit 역할
  const slide = state.slides[state.curSlide];
  if (slide?.type === 'sequence' && !btnNext.disabled) { goNext(); return; }
  goNext();
});
btnPrev.addEventListener('click', goPrev);

$('btnHome').addEventListener('click', () => {
  if (confirm('처음 화면으로 돌아갈까요?')) { stopAudio(); showTitle(); }
});
$('btnRestart').addEventListener('click', showTitle);

// 상단 오디오 버튼
$('btnAudioChunk').addEventListener('click', e => {
  if (!speechOK) return;
  const text = e.currentTarget.dataset.audio;
  if (text) Speech.play(text, e.currentTarget);
});

// 키보드
document.addEventListener('keydown', e => {
  if (titleScreen.style.display !== 'none') return;
  if (doneScreen.style.display  !== 'none') return;
  const slide = state.slides[state.curSlide];
  if (slide?.type === 'sequence') return; // 순서 맞추기 중 키 이동 방지
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
  if (e.key === 'ArrowLeft')                   { e.preventDefault(); goPrev(); }
});

// ── 초기화 ─────────────────────────────────────────────────
showTitle();
