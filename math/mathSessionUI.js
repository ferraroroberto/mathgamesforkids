/**
 * Math Session UI Module
 *
 * The four games (elemental_warrior, mountain_dung_dodger, birds_vs_robots,
 * tetris) each grew an identical copy of the math-exercise presentation loop
 * around the shared MathTests module: render the problem, show a correct /
 * incorrect line, advance a `exerciseCount / total` progress bar, wait 1500 ms,
 * then either show the next problem or finish the session. Only two things
 * actually differed between games — the DOM element ids / container toggle
 * style, and the *reward tail* that runs once the session ends (lives vs. score
 * bonuses vs. plain start-game).
 *
 * This factory centralises that loop. Pass it the game's MathTests instance,
 * the DOM ids, a few presentation flags, and an `onFinish(summary)` callback
 * that carries the game-specific reward semantics. It returns the three
 * functions each game wires to its buttons:
 *   { startMathExercise, submitMathAnswer, finishMathSession }
 *
 * @param {object} options
 * @param {MathTests} options.mathTests      - the game's MathTests instance
 * @param {function():number} options.getDifficulty - returns the grade/difficulty for the next session
 * @param {number} [options.exercisesPerSession=3] - problems per session
 * @param {object} options.ids               - DOM element ids
 * @param {string} options.ids.problem       - element showing the problem text
 * @param {string} options.ids.answer        - the answer <input>
 * @param {string} options.ids.result        - element showing correct/incorrect feedback
 * @param {string} options.ids.progress      - progress-bar element (its style.width is set)
 * @param {string} [options.ids.instructions]- optional element showing "Solve ... (n/total)"
 * @param {string} options.ids.container     - the screen/modal wrapper toggled open/closed
 * @param {string} options.containerToggleClass - class toggled on the container ('hidden' or 'visible')
 * @param {string} options.containerVisibleWhen - 'class-absent' (e.g. 'hidden') or 'class-present' (e.g. 'visible')
 * @param {string} [options.resultClass='mathResult'] - CSS class on the feedback <div>
 * @param {boolean} [options.focusAnswerOnStart=false] - focus the input when a session starts
 * @param {string} [options.invalidInput='none'] - 'none' | 'alert' | 'inline': how to handle a non-numeric answer
 * @param {function(object):void} options.onFinish - per-game reward tail; receives the MathTests session summary
 * @returns {{startMathExercise: function, submitMathAnswer: function, finishMathSession: function}}
 */
function createMathSessionUI(options) {
    const {
        mathTests,
        getDifficulty,
        exercisesPerSession = 3,
        ids,
        containerToggleClass,
        containerVisibleWhen,
        resultClass = 'mathResult',
        focusAnswerOnStart = false,
        invalidInput = 'none',
        onFinish
    } = options;

    const NEXT_PROBLEM_DELAY_MS = 1500;
    const el = (id) => document.getElementById(id);

    function showContainer() {
        const node = el(ids.container);
        if (containerVisibleWhen === 'class-present') {
            node.classList.add(containerToggleClass);    // e.g. add 'visible'
        } else {
            node.classList.remove(containerToggleClass);  // e.g. remove 'hidden'
        }
    }

    function hideContainer() {
        const node = el(ids.container);
        if (containerVisibleWhen === 'class-present') {
            node.classList.remove(containerToggleClass);  // e.g. remove 'visible'
        } else {
            node.classList.add(containerToggleClass);     // e.g. add 'hidden'
        }
    }

    function setInstructions(text) {
        if (ids.instructions) {
            el(ids.instructions).textContent = text;
        }
    }

    function setProgress(fraction) {
        el(ids.progress).style.width = `${fraction * 100}%`;
    }

    function startMathExercise() {
        const problem = mathTests.startMathExercise(getDifficulty(), exercisesPerSession);
        el(ids.problem).textContent = problem.problem;

        el(ids.answer).value = '';
        el(ids.result).innerHTML = '';
        setInstructions(`Solve the math problem to continue! (1/${exercisesPerSession})`);
        setProgress(0);

        showContainer();

        if (focusAnswerOnStart) {
            el(ids.answer).focus();
        }
    }

    // Returns the validated numeric answer, or null if the input was invalid
    // (after surfacing the configured feedback). null means "do not submit".
    function readAnswer() {
        const raw = el(ids.answer).value;

        if (invalidInput === 'inline') {
            const cleanValue = raw.replace(/[^0-9]/g, '');
            const value = parseInt(cleanValue);
            if (isNaN(value) || cleanValue === '') {
                el(ids.result).innerHTML =
                    `<div class="${resultClass} incorrect">❌ Please enter a valid number</div>`;
                return null;
            }
            return value;
        }

        const value = parseInt(raw);
        if (invalidInput === 'alert' && isNaN(value)) {
            alert('Please enter a valid number');
            return null;
        }
        return value;
    }

    function submitMathAnswer() {
        const userAnswer = readAnswer();
        if (userAnswer === null) {
            return;
        }

        const result = mathTests.submitMathAnswer(userAnswer);

        if (result.isCorrect) {
            el(ids.result).innerHTML =
                `<div class="${resultClass} correct">✅ Correct! Well done!</div>`;
        } else {
            el(ids.result).innerHTML =
                `<div class="${resultClass} incorrect">❌ Wrong! The answer was ${result.correctAnswer}</div>`;
        }

        setProgress(result.exerciseCount / exercisesPerSession);

        if (!result.isSessionComplete) {
            setTimeout(() => {
                el(ids.problem).textContent = result.nextProblem.problem;
                el(ids.answer).value = '';
                el(ids.result).innerHTML = '';
                setInstructions(
                    `Solve the math problem to continue! (${result.exerciseCount + 1}/${exercisesPerSession})`
                );
            }, NEXT_PROBLEM_DELAY_MS);
        } else {
            setTimeout(() => {
                finishMathSession();
            }, NEXT_PROBLEM_DELAY_MS);
        }
    }

    function finishMathSession() {
        hideContainer();
        const sessionSummary = mathTests.finishMathSession();
        onFinish(sessionSummary);
    }

    return { startMathExercise, submitMathAnswer, finishMathSession };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = createMathSessionUI;
} else if (typeof window !== 'undefined') {
    window.createMathSessionUI = createMathSessionUI;
}
