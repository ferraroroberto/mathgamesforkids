# Math Tests Module

This module provides a reusable math testing system that can be integrated into any educational game or application.

## Features

- **5 Difficulty Levels**: Corresponding to grades 1-5
- **Multiple Operations**: Addition, subtraction, and multiplication
- **Session Management**: Track progress and performance
- **Flexible Configuration**: Customizable number of exercises per session
- **Statistics Tracking**: Monitor overall performance

## Usage

### Basic Setup

1. Include the module in your HTML:
```html
<script src="mathTests.js"></script>
```

2. Create an instance:
```javascript
const mathTests = new MathTests();
```

### Core Functions

#### `generateMathProblem(difficulty)`
Generates a single math problem for the specified difficulty level.

```javascript
const problem = mathTests.generateMathProblem(3); // Grade 3
console.log(problem.problem); // "15 + 23 = ?"
console.log(problem.answer);  // 38
```

#### `startMathExercise(difficulty, exercisesPerSession)`
Starts a new math exercise session.

```javascript
const problem = mathTests.startMathExercise(2, 5); // Grade 2, 5 exercises
```

#### `submitMathAnswer(userAnswer)`
Submits an answer and gets the result.

```javascript
const result = mathTests.submitMathAnswer(42);
if (result.isCorrect) {
    console.log("Correct!");
} else {
    console.log(`Wrong! The answer was ${result.correctAnswer}`);
}
```

#### `finishMathSession()`
Completes the current session and returns summary.

```javascript
const summary = mathTests.finishMathSession();
console.log(`Score: ${summary.correctAnswers}/${summary.totalExercises}`);
console.log(`Accuracy: ${summary.accuracy}%`);
```

### Difficulty Levels

| Level | Grade | Description |
|-------|-------|-------------|
| 1 | Grade 1 | Addition up to 10 |
| 2 | Grade 2 | Addition up to 20, subtraction up to 10 |
| 3 | Grade 3 | Addition up to 50, subtraction up to 20, simple multiplication |
| 4 | Grade 4 | Addition up to 100, subtraction up to 50, multiplication tables 1-6 |
| 5 | Grade 5 | Addition up to 200, subtraction up to 100, multiplication tables 1-10 |

### Example Integration

```javascript
class MathGame {
    constructor() {
        this.mathTests = new MathTests();
        this.currentProblem = null;
    }
    
    startMathChallenge(difficulty) {
        this.currentProblem = this.mathTests.startMathExercise(difficulty, 3);
        this.displayProblem(this.currentProblem);
    }
    
    submitAnswer(answer) {
        const result = this.mathTests.submitMathAnswer(answer);
        
        if (result.isCorrect) {
            this.showCorrectMessage();
        } else {
            this.showIncorrectMessage(result.correctAnswer);
        }
        
        if (result.isSessionComplete) {
            this.finishChallenge();
        } else {
            this.displayProblem(result.nextProblem);
        }
    }
    
    finishChallenge() {
        const summary = this.mathTests.finishMathSession();
        this.showResults(summary);
    }
}
```

### Utility Functions

#### `getSessionStats()`
Returns current session information.

#### `setDifficulty(difficulty)`
Sets the difficulty level for future problems.

#### `getDifficultyDescription(difficulty)`
Gets a human-readable description of the difficulty level.

#### `reset()`
Resets the module to initial state.

## Integration with Existing Games

The module has been designed to be easily integrated into existing games:

1. **Replace existing math logic** with calls to the module
2. **Maintain game state** through the module's session management
3. **Customize difficulty** based on player level or game progression
4. **Track performance** for achievements or adaptive difficulty

## Browser Compatibility

- Modern browsers (ES6+)
- Node.js environments
- Mobile browsers

## Testing

Use the included `test_math.html` file to test the module functionality before integration.

## License

This module is part of the Mountain Dung Dodger game project and follows the same licensing terms.