/**
 * 한글 → 영어 매핑 데이터 (v3 - 로고 유형 확장 + 목업 프롬프트)
 */

// =============================================
// 로고 유형 7종 (v4 플랫폼 맞춤 분리)
// =============================================
export const logoTypes = [
    // === 기본 유형 (단일 입력) ===
    {
        id: 'symbol',
        icon: '🎯',
        ko: '심볼 로고',
        desc: '아이콘만으로 구성',
        example: '애플, 트위터, 나이키',
        inputMode: 'single', // 입력란 1개
        inputLabel: '로고 대상',
        inputPlaceholder: '예: coffee cup, 고양이...',
        coreConcept: 'logo icon of a simple {subject}',
    },
    {
        id: 'lettermark',
        icon: '🔤',
        ko: '레터마크',
        desc: '이니셜/글자 디자인',
        example: 'IBM, NASA, HBO',
        inputMode: 'single',
        inputLabel: '글자/이니셜',
        inputPlaceholder: '예: A, JD, SH...',
        coreConcept: 'lettermark logo of the letter "{subject}"',
    },
    {
        id: 'emblem',
        icon: '🛡️',
        ko: '엠블럼',
        desc: '원형/방패 프레임 안에 심볼',
        example: '스타벅스, BMW',
        inputMode: 'single',
        inputLabel: '프레임 안 대상',
        inputPlaceholder: '예: crown, eagle...',
        coreConcept: 'emblem logo with {subject} inside a circular badge frame',
    },
    // === 확장 유형 (이중 입력) ===
    {
        id: 'monogram',
        icon: '✦',
        ko: '모노그램',
        desc: '글자 2개를 하나로 결합',
        example: 'LV, CC, GG',
        inputMode: 'dual',
        inputLabel1: '첫 번째 글자',
        inputLabel2: '두 번째 글자',
        inputPlaceholder1: '예: J',
        inputPlaceholder2: '예: D',
        coreConcept: 'monogram logo combining the letters "{input1}" and "{input2}" into a single unified mark, elegant intertwined letterforms',
    },
    {
        id: 'combined',
        icon: '🔀',
        ko: '아이콘 결합',
        desc: '두 이미지를 합쳐 이중 의미',
        example: '커피잔+책 = 북카페',
        inputMode: 'dual',
        inputLabel1: '아이콘 1',
        inputLabel2: '아이콘 2',
        inputPlaceholder1: '예: coffee cup, 잔',
        inputPlaceholder2: '예: book, 책',
        coreConcept: 'dual meaning logo combining {input1} and {input2} into one unified symbol, clever visual metaphor',
    },
    {
        id: 'negativespace',
        icon: '◐',
        ko: '네거티브 스페이스',
        desc: '빈 공간에 숨겨진 의미',
        example: 'FedEx 화살표',
        inputMode: 'dual',
        inputLabel1: '주 대상',
        inputLabel2: '숨겨진 대상',
        inputPlaceholder1: '예: tree, 나무',
        inputPlaceholder2: '예: bird, 새',
        coreConcept: 'negative space logo of {input1} with {input2} hidden in the negative space, clever optical illusion',
    },
    {
        id: 'letterform',
        icon: '🅰',
        ko: '레터폼 심볼',
        desc: '글자 일부를 아이콘으로 변형',
        example: '"A" 꼭대기가 산봉우리',
        inputMode: 'dual',
        inputLabel1: '글자',
        inputLabel2: '변형할 요소',
        inputPlaceholder1: '예: A, B, S...',
        inputPlaceholder2: '예: mountain, leaf...',
        coreConcept: 'letterform logo of the letter "{input1}" with {input2} integrated into the letter structure, creative typography',
    },
];

// =============================================
// 업종별 프리셋
// =============================================
export const industryPresets = [
    {
        id: 'cafe',
        icon: '☕',
        ko: '카페/음식',
        keywords: [
            { ko: '커피잔', en: 'coffee cup' },
            { ko: '찻잎', en: 'tea leaf' },
            { ko: '원두', en: 'coffee bean' },
            { ko: '스팀', en: 'steam' },
            { ko: '빵', en: 'bread' },
            { ko: '케이크', en: 'cake' },
            { ko: '포크와 나이프', en: 'fork and knife' },
            { ko: '와인잔', en: 'wine glass' },
        ],
        autoStyles: ['rounded', 'elegant'],
    },
    {
        id: 'beauty',
        icon: '💄',
        ko: '뷰티/미용',
        keywords: [
            { ko: '나뭇잎', en: 'leaf' },
            { ko: '꽃잎', en: 'flower petal' },
            { ko: '립', en: 'lips' },
            { ko: '거울', en: 'mirror' },
            { ko: '가위', en: 'scissors' },
            { ko: '드라이어', en: 'hair dryer' },
            { ko: '다이아몬드', en: 'diamond' },
        ],
        autoStyles: ['thin', 'elegant'],
    },
    {
        id: 'medical',
        icon: '🏥',
        ko: '병원/의료',
        keywords: [
            { ko: '십자', en: 'medical cross' },
            { ko: '하트', en: 'heart' },
            { ko: '방패', en: 'shield' },
            { ko: '맥박', en: 'pulse line' },
            { ko: '청진기', en: 'stethoscope' },
            { ko: '나뭇잎', en: 'leaf' },
        ],
        autoStyles: ['symmetrical', 'trustworthy'],
    },
    {
        id: 'realestate',
        icon: '🏠',
        ko: '부동산',
        keywords: [
            { ko: '집', en: 'house' },
            { ko: '빌딩', en: 'building' },
            { ko: '열쇠', en: 'key' },
            { ko: '지붕', en: 'rooftop' },
            { ko: '문', en: 'door' },
            { ko: '창문', en: 'window frame' },
        ],
        autoStyles: ['angular', 'trustworthy'],
    },
    {
        id: 'shopping',
        icon: '🛍️',
        ko: '쇼핑몰',
        keywords: [
            { ko: '쇼핑백', en: 'shopping bag' },
            { ko: '카트', en: 'shopping cart' },
            { ko: '태그', en: 'price tag' },
            { ko: '박스', en: 'box' },
            { ko: '별', en: 'star' },
            { ko: '하트', en: 'heart' },
        ],
        autoStyles: ['playful', 'bold'],
    },
    {
        id: 'fitness',
        icon: '💪',
        ko: '피트니스/건강',
        keywords: [
            { ko: '덤벨', en: 'dumbbell' },
            { ko: '러닝', en: 'running figure' },
            { ko: '근육', en: 'flexed muscle' },
            { ko: '요가', en: 'yoga pose' },
            { ko: '자전거', en: 'bicycle' },
            { ko: '하트', en: 'heart' },
        ],
        autoStyles: ['bold', 'dynamic'],
    },
    {
        id: 'education',
        icon: '📚',
        ko: '교육/학원',
        keywords: [
            { ko: '책', en: 'book' },
            { ko: '연필', en: 'pencil' },
            { ko: '학사모', en: 'graduation cap' },
            { ko: '전구', en: 'light bulb' },
            { ko: '별', en: 'star' },
            { ko: '나무', en: 'tree' },
        ],
        autoStyles: ['rounded', 'playful'],
    },
    {
        id: 'tech',
        icon: '💻',
        ko: '테크/스타트업',
        keywords: [
            { ko: '회로', en: 'circuit' },
            { ko: '톱니바퀴', en: 'gear' },
            { ko: '코드 괄호', en: 'code brackets' },
            { ko: '로켓', en: 'rocket' },
            { ko: '전구', en: 'light bulb' },
            { ko: '모니터', en: 'monitor' },
        ],
        autoStyles: ['angular', 'futuristic'],
    },
];

// =============================================
// 스타일 태그
// =============================================
export const styleTags = [
    { id: 'rounded', icon: '🥚', ko: '둥근 느낌', en: 'rounded, soft curves', group: 'shape' },
    { id: 'angular', icon: '📐', ko: '각진 느낌', en: 'angular, geometric', group: 'shape' },
    { id: 'symmetrical', icon: '🦋', ko: '대칭', en: 'symmetrical', group: 'shape' },
    { id: 'organic', icon: '🍃', ko: '자연스러운', en: 'organic, natural flow', group: 'shape' },
    { id: 'continuous', icon: '〰️', ko: '연속선', en: 'single continuous line', group: 'shape' },
    { id: 'negativespace', icon: '◐', ko: '여백 활용', en: 'negative space', group: 'shape' },

    { id: 'bold', icon: '🖊️', ko: '굵은 선', en: 'bold strokes', group: 'stroke' },
    { id: 'thin', icon: '🖋️', ko: '가는 선', en: 'thin strokes, delicate', group: 'stroke' },

    { id: 'elegant', icon: '✨', ko: '우아한', en: 'elegant, sophisticated', group: 'mood' },
    { id: 'playful', icon: '🎈', ko: '발랄한', en: 'playful, friendly', group: 'mood' },
    { id: 'minimal', icon: '🧊', ko: '극도로 심플', en: 'ultra minimal, abstract', group: 'mood' },
    { id: 'retro', icon: '📼', ko: '레트로', en: 'retro, vintage style', group: 'mood' },
    { id: 'futuristic', icon: '🚀', ko: '미래적인', en: 'futuristic, modern', group: 'mood' },
    { id: 'trustworthy', icon: '🏛️', ko: '신뢰감 있는', en: 'trustworthy, professional', group: 'mood' },
    { id: 'luxurious', icon: '💎', ko: '고급스러운', en: 'luxurious, premium', group: 'mood' },
    { id: 'friendly', icon: '😊', ko: '친근한', en: 'friendly, approachable', group: 'mood' },
    { id: 'dynamic', icon: '⚡', ko: '역동적인', en: 'dynamic, energetic', group: 'mood' },

    { id: 'handdrawn', icon: '✍️', ko: '손그림 느낌', en: 'hand-drawn style', group: 'variant' },
    { id: 'lettermark_style', icon: '🔤', ko: '연결된 글자', en: 'lettermark, monogram', group: 'variant' },
    { id: 'circular', icon: '🔘', ko: '원형 배지', en: 'circular badge, emblem', group: 'variant' },
    { id: 'shield', icon: '🛡️', ko: '방패 모양', en: 'shield shape', group: 'variant' },
];

// =============================================
// 미드저니 --no 파라미터
// =============================================
export const midjourneyNoParams = [
    { id: 'no_text', ko: '텍스트 제외', value: 'text' },
    { id: 'no_gradients', ko: '그라데이션 제외', value: 'gradients' },
    { id: 'no_complex', ko: '복잡한 형태 제외', value: 'complex shapes' },
    { id: 'no_shading', ko: '음영 제외', value: 'shading' },
];

// =============================================
// 나노바나나 목업 프롬프트 5종
// =============================================
export const mockupPrompts = [
    {
        id: 'marble',
        icon: '🪨',
        ko: '대리석 목업',
        desc: '화이트 대리석 위 금빛 글로우',
        prompt: 'A premium logo mockup on a white marble texture background. Natural gold veins running through the marble surface. A simple minimalist logo symbol placed at the center. The logo is in clean vector style with sharp, clear lines and minimal design that showcases brand identity. Soft golden glow effect around the logo creating a luxurious warm atmosphere. Overall tone is premium, sophisticated, and clean. Realistic composite look like an actual brand mockup. High resolution, sharp details, commercial logo mockup style.',
    },
    {
        id: 'emboss',
        icon: '📋',
        ko: '엠보싱 목업',
        desc: '고급 종이 위 입체 양각 효과',
        prompt: 'A premium embossed logo mockup on thick textured cotton paper. The logo is pressed into the paper with a subtle raised emboss effect creating elegant shadows. Soft natural lighting from the upper left. Shallow depth of field with slight blur on edges. The paper has a warm cream white tone with fine grain texture. Clean and minimal composition. Photorealistic, high resolution, luxury stationery brand mockup style, commercial photography quality.',
    },
    {
        id: 'foil',
        icon: '✨',
        ko: '금박 목업',
        desc: '다크 배경 위 골드 포일 스탬프',
        prompt: 'A premium gold foil stamped logo mockup on dark navy or black textured paper. The logo is rendered in metallic gold foil with realistic light reflections and subtle shine. Rich deep dark background creating strong contrast. Elegant and luxurious atmosphere. Photorealistic gold hot stamping effect. High resolution, sharp metallic details, premium brand identity mockup, commercial packaging quality.',
    },
    {
        id: 'glass',
        icon: '🪟',
        ko: '유리 간판 목업',
        desc: '유리 표면 위 프로스트 로고',
        prompt: 'A modern frosted glass logo mockup on a clean glass surface. The logo appears as frosted etched glass effect with soft translucency. Bright natural daylight illuminating from behind creating a soft glow through the glass. Minimal clean interior background slightly blurred. Contemporary premium office or retail signage look. Photorealistic, high resolution, modern brand identity glass sign mockup style.',
    },
    {
        id: 'wall',
        icon: '🏢',
        ko: '벽면 간판 목업',
        desc: '콘크리트 벽 위 3D 메탈 로고',
        prompt: 'A premium 3D metal logo sign mockup mounted on a clean concrete wall. The logo is made of brushed stainless steel or matte black metal with subtle shadows cast on the wall. Soft ambient lighting creating depth. Industrial modern interior or exterior setting. Clean minimal composition with the logo as the focal point. Photorealistic, high resolution, architectural signage mockup, commercial brand identity style.',
    },
];

// =============================================
// 수강생 맞춤 원클릭 치트키 (Best Presets)
// =============================================
export const bestPresets = [
    {
        id: 'cheat_modern_symbol',
        icon: '🏆',
        ko: '모던 심볼 1위',
        desc: '가장 많이 팔리는 심플 벡터',
        logoType: 'symbol',
        styles: ['minimal', 'symmetrical', 'thin'],
        industry: 'medical', // 범용적 구조
    },
    {
        id: 'cheat_luxury_mono',
        icon: '✨',
        ko: '명품 모노그램',
        desc: '뷰티/패션 프리미엄',
        logoType: 'monogram',
        styles: ['elegant', 'thin'],
        industry: 'beauty',
    },
    {
        id: 'cheat_clever_combine',
        icon: '💡',
        ko: '위트있는 결합',
        desc: '기발한 이중 의미 아이콘',
        logoType: 'combined',
        styles: ['playful', 'rounded'],
        industry: 'cafe',
    },
];

// =============================================
// 이중 입력 꿀조합 자판기 (Dual Input Combos)
// =============================================
export const dualInputCombos = {
    combined: [
        { label: '커피잔 + 책 (북카페)', i1: '커피잔', i2: '책', en1: 'coffee cup', en2: 'book' },
        { label: '집 + 하트 (부동산/홈케어)', i1: '집', i2: '하트', en1: 'house', en2: 'heart' },
        { label: '전구 + 뇌 (아이디어)', i1: '전구', i2: '뇌', en1: 'light bulb', en2: 'brain' },
        { label: '나뭇잎 + 물방울 (자연)', i1: '나뭇잎', i2: '물방울', en1: 'leaf', en2: 'water drop' }
    ],
    negativespace: [
        { label: '주택 숲 + 동물 (반려동물 주택)', i1: '집 실루엣', i2: '고양이 형태', en1: 'house silhouette', en2: 'cat shape' },
        { label: '펜 + 포크 (음식블로그)', i1: '펜 촉', i2: '포크 형태', en1: 'pen nib', en2: 'fork shape' },
        { label: '산 + 독수리 (아웃도어)', i1: '산봉우리', i2: '독수리 날개', en1: 'mountain peak', en2: 'eagle wings' }
    ],
    letterform: [
        { label: 'A + 산 (아웃도어)', i1: 'A', i2: '산봉우리', en1: 'A', en2: 'mountain peak' },
        { label: 'C + 스팀 (커피)', i1: 'C', i2: '커피 스팀', en1: 'C', en2: 'coffee steam' },
        { label: 'W + 파도 (해양)', i1: 'W', i2: '파도', en1: 'W', en2: 'ocean wave' }
    ],
    monogram: [
        { label: 'S + H (모던기업)', i1: 'S', i2: 'H', en1: 'S', en2: 'H' },
        { label: 'J + D (고급뷰티)', i1: 'J', i2: 'D', en1: 'J', en2: 'D' },
        { label: 'C + C (클래식명품)', i1: 'C', i2: 'C', en1: 'C', en2: 'C' }
    ]
};

// =============================================
// 한글 → 영어 사전
// =============================================
export const korToEngDict = {};
industryPresets.forEach(preset => {
    preset.keywords.forEach(item => {
        korToEngDict[item.ko] = item.en;
    });
});
Object.values(dualInputCombos).forEach(arr => {
    arr.forEach(item => {
        korToEngDict[item.i1] = item.en1;
        korToEngDict[item.i2] = item.en2;
    });
});
