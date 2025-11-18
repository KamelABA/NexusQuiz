import enTranslations from '../locales/en.json'
import arTranslations from '../locales/ar.json'

// Correct answers for each question (same regardless of language)
export const correctAnswers = [1, 3, 1, 3, 1, 3, 1, 1, 1, 0]

// Get quiz data based on language
export function getQuizData(language = 'en') {
  const translations = language === 'ar' ? arTranslations : enTranslations
  
  return translations.questions.map((q, index) => ({
    id: q.id,
    question: q.question,
    options: q.options,
    correct: correctAnswers[index]
  }))
}

// Default export for backward compatibility (English)
export const quizData = getQuizData('en')

