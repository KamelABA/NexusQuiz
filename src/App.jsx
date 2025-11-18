import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { translations } from './utils/translations'
import Quiz from './components/Quiz'
import Results from './components/Results'
import NameInput from './components/NameInput'
import Info from './components/Info'
import './App.css'

function QuizApp() {
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

  const t = translations[language] || translations.en

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
            <h1>{t.welcome}</h1>
            <p>{t.subtitle}</p>
            <button className="start-button" onClick={handleStart}>
              {t.startQuiz}
            </button>
          </div>
        ) : showResults ? (
          <Results 
            answers={answers} 
            onRestart={handleRestart} 
            userName={userName}
            userCode={userCode}
            durationMs={durationMs}
            language={language}
          />
        ) : (
          <Quiz
            currentQuestion={currentQuestion}
            selectedAnswer={answers[currentQuestion]}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onPrevious={handlePrevious}
            userName={userName}
            language={language}
            onToggleLanguage={toggleLanguage}
          />
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<QuizApp />} />
      <Route path="/info" element={<Info />} />
    </Routes>
  )
}

export default App

