/**
 * 로컬 AI (Ollama + Gemma3) 연동 모듈
 *
 * - 브라우저에서 직접 Ollama(localhost:11434)를 호출합니다.
 * - 로컬 `npm run dev` 환경 + Ollama 실행 시에만 동작하며,
 *   미설치/미실행/CORS 차단 시 isAvailable()이 false를 반환해 기능이 자동 숨김됩니다.
 * - CORS로 막히면 Ollama를 OLLAMA_ORIGINS=* 로 재실행하세요.
 */

import { translateSubject } from './promptBuilder.js';

const OLLAMA_URL = 'http://localhost:11434';
const MODEL = 'gemma3:4b-it-qat';

/** 한글 대상을 "한글 / 영어" 힌트 문자열로 (4b 모델 주제 고정용) */
function subjectHint(subject1, subject2) {
    const ko = [subject1, subject2].filter(Boolean).join(' + ');
    const en = [subject1, subject2].filter(Boolean).map(translateSubject).join(' + ');
    return en && en !== ko ? `${ko} / ${en}` : ko;
}

/** 타임아웃이 있는 fetch */
async function fetchWithTimeout(url, options = {}, ms = 60000) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    try {
        return await fetch(url, { ...options, signal: ctrl.signal });
    } finally {
        clearTimeout(timer);
    }
}

/** Ollama가 켜져 있고 gemma3 모델이 있는지 확인 (실패해도 조용히 false) */
export async function isAvailable() {
    try {
        const res = await fetchWithTimeout(`${OLLAMA_URL}/api/tags`, {}, 2000);
        if (!res.ok) return false;
        const data = await res.json();
        return (data.models || []).some(m => (m.name || '').startsWith('gemma3'));
    } catch {
        return false;
    }
}

/** Ollama chat 호출 (stream:false) */
async function chat(messages, { format, temperature = 0.8 } = {}) {
    const body = {
        model: MODEL,
        messages,
        stream: false,
        options: { temperature, num_predict: 256 },
    };
    if (format) body.format = format;

    const res = await fetchWithTimeout(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }, 90000);

    if (!res.ok) throw new Error(`Ollama ${res.status}`);
    const data = await res.json();
    return (data.message?.content || '').trim();
}

const LOGO_TYPE_HINT = {
    symbol: 'a single icon-only symbol',
    lettermark: 'a stylized letterform / lettermark',
    emblem: 'an emblem inside a circular badge frame',
    monogram: 'two letters fused into one monogram',
    combined: 'an object fused with a letter',
    abstract: 'an abstract geometric mark',
    mascot: 'a simple geometric mascot character',
};

/**
 * 핵심 컨셉 AI 강화: 대상에 딱 맞는 창의적 시각 메타포 영어 구문 1개 반환.
 * 스타일/품질/배경 단어는 빼고 "마크의 형태"만 묘사 (이후 플랫폼 템플릿이 감쌈).
 */
export async function enhanceConcept({ subject1, subject2, logoTypeId, logoTypeKo }) {
    const subject = subjectHint(subject1, subject2);
    const typeHint = LOGO_TYPE_HINT[logoTypeId] || 'a logo mark';

    const sys =
        'You design clever flat minimalist vector logos. ' +
        'Output ONE vivid English phrase describing the logo mark. RULES:\n' +
        '1) The mark MUST visually contain the literal subject object — never abstract it away.\n' +
        '2) Add ONE clever idea: negative space, dual meaning, or fusion with a related element.\n' +
        '3) Start the phrase with the subject object. Max 18 words, English only.\n' +
        '4) Do NOT add background, color, style, quality, or "minimalist" words — those are added elsewhere.\n' +
        'Output ONLY the phrase. No quotes, no preamble.';

    const user =
        `Subject (literal object to draw): ${subject}\n` +
        `Logo type: ${logoTypeKo} (${typeHint})\n` +
        `Write the logo mark description:`;

    const out = await chat(
        [{ role: 'system', content: sys }, { role: 'user', content: user }],
        { temperature: 0.95 }
    );
    // 혹시 모델이 따옴표/줄바꿈을 붙이면 정리
    return out.replace(/^["'`]+|["'`]+$/g, '').split('\n')[0].trim();
}

/**
 * 시각 메타포 아이디어 3개 제안.
 * 반환: [{ ko: '한글 설명', en: '영어 코어 컨셉' }, ...]
 */
export async function suggestConcepts({ subject1, subject2, logoTypeKo }) {
    const subject = subjectHint(subject1, subject2);

    const schema = {
        type: 'object',
        properties: {
            ideas: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        ko: { type: 'string' },
                        en: { type: 'string' },
                    },
                    required: ['ko', 'en'],
                },
            },
        },
        required: ['ideas'],
    };

    const sys =
        'You design clever flat minimalist logos. RULES:\n' +
        '1) Every idea MUST visually contain the literal subject object — never abstract it away.\n' +
        '2) Each idea fuses the subject with a second simple element (negative space, dual meaning, or related object).\n' +
        '3) "ko" = short Korean noun phrase, MAX 15 Korean characters, NO sentences (예: "커피잔 + 떠오르는 해").\n' +
        '4) "en" = English logo-mark phrase, max 14 words, starts with the subject object, no style words.\n' +
        'Give exactly 3 DISTINCT ideas.';

    const user = `Subject (literal object to draw): ${subject}\nLogo type: ${logoTypeKo}\nReturn JSON.`;

    const out = await chat(
        [{ role: 'system', content: sys }, { role: 'user', content: user }],
        { format: schema, temperature: 1.0 }
    );

    let parsed;
    try {
        parsed = JSON.parse(out);
    } catch {
        return [];
    }
    return Array.isArray(parsed.ideas) ? parsed.ideas.slice(0, 3) : [];
}
