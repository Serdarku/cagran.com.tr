import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'

const EMOJILER = ["😎","🦄","🐺","🦊","🐸","🐼","🐯","🦁","🐰","👾","🤖","👻"]

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '', avatar_emoji: '😎' })
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function submit(e) {
    e.preventDefault(); setErr('')
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register'
      const body = mode === 'login'
        ? { username: form.username, password: form.password }
        : form
      const data = await api(path, { method: 'POST', body: JSON.stringify(body) })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      nav('/')
    } catch (e2) { setErr(e2.message) }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 p-4">
      {/* ⚠️ ETİK KURAL — büyük ve net uyarı */}
      <div className="max-w-md w-full bg-orange-500/10 border-2 border-orange-500 rounded-xl p-4 mb-6 text-center">
        <p className="text-orange-400 font-bold text-sm">
          🔔 BoşCüzdan tamamen EĞLENCE ve SİMÜLASYON amaçlıdır.
          Hiçbir gerçek para işlemi yapılmaz. Kredi kartı bilgisi asla istenmez.
        </p>
      </div>

      <h1 className="text-4xl font-black text-orange-400 mb-1">🪙 BoşCüzdan</h1>
      <p className="text-gray-400 mb-6 text-sm">Alışverişin hayali, cüzdanın derdi yok!</p>

      <form onSubmit={submit} className="max-w-md w-full bg-gray-900 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold">{mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
        {mode === 'register' && (
          <>
            <input className="w-full bg-gray-800 rounded-lg p-3" placeholder="E-posta"
              onChange={e => setForm({...form, email: e.target.value})} />
            <div className="flex gap-2 flex-wrap">
              {EMOJILER.map(e2 => (
                <button type="button" key={e2} onClick={() => setForm({...form, avatar_emoji: e2})}
                  className={`text-2xl p-1 rounded ${form.avatar_emoji === e2 ? 'bg-orange-500' : ''}`}>
                  {e2}
                </button>
              ))}
            </div>
          </>
        )}
        <input className="w-full bg-gray-800 rounded-lg p-3" placeholder="Kullanıcı adı"
          onChange={e => setForm({...form, username: e.target.value})} required />
        <input className="w-full bg-gray-800 rounded-lg p-3" type="password" placeholder="Şifre"
          onChange={e => setForm({...form, password: e.target.value})} required />
        {err && <p className="text-red-400 text-sm">{err}</p>}
        <button className="btn-pop w-full bg-orange-500 hover:bg-orange-600 font-bold py-3 rounded-lg">
          {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
        </button>
        <p className="text-sm text-gray-400 text-center cursor-pointer"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Hesabın yok mu? Kayıt ol' : 'Hesabın var mı? Giriş yap'}
        </p>
        {mode === 'login' && (
          <p className="text-xs text-gray-500 text-center">Demo: demo / demo123</p>
        )}
      </form>
    </div>
  )
}
