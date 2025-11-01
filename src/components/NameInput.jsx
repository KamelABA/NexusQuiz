import { useState } from 'react'
import { translations } from '../utils/translations'
import './NameInput.css'

function NameInput({ onSubmit, language }) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const t = translations[language]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim() && code.trim()) {
      onSubmit(name.trim(), undefined, code.trim())
    }
  }

  return (
    <div className="name-input-container">
      <div className="name-input-box">
        <h2>{t.enterName}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="name-input-field"
            placeholder={t.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
          <input
            type="number"
            className="name-input-field"
            placeholder={t.codePlaceholder}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            min="0"
          />
          <button type="submit" className="submit-name-button">
            {t.submitName}
          </button>
        </form>
      </div>
    </div>
  )
}

export default NameInput

