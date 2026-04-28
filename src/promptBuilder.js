/**
 * 프롬프트 빌더 (v4 - AI 플랫폼 맞춤형 최적화)
 */

import { korToEngDict, logoTypes } from './data.js';

/**
 * 한글 대상을 영어로 변환
 */
export function translateSubject(input) {
    const trimmed = (input || '').trim();
    if (!trimmed) return '';
    if (korToEngDict[trimmed]) return korToEngDict[trimmed];
    const words = trimmed.split(/[\s,]+/);
    return words.map(w => korToEngDict[w] || w).join(', ');
}

// 크몽 트렌드 스타일 키워드 (기본 내장)
const TREND_KEYWORDS = 'clever visual metaphor, modern minimalistic identity, timeless design';

/**
 * 로고 유형별 핵심 컨셉 반환
 */
function getCoreConcept(logoTypeId, input1, input2) {
    const lt = logoTypes.find(t => t.id === logoTypeId) || logoTypes[0];

    if (lt.inputMode === 'dual') {
        return lt.coreConcept
            .replace('{input1}', input1)
            .replace('{input2}', input2);
    }
    return lt.coreConcept.replace('{subject}', input1);
}

/**
 * 메인 프롬프트 빌드 (Plain Text)
 */
export function buildPrompt(input1, input2, styleEnglish, platform, logoTypeId = 'symbol', noParams = []) {
    const t1 = translateSubject(input1);
    const t2 = translateSubject(input2);
    const lt = logoTypes.find(t => t.id === logoTypeId) || logoTypes[0];

    if (!t1) return '위에 만들고 싶은 로고의 대상을 입력해주세요 ✏️';
    if (lt.inputMode === 'dual' && !t2) return '두 번째 입력란도 채워주세요 ✏️';

    const coreConcept = getCoreConcept(logoTypeId, t1, t2);
    const styleStr = styleEnglish.length > 0 ? ', ' + styleEnglish.join(', ') : '';

    switch (platform) {
        case 'midjourney': {
            // 강력한 네거티브, style raw, 낮은 s값
            const defaultNo = ['gradients', 'shading', 'realistic details', '3D', 'complex shapes', 'text'];
            const mergedNo = Array.from(new Set([...defaultNo, ...noParams]));
            const noStr = mergedNo.length > 0 ? ' --no ' + mergedNo.join(', ') : '';
            return `A flat vector logo of ${coreConcept}${styleStr}, minimalist, clean lines, solid colors, pure white background, corporate brand identity, ${TREND_KEYWORDS}${noStr} --ar 1:1 --style raw --s 50`;
        }
        case 'gpt': {
            // 명확한 금지어 명령(CRITICAL INSTRUCTIONS)
            return `Design a strict 2D flat vector ${coreConcept}. Style: minimalist, clean lines, solid colors${styleStr}, ${TREND_KEYWORDS}.\nCRITICAL INSTRUCTIONS: It must be completely flat with absolutely NO gradients, NO 3D effects, NO shading, and NO photographic realism. Use a solid pure white background. The design must be a clean, minimalist corporate icon suitable for a brand identity.`;
        }
        case 'nanobanana': {
            // SD 가중치 태그
            return `(masterpiece, best quality:1.2), (flat vector logo:1.3) of ${coreConcept}${styleStr}, minimalist, clean vector art, simple shapes, 2D, solid white background, corporate identity, high contrast, ${TREND_KEYWORDS}`;
        }
        default:
            return `A flat vector ${coreConcept}${styleStr}, minimalist, clean lines, solid colors, pure white background, corporate brand identity, ${TREND_KEYWORDS}`;
    }
}

/**
 * HTML 하이라이트 프롬프트 빌드
 */
export function buildPromptHTML(input1, input2, styleEnglish, platform, logoTypeId = 'symbol', noParams = []) {
    const t1 = translateSubject(input1);
    const t2 = translateSubject(input2);
    const lt = logoTypes.find(t => t.id === logoTypeId) || logoTypes[0];

    if (!t1) return '<span class="prompt-placeholder">위에 만들고 싶은 로고의 대상을 입력해주세요 ✏️</span>';
    if (lt.inputMode === 'dual' && !t2) return '<span class="prompt-placeholder">두 번째 입력란도 채워주세요 ✏️</span>';

    const h1 = `<span class="prompt-highlight">${t1}</span>`;
    const h2 = `<span class="prompt-highlight-2">${t2}</span>`;

    let coreConceptH;
    if (lt.inputMode === 'dual') {
        coreConceptH = lt.coreConcept.replace('{input1}', h1).replace('{input2}', h2);
    } else {
        coreConceptH = lt.coreConcept.replace('{subject}', h1);
    }

    const styleH = styleEnglish.length > 0
        ? ', <span class="prompt-style-highlight">' + styleEnglish.join(', ') + '</span>'
        : '';

    switch (platform) {
        case 'midjourney': {
            const defaultNo = ['gradients', 'shading', 'realistic details', '3D', 'complex shapes', 'text'];
            const mergedNo = Array.from(new Set([...defaultNo, ...noParams]));
            const noStr = mergedNo.length > 0 ? ' <span class="prompt-no-highlight">--no ' + mergedNo.join(', ') + '</span>' : '';
            return `A flat vector logo of ${coreConceptH}${styleH}, minimalist, clean lines, solid colors, pure white background, corporate brand identity, ${TREND_KEYWORDS}${noStr} <span class="prompt-param">--ar 1:1 --style raw --s 50</span>`;
        }
        case 'gpt': {
            return `Design a strict 2D flat vector ${coreConceptH}. Style: minimalist, clean lines, solid colors${styleH}, ${TREND_KEYWORDS}.<br/><br/><span class="prompt-no-highlight">CRITICAL INSTRUCTIONS: It must be completely flat with absolutely NO gradients, NO 3D effects, NO shading, and NO photographic realism.</span> Use a solid pure white background. The design must be a clean, minimalist corporate icon suitable for a brand identity.`;
        }
        case 'nanobanana': {
            return `(masterpiece, best quality:1.2), <span class="prompt-param">(flat vector logo:1.3)</span> of ${coreConceptH}${styleH}, minimalist, clean vector art, simple shapes, 2D, solid white background, corporate identity, high contrast, ${TREND_KEYWORDS}`;
        }
        default:
            return '';
    }
}
