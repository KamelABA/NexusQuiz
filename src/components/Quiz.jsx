import { getQuizData } from '../data/quizData'
import { translations } from '../utils/translations'
import './Quiz.css'

function Quiz({ currentQuestion, selectedAnswer, onAnswer, onNext, onPrevious, userName, language = 'en', onToggleLanguage }) {
  const quizData = getQuizData(language)
  const question = quizData[currentQuestion]
  const progress = ((currentQuestion + 1) / quizData.length) * 100
  const t = translations[language] || translations.en

  return (
    <div className="quiz-container">
      <div className="quiz-language-toggle">
        <button className="quiz-lang-button" onClick={onToggleLanguage}>
          {language === 'en' ? 'العربية' : 'English'}
        </button>
      </div>
      {userName && (
        <div className="user-name-display">
          {t.hello} {userName}!
        </div>
      )}
      <div className="quiz-header">
        <div className="question-number">
          {t.question} {currentQuestion + 1} {t.of} {quizData.length}
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
          {t.previous}
        </button>
        <button
          className="nav-button next-button"
          onClick={onNext}
          disabled={selectedAnswer === undefined}
        >
          {currentQuestion === quizData.length - 1 ? t.finish : t.next}
        </button>
      </div>
    </div>
  )
}

export default Quiz

