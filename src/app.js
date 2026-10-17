// UI code: connects the quiz logic (quiz.js) to the page (index.html).

let state = createQuiz([]);
const QUESTION_TIME_SECONDS = 15;
let timerInterval = null;
let secondsLeft = QUESTION_TIME_SECONDS;
let questionResolved = false;

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const progressText = document.getElementById("progress");
const timerText = document.getElementById("timer");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options");
const feedbackText = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");
const scoreText = document.getElementById("score-text");
const gradeText = document.getElementById("grade-text");

function showScreen(screenToShow) {
  [startScreen, quizScreen, resultScreen].forEach((screen) => {
    screen.hidden = screen !== screenToShow;
  });
}

function clearQuestionTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimer() {
  timerText.textContent = formatTimeLeft(secondsLeft);
  timerText.classList.toggle("timer--urgent", secondsLeft <= 5);
}

function startQuestionTimer() {
  secondsLeft = QUESTION_TIME_SECONDS;
  updateTimer();
  timerInterval = setInterval(() => {
    secondsLeft--;
    updateTimer();
    if (secondsLeft === 0) {
      timeOutQuestion();
    }
  }, 1000);
}

function startQuiz() {
  clearQuestionTimer();
  state = createQuiz(shuffle(QUESTIONS));
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  clearQuestionTimer();
  questionResolved = false;
  const question = state.questions[state.current];
  progressText.textContent = `Question ${state.current + 1} of ${state.questions.length}`;
  questionText.textContent = question.question;
  feedbackText.textContent = "";
  nextButton.hidden = true;
  optionsList.innerHTML = "";

  question.options.forEach((option, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(index, button));
    item.appendChild(button);
    optionsList.appendChild(item);
  });

  startQuestionTimer();
}

function resolveQuestion() {
  if (questionResolved) return null;
  questionResolved = true;
  clearQuestionTimer();
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));
  return buttons;
}

function selectAnswer(selectedIndex, selectedButton) {
  const buttons = resolveQuestion();
  if (!buttons) return;
  const question = state.questions[state.current];
  const result = answerQuestion(state, selectedIndex);
  state = result.state;

  if (result.correct) {
    selectedButton.classList.add("correct");
    feedbackText.textContent = "Correct!";
  } else {
    selectedButton.classList.add("wrong");
    buttons[question.answer].classList.add("correct");
    feedbackText.textContent = "Not quite. The correct answer is highlighted.";
  }

  nextButton.hidden = false;
  nextButton.focus();
}

function timeOutQuestion() {
  const buttons = resolveQuestion();
  if (!buttons) return;
  secondsLeft = 0;
  updateTimer();
  const question = state.questions[state.current];
  buttons[question.answer].classList.add("correct");
  feedbackText.textContent = "Time's up! The correct answer is highlighted.";
  nextButton.hidden = false;
  nextButton.focus();
}

function nextQuestion() {
  if (!questionResolved) return;
  clearQuestionTimer();
  state = advanceQuiz(state);
  if (!isQuizFinished(state)) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  clearQuestionTimer();
  const total = state.questions.length;
  const percentage = calculatePercentage(state.score, total);
  scoreText.textContent = `You scored ${state.score} out of ${total} (${percentage}%)`;
  gradeText.textContent = `Grade: ${getGrade(percentage)}`;
  showScreen(resultScreen);
}

document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("restart-btn").addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
