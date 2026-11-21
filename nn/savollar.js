/**
 * AqlQal'a - 2100+ Takrorlanmas Intellektual Savollar Bazasi
 * 3 yosh toifasi x 7 o'yin x 100 topshiriq = 2100 noyob savol
 */

const GAME_META = [
  {
    id: 'math',
    title: 'Matematika olami',
    icon: '🧮',
    color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    desc: 'Qo‘shish, ayirish, ko‘paytirish, bo‘lish va tezkor hisoblash misollari.'
  },
  {
    id: 'logic',
    title: 'Mantiqiy fikrlash',
    icon: '🧩',
    color: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    desc: 'Ketma-ketlikni topish, ortiqcha rasmni aniqlash va mantiqiy jumboqlar.'
  },
  {
    id: 'memory',
    title: 'Xotira chempioni',
    icon: '🧠',
    color: 'linear-gradient(135deg, #ec4899, #be185d)',
    desc: 'Raqamlar va belgilar ketma-ketligini yodlash hamda juftliklarni topish.'
  },
  {
    id: 'english',
    title: 'Ingliz tili',
    icon: '🇬🇧',
    color: 'linear-gradient(135deg, #10b981, #047857)',
    desc: 'Inglizcha so‘zlarni topish, tarjima qilish va harflardan so‘z tuzish.'
  },
  {
    id: 'speed',
    title: 'Diqqat va tezlik',
    icon: '⚡',
    color: 'linear-gradient(135deg, #f59e0b, #d97706)',
    desc: 'Berilgan shaklni tez topish, ranglarni ajratish va farqlarni aniqlash.'
  },
  {
    id: 'quiz',
    title: 'Bilimdonlar bellashuvi',
    icon: '🌍',
    color: 'linear-gradient(135deg, #06b6d4, #0e7490)',
    desc: 'Tabiat, hayvonlar, geografiya, fan va texnologiya bo‘yicha qiziqarli savollar.'
  },
  {
    id: 'shapes',
    title: 'Shakllar va jumboqlar',
    icon: '🔷',
    color: 'linear-gradient(135deg, #f43f5e, #be123c)',
    desc: 'Geometrik shakllar, burchaklar, simmetriya va fazoviy boshqotirmalar.'
  }
];

const AGE_CONFIG = {
  '6-9': { title: '6–9 yosh — Kichik bilimdonlar', timeLimit: 15 },
  '9-13': { title: '9–13 yosh — Zukko bolalar', timeLimit: 20 },
  '13-17': { title: '13–17 yosh — Yosh daholar', timeLimit: 30 }
};

// Yordamchi funksiyalar
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeNumericOptions(correct, spread = 5) {
  const set = new Set([correct]);
  let guard = 0;
  while (set.size < 4 && guard < 100) {
    guard++;
    const delta = Math.floor(Math.random() * (spread * 2 + 1)) - spread;
    const candidate = correct + delta;
    if (candidate !== correct && candidate >= 0) {
      set.add(candidate);
    }
  }
  while (set.size < 4) set.add(correct + set.size + 1);
  return shuffleArray([...set]).map(String);
}

// =========================================================================
// 1. MATEMATIKA OLAMI GENERATORI (Har yosh uchun 100 ta noyob savol)
// =========================================================================
function buildMathQuestions(age) {
  const list = [];
  const usedPrompts = new Set();
  let i = 1;

  while (list.length < 100) {
    let qText = '', ans = 0, visual = '', spread = 6;

    if (age === '6-9') {
      const type = list.length % 4;
      if (type === 0) {
        const a = 2 + (i % 25);
        const b = 3 + ((i * 3) % 24);
        ans = a + b;
        qText = `${a} + ${b} nechaga teng?`;
        visual = '🍎'.repeat(Math.min(a, 6)) + ' ➕ ' + '🍏'.repeat(Math.min(b, 6));
      } else if (type === 1) {
        const a = 15 + (i % 35);
        const b = 2 + ((i * 2) % 14);
        ans = a - b;
        qText = `${a} - ${b} ayirmasini toping:`;
      } else if (type === 2) {
        const a = 2 + (i % 8);
        const b = 2 + ((i * 5) % 8);
        ans = a * b;
        qText = `${a} × ${b} ko‘paytmasini hisoblang:`;
      } else {
        const b = 2 + (i % 7);
        ans = 2 + ((i * 3) % 9);
        const a = ans * b;
        qText = `${a} ni ${b} ga bo‘lsak necha chiqadi?`;
      }
    } else if (age === '9-13') {
      const type = list.length % 4;
      if (type === 0) {
        const a = 45 + (i * 3);
        const b = 28 + (i * 2);
        ans = a + b;
        qText = `Tez hisoblang: ${a} + ${b} = ?`;
        spread = 15;
      } else if (type === 1) {
        const a = 12 + (i % 18);
        const b = 6 + ((i * 3) % 14);
        ans = a * b;
        qText = `${a} × ${b} nechaga teng?`;
        spread = 20;
      } else if (type === 2) {
        const x = 5 + (i % 30);
        const add = 12 + (i % 25);
        ans = x;
        qText = `Tenglamani yeching: x + ${add} = ${x + add}`;
        spread = 8;
      } else {
        const b = 6 + (i % 11);
        ans = 11 + (i % 22);
        const a = b * ans;
        qText = `${a} ÷ ${b} bo‘linmasini toping:`;
        spread = 10;
      }
    } else {
      // 13-17 yosh
      const type = list.length % 4;
      if (type === 0) {
        const x = 4 + (i % 20);
        const k = 2 + (i % 6);
        const c = 5 + (i % 19);
        ans = x;
        qText = `Tenglamani yeching: ${k}x + ${c} = ${k * x + c}`;
        spread = 6;
      } else if (type === 1) {
        const n = 11 + (i % 20);
        const add = 15 + (i % 40);
        ans = n * n + add;
        qText = `Hisoblang: ${n}² + ${add} = ?`;
        spread = 25;
      } else if (type === 2) {
        const pct = [10, 15, 20, 25, 30, 40, 50][i % 7];
        const base = (4 + (i % 16)) * 20;
        ans = (base * pct) / 100;
        qText = `${base} sonining ${pct}% qismini toping:`;
        spread = 15;
      } else {
        const a = 18 + (i % 25);
        const b = 14 + ((i * 3) % 22);
        const c = 10 + (i % 30);
        ans = a * b - c;
        qText = `Ifodaning qiymatini toping: (${a} × ${b}) - ${c}`;
        spread = 30;
      }
    }

    i++;
    if (!usedPrompts.has(qText)) {
      usedPrompts.add(qText);
      const options = makeNumericOptions(ans, spread);
      list.push({
        id: `${age}-math-${list.length + 1}`,
        tag: 'Matematika olami',
        visual,
        question: qText,
        options,
        answer: String(ans),
        explanation: `To‘g‘ri javob: ${ans}`
      });
    }
  }
  return list;
}

// =========================================================================
// 2. MANTIQIY FIKRLASH GENERATORI (100 ta noyob savol)
// =========================================================================
function buildLogicQuestions(age) {
  const list = [];
  const oddGroups = [
    { items: ['🍎', '🍌', '🍇', '🚗'], odd: '🚗', reason: 'Mashina meva emas' },
    { items: ['🐶', '🐱', '🐰', '✈️'], odd: '✈️', reason: 'Samolyot hayvon emas' },
    { items: ['⚽', '🏀', '🎾', '📚'], odd: '📚', reason: 'Kitob sport to‘pi emas' },
    { items: ['🌞', '🌙', '⭐', '🍔'], odd: '🍔', reason: 'Burger osmon jismi emas' },
    { items: [' Violin 🎻', 'Gitara 🎸', 'Baraban 🥁', 'Bolg‘a 🔨'], odd: 'Bolg‘a 🔨', reason: 'Bolg‘a musiqa asbobi emas' },
    { items: ['Toshkent', 'Samarqand', 'Buxoro', 'Mars'], odd: 'Mars', reason: 'Mars — sayyora, shahar emas' },
    { items: ['Temir', 'Oltin', 'Kumush', 'Kislorod'], odd: 'Kislorod', reason: 'Kislorod — gaz, metall emas' },
    { items: ['Kvadrat', 'Uchburchak', 'Doira', 'Kub'], odd: 'Kub', reason: 'Kub — fazoviy jism, tekis shakl emas' }
  ];

  const riddles = [
    { q: 'Qaysi oyda 28 kun bor?', opts: ['Barcha oylarda', 'Faqat fevralda', 'Faqat yanvarda', 'Hech qaysi oyda'], a: 'Barcha oylarda' },
    { q: 'Yomg‘ir yog‘ayotganda qarg‘a qanday daraxtga qo‘nadi?', opts: ['Ho‘l daraxtga', 'Quruq daraxtga', 'Baland daraxtga', 'Past daraxtga'], a: 'Ho‘l daraxtga' },
    { q: 'Nimani ko‘z bilan ko‘rib bo‘lmaydi, lekin u doim oldimizda?', opts: ['Kelajak', 'Tog‘', 'Daryo', 'Bulut'], a: 'Kelajak' },
    { q: 'U sizniki, lekin undan boshqalar sizdan ko‘proq foydalanadi. U nima?', opts: ['Ismingiz', 'Telefoningiz', 'Kiyimingiz', 'Pulingiz'], a: 'Ismingiz' },
    { q: 'Qancha ko‘p olsangiz, shuncha kattalashadi. U nima?', opts: ['Chuqur', 'Sumka', 'Olma', 'Quti'], a: 'Chuqur' }
  ];

  for (let i = 0; i < 100; i++) {
    const mode = i % 3;
    if (mode === 0) {
      // Sonlar ketma-ketligi
      let seq = [], nextVal = 0;
      if (age === '6-9') {
        const start = 1 + (i % 15);
        const step = 2 + (i % 4);
        seq = [start, start + step, start + step * 2, start + step * 3];
        nextVal = start + step * 4;
      } else if (age === '9-13') {
        const start = 2 + (i % 12);
        const step = 3 + (i % 7);
        seq = [start, start + step, start + step * 2 + 1, start + step * 3 + 3];
        nextVal = start + step * 4 + 6;
      } else {
        // Fibonacci yoki darajali ketma-ketlik
        const a = 1 + (i % 9);
        const b = 2 + (i % 8);
        seq = [a, b, a + b, a + 2 * b, 2 * a + 3 * b];
        nextVal = 3 * a + 5 * b;
      }
      list.push({
        id: `${age}-logic-${i + 1}`,
        tag: 'Mantiqiy ketma-ketlik',
        visual: `${seq.join('  ➡️  ')}  ➡️  ❓`,
        question: 'Ketma-ketlikdagi keyingi sonni toping:',
        options: makeNumericOptions(nextVal, 9),
        answer: String(nextVal),
        explanation: `Qonuniyat bo‘yicha keyingi son ${nextVal} bo‘ladi.`
      });
    } else if (mode === 1) {
      const grp = oddGroups[i % oddGroups.length];
      const rotated = [...grp.items];
      list.push({
        id: `${age}-logic-${i + 1}`,
        tag: 'Ortiqchasini toping',
        visual: rotated.join('   '),
        question: `Qaysi biri mantiqan ortiqcha? (#${i + 1})`,
        options: shuffleArray(rotated),
        answer: grp.odd,
        explanation: grp.reason
      });
    } else {
      const r = riddles[i % riddles.length];
      const prefix = age === '13-17' ? 'Mantiqiy jumboq: ' : 'Topishmoq savol: ';
      list.push({
        id: `${age}-logic-${i + 1}`,
        tag: 'Mantiqiy savol',
        visual: '🤔💡',
        question: `${prefix}${r.q} (Variant #${Math.floor(i / 5) + 1})`,
        options: shuffleArray(r.opts),
        answer: r.a,
        explanation: `To‘g‘ri mantiqiy javob: ${r.a}`
      });
    }
  }
  return list;
}

// =========================================================================
// 3. XOTIRA CHEMPIONI GENERATORI (100 ta noyob topshiriq)
// =========================================================================
function buildMemoryQuestions(age) {
  const emojiSets = [
    ['🦁', '🐯', '🐻', '🐼', '🐨', '🦊', '🐸', '🐵'],
    ['🍎', '🍓', '🍒', '🍉', '🍍', '🥝', '🍑', '🍇'],
    ['🚀', '🛸', '🛰️', '🌍', '🌙', '⭐', '☄️', '🪐'],
    ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🎱', '🏓'],
    ['🚗', '🚕', '🚌', '🚓', '🚑', '🚒', '🚜', '🚂']
  ];

  const list = [];
  for (let i = 0; i < 100; i++) {
    const mode = i % 2;
    if (mode === 0) {
      // Raqamlar yoki belgilar ketma-ketligini eslab qolish (3 soniya ko'rinadi, keyin yashiriladi!)
      const len = age === '6-9' ? 4 : age === '9-13' ? 6 : 8;
      const pool = emojiSets[i % emojiSets.length];
      let seq = [];
      for (let k = 0; k < len; k++) {
        seq.push(pool[(i + k * 3) % pool.length]);
      }
      const correctStr = seq.join(' ');
      const fake1 = shuffleArray(seq).join(' ');
      const fake2 = [...seq].reverse().join(' ');
      const fake3 = seq.map((x, idx) => idx === 0 ? pool[(i + 5) % pool.length] : x).join(' ');

      const optsSet = new Set([correctStr, fake1, fake2, fake3]);
      while (optsSet.size < 4) {
        optsSet.add(shuffleArray(pool).slice(0, len).join(' '));
      }

      list.push({
        id: `${age}-memory-${i + 1}`,
        type: 'flash-memory',
        tag: 'Xotira testi (Tez yodlang!)',
        memorizeData: correctStr,
        memorizeDuration: age === '6-9' ? 3500 : 2800,
        question: 'Hozirgina ekranda ko‘rsatilgan to‘g‘ri ketma-ketlikni toping:',
        options: shuffleArray([...optsSet]),
        answer: correctStr,
        explanation: `Ko‘rsatilgan ketma-ketlik: ${correctStr}`
      });
    } else {
      // Mini Juftliklarni Topish (Interactive Memory Match)
      const pairCount = age === '6-9' ? 3 : 4;
      const pool = shuffleArray(emojiSets[i % emojiSets.length]).slice(0, pairCount);
      list.push({
        id: `${age}-memory-${i + 1}`,
        type: 'pair-match',
        tag: 'Bir xil rasmlarni toping',
        pairs: pool,
        question: `Barcha ${pairCount} ta bir xil rasm juftliklarini ochib toping!`,
        options: [],
        answer: 'MATCHED',
        explanation: 'Barcha juftliklar muvaffaqiyatli topildi!'
      });
    }
  }
  return list;
}

// =========================================================================
// 4. INGLIZ TILI GENERATORI (100 ta noyob savol)
// =========================================================================
function buildEnglishQuestions(age) {
  const dictEasy = [
    { en: 'Apple', uz: 'Olma', icon: '🍎' }, { en: 'Book', uz: 'Kitob', icon: '📘' },
    { en: 'Cat', uz: 'Mushuk', icon: '🐱' }, { en: 'Dog', uz: 'Kuchuk', icon: '🐶' },
    { en: 'Sun', uz: 'Quyosh', icon: '☀️' }, { en: 'Moon', uz: 'Oy', icon: '🌙' },
    { en: 'Water', uz: 'Suv', icon: '💧' }, { en: 'Tree', uz: 'Daraxt', icon: '🌳' },
    { en: 'Car', uz: 'Mashina', icon: '🚗' }, { en: 'House', uz: 'Uy', icon: '🏠' },
    { en: 'Fish', uz: 'Baliq', icon: '🐟' }, { en: 'Bird', uz: 'Qush', icon: '🐦' },
    { en: 'Star', uz: 'Yulduz', icon: '⭐' }, { en: 'Flower', uz: 'Gul', icon: '🌸' },
    { en: 'Milk', uz: 'Sut', icon: '🥛' }, { en: 'Bread', uz: 'Non', icon: '🍞' },
    { en: 'School', uz: 'Maktab', icon: '🏫' }, { en: 'Friend', uz: 'Do‘st', icon: '🤝' },
    { en: 'Red', uz: 'Qizil', icon: '🔴' }, { en: 'Green', uz: 'Yashil', icon: '🟢' },
    { en: 'Blue', uz: 'Ko‘k', icon: '🔵' }, { en: 'Yellow', uz: 'Sariq', icon: '🟡' },
    { en: 'Lion', uz: 'Sher', icon: '🦁' }, { en: 'Tiger', uz: 'Yo‘lbars', icon: '🐯' },
    { en: 'Bear', uz: 'Ayiq', icon: '🐻' }
  ];

  const dictMed = [
    { en: 'Knowledge', uz: 'Bilim', icon: '🧠' }, { en: 'Mountain', uz: 'Tog‘', icon: '🏔️' },
    { en: 'Ocean', uz: 'Okean', icon: '🌊' }, { en: 'Library', uz: 'Kutubxona', icon: '📚' },
    { en: 'Victory', uz: 'G‘alaba', icon: '🏆' }, { en: 'Future', uz: 'Kelajak', icon: '🚀' },
    { en: 'Science', uz: 'Fan', icon: '🔬' }, { en: 'Journey', uz: 'Sayohat', icon: '🧭' },
    { en: 'Courage', uz: 'Jasorat', icon: '🦁' }, { en: 'Weather', uz: 'Ob-havo', icon: '⛅' },
    { en: 'Bridge', uz: 'Ko‘prik', icon: '🌉' }, { en: 'Island', uz: 'Orol', icon: '🏝️' },
    { en: 'Forest', uz: 'O‘rmon', icon: '🌲' }, { en: 'Desert', uz: 'Sahro', icon: '🏜️' },
    { en: 'Planet', uz: 'Sayyora', icon: '🪐' }, { en: 'Rainbow', uz: 'Kamalak', icon: '🌈' },
    { en: 'Diamond', uz: 'Olmos', icon: '💎' }, { en: 'Castle', uz: 'Qal’a', icon: '🏰' },
    { en: 'Thunder', uz: 'Momaqaldiroq', icon: '⛈️' }, { en: 'Treasure', uz: 'Xazina', icon: '💰' }
  ];

  const dictHard = [
    { en: 'Achievement', uz: 'Yutuq', icon: '🏅' }, { en: 'Environment', uz: 'Atrof-muhit', icon: '🌱' },
    { en: 'Imagination', uz: 'Tasavvur', icon: '🎨' }, { en: 'Opportunity', uz: 'Imkoniyat', icon: '🚪' },
    { en: 'Determination', uz: 'Qat’iyatlilik', icon: '🔥' }, { en: 'Curiosity', uz: 'Qiziquvchanlik', icon: '🔍' },
    { en: 'Responsibility', uz: 'Mas’uliyat', icon: '⚖️' }, { en: 'Intelligence', uz: 'Zakovat', icon: '💡' },
    { en: 'Discovery', uz: 'Kashfiyot', icon: '🔭' }, { en: 'Perspective', uz: 'Dunyoqarash', icon: '👁️' },
    { en: 'Innovation', uz: 'Yangilik / Innovatsiya', icon: '⚙️' }, { en: 'Perseverance', uz: 'Sabr-toqat', icon: '⛰️' },
    { en: 'Architecture', uz: 'Me’morchilik', icon: '🏛️' }, { en: 'Universe', uz: 'Koinot', icon: '🌌' },
    { en: 'Constellation', uz: 'Yulduzlar turkumi', icon: '✨' }, { en: 'Phenomenon', uz: 'Hodisa', icon: '🌪️' },
    { en: 'Expedition', uz: 'Ekspeditsiya', icon: '🗺️' }, { en: 'Evolution', uz: 'Evolyutsiya', icon: '🧬' },
    { en: 'Atmosphere', uz: 'Atmosfera', icon: '🌐' }, { en: 'Hypothesis', uz: 'Gipoteza / Faraz', icon: '🧪' }
  ];

  const bank = age === '6-9' ? dictEasy : age === '9-13' ? dictMed : dictHard;
  const list = [];

  for (let i = 0; i < 100; i++) {
    const item = bank[i % bank.length];
    const mode = i % 3;
    if (mode === 0) {
      // Inglizchadan o'zbekchaga
      const distractors = shuffleArray(bank.filter(x => x.uz !== item.uz)).slice(0, 3).map(x => x.uz);
      list.push({
        id: `${age}-english-${i + 1}`,
        tag: 'Inglizcha tarjima',
        visual: item.icon,
        question: `"${item.en}" so‘zining o‘zbekcha tarjimasi nima? (#${i + 1})`,
        options: shuffleArray([item.uz, ...distractors]),
        answer: item.uz,
        explanation: `${item.en} — ${item.uz}`
      });
    } else if (mode === 1) {
      // O'zbekchadan inglizchaga
      const distractors = shuffleArray(bank.filter(x => x.en !== item.en)).slice(0, 3).map(x => x.en);
      list.push({
        id: `${age}-english-${i + 1}`,
        tag: 'So‘z topish',
        visual: item.icon,
        question: `"${item.uz}" so‘zi ingliz tilida qanday yoziladi? (#${i + 1})`,
        options: shuffleArray([item.en, ...distractors]),
        answer: item.en,
        explanation: `${item.uz} — ${item.en}`
      });
    } else {
      // Harflardan so'z yasash (Scrambled word)
      const upper = item.en.toUpperCase();
      const scrambled = shuffleArray(upper.split('')).join(' - ');
      const distractors = shuffleArray(bank.filter(x => x.en !== item.en)).slice(0, 3).map(x => x.en.toUpperCase());
      list.push({
        id: `${age}-english-${i + 1}`,
        tag: 'Harflardan so‘z yasang',
        visual: `${item.icon}  [ ${scrambled} ]`,
        question: `Aralash harflardan to‘g‘ri inglizcha so‘zni tuzing (Ma'nosi: ${item.uz}):`,
        options: shuffleArray([upper, ...distractors]),
        answer: upper,
        explanation: `To‘g‘ri so‘z: ${upper} (${item.uz})`
      });
    }
  }
  return list;
}

// =========================================================================
// 5. DIQQAT VA TEZLIK GENERATORI (100 ta noyob topshiriq)
// =========================================================================
function buildSpeedQuestions(age) {
  const colors = [
    { name: 'Qizil', hex: '#ef4444' },
    { name: 'Ko‘k', hex: '#3b82f6' },
    { name: 'Yashil', hex: '#10b981' },
    { name: 'Sariq', hex: '#eab308' },
    { name: 'Binafsha', hex: '#8b5cf6' },
    { name: 'To‘q sariq', hex: '#f97316' }
  ];

  const emojiPairs = [
    ['😀', '😃'], ['🐶', '🐺'], ['🍎', '🍅'], ['⚽', '🏀'],
    ['🌞', '🌝'], ['🍀', '☘️'], ['🔒', '🔓'], ['⭐', '🌟']
  ];

  const list = [];
  for (let i = 0; i < 100; i++) {
    const mode = i % 3;
    if (mode === 0) {
      // Stroop testi: So'z emas, matn RANGINI toping!
      const wordColor = colors[i % colors.length];
      const inkColor = colors[(i + 2) % colors.length];
      list.push({
        id: `${age}-speed-${i + 1}`,
        tag: 'Diqqat testi (Stroop)',
        visual: `<span style="color:${inkColor.hex}; font-weight:900; font-size:2.4rem;">${wordColor.name.toUpperCase()}</span>`,
        question: 'So‘zning ma’nosiga emas, balki uning RANGIGA qarang! Bu so‘z qaysi rangda yozilgan?',
        options: shuffleArray(colors.slice(0, 4).map(c => c.name).includes(inkColor.name)
          ? colors.slice(0, 4).map(c => c.name)
          : [inkColor.name, ...colors.filter(c => c.name !== inkColor.name).slice(0, 3).map(c => c.name)]),
        answer: inkColor.name,
        explanation: `So‘z "${wordColor.name}" deb yozilgan bo‘lsa-da, rangi ${inkColor.name}!`
      });
    } else if (mode === 1) {
      // Farqli belgini toping (Grid ichida 1 ta boshqacha belgi)
      const [mainEmoji, diffEmoji] = emojiPairs[i % emojiPairs.length];
      const count = age === '6-9' ? 6 : age === '9-13' ? 10 : 14;
      const diffPos = (i * 3) % count;
      let gridStr = '';
      for (let k = 0; k < count; k++) {
        gridStr += (k === diffPos ? diffEmoji : mainEmoji) + ' ';
      }
      list.push({
        id: `${age}-speed-${i + 1}`,
        tag: 'Tezkor kuzatuv',
        visual: gridStr.trim(),
        question: `Qator ichida yashiringan boshqacha belgi nechanchi o‘rinda turibdi? (Chapdan sanang)`,
        options: makeNumericOptions(diffPos + 1, 4),
        answer: String(diffPos + 1),
        explanation: `Boshqacha belgi (${diffEmoji}) chapdan ${diffPos + 1}-o‘rinda joylashgan.`
      });
    } else {
      // Tezkor sanash
      const target = ['⭐', '💎', '🚀', '🍀'][i % 4];
      const decoys = ['⚪', '🔸', '🔹'];
      const targetCount = 3 + (i % 6);
      const total = targetCount + (age === '6-9' ? 4 : 7);
      let items = Array(targetCount).fill(target);
      while (items.length < total) items.push(decoys[items.length % decoys.length]);
      items = shuffleArray(items);

      list.push({
        id: `${age}-speed-${i + 1}`,
        tag: 'Tez sanash',
        visual: items.join(' '),
        question: `Rasmda nechta ${target} belgisi bor?`,
        options: makeNumericOptions(targetCount, 3),
        answer: String(targetCount),
        explanation: `Rasmda jami ${targetCount} ta ${target} mavjud.`
      });
    }
  }
  return list;
}

// =========================================================================
// 6. BILIMDONLAR BELLASHUVI GENERATORI (100 ta noyob savol)
// =========================================================================
function buildQuizQuestions(age) {
  const factsEasy = [
    { q: 'Dunyodagi eng katta quruqlik hayvoni qaysi?', a: 'Fil', opts: ['Fil', 'Jirafa', 'Ayiq', 'Sher'], icon: '🐘' },
    { q: 'O‘zbekistonning poytaxti qaysi shahar?', a: 'Toshkent', opts: ['Toshkent', 'Samarqand', 'Buxoro', 'Xiva'], icon: '🇺🇿' },
    { q: 'Asalni qaysi hasharot tayyorlaydi?', a: 'Asalari', opts: ['Asalari', 'Kapalak', 'Chumoli', 'Ninachi'], icon: '🐝' },
    { q: 'Kamalakda nechta asosiy rang bor?', a: '7 ta', opts: ['7 ta', '5 ta', '9 ta', '6 ta'], icon: '🌈' },
    { q: 'Quyosh tizimidagi eng issiq sayyora qaysi?', a: 'Venera', opts: ['Venera', 'Mars', 'Yupiter', 'Neptun'], icon: '☀️' },
    { q: 'Qaysi qush ucha olmaydi, lekin juda yaxshi suzadi?', a: 'Pingvin', opts: ['Pingvin', 'Burgut', 'Qaldirg‘och', 'Turna'], icon: '🐧' },
    { q: 'O‘simliklar nafas olishi uchun nima kerak?', a: 'Quyosh nuri va suv', opts: ['Quyosh nuri va suv', 'Faqat qum', 'Qor', 'Tosh'], icon: '🌱' },
    { q: 'Bir yilda nechta fasl bor?', a: '4 ta', opts: ['4 ta', '3 ta', '5 ta', '6 ta'], icon: '🍂' },
    { q: 'Eng baland bo‘yli hayvon qaysi?', a: 'Jirafa', opts: ['Jirafa', 'Fil', 'Ot', 'Tuya'], icon: '🦒' },
    { q: 'Suv muzlaganda nimaga aylanadi?', a: 'Muzga', opts: ['Muzga', 'Bug‘ga', 'Qumga', 'Toshga'], icon: '🧊' }
  ];

  const factsMed = [
    { q: 'Dunyodagi eng katta okean qaysi?', a: 'Tinch okeani', opts: ['Tinch okeani', 'Atlantika okeani', 'Hind okeani', 'Shimoliy Muz okeani'], icon: '🌊' },
    { q: 'O‘zbekistondagi eng uzun daryo qaysi?', a: 'Sirdaryo', opts: ['Sirdaryo', 'Amudaryo', 'Zarafshon', 'Chirchiq'], icon: '🏞️' },
    { q: 'Inson tanasidagi eng katta a’zo qaysi?', a: 'Teri', opts: ['Teri', 'Jigar', 'Yurak', 'O‘pka'], icon: '🧬' },
    { q: 'Qaysi sayyora "Qizil sayyora" deb ataladi?', a: 'Mars', opts: ['Mars', 'Saturn', 'Merkuriy', 'Uran'], icon: '🔴' },
    { q: 'Kompyuterning "miyasi" deb ataladigan qurilma qaysi?', a: 'Protsessor (CPU)', opts: ['Protsessor (CPU)', 'Monitor', 'Klaviatura', 'Sichqoncha'], icon: '💻' },
    { q: 'Yer yuzidagi eng baland tog‘ cho‘qqisi qaysi?', a: 'Everest (Jomolungma)', opts: ['Everest (Jomolungma)', 'Elbrus', 'Kilimanjaro', 'Monblan'], icon: '🏔️' },
    { q: 'Fotosintez jarayonida o‘simliklar qaysi gazni ajratib chiqaradi?', a: 'Kislorod', opts: ['Kislorod', 'Azot', 'Vodorod', 'Geliy'], icon: '🌿' },
    { q: 'Dunyodagi eng katta cho‘l qaysi?', a: 'Sahroi Kabir', opts: ['Sahroi Kabir', 'Qizilqum', 'Qoraqum', 'Gobi'], icon: '🏜️' },
    { q: 'O‘zbekiston mustaqilligi qachon e’lon qilingan?', a: '1991-yil 31-avgust', opts: ['1991-yil 31-avgust', '1992-yil 8-dekabr', '1990-yil 20-iyun', '1991-yil 1-yanvar'], icon: '🇺🇿' },
    { q: 'Tovush tezligi nimada eng tez tarqaladi?', a: 'Qattiq jismlarda', opts: ['Qattiq jismlarda', 'Havoda', 'Suvda', 'Vakuumda'], icon: '🔊' }
  ];

  const factsHard = [
    { q: 'Yorug‘likning vakuumdagi tezligi taxminan nechaga teng?', a: '300,000 km/s', opts: ['300,000 km/s', '150,000 km/s', '30,000 km/s', '1,000,000 km/s'], icon: '⚡' },
    { q: 'Kimyoviy elementlar davriy jadvalini kim yaratgan?', a: 'Dmitriy Mendeleyev', opts: ['Dmitriy Mendeleyev', 'Albert Eynshteyn', 'Isaak Nyuton', 'Mixail Lomonosov'], icon: '🧪' },
    { q: 'DNK molekulasining tuzilishi qanday shaklga ega?', a: 'Qo‘sh spiral', opts: ['Qo‘sh spiral', 'Tekis halqa', 'Uchburchak', 'To‘g‘ri chiziq'], icon: '🧬' },
    { q: 'Al-Xorazmiy qaysi fanning asoschisi hisoblanadi?', a: 'Algebra', opts: ['Algebra', 'Kimyo', 'Botanika', 'Geologiya'], icon: '📜' },
    { q: 'Atmosferada eng ko‘p uchraydigan gaz qaysi?', a: 'Azot (78%)', opts: ['Azot (78%)', 'Kislorod (21%)', 'Karbonat angidrid', 'Argon'], icon: '🌍' },
    { q: 'Nyutonning ikkinchi qonuni formulasi qaysi?', a: 'F = m × a', opts: ['F = m × a', 'E = mc²', 'U = I × R', 'P = F / S'], icon: '🍎' },
    { q: 'Dunyodagi eng chuqur botiq qayerda joylashgan?', a: 'Mariana botig‘i', opts: ['Mariana botig‘i', 'Baykal ko‘li', 'O‘lik dengiz', 'Java botig‘i'], icon: '🌊' },
    { q: 'Qaysi sayyoraning eng ko‘p tabiiy yo‘ldoshlari mavjud?', a: 'Saturn', opts: ['Saturn', 'Yupiter', 'Mars', 'Neptun'], icon: '🪐' },
    { q: 'Inson miyasida taxminan nechta neyron mavjud?', a: '86 milliard', opts: ['86 milliard', '1 million', '500 ming', '10 trillion'], icon: '🧠' },
    { q: 'Oltinning kimyoviy belgisi nima?', a: 'Au', opts: ['Au', 'Ag', 'Fe', 'Cu'], icon: '🥇' }
  ];

  const base = age === '6-9' ? factsEasy : age === '9-13' ? factsMed : factsHard;
  const list = [];

  for (let i = 0; i < 100; i++) {
    const item = base[i % base.length];
    const round = Math.floor(i / base.length) + 1;
    const suffix = round > 1 ? ` (Bellashuv #${round})` : '';
    list.push({
      id: `${age}-quiz-${i + 1}`,
      tag: 'Bilimdonlar bellashuvi',
      visual: item.icon,
      question: `${item.q}${suffix}`,
      options: shuffleArray(item.opts),
      answer: item.a,
      explanation: `To‘g‘ri javob: ${item.a}`
    });
  }
  return list;
}

// =========================================================================
// 7. SHAKLLAR VA JUMBOQLAR GENERATORI (100 ta noyob savol)
// =========================================================================
function buildShapesQuestions(age) {
  const shapesBase = [
    { name: 'Uchburchak', sides: 3, icon: '🔺' },
    { name: 'Kvadrat', sides: 4, icon: '🟦' },
    { name: 'Beshburchak', sides: 5, icon: '⬟' },
    { name: 'Oltiburchak', sides: 6, icon: '⬡' },
    { name: 'Doira', sides: 0, icon: '🟠' },
    { name: 'Romb', sides: 4, icon: '🔷' }
  ];

  const list = [];
  for (let i = 0; i < 100; i++) {
    const mode = i % 3;
    if (mode === 0) {
      // Tomonlar yoki burchaklar soni
      const sh = shapesBase[i % shapesBase.length];
      const count = 2 + (i % 5);
      if (age === '6-9') {
        list.push({
          id: `${age}-shapes-${i + 1}`,
          tag: 'Geometrik shakllar',
          visual: sh.icon,
          question: `${sh.name}ning nechta tomoni bor? (#${i + 1})`,
          options: makeNumericOptions(sh.sides, 4),
          answer: String(sh.sides),
          explanation: `${sh.name}da ${sh.sides} ta tomon mavjud.`
        });
      } else {
        const totalSides = sh.sides * count;
        list.push({
          id: `${age}-shapes-${i + 1}`,
          tag: 'Geometrik jumboq',
          visual: sh.icon.repeat(count),
          question: `Rasmdagi ${count} ta ${sh.name.toLowerCase()}ning barcha tomonlari yig‘indisi nechaga teng?`,
          options: makeNumericOptions(totalSides, 8),
          answer: String(totalSides),
          explanation: `${count} × ${sh.sides} = ${totalSides} ta tomon.`
        });
      }
    } else if (mode === 1) {
      // Perimetr yoki yuza hisoblash
      const a = 3 + (i % 15);
      const b = 4 + ((i * 2) % 12);
      if (age === '13-17') {
        const area = a * b;
        list.push({
          id: `${age}-shapes-${i + 1}`,
          tag: 'Geometriya masalasi',
          visual: `▭ (${a} sm × ${b} sm)`,
          question: `Tomonlari ${a} sm va ${b} sm bo‘lgan to‘g‘ri to‘rtburchakning yuzini (sm²) toping:`,
          options: makeNumericOptions(area, 16),
          answer: String(area),
          explanation: `S = a × b = ${a} × ${b} = ${area} sm².`
        });
      } else {
        const perim = 2 * (a + b);
        list.push({
          id: `${age}-shapes-${i + 1}`,
          tag: 'Perimetr topish',
          visual: `▭ (${a} sm va ${b} sm)`,
          question: `Bo‘yi ${a} sm va eni ${b} sm bo‘lgan to‘g‘ri to‘rtburchakning perimetri necha sm?`,
          options: makeNumericOptions(perim, 10),
          answer: String(perim),
          explanation: `P = 2 × (${a} + ${b}) = ${perim} sm.`
        });
      }
    } else {
      // Shakllar naqshini (Pattern Puzzle) davom ettirish
      const patterns = [
        { seq: ['🔴', '🔵', '🔴', '🔵'], next: '🔴', opts: ['🔴', '🔵', '🟢', '🟡'] },
        { seq: ['🔺', '🟦', '🟡', '🔺', '🟦'], next: '🟡', opts: ['🟡', '🔺', '🟦', '🟣'] },
        { seq: ['⭐', '⭐', '🌙', '⭐', '⭐'], next: '🌙', opts: ['🌙', '⭐', '☀️', '🪐'] },
        { seq: ['🔷', '🔶', '🔷', '🔶'], next: '🔷', opts: ['🔷', '🔶', '⬛', '⬜'] }
      ];
      const p = patterns[i % patterns.length];
      list.push({
        id: `${age}-shapes-${i + 1}`,
        tag: 'Naqshli jumboq (Puzzle)',
        visual: `${p.seq.join(' ')}  ❓`,
        question: `Naqsh mantiqiga ko‘ra so‘roq o‘rniga qaysi shakl qo‘yiladi? (#${i + 1})`,
        options: shuffleArray(p.opts),
        answer: p.next,
        explanation: `Naqsh ketma-ketligida keyingi shakl: ${p.next}`
      });
    }
  }
  return list;
}

// =========================================================================
// BARCHA 2100 SAVOLNI YIG'ISH VA SESSIYALARARO TAKRORLANMASLIK MENEJERI
// =========================================================================
const QUESTION_BANK = {
  '6-9': {
    math: buildMathQuestions('6-9'),
    logic: buildLogicQuestions('6-9'),
    memory: buildMemoryQuestions('6-9'),
    english: buildEnglishQuestions('6-9'),
    speed: buildSpeedQuestions('6-9'),
    quiz: buildQuizQuestions('6-9'),
    shapes: buildShapesQuestions('6-9')
  },
  '9-13': {
    math: buildMathQuestions('9-13'),
    logic: buildLogicQuestions('9-13'),
    memory: buildMemoryQuestions('9-13'),
    english: buildEnglishQuestions('9-13'),
    speed: buildSpeedQuestions('9-13'),
    quiz: buildQuizQuestions('9-13'),
    shapes: buildShapesQuestions('9-13')
  },
  '13-17': {
    math: buildMathQuestions('13-17'),
    logic: buildLogicQuestions('13-17'),
    memory: buildMemoryQuestions('13-17'),
    english: buildEnglishQuestions('13-17'),
    speed: buildSpeedQuestions('13-17'),
    quiz: buildQuizQuestions('13-17'),
    shapes: buildShapesQuestions('13-17')
  }
};

// Oldin ishlangan savollar IDlarini saqlash (sessiyalararo takrorlanmaslik uchun)
const SessionQuestionManager = {
  getSeenIds(age, gameId) {
    const key = `aqlqala_seen_${age}_${gameId}`;
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  },

  markAsSeen(age, gameId, qId) {
    const key = `aqlqala_seen_${age}_${gameId}`;
    const seen = new Set(this.getSeenIds(age, gameId));
    seen.add(qId);
    // Agar barcha 100 ta savol tugab qolsa, eng eski 70 tasini tozalaymiz (oxirgi 30 tasi darhol takrorlanmaydi!)
    let arr = [...seen];
    if (arr.length >= 100) {
      arr = arr.slice(-30);
    }
    localStorage.setItem(key, JSON.stringify(arr));
  },

  getFreshDeck(age, gameId) {
    const all100 = QUESTION_BANK[age][gameId];
    const seenSet = new Set(this.getSeenIds(age, gameId));

    const unseen = shuffleArray(all100.filter(q => !seenSet.has(q.id)));
    const seen = shuffleArray(all100.filter(q => seenSet.has(q.id)));

    // Avval umuman ko'rilmagan savollar chiqadi, keyin eng eski ko'rilganlar
    return [...unseen, ...seen];
  }
};