import { useEffect, useState, useRef } from 'react'
import { quizData } from '../data/quizData'
import './Results.css'

function Results({ answers, onRestart, userName, userCode, durationMs }) {
  let score = 0
  const review = []
  const [leaderboard, setLeaderboard] = useState([])
  const hasPostedRef = useRef(false)
  const API_BASE = import.meta.env.VITE_API_URL || 'http://10.166.203.221:5000'

  quizData.forEach((question, index) => {
    const isCorrect = answers[index] === question.correct
    if (isCorrect) score++

    review.push({
      question: question.question,
      userAnswer: question.options[answers[index] || -1] || 'Not answered',
      correctAnswer: question.options[question.correct],
      isCorrect: isCorrect
    })
  })

  const percentage = (score / quizData.length) * 100
  let message = ''
  let emoji = ''

  if (percentage >= 90) {
    message = 'Outstanding!'
    emoji = '🎉'
  } else if (percentage >= 70) {
    message = 'Great job!'
    emoji = '👍'
  } else if (percentage >= 50) {
    message = 'Good effort!'
    emoji = '😊'
  } else {
    message = 'Keep practicing!'
    emoji = '💪'
  }

  const seconds = Math.floor((durationMs || 0) / 1000)
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  useEffect(() => {
    async function submitAndFetch() {
      if (!hasPostedRef.current) {
        hasPostedRef.current = true
        try {
          await fetch(`${API_BASE}/api/scores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: userName || 'Anonymous', code: userCode || '0000', score, durationMs: durationMs || 0 })
          })
        } catch (e) {
          // ignore errors for UX simplicity
        }
      }
      try {
        const res = await fetch(`${API_BASE}/api/scores/leaderboard?limit=10`)
        const data = await res.json()
        if (Array.isArray(data)) setLeaderboard(data)
      } catch (e) {
        // ignore errors
      }
    }
    submitAndFetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="results-container">
      {userName && (
        <div className="user-name-display-results">
          Hello {userName}!
        </div>
      )}
      <div className="results-header">
        <h1>Quiz Complete!</h1>
        <div className="score-display">
          <div className="score-circle">
            <span className="score-number">{score}</span>
            <span className="score-total">/{quizData.length}</span>
          </div>
          <div className="score-percentage">{Math.round(percentage)}%</div>
          <div className="score-time">Time: {mm}:{ss}</div>
          <div className="score-message">
            {emoji} {message}
          </div>
        </div>
      </div>

      <div className="review-section">
        <h2>Review Your Answers</h2>
        <div className="review-list">
          {review.map((item, index) => (
            <div key={index} className={`review-item ${item.isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="review-question">
                <span className="review-number">Q{index + 1}:</span> {item.question}
              </div>
              <div className="review-answers">
                <div className={`review-answer ${item.isCorrect ? 'correct-answer' : 'wrong-answer'}`}>
                  <span className="answer-label">Your answer:</span> {item.userAnswer}
                </div>
                {!item.isCorrect && (
                  <div className="review-answer correct-answer">
                    <span className="answer-label">Correct answer:</span> {item.correctAnswer}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="review-section">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Code</th>
              <th>Score</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, idx) => {
              const secs = Math.floor((entry.durationMs || 0) / 1000)
              const m = String(Math.floor(secs / 60)).padStart(2, '0')
              const s = String(secs % 60).padStart(2, '0')
              return (
                <tr key={entry.id || idx}>
                  <td>{idx + 1}</td>
                  <td>{entry.name}</td>
                  <td>#{entry.code}</td>
                  <td>{entry.score}/{quizData.length}</td>
                  <td>{m}:{s}</td>
                </tr>
              )
            })}
            {leaderboard.length === 0 && (
              <tr>
                <td colSpan="5">Leaderboard will appear here after submissions.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button className="restart-button" onClick={onRestart}>
        Take Quiz Again
      </button>
    </div>
  )
}

export default Results

