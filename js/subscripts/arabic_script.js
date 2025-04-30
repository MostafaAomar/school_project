// script.js

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('../../data/subdata/arabic_data.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    const data = await response.json();
    new ArabicLearningApp(data);
  } catch (err) {
    console.error('Fetch error:', err);
    alert(`Failed to load learning data: ${err.message}`);
  }
});

class ArabicLearningApp {
  constructor(data) {
    this.data = data;
    this.currentCategory = 'letters';
    this.currentIndex = 0;
    this.score = this._loadProgress().score || 0;
    this.gameMode = 'cards';
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.currentExerciseIndex = 0;

    this._cacheDOM();
    this._bindEvents();
    this.switchMode('cards');
    this._updateScore();
  }

  /* DOM caching */
  _cacheDOM() {
    this.container = document.querySelector('.container');
    this.modeButtons = document.querySelectorAll('.mode-btn');
    this.staticCategoryButtons = document.querySelector('.category-buttons');
    this.gameContainer = document.querySelector('.game-container');
    this.card = document.querySelector('.card');
    this.controls = document.querySelector('.controls');
   // this.soundBtn = document.getElementById('sound-btn');
    this.starBtn = document.getElementById('star-btn');
    this.homeBtn = document.getElementById('home-btn');
    this.scoreEl = document.getElementById('score');
  }

  /* Local storage */
  _loadProgress() {
    const saved = localStorage.getItem('arabicLearningProgress');
    return saved ? JSON.parse(saved) : { score: 0 };
  }

  _saveProgress() {
    localStorage.setItem('arabicLearningProgress', JSON.stringify({ score: this.score }));
  }

  _updateScore() {
    this.scoreEl.textContent = this.score;
  }

  _bindEvents() {
    this.modeButtons.forEach(btn =>
      btn.addEventListener('click', () => {
        document.querySelector('.mode-btn.active')?.classList.remove('active');
        btn.classList.add('active');
        this.switchMode(btn.dataset.mode);
      })
    );

    this.staticCategoryButtons.querySelectorAll('.category-btn').forEach(btn =>
      btn.addEventListener('click', () => {
        this.staticCategoryButtons.querySelector('.active').classList.remove('active');
        btn.classList.add('active');
        this.currentCategory = btn.dataset.category;
        this.currentIndex = 0;
        this._showCards();
      })
    );

    document.getElementById('prev-btn')?.addEventListener('click', () => this._navigate(-1));
    document.getElementById('next-btn')?.addEventListener('click', () => this._navigate(1));
    document.getElementById('flip-btn')?.addEventListener('click', () => this._flipCard());
   // this.soundBtn.addEventListener('click', () => this._playSound());
    this.homeBtn?.addEventListener('click', () => window.location.href = '/index.html');
  }

  switchMode(mode) {
    this.gameMode = mode;
    this._clearUI();

    if (mode === 'cards') this._initCards();
    else if (mode === 'memory') this._initMemory();
    else if (mode === 'exercise') this._initExercise();
  }

  _clearUI() {
    this.card.style.display = 'none';
    this.controls.style.display = 'none';
    this.staticCategoryButtons.style.display = 'none';
   // this.soundBtn.style.display = 'none';
    this.gameContainer.innerHTML = '';
  }

  /* ——— Flash Cards ——— */
  _initCards() {
    this.card.style.display = 'block';
    this.controls.style.display = 'flex';
    this.staticCategoryButtons.style.display = 'flex';
   // this.soundBtn.style.display = 'block';
    this._showCards();
  }

  _showCards() {
    const cardData = this.data[this.currentCategory][this.currentIndex];
    document.querySelector('.arabic-text').textContent = cardData.arabic;
    document.querySelector('.english-text').textContent = cardData.english;
    document.querySelector('.pronunciation').textContent = cardData.pronunciation;
    this.card.classList.remove('flipped');
  }

  _navigate(dir) {
    const len = this.data[this.currentCategory].length;
    this.currentIndex = (this.currentIndex + dir + len) % len;
    this._showCards();
  }

  _flipCard() {
    this.card.classList.toggle('flipped');
  }

  _playSound() {
    const cardData = this.data[this.currentCategory][this.currentIndex];
    console.log(`Playing sound for: ${cardData.pronunciation}`);
  }

  /* ——— Memory Game ——— */
  _initMemory() {
    this.flippedCards = [];
    this.matchedPairs = 0;
    this._clearMessages();

    this.gameContainer.innerHTML = `
      <div class="memory-container">
        <div class="category-buttons memory-categories">
          <button class="category-btn active" data-cat="letters">الاحرف</button>
          <button class="category-btn" data-cat="numbers">الارقام</button>
          <button class="category-btn" data-cat="words">الكلمات</button>
        </div>
        <div class="memory-game"></div>
        <div class="memory-message"></div>
      </div>
    `;

    this.gameContainer.querySelectorAll('.memory-categories .category-btn')
      .forEach(btn => btn.addEventListener('click', () => {
        this.gameContainer.querySelector('.memory-categories .active').classList.remove('active');
        btn.classList.add('active');
        this.currentCategory = btn.dataset.cat;
        this._renderMemoryBoard();
      }));

    this.gameContainer.querySelector('.memory-game')
      .addEventListener('click', e => {
        const card = e.target.closest('.memory-card');
        if (card) this._flipMemory(card);
      });

    this._renderMemoryBoard();
  }

  _renderMemoryBoard() {
    const board = this.gameContainer.querySelector('.memory-game');
    board.innerHTML = '';
    const items = this.data[this.currentCategory].slice(0, 6);
    const cards = [];

    items.forEach(i => {
      cards.push(
        { content: i.arabic, type: 'arabic', pair: i.english },
        { content: i.english, type: 'english', pair: i.arabic }
      );
    });

    cards.sort(() => Math.random() - 0.5);

    cards.forEach(c => {
      const el = document.createElement('div');
      el.className = 'memory-card';
      el.dataset.type = c.type;
      el.dataset.pair = c.pair;
      el.innerHTML = `
        <div class="memory-card-inner">
          <div class="memory-card-front">❓</div>
          <div class="memory-card-back">${c.content}</div>
        </div>
      `;
      board.appendChild(el);
    });
  }

  _flipMemory(card) {
    if (
      this.flippedCards.length === 2 ||
      card.classList.contains('matched') ||
      this.flippedCards.includes(card)
    ) return;

    card.classList.add('flipped');
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      setTimeout(() => this._checkMemoryMatch(), 600);
    }
  }

  _checkMemoryMatch() {
    const [cardA, cardB] = this.flippedCards;
    const backA = cardA.querySelector('.memory-card-back').textContent;
    const backB = cardB.querySelector('.memory-card-back').textContent;
    const pairA = cardA.dataset.pair;
    const pairB = cardB.dataset.pair;
    const typeA = cardA.dataset.type;
    const typeB = cardB.dataset.type;

    if (typeA !== typeB && pairA === backB && pairB === backA) {
      [cardA, cardB].forEach(c => c.classList.add('matched'));
      this.matchedPairs++;
      this._addStar();
      if (this.matchedPairs === 6) {
        this._showMessage('memory', '🎉 Completed memory game!');
        this._addStar(5);
      }
    } else {
      setTimeout(() => {
        cardA.classList.remove('flipped');
        cardB.classList.remove('flipped');
      }, 600);
    }

    this.flippedCards = [];
  }

  /* ——— Exercise Mode ——— */
  _initExercise() {
    this.currentExerciseIndex = 0;
    this._nextExercise();
  }

  _nextExercise() {
    this._clearMessages();

    const exercises = this.data.exercises;
    if (this.currentExerciseIndex >= exercises.length) {
      this.gameContainer.innerHTML = `<div class="exercise-complete"><h2>🎉 جميع التمارين انتهت! أحسنت!</h2></div>`;
      return;
    }

    const ex = exercises[this.currentExerciseIndex];
    this.gameContainer.innerHTML = `
      <div class="exercise">
        <h2>اكمل الكلمة التالية</h2>
        <div class="exercise-question">${ex.question}</div>
        <div class="exercise-hint">${ex.hint}</div>
        <input type="text" class="exercise-input" maxlength="2">
        <button class="check-answer-btn">Check Answer</button>
        <div class="exercise-message"></div>
      </div>
    `;

    this.gameContainer.querySelector('.check-answer-btn').addEventListener('click', () => {
      const input = this.gameContainer.querySelector('.exercise-input');
      const message = this.gameContainer.querySelector('.exercise-message');
      if (input.value.trim() === ex.answer) {
        message.textContent = '✅ صحيح!';
        this._addStar(2);
        this.currentExerciseIndex++;
        setTimeout(() => this._nextExercise(), 1000);
      } else {
        message.textContent = '❌ حاول مرة أخرى';
      }
    });
  }

  /* ——— Utilities ——— */
  _clearMessages() {
    ['memory-message', 'exercise-message'].forEach(cls => {
      const el = this.gameContainer.querySelector(`.${cls}`);
      if (el) el.textContent = '';
    });
  }

  _showMessage(mode, text) {
    const el = this.gameContainer.querySelector(`.${mode}-message`);
    if (el) el.textContent = text;
  }

  _addStar(count = 1) {
    this.score += count;
    this._updateScore();
    this._saveProgress();
    this.starBtn.classList.add('celebrating');
    setTimeout(() => this.starBtn.classList.remove('celebrating'), 500);
  }
}


