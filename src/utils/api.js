export const API_BASE = import.meta.env.VITE_API_BASE || '/api'

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`)
  return res
}


