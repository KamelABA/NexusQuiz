import { quizData } from '../data/quizData'
import './Quiz.css'

function Quiz({ currentQuestion, selectedAnswer, onAnswer, onNext, onPrevious, userName }) {
  const question = quizData[currentQuestion]
  const progress = ((currentQuestion + 1) / quizData.length) * 100

  return (
    <div className="quiz-container">
      {userName && (
        <div className="user-name-display">
          Hello {userName}!
        </div>
      )}
      <div className="quiz-header">
        <div className="question-number">
          Question {currentQuestion + 1} of {quizData.length}
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="question-section">
        <h2 className="question-text">{question.question}</h2>
        
        <div className="options-container">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${selectedAnswer === index ? 'selected' : ''}`}
              onClick={() => onAnswer(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <button
          className="nav-button prev-button"
          onClick={onPrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </button>
        <button
          className="nav-button next-button"
          onClick={onNext}
          disabled={selectedAnswer === undefined}
        >
          {currentQuestion === quizData.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  )
}

export default Quiz

