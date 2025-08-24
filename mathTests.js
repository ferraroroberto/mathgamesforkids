/**
 * Math Tests Module
 * A reusable module for generating and managing math problems across different difficulty levels
 * Compatible with grades 1-5
 */

class MathTests {
    constructor() {
        this.currentProblem = null;
        this.exerciseCount = 0;
        this.correctAnswers = 0;
        this.sessionActive = false;
        this.problemsSolved = 0;
        this.selectedDifficulty = 1;
    }

    /**
     * Generate a math problem based on difficulty level
     * @param {number} difficulty - Difficulty level (1-5, corresponding to grades)
     * @returns {object} Object containing problem string and answer number
     */
    generateMathProblem(difficulty) {
        let problem, answer;
        
        // Default to grade 1 if difficulty is invalid
        if (!difficulty || difficulty < 1 || difficulty > 5) {
            difficulty = 1;
        }
        
        switch(difficulty) {
            case 1: // Grade 1: Addition up to 10
                const num1 = Math.floor(Math.random() * 10) + 1;
                const num2 = Math.floor(Math.random() * (10 - num1)) + 1;
                problem = `${num1} + ${num2} = ?`;
                answer = num1 + num2;
                break;
                
            case 2: // Grade 2: Addition up to 20, subtraction up to 10
                if (Math.random() < 0.7) {
                    const num1 = Math.floor(Math.random() * 15) + 1;
                    const num2 = Math.floor(Math.random() * (20 - num1)) + 1;
                    problem = `${num1} + ${num2} = ?`;
                    answer = num1 + num2;
                } else {
                    const num1 = Math.floor(Math.random() * 10) + 1;
                    const num2 = Math.floor(Math.random() * num1) + 1;
                    problem = `${num1} - ${num2} = ?`;
                    answer = num1 - num2;
                }
                break;
                
            case 3: // Grade 3: Addition up to 50, subtraction up to 20, simple multiplication
                const operation = Math.random();
                if (operation < 0.5) {
                    const num1 = Math.floor(Math.random() * 30) + 1;
                    const num2 = Math.floor(Math.random() * (50 - num1)) + 1;
                    problem = `${num1} + ${num2} = ?`;
                    answer = num1 + num2;
                } else if (operation < 0.8) {
                    const num1 = Math.floor(Math.random() * 20) + 1;
                    const num2 = Math.floor(Math.random() * num1) + 1;
                    problem = `${num1} - ${num2} = ?`;
                    answer = num1 - num2;
                } else {
                    const num1 = Math.floor(Math.random() * 5) + 1;
                    const num2 = Math.floor(Math.random() * 5) + 1;
                    problem = `${num1} × ${num2} = ?`;
                    answer = num1 * num2;
                }
                break;
                
            case 4: // Grade 4: Addition up to 100, subtraction up to 50, multiplication tables 1-6
                const op = Math.random();
                if (op < 0.4) {
                    const num1 = Math.floor(Math.random() * 60) + 1;
                    const num2 = Math.floor(Math.random() * (100 - num1)) + 1;
                    problem = `${num1} + ${num2} = ?`;
                    answer = num1 + num2;
                } else if (op < 0.7) {
                    const num1 = Math.floor(Math.random() * 50) + 1;
                    const num2 = Math.floor(Math.random() * num1) + 1;
                    problem = `${num1} - ${num2} = ?`;
                    answer = num1 - num2;
                } else {
                    const num1 = Math.floor(Math.random() * 6) + 1;
                    const num2 = Math.floor(Math.random() * 6) + 1;
                    problem = `${num1} × ${num2} = ?`;
                    answer = num1 * num2;
                }
                break;
                
            case 5: // Grade 5: Addition up to 200, subtraction up to 100, multiplication tables 1-10
                const op5 = Math.random();
                if (op5 < 0.3) {
                    const num1 = Math.floor(Math.random() * 120) + 1;
                    const num2 = Math.floor(Math.random() * (200 - num1)) + 1;
                    problem = `${num1} + ${num2} = ?`;
                    answer = num1 + num2;
                } else if (op5 < 0.6) {
                    const num1 = Math.floor(Math.random() * 100) + 1;
                    const num2 = Math.floor(Math.random() * num1) + 1;
                    problem = `${num1} - ${num2} = ?`;
                    answer = num1 - num2;
                } else {
                    const num1 = Math.floor(Math.random() * 10) + 1;
                    const num2 = Math.floor(Math.random() * 10) + 1;
                    problem = `${num1} × ${num2} = ?`;
                    answer = num1 * num2;
                }
                break;
        }
        
        return { problem, answer };
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
     * Finish the current math session
     * @returns {object} Session summary
     */
    finishMathSession() {
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