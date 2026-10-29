const levels = [
  ['Level 1: Home Row', 'Practice the home-row keys: A S D F and J K L ;.'],
  ['Level 2: Top Row', 'Build familiarity with Q W E R T Y U I O P.'],
  ['Level 3: Bottom Row', 'Practice Z X C V B N M with steady rhythm.'],
  ['Level 4: Capital Letters', 'Use Shift and Caps Lock correctly.'],
  ['Level 5: Numbers & Symbols', 'Practice number keys and common punctuation.'],
  ['Level 6: Office Vocabulary', 'Type common words used in office communication.'],
  ['Level 7: Full Sentences', 'Combine accuracy, speed, and punctuation.']
];

const prompts = [
  'The home row keys help typists keep their fingers in the correct position.',
  'A good typist focuses on accuracy first and gradually improves speed.',
  'Clear communication helps office teams coordinate their daily tasks.',
  'Use the correct fingers and keep your wrists relaxed while typing.'
];

const questions = [
  {
    q: 'Which device is mainly used to enter text into a computer?',
    o: ['Monitor', 'Keyboard', 'Speaker', 'Projector'],
    a: 1
  },
  {
    q: 'What does CPU stand for?',
    o: ['Central Processing Unit', 'Computer Personal Utility', 'Central Program User', 'Control Power Unit'],
    a: 0
  },
  {
    q: 'Which application is commonly used to create spreadsheets?',
    o: ['Microsoft Excel', 'Paint', 'Notepad', 'Calculator'],
    a: 0
  },
  {
    q: 'Which keyboard row is called the home row?',
    o: ['QWERTY row', 'ASDF JKL; row', 'ZXCV row', 'Number row'],
    a: 1
  },
  {
    q: 'What does URL identify?',
    o: ['A website address', 'A keyboard key', 'A file size', 'A computer brand'],
    a: 0
  },
  {
    q: 'Which is an example of an output device?',
    o: ['Mouse', 'Keyboard', 'Monitor', 'Microphone'],
    a: 2
  },
  {
    q: 'Which shortcut usually copies selected text?',
    o: ['Ctrl + X', 'Ctrl + C', 'Ctrl + V', 'Ctrl + Z'],
    a: 1
  },
  {
    q: 'Which shortcut usually pastes copied content?',
    o: ['Ctrl + P', 'Ctrl + A', 'Ctrl + V', 'Ctrl + S'],
    a: 2
  },
  {
    q: 'What is the main purpose of a strong password?',
    o: ['Make typing faster', 'Protect an account', 'Increase screen brightness', 'Save printer ink'],
    a: 1
  },
  {
    q: 'Which program is best suited for a formal letter?',
    o: ['Word processor', 'Media player', 'Clock', 'Camera'],
    a: 0
  },
  {
    q: 'What does WPM mean in typing practice?',
    o: ['Words per minute', 'Work per monitor', 'Web page mode', 'Write print memory'],
    a: 0
  },
  {
    q: 'Why is typing accuracy important?',
    o: ['It reduces errors', 'It makes the monitor bigger', 'It changes the keyboard', 'It removes files'],
    a: 0
  },
  {
    q: 'Which is a common spreadsheet cell reference?',
    o: ['B4', 'Page Blue', 'File One', 'Keyboard'],
    a: 0
  },
  {
    q: 'What should you do before opening an unexpected email attachment?',
    o: [
      'Open it immediately',
      'Check whether the sender and file are trustworthy',
      'Forward it to everyone',
      'Disable security tools'
    ],
    a: 1
  },
  {
    q: 'Which key creates a space between words?',
    o: ['Tab', 'Shift', 'Spacebar', 'Esc'],
    a: 2
  }
];

let activePrompt = prompts[0];
let timer = null;
let timeLeft = 60;
let startedAt = null;
let quizIndex = 0;
let answers = Array(questions.length).fill(null);
let drillDone = 0;

const $ = id => document.getElementById(id);

function renderLevels() {
  $('levelsGrid').innerHTML = levels.map((level, index) => `
    <article class="level-card">
      <div class="text-xs font-bold uppercase tracking-widest text-indigo-300">
        Level ${index + 1}
      </div>
      <h3 class="mt-2 font-bold">${level[0]}</h3>
      <p>${level[1]}</p>
    </article>
  `).join('');
}

function resetDrill() {
  clearInterval(timer);
  timer = null;

  timeLeft = Number($('drillDuration').value);

  $('drillTimer').textContent = `${timeLeft}s`;
  $('drillWpm').textContent = '0';
  $('drillAccuracy').textContent = '100%';
  $('drillInput').value = '';
  $('drillInput').disabled = true;
  $('drillMessage').textContent = 'Press Start drill when you are ready.';
  $('drillPrompt').textContent = activePrompt;

  startedAt = null;
}

function startDrill() {
  resetDrill();

  timeLeft = Number($('drillDuration').value);
  $('drillTimer').textContent = `${timeLeft}s`;
  $('drillInput').disabled = false;
  $('drillInput').focus();

  startedAt = Date.now();

  $('drillMessage').textContent = 'Start typing the sentence above.';

  timer = setInterval(() => {
    timeLeft--;

    $('drillTimer').textContent = `${timeLeft}s`;

    updateDrillStats();

    if (timeLeft <= 0) {
      finishDrill();
    }
  }, 1000);
}

function updateDrillStats() {
  if (!startedAt) return;

  const typed = $('drillInput').value;
  let correct = 0;

  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === activePrompt[i]) {
      correct++;
    }
  }

  const accuracy = typed.length
    ? Math.round((correct / typed.length) * 100)
    : 100;

  const elapsed = Math.max(1, (Date.now() - startedAt) / 60000);

  const wpm = Math.round(
    typed.trim() ? typed.trim().split(/\s+/).length / elapsed : 0
  );

  $('drillWpm').textContent = String(wpm);
  $('drillAccuracy').textContent = `${accuracy}%`;

  if (typed === activePrompt) {
    finishDrill(true);
  }
}

function finishDrill(completed = false) {
  if (!timer) return;

  clearInterval(timer);
  timer = null;

  $('drillInput').disabled = true;

  if (completed) {
    drillDone++;
    $('drillMessage').textContent = 'Great job! You typed the full prompt.';
  } else {
    $('drillMessage').textContent = 'Time is up! Try again to improve your score.';
  }

  $('achievementMessage').textContent =
    `Typing drills completed: ${drillDone}. Keep practicing for better accuracy and speed.`;
}

function renderQuestion() {
  const question = questions[quizIndex];

  $('quizProgress').textContent =
    `Question ${quizIndex + 1} of ${questions.length}`;

  $('quizQuestion').textContent = question.q;

  $('quizOptions').innerHTML = question.o.map((option, index) => `
    <button
      class="option-btn ${answers[quizIndex] === index ? 'selected' : ''}"
      data-answer="${index}"
    >
      ${String.fromCharCode(65 + index)}. ${option}
    </button>
  `).join('');

  $('prevQuestion').disabled = quizIndex === 0;

  $('nextQuestion').textContent =
    quizIndex === questions.length - 1 ? 'Finish quiz' : 'Next';

  $('quizFeedback').textContent = '';
  $('quizScore').textContent = '';

  document.querySelectorAll('[data-answer]').forEach(button => {
    button.addEventListener('click', () => {
      answers[quizIndex] = Number(button.dataset.answer);
      renderQuestion();
    });
  });
}

function nextQuestion() {
  if (quizIndex < questions.length - 1) {
    quizIndex++;
    renderQuestion();
  } else {
    finishQuiz();
  }
}

function prevQuestion() {
  if (quizIndex > 0) {
    quizIndex--;
    renderQuestion();
  }
}

function finishQuiz() {
  const score = answers.reduce((sum, answer, index) => {
    return sum + (answer === questions[index].a ? 1 : 0);
  }, 0);

  $('quizFeedback').textContent = 'Quiz completed!';
  $('quizScore').textContent = `Your score: ${score} / ${questions.length}`;

  $('achievementMessage').textContent =
    `Latest quiz score: ${score} out of ${questions.length}. You can restart to practice again.`;

  $('nextQuestion').textContent = 'Finish';
}

function restartQuiz() {
  quizIndex = 0;
  answers = Array(questions.length).fill(null);

  renderQuestion();
}

$('startDrill').addEventListener('click', startDrill);
$('resetDrill').addEventListener('click', resetDrill);
$('drillInput').addEventListener('input', updateDrillStats);
$('drillDuration').addEventListener('change', resetDrill);

$('prevQuestion').addEventListener('click', prevQuestion);
$('nextQuestion').addEventListener('click', nextQuestion);
$('restartQuiz').addEventListener('click', restartQuiz);

document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const text = $(button.dataset.copy).textContent;

    try {
      await navigator.clipboard.writeText(text);
      $('libraryMessage').textContent = 'Template copied!';
    } catch (error) {
      $('libraryMessage').textContent =
        'Copy is not available in this browser. Select and copy the template text manually.';
    }
  });
});

$('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light-mode');

  document.documentElement.classList.toggle(
    'dark',
    !document.body.classList.contains('light-mode')
  );
});

renderLevels();
renderQuestion();
resetDrill();
