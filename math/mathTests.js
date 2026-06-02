/**
 * Math Tests Module
 * A reusable module for generating and managing math problems across different difficulty levels
 * Compatible with grades 1-5
 */

class MathTests {
    /**
     * One shared set of operation generators. Each takes a `range` object and
     * returns a `{ problem, answer }` pair, mirroring the original inline
     * templates exactly (same `rand(0..n-1)+1` bounds and `?`-suffixed strings).
     */
    static get OPERATIONS() {
        // Inclusive integer in [1, max] — matches Math.floor(random()*max)+1.
        const r = (max) => Math.floor(Math.random() * max) + 1;
        return {
            // Addition: first addend in [1, maxA]; second in [1, cap - first].
            addition: ({ maxA, cap }) => {
                const num1 = r(maxA);
                const num2 = Math.floor(Math.random() * (cap - num1)) + 1;
                return { problem: `${num1} + ${num2} = ?`, answer: num1 + num2 };
            },
            // Subtraction: minuend in [1, max]; subtrahend in [1, minuend].
            subtraction: ({ max }) => {
                const num1 = r(max);
                const num2 = Math.floor(Math.random() * num1) + 1;
                return { problem: `${num1} - ${num2} = ?`, answer: num1 - num2 };
            },
            // Multiplication: both factors in [1, max].
            multiplication: ({ max }) => {
                const num1 = r(max);
                const num2 = r(max);
                return { problem: `${num1} × ${num2} = ?`, answer: num1 * num2 };
            }
        };
    }

    /**
     * Per-grade operation mix. For each grade, operations are tried in order
     * and selected when `Math.random()` falls below `threshold` (cumulative);
     * the final entry's threshold is 1 so an operation is always chosen.
     * `range` carries the bounds passed to the matching generator.
     */
    static get GRADE_CONFIG() {
        return {
            // Grade 1: Addition up to 10
            1: [
                { op: 'addition', threshold: 1, range: { maxA: 9, cap: 10 } }
            ],
            // Grade 2: Addition up to 20, subtraction up to 10
            2: [
                { op: 'addition', threshold: 0.7, range: { maxA: 15, cap: 20 } },
                { op: 'subtraction', threshold: 1, range: { max: 10 } }
            ],
            // Grade 3: Addition up to 50, subtraction up to 20, simple multiplication
            3: [
                { op: 'addition', threshold: 0.5, range: { maxA: 30, cap: 50 } },
                { op: 'subtraction', threshold: 0.8, range: { max: 20 } },
                { op: 'multiplication', threshold: 1, range: { max: 5 } }
            ],
            // Grade 4: Addition up to 100, subtraction up to 50, multiplication tables 1-6
            4: [
                { op: 'addition', threshold: 0.4, range: { maxA: 60, cap: 100 } },
                { op: 'subtraction', threshold: 0.7, range: { max: 50 } },
                { op: 'multiplication', threshold: 1, range: { max: 6 } }
            ],
            // Grade 5: Addition up to 200, subtraction up to 100, multiplication tables 1-10
            5: [
                { op: 'addition', threshold: 0.3, range: { maxA: 120, cap: 200 } },
                { op: 'subtraction', threshold: 0.6, range: { max: 100 } },
                { op: 'multiplication', threshold: 1, range: { max: 10 } }
            ]
        };
    }

    constructor() {
        this.currentProblem = null;
        this.exerciseCount = 0;
        this.correctAnswers = 0;
        this.sessionActive = false;
        this.problemsSolved = 0;
        this.selectedDifficulty = 1;
    }

    /**
     * Generate a math problem based on difficulty level.
     *
     * Per-grade differences are driven by GRADE_CONFIG (see the static getter
     * below): each grade lists the operations it can produce, the cumulative
     * probability threshold that selects each operation, and the random ranges
     * fed to one shared set of operation generators (MathTests.OPERATIONS).
     *
     * @param {number} difficulty - Difficulty level (1-5, corresponding to grades)
     * @returns {object} Object containing problem string and answer number
     */
    generateMathProblem(difficulty) {
        // Default to grade 1 if difficulty is invalid
        if (!difficulty || difficulty < 1 || difficulty > 5) {
            difficulty = 1;
        }

        const operations = MathTests.OPERATIONS;
        const config = MathTests.GRADE_CONFIG[difficulty];

        // Pick an operation by walking the cumulative probability thresholds.
        // The last entry's threshold is 1, so the loop always selects one.
        const roll = Math.random();
        const choice = config.find(entry => roll < entry.threshold) || config[config.length - 1];

        return operations[choice.op](choice.range);
    }

    /**
     * Start a new math exercise session
     * @param {number} difficulty - Difficulty level for the session
     * @param {number} exercisesPerSession - Number of exercises in this session (default: 3)
     */
    startMathExercise(difficulty, exercisesPerSession = 3) {
        this.sessionActive = true;
        this.exerciseCount = 0;
        this.correctAnswers = 0;
        this.selectedDifficulty = difficulty;
        this.exercisesPerSession = exercisesPerSession;
        
        this.currentProblem = this.generateMathProblem(difficulty);
        return this.currentProblem;
    }

    /**
     * Submit an answer and get the result
     * @param {number} userAnswer - The user's answer
     * @returns {object} Object containing result info and next problem if available
     */
    submitMathAnswer(userAnswer) {
        const correctAnswer = this.currentProblem.answer;
        const isCorrect = userAnswer === correctAnswer;
        
        if (isCorrect) {
            this.correctAnswers++;
        }
        
        this.exerciseCount++;
        
        const result = {
            isCorrect,
            userAnswer,
            correctAnswer,
            exerciseCount: this.exerciseCount,
            correctAnswers: this.correctAnswers,
            totalExercises: this.exercisesPerSession,
            isSessionComplete: this.exerciseCount >= this.exercisesPerSession
        };
        
        // Generate next problem if session is not complete
        if (!result.isSessionComplete) {
            this.currentProblem = this.generateMathProblem(this.selectedDifficulty);
            result.nextProblem = this.currentProblem;
        } else {
            this.finishMathSession();
        }
        
        return result;
    }

    /**
     * Finish the current math session.
     * Idempotent: if the session is already finished (sessionActive is false)
     * this is a no-op that returns the same summary without double-counting.
     * @returns {object} Session summary
     */
    finishMathSession() {
        if (!this.sessionActive) {
            // Session already finished — return current stats without modifying them
            return {
                totalExercises: this.exercisesPerSession,
                correctAnswers: this.correctAnswers,
                accuracy: this.exercisesPerSession > 0
                    ? (this.correctAnswers / this.exercisesPerSession) * 100
                    : 0,
                problemsSolved: this.problemsSolved
            };
        }
        this.sessionActive = false;
        this.problemsSolved += this.correctAnswers;
        
        const sessionSummary = {
            totalExercises: this.exercisesPerSession,
            correctAnswers: this.correctAnswers,
            accuracy: (this.correctAnswers / this.exercisesPerSession) * 100,
            problemsSolved: this.problemsSolved
        };
        
        return sessionSummary;
    }

    /**
     * Reset the math test module to initial state
     */
    reset() {
        this.currentProblem = null;
        this.exerciseCount = 0;
        this.correctAnswers = 0;
        this.sessionActive = false;
        this.problemsSolved = 0;
        this.selectedDifficulty = 1;
    }

    /**
     * Get current session statistics
     * @returns {object} Current session info
     */
    getSessionStats() {
        return {
            sessionActive: this.sessionActive,
            exerciseCount: this.exerciseCount,
            correctAnswers: this.correctAnswers,
            problemsSolved: this.problemsSolved,
            selectedDifficulty: this.selectedDifficulty
        };
    }

    /**
     * Set the difficulty level
     * @param {number} difficulty - Difficulty level (1-5)
     */
    setDifficulty(difficulty) {
        if (difficulty >= 1 && difficulty <= 5) {
            this.selectedDifficulty = difficulty;
        }
    }

    /**
     * Get difficulty level description
     * @param {number} difficulty - Difficulty level (1-5)
     * @returns {string} Description of the difficulty level
     */
    getDifficultyDescription(difficulty) {
        const descriptions = {
            1: "Grade 1: Addition up to 10",
            2: "Grade 2: Addition up to 20, subtraction up to 10",
            3: "Grade 3: Addition up to 50, subtraction up to 20, simple multiplication",
            4: "Grade 4: Addition up to 100, subtraction up to 50, multiplication tables 1-6",
            5: "Grade 5: Addition up to 200, subtraction up to 100, multiplication tables 1-10"
        };
        return descriptions[difficulty] || descriptions[1];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MathTests;
} else if (typeof window !== 'undefined') {
    window.MathTests = MathTests;
}