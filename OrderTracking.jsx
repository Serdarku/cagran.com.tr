import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api.js'

export default function OrderTracking() {
  const { id } = useParams()
  const [track, setTrack] = useState(null)
  const nav = useNavigate()

  useEffect(() => { api(`/orders/${id}/track`).then(setTrack).catch(() => {}) }, [id])
  if (!track) return <p className="text-center mt-10">Yükleniyor...</p>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-black">🚚 Kargo Takibi</h1>
      <p className="text-gray-400">Takip No: <b className="text-white">{track.tracking_number}</b></p>

      {/* Sahte harita */}
      <div className="bg-gradient-to-br from-green-900 to-blue-900 rounded-2xl h-48 relative overflow-hidden flex items-center justify-center">
        <p className="text-4xl">🗺️</p>
        <div className="absolute bottom-3 left-3 bg-black/60 rounded-lg px-3 py-1 text-sm">
          📍 Şu an: {track.location}
        </div>
        {/* Hareket eden kurye simülasyonu */}
        <div className="absolute text-3xl animate-bounce" style={{ left: '60%', top: '35%' }}>🛵</div>
      </div>

      {/* Zaman çizelgesi */}
      <div className="bg-gray-900 rounded-xl p-6">
        {track.timeline.map((t, i) => (
          <div key={i} className="flex items-center gap-4 py-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              t.done ? 'bg-green-500' : 'bg-gray-700 text-gray-500'}`}>
              {t.done ? '✓' : i + 1}
            </span>
            <p className={t.done ? 'font-bold' : 'text-gray-500'}>{t.step}</p>
          </div>
        ))}
      </div>

      {track.delivery_date && (
        <p className="text-center text-gray-400">
          📅 Tahmini teslim: <b>{new Date(track.delivery_date).toLocaleDateString('tr-TR')}</b>
        </p>
      )}

      {/* Teslim Al — unboxing başlatır */}
      {track.status !== 'Teslim Edildi' && (
        <button onClick={async () => { await api(`/orders/${id}/deliver`, { method: 'POST' }); nav(`/unbox/${id}`) }}
          className="btn-pop w-full bg-green-500 hover:bg-green-600 font-black text-xl py-4 rounded-xl">
          📦 TESLİM AL — KUTUYU AÇ!
        </button>
      )}
      {track.status === 'Teslim Edildi' && (
        <button onClick={() => nav(`/unbox/${id}`)}
          className="btn-pop w-full bg-gray-800 font-bold py-3 rounded-xl">
          🎁 Kutuyu Tekrar Aç
        </button>
      )}
    </div>
  )
}
