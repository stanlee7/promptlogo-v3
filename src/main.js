/**
 * PromptLogo v3 - 메인 앱
 * 7 로고 유형 (dual input), 업종 프리셋, 스타일 태그, --no 파라미터, 목업 프롬프트
 */

import './style.css';
import { logoTypes, industryPresets, styleTags, midjourneyNoParams, mockupPrompts, bestPresets, dualInputCombos } from './data.js';
import { buildPrompt, buildPromptHTML } from './promptBuilder.js';
import { isAvailable, enhanceConcept, suggestConcepts } from './ai.js';

const state = {
  logoType: 'symbol',
  industry: null,
  input1: '',
  input2: '',
  selectedStyles: new Set(),
  platform: 'midjourney',
  selectedNoParams: new Set(['text']),
  aiCore: '',       // AI가 생성한 영어 코어 컨셉 (있으면 템플릿 대신 사용)
  aiCoreKey: '',    // aiCore가 생성된 시점의 입력 키 — 바뀌면 자동 무효화
};

let els = {};

function init() {
  renderApp();
  bindElements();
  bindEvents();
  updatePrompt();
  detectLocalAI();
}

// Ollama(로컬 Gemma)가 감지되면 AI 패널 노출, 아니면 숨김 유지
async function detectLocalAI() {
  try {
    if (await isAvailable() && els.aiPanel) {
      els.aiPanel.hidden = false;
    }
  } catch {
    /* 미감지 시 조용히 무시 */
  }
}

function renderApp() {
  document.querySelector('#app').innerHTML = `
    <div class="container">
      <!-- 헤더 -->
      <header class="header">
        <div class="logo-mark">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="url(#grad)" stroke-width="2"/>
            <path d="M10 16 L16 10 L22 16 L16 22 Z" stroke="url(#grad)" stroke-width="2" fill="none"/>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stop-color="#a78bfa"/>
                <stop offset="100%" stop-color="#60a5fa"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <h1>PromptLogo</h1>
          <p class="subtitle">한글로 선택하면, AI 로고 프롬프트가 완성됩니다</p>
        </div>
      </header>

      <!-- CHAT KEY: 원클릭 치트키 -->
      <section class="section cheat-section">
        <div class="section-header">
          <span class="step-badge cheat-badge">✨</span>
          <h2>베스트셀러 원클릭 치트키 <span class="badge-nano">강력 추천</span></h2>
        </div>
        <p class="section-desc">무엇을 만들지 막막하다면, 가장 잘 팔리는 형태를 원클릭으로 세팅하세요!</p>
        <div id="cheat-container" class="cheat-grid">
          ${bestPresets.map(c => `
            <button class="cheat-card" data-id="${c.id}">
              <span class="cheat-icon">${c.icon}</span>
              <div class="cheat-text">
                <span class="cheat-name">${c.ko}</span>
                <span class="cheat-desc">${c.desc}</span>
              </div>
            </button>
          `).join('')}
        </div>
      </section>

      <!-- 작업 영역: 좌(선택) / 우(결과 고정) 2단 -->
      <div class="workspace">
        <div class="controls-col">

      <!-- STEP 1: 로고 유형 -->
      <section class="section">
        <div class="section-header">
          <span class="step-badge">1</span>
          <h2>로고 유형을 선택하세요</h2>
        </div>
        <p class="section-desc">만들고 싶은 로고의 형태를 선택하세요</p>
        <div id="logo-type-container" class="logo-type-grid"></div>
      </section>

      <!-- STEP 2: 업종 프리셋 -->
      <section class="section">
        <div class="section-header">
          <span class="step-badge">2</span>
          <h2>업종을 선택하세요 <span class="optional">(선택사항)</span></h2>
        </div>
        <p class="section-desc">업종을 선택하면 추천 키워드와 스타일이 자동으로 세팅됩니다</p>
        <div id="industry-container" class="industry-grid">
          ${industryPresets.map(p => `
            <button class="industry-card" data-id="${p.id}">
              <span class="industry-icon">${p.icon}</span>
              <span class="industry-name">${p.ko}</span>
            </button>
          `).join('')}
        </div>
      </section>

      <!-- STEP 3: 대상 입력 (동적) -->
      <section class="section">
        <div class="section-header">
          <span class="step-badge">3</span>
          <h2>만들고 싶은 로고를 입력하세요</h2>
        </div>
        <div id="input-area"></div>
        <div class="suggested-section">
          <p class="suggested-label">💡 추천 키워드를 클릭하면 자동 입력됩니다</p>
          <div id="suggested-container" class="suggested-container"></div>
        </div>
      </section>

      <!-- STEP 4: 스타일 -->
      <section class="section">
        <div class="section-header">
          <span class="step-badge">4</span>
          <h2>스타일을 선택하세요 <span class="optional">(선택사항)</span></h2>
        </div>
        <p class="section-desc">원하는 느낌을 클릭하면 프롬프트에 자동으로 추가됩니다</p>
        <div id="style-container" class="style-container"></div>
      </section>

        </div><!-- /controls-col -->

        <div class="result-col">
      <!-- STEP 5: 프롬프트 출력 (고정 결과) -->
      <section class="section output-section">
        <div class="section-header">
          <span class="step-badge">5</span>
          <h2>완성된 프롬프트</h2>
          <span class="live-badge"><span class="live-dot"></span>실시간</span>
        </div>
        <div class="platform-tabs" id="platform-tabs">
          <button class="platform-tab active" data-platform="midjourney">
            <span class="tab-icon">🎨</span> Midjourney
          </button>
          <button class="platform-tab" data-platform="gpt">
            <span class="tab-icon">🤖</span> GPT
          </button>
          <button class="platform-tab" data-platform="nanobanana">
            <span class="tab-icon">🍌</span> 나노바나나
          </button>
        </div>
        <div id="no-params-section" class="no-params-section visible">
          <p class="no-params-label">🚫 제외할 요소 (Midjourney --no)</p>
          <div id="no-params-container" class="no-params-container">
            ${midjourneyNoParams.map(p => `
              <label class="no-param-item">
                <input type="checkbox" data-value="${p.value}" ${p.id === 'no_text' ? 'checked' : ''} />
                <span>${p.ko}</span>
              </label>
            `).join('')}
          </div>
        </div>
        <div class="prompt-output-wrapper">
          <div id="prompt-output-html" class="prompt-output"></div>
          <textarea id="prompt-output" class="prompt-output-hidden" readonly></textarea>
          <button id="copy-btn" class="copy-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            복사하기
          </button>
        </div>

        <!-- 로컬 AI (Gemma3) 패널 — Ollama 감지 시에만 표시 -->
        <div id="ai-panel" class="ai-panel" hidden>
          <div class="ai-actions">
            <button id="ai-enhance-btn" class="ai-btn ai-enhance">
              ✨ AI 강화 <span class="ai-sub">대상 맞춤 메타포로 재작성</span>
            </button>
            <button id="ai-idea-btn" class="ai-btn ai-idea">
              💡 AI 아이디어 <span class="ai-sub">시각 컨셉 3개 제안</span>
            </button>
            <button id="ai-reset-btn" class="ai-btn ai-reset" hidden>↩ 원래대로</button>
            <span class="ai-badge-local">🖥️ 로컬 Gemma3 · 무료</span>
          </div>
          <div id="ai-ideas" class="ai-ideas"></div>
        </div>
      </section>
        </div><!-- /result-col -->
      </div><!-- /workspace -->

      <!-- STEP 6: 목업 프롬프트 -->
      <section class="section mockup-section">
        <div class="section-header">
          <span class="step-badge mockup-badge">✨</span>
          <h2>로고 목업 프롬프트 <span class="badge-nano">나노바나나</span></h2>
        </div>
        <p class="section-desc">완성된 로고 이미지를 고급 목업에 합성해보세요. 나노바나나에 붙여넣기하세요!</p>
        <div id="mockup-container" class="mockup-grid"></div>
      </section>

      <footer class="footer">
        <p>PromptLogo — 한글 미니멀 로고 프롬프트 생성기</p>
        <p class="footer-sub">API 없이 동작합니다. 프롬프트를 복사해서 AI 도구에 붙여넣기하세요.</p>
      </footer>

      <div id="toast" class="toast">✅ 클립보드에 복사되었습니다!</div>
    </div>
  `;
}

function bindElements() {
  els = {
    logoTypeContainer: document.getElementById('logo-type-container'),
    industryContainer: document.getElementById('industry-container'),
    inputArea: document.getElementById('input-area'),
    suggestedContainer: document.getElementById('suggested-container'),
    styleContainer: document.getElementById('style-container'),
    platformTabs: document.getElementById('platform-tabs'),
    noParamsSection: document.getElementById('no-params-section'),
    noParamsContainer: document.getElementById('no-params-container'),
    promptOutput: document.getElementById('prompt-output'),
    promptOutputHTML: document.getElementById('prompt-output-html'),
    copyBtn: document.getElementById('copy-btn'),
    mockupContainer: document.getElementById('mockup-container'),
    toast: document.getElementById('toast'),
    cheatContainer: document.getElementById('cheat-container'),
    aiPanel: document.getElementById('ai-panel'),
    aiEnhanceBtn: document.getElementById('ai-enhance-btn'),
    aiIdeaBtn: document.getElementById('ai-idea-btn'),
    aiResetBtn: document.getElementById('ai-reset-btn'),
    aiIdeas: document.getElementById('ai-ideas'),
  };

  renderLogoTypes();
  renderInputArea();
  renderStyleTags();
  renderSuggestedKeywords();
  renderMockups();
}

// ============= 로고 유형 렌더링 =============
function renderLogoTypes() {
  els.logoTypeContainer.innerHTML = logoTypes.map(type => `
    <button class="logo-type-card ${type.id === state.logoType ? 'active' : ''}" data-type="${type.id}">
      <span class="type-icon">${type.icon}</span>
      <span class="type-name">${type.ko}</span>
      <span class="type-desc">${type.desc}</span>
      <span class="type-example">${type.example}</span>
    </button>
  `).join('');
}

// ============= 동적 입력 영역 =============
function renderInputArea() {
  const lt = logoTypes.find(t => t.id === state.logoType) || logoTypes[0];

  if (lt.inputMode === 'dual') {
    const combos = dualInputCombos[lt.id] || [];
    els.inputArea.innerHTML = `
      <p class="section-desc input-warning-text">💡 <strong>주의:</strong> 문장보다는 '사과', '열쇠'처럼 단어로 짧게 입력해야 더 깔끔하게 나옵니다!</p>
      <div class="dual-input-grid">
        <div class="dual-input-col">
          <label class="input-label">${lt.inputLabel1}</label>
          <div class="input-wrapper">
            <input type="text" id="input1" class="subject-input" 
              placeholder="${lt.inputPlaceholder1}" autocomplete="off" spellcheck="false" 
              value="${state.input1}" />
          </div>
        </div>
        <span class="dual-input-plus">+</span>
        <div class="dual-input-col">
          <label class="input-label">${lt.inputLabel2}</label>
          <div class="input-wrapper">
            <input type="text" id="input2" class="subject-input" 
              placeholder="${lt.inputPlaceholder2}" autocomplete="off" spellcheck="false" 
              value="${state.input2}" />
          </div>
        </div>
      </div>
      ${combos.length > 0 ? `
      <div class="dual-combo-section">
        <p class="combo-title">💡 인기 꿀조합 자판기</p>
        <div class="combo-grid">
          ${combos.map((c, i) => `
            <button class="combo-btn" data-i1="${c.i1}" data-i2="${c.i2}">${c.label}</button>
          `).join('')}
        </div>
      </div>
      ` : ''}
    `;
  } else {
    els.inputArea.innerHTML = `
      <p class="section-desc input-warning-text">💡 <strong>주의:</strong> 문장보다는 단어('고양이', '커피잔')로 짧게 입력해야 더 깔끔하게 나옵니다!</p>
      <div class="input-wrapper">
        <input type="text" id="input1" class="subject-input" 
          placeholder="${lt.inputPlaceholder}" autocomplete="off" spellcheck="false" 
          value="${state.input1}" />
        <button id="clear-btn" class="clear-btn" title="지우기">✕</button>
      </div>
    `;
  }

  // 이벤트 재바인딩
  const input1 = document.getElementById('input1');
  const input2 = document.getElementById('input2');
  const clearBtn = document.getElementById('clear-btn');

  if (input1) {
    input1.addEventListener('input', (e) => {
      state.input1 = e.target.value;
      updatePrompt();
    });
  }
  if (input2) {
    input2.addEventListener('input', (e) => {
      state.input2 = e.target.value;
      updatePrompt();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      state.input1 = '';
      state.input2 = '';
      if (input1) input1.value = '';
      if (input2) input2.value = '';
      input1?.focus();
      updatePrompt();
    });
  }
}

// ============= 스타일 태그 =============
function renderStyleTags() {
  const groups = { shape: '형태', stroke: '선 굵기', mood: '느낌', variant: '형태 변형' };
  let html = '';
  for (const [gId, gLabel] of Object.entries(groups)) {
    const tags = styleTags.filter(t => t.group === gId);
    if (!tags.length) continue;
    html += `<div class="style-group">
      <span class="style-group-label">${gLabel}</span>
      <div class="style-group-tags">
        ${tags.map(tag => `
          <button class="style-tag" data-id="${tag.id}" data-en="${tag.en}">
            <span class="tag-icon">${tag.icon}</span>
            <div class="tag-text-group">
              <span class="tag-ko">${tag.ko}</span>
              <span class="tag-en">${tag.en}</span>
            </div>
          </button>
        `).join('')}
      </div>
    </div>`;
  }
  els.styleContainer.innerHTML = html;
}

// ============= 추천 키워드 =============
function renderSuggestedKeywords(filterIndustry = null) {
  let presets = filterIndustry
    ? industryPresets.filter(p => p.id === filterIndustry)
    : industryPresets;

  els.suggestedContainer.innerHTML = presets.map(cat => `
    <div class="keyword-category">
      <span class="category-label">${cat.icon} ${cat.ko}</span>
      <div class="keyword-items">
        ${cat.keywords.map(item => `
          <button class="keyword-btn" data-ko="${item.ko}" data-en="${item.en}">${item.ko}</button>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ============= 목업 프롬프트 렌더링 =============
function renderMockups() {
  els.mockupContainer.innerHTML = mockupPrompts.map(m => `
    <div class="mockup-card" data-id="${m.id}">
      <div class="mockup-card-header">
        <span class="mockup-icon">${m.icon}</span>
        <div>
          <span class="mockup-name">${m.ko}</span>
          <span class="mockup-desc">${m.desc}</span>
        </div>
      </div>
      <div class="mockup-prompt-preview">${m.prompt.substring(0, 80)}...</div>
      <button class="mockup-copy-btn" data-prompt="${encodeURIComponent(m.prompt)}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        복사
      </button>
    </div>
  `).join('');
}

// ============= 이벤트 바인딩 =============
function bindEvents() {
  // 로고 유형
  els.logoTypeContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.logo-type-card');
    if (!card) return;
    els.logoTypeContainer.querySelectorAll('.logo-type-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    state.logoType = card.dataset.type;
    state.input1 = '';
    state.input2 = '';
    renderInputArea();
    updatePrompt();
  });

  // 업종 프리셋
  els.industryContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.industry-card');
    if (!card) return;
    const id = card.dataset.id;
    if (state.industry === id) {
      state.industry = null;
      card.classList.remove('active');
      clearAutoStyles();
      renderSuggestedKeywords();
    } else {
      els.industryContainer.querySelectorAll('.industry-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.industry = id;
      applyIndustryPreset(id);
      renderSuggestedKeywords(id);
    }
    updatePrompt();
  });

  // 스타일 태그 (상호 배타적 선택: 같은 그룹이면 기존 것 해제)
  els.styleContainer.addEventListener('click', (e) => {
    const tag = e.target.closest('.style-tag');
    if (!tag) return;
    const id = tag.dataset.id;
    const tagData = styleTags.find(t => t.id === id);
    if (!tagData) return;

    if (state.selectedStyles.has(id)) {
      state.selectedStyles.delete(id);
      tag.classList.remove('active');
    } else {
      // 같은 그룹의 다른 태그 모두 해제 (가드레일)
      const sameGroupTags = styleTags.filter(t => t.group === tagData.group);
      sameGroupTags.forEach(sg => {
        if (state.selectedStyles.has(sg.id)) {
          state.selectedStyles.delete(sg.id);
          const el = els.styleContainer.querySelector(`[data-id="${sg.id}"]`);
          if (el) el.classList.remove('active');
        }
      });
      state.selectedStyles.add(id);
      tag.classList.add('active');
    }
    updatePrompt();
  });

  // 추천 키워드
  els.suggestedContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.keyword-btn');
    if (!btn) return;
    const input1El = document.getElementById('input1');
    state.input1 = btn.dataset.en;
    if (input1El) input1El.value = btn.dataset.ko;
    updatePrompt();
    btn.classList.add('clicked');
    setTimeout(() => btn.classList.remove('clicked'), 300);
  });

  // 플랫폼 탭
  els.platformTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.platform-tab');
    if (!tab) return;
    els.platformTabs.querySelectorAll('.platform-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    state.platform = tab.dataset.platform;
    els.noParamsSection.classList.toggle('visible', state.platform === 'midjourney');
    updatePrompt();
  });

  // --no 파라미터
  els.noParamsContainer.addEventListener('change', (e) => {
    if (e.target.type !== 'checkbox') return;
    if (e.target.checked) state.selectedNoParams.add(e.target.dataset.value);
    else state.selectedNoParams.delete(e.target.dataset.value);
    updatePrompt();
  });

  // 로고 프롬프트 복사
  els.copyBtn.addEventListener('click', () => copyText(els.promptOutput.value));

  // 목업 프롬프트 복사
  els.mockupContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.mockup-copy-btn');
    if (!btn) return;
    copyText(decodeURIComponent(btn.dataset.prompt));
  });

  // 치트키 (원클릭 세팅)
  els.cheatContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.cheat-card');
    if (!btn) return;
    const cheat = bestPresets.find(c => c.id === btn.dataset.id);
    if (!cheat) return;

    // 로고 타입 변경
    els.logoTypeContainer.querySelectorAll('.logo-type-card').forEach(c => c.classList.remove('active'));
    const tCard = els.logoTypeContainer.querySelector(`[data-type="${cheat.logoType}"]`);
    if (tCard) tCard.classList.add('active');
    state.logoType = cheat.logoType;
    state.input1 = '';
    state.input2 = '';

    // 업종 및 스타일 세팅 (업종 해제 후 재적용)
    state.industry = null;
    els.industryContainer.querySelectorAll('.industry-card').forEach(c => c.classList.remove('active'));
    const iCard = els.industryContainer.querySelector(`[data-id="${cheat.industry}"]`);
    if (iCard) {
      iCard.classList.add('active');
      state.industry = cheat.industry;
      clearAutoStyles();
      // 치트키에 지정된 스타일 강제 적용
      cheat.styles.forEach(sId => {
        state.selectedStyles.add(sId);
        const sEl = els.styleContainer.querySelector(`[data-id="${sId}"]`);
        if (sEl) sEl.classList.add('active');
      });
      renderSuggestedKeywords(cheat.industry);
    }

    // UI 재렌더링
    renderInputArea();
    updatePrompt();
    showToastMsg('✨ 치트키 자동 세팅 완료! 글자만 수정하세요.');

    // 스크롤 이동
    els.inputArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // 꿀조합 자판기 (동적 생성되므로 inputArea 내의 이벤트 델리게이션)
  els.inputArea.addEventListener('click', (e) => {
    const comboBtn = e.target.closest('.combo-btn');
    if (!comboBtn) return;

    state.input1 = comboBtn.dataset.i1;
    state.input2 = comboBtn.dataset.i2;
    document.getElementById('input1').value = comboBtn.dataset.i1;
    document.getElementById('input2').value = comboBtn.dataset.i2;

    updatePrompt();
    comboBtn.classList.add('clicked');
    setTimeout(() => comboBtn.classList.remove('clicked'), 300);
  });

  bindAiEvents();
}

// ============= 로컬 AI (Gemma3) =============
function logoTypeKo() {
  return (logoTypes.find(t => t.id === state.logoType) || logoTypes[0]).ko;
}

function requireSubject() {
  const lt = logoTypes.find(t => t.id === state.logoType) || logoTypes[0];
  if (!state.input1.trim()) {
    showToastMsg('⚠️ 먼저 로고 대상을 입력하세요');
    return false;
  }
  if (lt.inputMode === 'dual' && !state.input2.trim()) {
    showToastMsg('⚠️ 두 번째 입력란도 채워주세요');
    return false;
  }
  return true;
}

function setAiLoading(btn, on, label) {
  if (!btn) return;
  if (on) {
    btn.dataset.html = btn.innerHTML;
    btn.disabled = true;
    btn.classList.add('loading');
    btn.innerHTML = `<span class="ai-spinner"></span> ${label}`;
  } else {
    btn.disabled = false;
    btn.classList.remove('loading');
    if (btn.dataset.html) btn.innerHTML = btn.dataset.html;
  }
}

function clearAiIdeasSelection() {
  els.aiIdeas?.querySelectorAll('.ai-idea-card.selected')
    .forEach(c => c.classList.remove('selected'));
}

function applyAiCore(coreEn) {
  state.aiCore = coreEn;
  state.aiCoreKey = currentInputKey();
  updatePrompt();
}

function bindAiEvents() {
  // ✨ AI 강화: 현재 대상에 맞는 창의적 컨셉으로 재작성
  els.aiEnhanceBtn?.addEventListener('click', async () => {
    if (!requireSubject()) return;
    setAiLoading(els.aiEnhanceBtn, true, 'Gemma 생각 중…');
    try {
      const core = await enhanceConcept({
        subject1: state.input1.trim(),
        subject2: state.input2.trim(),
        logoTypeId: state.logoType,
        logoTypeKo: logoTypeKo(),
      });
      if (!core) throw new Error('empty');
      applyAiCore(core);
      showToastMsg('✨ AI 강화 완료! 프롬프트가 업데이트됐어요');
    } catch {
      showToastMsg('⚠️ AI 호출 실패 (Ollama 확인)');
    } finally {
      setAiLoading(els.aiEnhanceBtn, false);
    }
  });

  // 💡 AI 아이디어: 시각 메타포 3개 제안
  els.aiIdeaBtn?.addEventListener('click', async () => {
    if (!requireSubject()) return;
    setAiLoading(els.aiIdeaBtn, true, 'Gemma 발상 중…');
    els.aiIdeas.innerHTML = '';
    try {
      const ideas = await suggestConcepts({
        subject1: state.input1.trim(),
        subject2: state.input2.trim(),
        logoTypeKo: logoTypeKo(),
      });
      if (!ideas.length) throw new Error('empty');
      renderAiIdeas(ideas);
    } catch {
      showToastMsg('⚠️ AI 호출 실패 (Ollama 확인)');
    } finally {
      setAiLoading(els.aiIdeaBtn, false);
    }
  });

  // ↩ 원래대로: 템플릿 컨셉으로 복귀
  els.aiResetBtn?.addEventListener('click', () => {
    state.aiCore = '';
    state.aiCoreKey = '';
    clearAiIdeasSelection();
    updatePrompt();
    showToastMsg('↩ 기본 프롬프트로 되돌렸어요');
  });

  // 아이디어 카드 클릭 → 프롬프트에 반영
  els.aiIdeas?.addEventListener('click', (e) => {
    const card = e.target.closest('.ai-idea-card');
    if (!card) return;
    clearAiIdeasSelection();
    card.classList.add('selected');
    applyAiCore(decodeURIComponent(card.dataset.en));
    showToastMsg('💡 아이디어 반영 완료!');
  });
}

function renderAiIdeas(ideas) {
  els.aiIdeas.innerHTML = ideas.map((it, i) => `
    <button class="ai-idea-card" data-en="${encodeURIComponent(it.en || '')}">
      <span class="ai-idea-num">${i + 1}</span>
      <div class="ai-idea-text">
        <span class="ai-idea-ko">${it.ko || ''}</span>
        <span class="ai-idea-en">${it.en || ''}</span>
      </div>
    </button>
  `).join('');
}

function applyIndustryPreset(industryId) {
  const preset = industryPresets.find(p => p.id === industryId);
  if (!preset) return;
  clearAutoStyles();
  preset.autoStyles.forEach(sId => {
    state.selectedStyles.add(sId);
    const el = els.styleContainer.querySelector(`[data-id="${sId}"]`);
    if (el) el.classList.add('active');
  });
}

function clearAutoStyles() {
  state.selectedStyles.clear();
  els.styleContainer.querySelectorAll('.style-tag').forEach(t => t.classList.remove('active'));
}

function currentInputKey() {
  return `${state.logoType}|${state.input1.trim()}|${state.input2.trim()}`;
}

function updatePrompt() {
  // 대상/유형이 바뀌면 AI 강화 컨셉은 자동 무효화 (스타일·플랫폼 변경은 유지)
  if (state.aiCore && state.aiCoreKey !== currentInputKey()) {
    state.aiCore = '';
    state.aiCoreKey = '';
    clearAiIdeasSelection();
  }
  if (els.aiResetBtn) els.aiResetBtn.hidden = !state.aiCore;

  const selectedStyleEn = [];
  state.selectedStyles.forEach(id => {
    const tag = styleTags.find(t => t.id === id);
    if (tag) selectedStyleEn.push(tag.en);
  });

  const noParams = state.platform === 'midjourney' ? [...state.selectedNoParams] : [];
  const plain = buildPrompt(state.input1, state.input2, selectedStyleEn, state.platform, state.logoType, noParams, state.aiCore);
  els.promptOutput.value = plain;

  const html = buildPromptHTML(state.input1, state.input2, selectedStyleEn, state.platform, state.logoType, noParams, state.aiCore);
  els.promptOutputHTML.innerHTML = html;
}

async function copyText(text) {
  if (!text || text.includes('입력해주세요') || text.includes('채워주세요')) return;
  try {
    await navigator.clipboard.writeText(text);
    showToastMsg();
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToastMsg();
  }
}

function showToastMsg(msg = '✅ 클립보드에 복사되었습니다!') {
  els.toast.textContent = msg;
  els.toast.classList.add('show');
  setTimeout(() => els.toast.classList.remove('show'), 2000);
}

document.addEventListener('DOMContentLoaded', init);
