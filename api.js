// Tüm backend istekleri buradan — token otomatik eklenir
const API = 'http://localhost:8000'

export function getToken() { return localStorage.getItem('token') }
export function getUser() { return JSON.parse(localStorage.getItem('user') || 'null') }

export async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(API + path, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Bir hata oluştu')
  }
  return res.json()
}
