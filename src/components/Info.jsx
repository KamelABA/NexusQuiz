import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore'
import { translations } from '../utils/translations'
import { db } from '../firebase'
import './Info.css'

function Info() {
  const [leaderboard, setLeaderboard] = useState([])
  const [visitorCount, setVisitorCount] = useState(0)
  const [uniqueVisitors, setUniqueVisitors] = useState(0)
  const [scoreCount, setScoreCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const language = searchParams.get('lang') || 'en'
  const t = translations[language] || translations.en

  useEffect(() => {
    async function fetchData() {
      // Optional: you can remove visitor logic if you no longer use the backend
      setVisitorCount(0)
      setUniqueVisitors(0)

      try {
        // Fetch leaderboard from Firestore 'scores' collection
        // Fetch all documents, then sort on the client (good for <= few thousand docs)
        const scoresRef = collection(db, 'scores')
        const snapshot = await getDocs(scoresRef)
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

        // Sort: highest score first, then lowest durationMs (best time)
        data.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score
          return (a.durationMs || 0) - (b.durationMs || 0)
        })

        setLeaderboard(data)
        setScoreCount(data.length)
      } catch (e) {
        console.error('Failed to load scores from Firestore on Info page', e)
      }

      setLoading(false)
    }
    fetchData()
  }, [])

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000)
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
    const ss = String(seconds % 60).padStart(2, '0')
    return `${mm}:${ss}`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  return (
    <div className="info-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="info-header">
        <h1>{t.quizInformation}</h1>
        <Link to="/" className="info-link">{t.backToQuiz}</Link>
      </div>

      <div className="info-stats">
        <div className="stat-card">
          <h2>{t.totalVisits}</h2>
          <p className="stat-number">{loading ? '...' : visitorCount.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h2>{t.uniqueVisitors}</h2>
          <p className="stat-number">{loading ? '...' : uniqueVisitors.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h2>{t.totalParticipants}</h2>
          <p className="stat-number">{loading ? '...' : scoreCount.toLocaleString()}</p>
        </div>
      </div>

      <div className="leaderboard-section">
        <h2>{t.leaderboard}</h2>
        {loading ? (
          <p>{t.loading}</p>
        ) : leaderboard.length === 0 ? (
          <p>{t.noScoresYet}</p>
        ) : (
          <div className="leaderboard-table">
            <table>
              <thead>
                <tr>
                  <th>{t.rank}</th>
                  <th>{t.name}</th>
                  <th>{t.code}</th>
                  <th>{t.score}</th>
                  <th>{t.time}</th>
                  <th>{t.date}</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={entry.id}>
                    <td>{index + 1}</td>
                    <td>{entry.name}</td>
                    <td>{entry.code}</td>
                    <td>{entry.score}/10</td>
                    <td>{formatTime(entry.durationMs)}</td>
                    <td>{formatDate(entry.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Info

