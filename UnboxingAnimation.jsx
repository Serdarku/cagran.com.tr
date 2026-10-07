import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { sounds } from '../sounds.js'

export default function UnboxingAnimation() {
  const { orderId } = useParams()
  const [opened, setOpened] = useState(false)
  const nav = useNavigate()

  function ac() {
    sounds.tape()   // Bant yırtılma sesi (Web Audio API)
    setOpened(true)
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      {!opened ? (
        <>
          <p className="text-xl font-bold mb-6">📦 Kutunu açmak için tıkla!</p>
          {/* 3D CSS koli */}
          <div className="relative cursor-pointer" onClick={ac} style={{ perspective: '800px' }}>
            <div className="w-56 h-44 bg-amber-700 rounded-lg relative shadow-2xl">
              {/* Koli bandı */}
              <div className="absolute left-1/2 -translate-x-1/2 w-10 h-full bg-amber-900" />
              <div className="absolute top-1/2 -translate-y-1/2 w-full h-10 bg-amber-900" />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl">🪙</div>
            </div>
            <p className="text-center mt-4 text-amber-400 animate-pulse">👆 TIKLA</p>
          </div>
        </>
      ) : (
        <>
          {/* Açılmış kutu + ürün beliriyor */}
          <div className="relative">
            <div className="w-56 h-24 bg-amber-800 rounded-b-lg mx-auto" />
            <div className="text-8xl absolute -top-16 left-1/2 -translate-x-1/2 reveal">🎁</div>
          </div>
          <div className="text-center mt-20 reveal">
            <p className="text-3xl font-black text-green-400">🎉 TEBRİKLER!</p>
            <p className="text-gray-400 mt-2">Siparişin (#{orderId}) Sanal Dolabına eklendi!</p>
            <button onClick={() => nav('/profile')}
              className="btn-pop mt-6 bg-orange-500 hover:bg-orange-600 font-bold px-8 py-3 rounded-xl">
              Sanal Dolabımı Gör 👕
            </button>
          </div>
        </>
      )}
    </div>
  )
}
