import { useState } from 'react'
import Quiz from './components/Quiz'
import Results from './components/Results'
import NameInput from './components/NameInput'
import './App.css'

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [started, setStarted] = useState(false)
  const [showNameInput, setShowNameInput] = useState(false)
  const [userName, setUserName] = useState('')
  const [userCode, setUserCode] = useState('')
  const [language, setLanguage] = useState('en')
  const [startTime, setStartTime] = useState(null)
  const [durationMs, setDurationMs] = useState(0)

  const handleStart = () => {
    setShowNameInput(true)
  }

  const handleNameSubmit = (name, _classNumber, code) => {
    setUserName(name)
    setUserCode(code)
    setShowNameInput(false)
    setStarted(true)
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
    setStartTime(Date.now())
    setDurationMs(0)
  }

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < 9) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      if (startTime) {
        setDurationMs(Date.now() - startTime)
      }
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleRestart = () => {
    setStarted(false)
    setShowNameInput(false)
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
    setUserName('')
    setUserCode('')
    setStartTime(null)
    setDurationMs(0)
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en')
  }

  return (
    <div className="App" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container">
        {showNameInput ? (
          <NameInput 
            onSubmit={handleNameSubmit} 
            language={language}
          />
        ) : !started ? (
          <div className="start-screen">
            <div className="language-toggle">
              <button className="lang-button" onClick={toggleLanguage}>
                {language === 'en' ? 'العربية' : 'English'}
              </button>
            </div>
            <h1>{language === 'en' ? 'Computer Science Quiz' : 'اختبار علوم الحاسوب'}</h1>
            <p>{language === 'en' ? 'Test your CS knowledge with 10 challenging questions' : 'اختبر معرفتك بـ 10 أسئلة تحدي'}</p>
            <button className="start-button" onClick={handleStart}>
              {language === 'en' ? 'Start Quiz' : 'بدء الاختبار'}
            </button>
          </div>
        ) : showResults ? (
          <Results 
            answers={answers} 
            onRestart={handleRestart} 
            userName={userName}
            userCode={userCode}
            durationMs={durationMs}
          />
        ) : (
          <Quiz
            currentQuestion={currentQuestion}
            selectedAnswer={answers[currentQuestion]}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onPrevious={handlePrevious}
            userName={userName}
          />
        )}
      </div>
    </div>
  )
}

export default App

