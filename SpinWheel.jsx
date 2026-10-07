import { useRef, useState, useEffect } from 'react'
import { api } from '../api.js'
import { sounds } from '../sounds.js'

const DILIMLER = ["100 TL", "500 TL", "2.000 TL", "10.000 TL", "X2", "BOŞ"]
const RENKLER = ["#f97316", "#22c55e", "#eab308", "#ef4444", "#8b5cf6", "#64748b"]

export default function SpinWheel({ onClose, onResult }) {
  const canvasRef = useRef(null)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)

  // Canvas ile 6 dilimli çark çizimi
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const cx = 150, cy = 150, r = 140
    DILIMLER.forEach((label, i) => {
      const start = (i * 60 - 90) * Math.PI / 180
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, start, start + Math.PI / 3)
      ctx.fillStyle = RENKLER[i]
      ctx.fill()
      ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 3; ctx.stroke()
      // Yazı
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(start + Math.PI / 6)
      ctx.textAlign = "right"
      ctx.fillStyle = "#fff"
      ctx.font = "bold 15px sans-serif"
      ctx.fillText(label, r - 12, 5)
      ctx.restore()
    })
    // Merkez düğme
    ctx.beginPath(); ctx.arc(cx, cy, 30, 0, 7)
    ctx.fillStyle = "#1e293b"; ctx.fill()
    ctx.fillStyle = "#f97316"; ctx.font = "bold 20px sans-serif"
    ctx.textAlign = "center"; ctx.fillText("🪙", cx, cy + 7)
  }, [])

  async function spin() {
    if (spinning) return
    setSpinning(true)
    // Döndürme animasyonu + tık sesleri
    const canvas = canvasRef.current
    const winIndex = Math.floor(Math.random() * 6)
    const target = 360 * 5 + (360 - winIndex * 60 - 30)  // 5 tur + hedef dilim
    let current = 0
    const duration = 4000
    const start = performance.now()
    let lastTick = 0
    function animate(now) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)  // Yavaşlayan easing
      current = target * eased
      canvas.style.transform = `rotate(${current}deg)`
      if (now - lastTick > 100 && t < 1) { sounds.tick(); lastTick = now }
      if (t < 1) requestAnimationFrame(animate)
      else finish()
    }
    requestAnimationFrame(animate)

    async function finish() {
      try {
        const data = await api('/spin-wheel', { method: 'POST' })
        setResult(data)
        onResult?.(data)
      } catch (e) {
        setResult({ result: 'HATA', won: 0, message: e.message })
      }
      setSpinning(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 text-center max-w-sm w-full">
        <h2 className="text-xl font-bold text-orange-400 mb-4">🎡 Günlük Çarkıfelek</h2>
        <canvas ref={canvasRef} width="300" height="300" className="mx-auto transition-transform" />
        {!result ? (
          <button onClick={spin} disabled={spinning}
            className="btn-pop mt-4 w-full bg-orange-500 hover:bg-orange-600 font-bold py-3 rounded-xl disabled:opacity-50">
            {spinning ? 'Çeviriliyor...' : 'ÇEVİR! 🎰'}
          </button>
        ) : (
          <div className="mt-4">
            <p className="text-2xl font-black text-green-400">
              {result.result === 'BOŞ' ? '😅 Boş... yarın tekrar!' :
               result.result === 'X2' ? '🤯 BAKİYE x2!!!' : `🎉 ${result.result} kazandın!`}
            </p>
            {result.message && <p className="text-red-400 text-sm mt-1">{result.message}</p>}
            <button onClick={onClose} className="btn-pop mt-3 w-full bg-gray-700 py-2 rounded-lg">Kapat</button>
          </div>
        )}
      </div>
    </div>
  )
}

// Basit confetti yardımcısı
export function confetti() {
  const colors = ['#f97316', '#22c55e', '#eab308', '#ef4444', '#8b5cf6']
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div')
    el.className = 'confetti'
    el.style.left = Math.random() * 100 + 'vw'
    el.style.background = colors[i % colors.length]
    el.style.animationDelay = Math.random() * 0.8 + 's'
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 4000)
  }
}
