/**
 * AqlQal'a - O'yin Dvigateli (Game Engine)
 * Taymer, 0-5 Yulduz tizimi, Xotira kartochkalari va Konfetti animatsiyasi
 */

const gameEngine = {
  currentAge: null,
  currentGameId: null,
  deck: [],
  currentIndex: 0,
  score: 0,
  stars: 0,
  correctCount: 0,
  wrongCount: 0,
  totalTimeSpent: 0,

  timeLimit: 15,
  timeLeft: 15,
  questionStartTime: 0,
  timerInterval: null,
  isAnswered: false,

  // O'yinni boshlash
  start(age, gameId) {
    this.currentAge = age;
    this.currentGameId = gameId;
    this.deck = SessionQuestionManager.getFreshDeck(age, gameId);
    this.currentIndex = 0;
    this.score = 0;
    this.stars = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.totalTimeSpent = 0;
    this.timeLimit = AGE_CONFIG[age].timeLimit;

    const meta = GAME_META.find(g => g.id === gameId);
    document.getElementById('arena-game-name').textContent = `${meta.icon} ${meta.title}`;
    this.updateTopStats();

    app.switchView('game-arena-view');
    soundFX.playStart();
    this.loadQuestion();
  },

  restartCurrentGame() {
    this.start(this.currentAge, this.currentGameId);
  },

  confirmStop() {
    clearInterval(this.timerInterval);
    if (this.correctCount + this.wrongCount > 0) {
      this.finishSession();
    } else {
      app.backToGamesMenu();
    }
  },

  updateTopStats() {
    document.getElementById('arena-q-counter').textContent = `${this.currentIndex + 1} / ${this.deck.length}`;
    document.getElementById('arena-score').textContent = this.score;
    document.getElementById('arena-stars').textContent = this.stars;
  },

  // Savolni ekranga chiqarish
  loadQuestion() {
    if (this.currentIndex >= this.deck.length) {
      this.finishSession();
      return;
    }

    this.isAnswered = false;
    const q = this.deck[this.currentIndex];
    SessionQuestionManager.markAsSeen(this.currentAge, this.currentGameId, q.id);

    this.updateTopStats();
    document.getElementById('feedback-area').classList.add('d-none');
    document.getElementById('question-tag').textContent = q.tag;
    document.getElementById('question-text').textContent = q.question;

    const visualEl = document.getElementById('question-visual');
    const optionsGrid = document.getElementById('options-grid');
    optionsGrid.innerHTML = '';

    // Maxsus o'yin turlari (Xotira)
    if (q.type === 'flash-memory') {
      visualEl.innerHTML = `<div class="fw-bold text-primary">${q.memorizeData}</div>`;
      optionsGrid.innerHTML = `<div class="col-12 text-muted fw-bold">👀 Diqqat bilan yodlab oling...</div>`;
      setTimeout(() => {
        if (this.isAnswered) return;
        visualEl.innerHTML = `<span class="badge bg-warning text-dark">🙈 Vaqt bo‘ldi! Endi eslab toping</span>`;
        this.renderOptions(q.options, q.answer);
      }, q.memorizeDuration);
    } else if (q.type === 'pair-match') {
      visualEl.innerHTML = '';
      this.renderPairMatchGame(q.pairs);
    } else {
      visualEl.innerHTML = q.visual || '';
      this.renderOptions(q.options, q.answer);
    }

    // Taymerni ishga tushirish
    this.startTimer();
  },

  renderOptions(options, correctAnswer) {
    const optionsGrid = document.getElementById('options-grid');
    optionsGrid.innerHTML = '';
    options.forEach(opt => {
      const col = document.createElement('div');
      col.className = 'col-12 col-sm-6';
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.onclick = () => this.handleAnswer(opt, correctAnswer, btn);
      col.appendChild(btn);
      optionsGrid.appendChild(col);
    });
  },

  // Interaktiv juftliklarni topish o'yini
  renderPairMatchGame(pairs) {
    const optionsGrid = document.getElementById('options-grid');
    const cards = shuffleArray([...pairs, ...pairs]);
    let flipped = [];
    let matchedCount = 0;

    const wrapper = document.createElement('div');
    wrapper.className = 'col-12';
    const grid = document.createElement('div');
    grid.className = 'memory-grid';

    cards.forEach((emoji) => {
      const card = document.createElement('div');
      card.className = 'mem-card';
      card.textContent = '❓';

      card.onclick = () => {
        if (this.isAnswered || card.classList.contains('flipped') || card.classList.contains('matched') || flipped.length >= 2) {
          return;
        }
        soundFX.playClick();
        card.classList.add('flipped');
        card.textContent = emoji;
        flipped.push({ card, emoji });

        if (flipped.length === 2) {
          const [first, second] = flipped;
          if (first.emoji === second.emoji) {
            first.card.classList.add('matched');
            second.card.classList.add('matched');
            flipped = [];
            matchedCount++;
            if (matchedCount === pairs.length) {
              this.handleAnswer('MATCHED', 'MATCHED', null);
            }
          } else {
            setTimeout(() => {
              first.card.classList.remove('flipped');
              second.card.classList.remove('flipped');
              first.card.textContent = '❓';
              second.card.textContent = '❓';
              flipped = [];
            }, 550);
          }
        }
      };

      grid.appendChild(card);
    });

    wrapper.appendChild(grid);
    optionsGrid.appendChild(wrapper);
  },

  // Taymer boshqaruvi
  startTimer() {
    clearInterval(this.timerInterval);
    this.timeLeft = this.timeLimit;
    this.questionStartTime = Date.now();
    this.updateTimerUI();

    this.timerInterval = setInterval(() => {
      this.timeLeft -= 0.25;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.updateTimerUI();
        clearInterval(this.timerInterval);
        this.handleTimeout();
      } else {
        this.updateTimerUI();
      }
    }, 250);
  },

  updateTimerUI() {
    const pct = Math.max(0, (this.timeLeft / this.timeLimit) * 100);
    const bar = document.getElementById('timer-bar');
    const txt = document.getElementById('timer-text');
    bar.style.width = `${pct}%`;
    txt.textContent = `${Math.ceil(this.timeLeft)}s`;
  },

  // Javobni tekshirish
  handleAnswer(selected, correct, clickedBtn) {
    if (this.isAnswered) return;
    this.isAnswered = true;
    clearInterval(this.timerInterval);

    const elapsed = Math.min(this.timeLimit, (Date.now() - this.questionStartTime) / 1000);
    this.totalTimeSpent += Math.round(elapsed);

    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => {
      b.disabled = true;
      if (b.textContent === correct) {
        b.classList.add('correct-ans');
      }
    });

    const isCorrect = selected === correct;
    const q = this.deck[this.currentIndex];

    if (isCorrect) {
      if (clickedBtn) clickedBtn.classList.add('correct-ans');
      this.correctCount++;
      const earnedStars = this.calculateStars(elapsed, this.timeLimit);
      const earnedPoints = earnedStars * 20;
      this.stars += earnedStars;
      this.score += earnedPoints;

      soundFX.playSuccess();
      if (earnedStars >= 4) launchConfetti(35);

      this.showFeedback(true, earnedStars, `Barakalla! +${earnedPoints} ball`, q.explanation);
    } else {
      if (clickedBtn) clickedBtn.classList.add('wrong-ans');
      this.wrongCount++;
      soundFX.playError();
      this.showFeedback(false, 0, 'Xato javob!', q.explanation);
    }

    this.updateTopStats();
  },

  // Vaqt tugaganda
  handleTimeout() {
    if (this.isAnswered) return;
    this.isAnswered = true;
    this.totalTimeSpent += this.timeLimit;
    this.wrongCount++;

    const q = this.deck[this.currentIndex];
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => {
      b.disabled = true;
      if (b.textContent === q.answer) {
        b.classList.add('correct-ans');
      }
    });

    soundFX.playError();
    this.showFeedback(false, 0, '⏰ Vaqt tugadi!', q.explanation);
  },

  // Tezlikka qarab 1 dan 5 gacha yulduz berish
  calculateStars(elapsed, limit) {
    const ratio = elapsed / limit;
    if (ratio <= 0.25) return 5; // Juda tez!
    if (ratio <= 0.45) return 4; // Yaxshi natija
    if (ratio <= 0.65) return 3; // O'rtacha
    if (ratio <= 0.85) return 2; // Qiyinchilik bilan
    return 1;                    // Oxirgi soniyalarda
  },

  showFeedback(isSuccess, starsCount, title, detail) {
    const area = document.getElementById('feedback-area');
    const starsEl = document.getElementById('feedback-stars');
    const msgEl = document.getElementById('feedback-message');
    const detailEl = document.getElementById('feedback-detail');

    const filled = '⭐'.repeat(starsCount);
    const empty = '☆'.repeat(5 - starsCount);
    starsEl.textContent = filled + empty;

    msgEl.textContent = title;
    msgEl.className = isSuccess ? 'text-success fw-bold mb-1' : 'text-danger fw-bold mb-1';
    detailEl.textContent = detail;

    area.classList.remove('d-none');
  },

  nextQuestion() {
    soundFX.playClick();
    this.currentIndex++;
    this.loadQuestion();
  },

  // O'yin sessiyasini yakunlash va natijalarni saqlash
  finishSession() {
    clearInterval(this.timerInterval);
    soundFX.playFanfare();
    launchConfetti(90);

    // LocalStoragega saqlash
    storageManager.recordGameResult({
      score: this.score,
      stars: this.stars,
      correct: this.correctCount,
      wrong: this.wrongCount
    });

    // Natija ekranini to'ldirish
    document.getElementById('res-correct-count').textContent = this.correctCount;
    document.getElementById('res-wrong-count').textContent = this.wrongCount;
    document.getElementById('res-time-spent').textContent = `${this.totalTimeSpent} soniya`;
    document.getElementById('res-stars-earned').textContent = `${this.stars} ⭐`;
    document.getElementById('res-score-earned').textContent = `${this.score} 💎`;

    let congrats = 'Ajoyib harakat!';
    let emoji = '🌟';
    if (this.stars >= 25) {
      congrats = 'SUPER DAHO! Siz haqiqiy chempionsiz!';
      emoji = '👑';
    } else if (this.stars >= 10) {
      congrats = 'Zukko o‘yinchi! Juda yaxshi natija!';
      emoji = '🏆';
    } else if (this.correctCount > 0) {
      congrats = 'Yaxshi boshlanish! Davom eting!';
      emoji = '🎯';
    }

    document.getElementById('result-emoji').textContent = emoji;
    document.getElementById('result-congrats').textContent = congrats;

    app.switchView('result-view');
  }
};

// =========================================================================
// KONFETTI ANIMATSIYASI
// =========================================================================
function launchConfetti(count = 60) {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#facc15', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6', '#f97316'];
  const pieces = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    r: Math.random() * 7 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    vy: Math.random() * 4 + 2.5,
    vx: Math.random() * 3 - 1.5,
    rot: Math.random() * 360
  }));

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.y += p.vy;
      p.x += p.vx;
      p.rot += 5;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.4);
      ctx.restore();
    });
    frame++;
    if (frame < 110) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  animate();
}