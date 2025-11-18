import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { translations } from '../utils/translations'
import './Info.css'

function Info() {
  const [leaderboard, setLeaderboard] = useState([])
  const [visitorCount, setVisitorCount] = useState(0)
  const [uniqueVisitors, setUniqueVisitors] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const language = searchParams.get('lang') || 'en'
  const t = translations[language] || translations.en
  const API_BASE = import.meta.env.VITE_API_URL || 'http://192.168.2.146:5000'

  useEffect(() => {
    async function fetchData() {
      try {
        // Track visitor
        await fetch(`${API_BASE}/api/visitors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      } catch (e) {
        // ignore errors
      }

      try {
        // Fetch visitor count
        const visitorRes = await fetch(`${API_BASE}/api/visitors/count`)
        const visitorData = await visitorRes.json()
        if (visitorData.totalVisits !== undefined) {
          setVisitorCount(visitorData.totalVisits)
        }
        if (visitorData.uniqueVisitors !== undefined) {
          setUniqueVisitors(visitorData.uniqueVisitors)
        } else if (visitorData.count !== undefined) {
          // Fallback for backward compatibility
          setVisitorCount(visitorData.count)
        }
      } catch (e) {
        // ignore errors
      }

      try {
        // Fetch leaderboard
        const leaderboardRes = await fetch(`${API_BASE}/api/scores/leaderboard?limit=100`)
        const leaderboardData = await leaderboardRes.json()
        if (Array.isArray(leaderboardData)) {
          setLeaderboard(leaderboardData)
        }
      } catch (e) {
        // ignore errors
      }

      setLoading(false)
    }
    fetchData()
  }, [API_BASE])

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

