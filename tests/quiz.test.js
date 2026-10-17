// Tests use Node's built-in test runner, so nothing needs to be installed.
// Run them with:  npm test
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  shuffle,
  isCorrect,
  createQuiz,
  answerQuestion,
  advanceQuiz,
  isQuizFinished,
  calculatePercentage,
  getGrade,
  getFeedbackMessage,
  formatTimeLeft,
} = require("../src/quiz.js");

test("isCorrect returns true for the right answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 2), true);
});

test("isCorrect returns false for a wrong answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 0), false);
});

test("createQuiz returns a fresh initial state", () => {
  const questions = [{ answer: 1 }];
  const state = createQuiz(questions);

  assert.deepEqual(state, { questions, current: 0, score: 0 });
  assert.notEqual(state.questions, questions);
});

test("answerQuestion adds a point for a correct answer without mutation", () => {
  const state = createQuiz([{ answer: 1 }]);
  const result = answerQuestion(state, 1);

  assert.deepEqual(result, {
    state: { questions: state.questions, current: 0, score: 1 },
    correct: true,
  });
  assert.equal(state.score, 0);
  assert.notEqual(result.state, state);
});

test("answerQuestion leaves the score unchanged for a wrong answer", () => {
  const state = { questions: [{ answer: 1 }], current: 0, score: 2 };
  const result = answerQuestion(state, 0);

  assert.equal(result.correct, false);
  assert.equal(result.state.score, 2);
  assert.equal(state.score, 2);
  assert.notEqual(result.state, state);
});

test("advanceQuiz returns a new state at the next question", () => {
  const state = createQuiz([{ answer: 0 }, { answer: 1 }]);
  const nextState = advanceQuiz(state);

  assert.equal(nextState.current, 1);
  assert.equal(state.current, 0);
  assert.notEqual(nextState, state);
});

test("isQuizFinished is true after advancing past the final question", () => {
  const firstQuestion = createQuiz([{ answer: 0 }]);
  const finishedQuiz = advanceQuiz(firstQuestion);

  assert.equal(isQuizFinished(firstQuestion), false);
  assert.equal(isQuizFinished(finishedQuiz), true);
});

test("calculatePercentage rounds to a whole number", () => {
  assert.equal(calculatePercentage(2, 3), 67);
});

test("calculatePercentage returns 0 when there are no questions", () => {
  assert.equal(calculatePercentage(0, 0), 0);
});

test("shuffle keeps every item and does not change the original array", () => {
  const original = [1, 2, 3, 4, 5];
  const result = shuffle(original);
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
});

test("getGrade gives an A for exactly 90%", () => {
  assert.equal(getGrade(90), "A");
});

test("getGrade gives a B for exactly 75%", () => {
  assert.equal(getGrade(75), "B");
});

test("getGrade gives a C for exactly 50%", () => {
  assert.equal(getGrade(50), "C");
});

test("getFeedbackMessage returns encouraging feedback for each grade", () => {
  assert.equal(getFeedbackMessage("A"), "Excellent work!");
  assert.equal(getFeedbackMessage("B"), "Great job!");
  assert.equal(getFeedbackMessage("C"), "Good effort!");
  assert.equal(getFeedbackMessage("Keep practicing"), "Keep practicing!");
});

test("formatTimeLeft formats remaining seconds", () => {
  assert.equal(formatTimeLeft(12), "⏱ 12s");
  assert.equal(formatTimeLeft(5), "⏱ 5s");
  assert.equal(formatTimeLeft(0), "⏱ 0s");
});
