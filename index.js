/**
 * AqlQal'a - Asosiy Ilova Boshqaruvi, Web Audio Ovozlar va Reyting Tizimi
 */

// =========================================================================
// 1. WEB AUDIO API QUVNOQ OVOZ EFFEKTLARI (Tashqi mp3 faylsiz ishlaydi)
// =========================================================================
const soundFX = {
  enabled: true,
  ctx: null,

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  toggle() {
    this.enabled = !this.enabled;
    const icon = document.getElementById('sound-icon');
    icon.className = this.enabled ? 'bi bi-volume-up-fill' : 'bi bi-volume-mute-fill';
    if (this.enabled) this.playClick();
  },

  playTone(freq, type = 'sine', duration = 0.15, delay = 0) {
    if (!this.enabled) return;
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

      gain.gain.setValueAtTime(0.14, this.ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration);
    } catch (e) {
      // Brauzer audio bloklasa xatolik chiqarmaydi
    }
  },

  playClick() {
    this.playTone(520, 'triangle', 0.08, 0);
  },

  playSuccess() {
    this.playTone(523.25, 'sine', 0.14, 0);     // C5
    this.playTone(659.25, 'sine', 0.14, 0.09);  // E5
    this.playTone(783.99, 'sine', 0.24, 0.18);  // G5
  },

  playError() {
    this.playTone(260, 'triangle', 0.18, 0);
    this.playTone(210, 'triangle', 0.24, 0.14);
  },

  playStart() {
    this.playTone(440, 'sine', 0.12, 0);
    this.playTone(554, 'sine', 0.12, 0.08);
    this.playTone(659, 'sine', 0.18, 0.16);
  },

  playFanfare() {
    this.playTone(523.25, 'triangle', 0.15, 0);
    this.playTone(659.25, 'triangle', 0.15, 0.12);
    this.playTone(783.99, 'triangle', 0.15, 0.24);
    this.playTone(1046.5, 'triangle', 0.4, 0.36);
  }
};

// =========================================================================
// 2. REYTING, DARAJALAR VA YUTUQLAR (localStorage)
// =========================================================================
const RANKS = [
  { minStars: 0, title: 'Yangi boshlovchi', icon: '🌱' },
  { minStars: 25, title: 'Zukko o‘yinchi', icon: '🦊' },
  { minStars: 75, title: 'Bilimdon', icon: '🦉' },
  { minStars: 150, title: 'Super daho', icon: '🚀' },
  { minStars: 300, title: 'Aql chempioni', icon: '👑' }
];

const ACHIEVEMENTS = [
  { id: 'first_game', title: 'Ilk qadam', desc: '1-o‘yinni yakunlash', icon: '🎮', check: d => d.gamesPlayed >= 1 },
  { id: 'star_10', title: 'Yulduz ovchisi', desc: '10 ta yulduz yig‘ish', icon: '⭐', check: d => d.totalStars >= 10 },
  { id: 'star_50', title: 'Yulduzlar qiroli', desc: '50 ta yulduz yig‘ish', icon: '🌟', check: d => d.totalStars >= 50 },
  { id: 'score_500', title: '500 ball marrasi', desc: '500 umumiy ball to‘plash', icon: '💎', check: d => d.totalScore >= 500 },
  { id: 'games_5', title: 'Faol bilimdon', desc: '5 ta o‘yin o‘ynash', icon: '🔥', check: d => d.gamesPlayed >= 5 },
  { id: 'master_200', title: 'Super Daho', desc: '150 ta yulduzga erishish', icon: '👑', check: d => d.totalStars >= 150 }
];

const storageManager = {
  KEY: 'aqlqala_user_profile_v1',

  getData() {
    const today = new Date().toLocaleDateString('uz-UZ');
    const defaultData = {
      totalScore: 0,
      totalStars: 0,
      gamesPlayed: 0,
      bestScore: 0,
      dailyDate: today,
      dailyStars: 0
    };
    try {
      const saved = JSON.parse(localStorage.getItem(this.KEY));
      if (!saved) return defaultData;
      if (saved.dailyDate !== today) {
        saved.dailyDate = today;
        saved.dailyStars = 0;
      }
      return { ...defaultData, ...saved };
    } catch {
      return defaultData;
    }
  },

  saveData(data) {
    localStorage.setItem(this.KEY, JSON.stringify(data));
    this.syncUI();
  },

  recordGameResult({ score, stars }) {
    const data = this.getData();
    data.totalScore += score;
    data.totalStars += stars;
    data.gamesPlayed += 1;
    data.dailyStars += stars;
    if (score > data.bestScore) data.bestScore = score;
    this.saveData(data);
  },

  getCurrentRank(stars) {
    let current = RANKS[0];
    let next = RANKS[1];
    for (let i = 0; i < RANKS.length; i++) {
      if (stars >= RANKS[i].minStars) {
        current = RANKS[i];
        next = RANKS[i + 1] || null;
      }
    }
    return { current, next };
  },

  syncUI() {
    const data = this.getData();
    const { current, next } = this.getCurrentRank(data.totalStars);

    // Navbar va Bosh sahifa
    document.getElementById('nav-stars').textContent = data.totalStars;
    document.getElementById('nav-score').textContent = data.totalScore;
    document.getElementById('nav-rank').textContent = current.title;

    const homeStars = document.getElementById('home-user-stars');
    const homePlayed = document.getElementById('home-games-played');
    if (homeStars) homeStars.textContent = data.totalStars;
    if (homePlayed) homePlayed.textContent = data.gamesPlayed;

    // Modal profil
    document.getElementById('modal-rank-icon').textContent = current.icon;
    document.getElementById('modal-rank-title').textContent = current.title;

    if (next) {
      const diff = next.minStars - data.totalStars;
      const pct = Math.min(100, Math.round(((data.totalStars - current.minStars) / (next.minStars - current.minStars)) * 100));
      document.getElementById('modal-rank-next').textContent = `"${next.title}" darajasigacha yana ${diff} ⭐ kerak!`;
      document.getElementById('modal-rank-progress').style.width = `${Math.max(8, pct)}%`;
    } else {
      document.getElementById('modal-rank-next').textContent = 'Tabriklaymiz! Eng yuqori darajaga yetdingiz! 🎉';
      document.getElementById('modal-rank-progress').style.width = '100%';
    }

    document.getElementById('prof-total-score').textContent = data.totalScore;
    document.getElementById('prof-total-stars').textContent = `${data.totalStars} ⭐`;
    document.getElementById('prof-games-played').textContent = data.gamesPlayed;
    document.getElementById('prof-best-score').textContent = data.bestScore;
    document.getElementById('prof-today-date').textContent = data.dailyDate;
    document.getElementById('prof-daily-stars').textContent = `${data.dailyStars} ⭐`;

    // Yutuqlar ro'yxati
    const achList = document.getElementById('achievements-list');
    achList.innerHTML = '';
    ACHIEVEMENTS.forEach(a => {
      const unlocked = a.check(data);
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6';
      col.innerHTML = `
        <div class="ach-badge ${unlocked ? 'unlocked' : ''}">
          <span class="fs-2">${unlocked ? a.icon : '🔒'}</span>
          <div>
            <div class="fw-bold">${a.title}</div>
            <small class="text-muted">${a.desc}</small>
          </div>
        </div>
      `;
      achList.appendChild(col);
    });
  }
};

// =========================================================================
// 3. SAHIFALARARO NAVIGATSIYA VA O'YINLAR MENYUSI
// =========================================================================
const app = {
  selectedAge: '6-9',

  switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('d-none'));
    document.getElementById(viewId).classList.remove('d-none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  showHome() {
    clearInterval(gameEngine.timerInterval);
    soundFX.playClick();
    storageManager.syncUI();
    this.switchView('home-view');
  },

  selectAge(age) {
    this.selectedAge = age;
    soundFX.playClick();
    document.getElementById('selected-age-title').textContent = AGE_CONFIG[age].title;
    this.renderGamesMenu(age);
    this.switchView('games-menu-view');
  },

  backToGamesMenu() {
    soundFX.playClick();
    this.renderGamesMenu(this.selectedAge);
    this.switchView('games-menu-view');
  },

  quickStart(age, gameId) {
    this.selectedAge = age;
    gameEngine.start(age, gameId);
  },

  renderGamesMenu(age) {
    const grid = document.getElementById('games-grid');
    grid.innerHTML = '';

    GAME_META.forEach(game => {
      const seenCount = SessionQuestionManager.getSeenIds(age, game.id).length;
      const col = document.createElement('div');
      col.className = 'col-12 col-sm-6 col-lg-4';
      col.innerHTML = `
        <div class="game-select-card">
          <div class="d-flex justify-content-between align-items-start">
            <div class="game-card-icon" style="background: ${game.color}">${game.icon}</div>
            <span class="badge bg-light text-dark border fw-bold">
              ${seenCount} / 100 ishlangan
            </span>
          </div>
          <h4 class="fw-bold mb-2">${game.title}</h4>
          <p class="text-muted small mb-3">${game.desc}</p>
          <div class="d-flex justify-content-between small fw-bold text-secondary mb-3">
            <span>⏱️ ${AGE_CONFIG[age].timeLimit} soniya</span>
            <span>⭐ 5 yulduzgacha</span>
          </div>
          <button class="btn btn-start-game" onclick="gameEngine.start('${age}', '${game.id}')">
            <i class="bi bi-play-fill me-1"></i>O‘yinni boshlash
          </button>
        </div>
      `;
      grid.appendChild(col);
    });
  }
};

// Sahifa yuklanganda reytingni sinxronlash
document.addEventListener('DOMContentLoaded', () => {
  storageManager.syncUI();
});