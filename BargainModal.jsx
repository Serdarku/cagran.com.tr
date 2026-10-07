import { useState } from 'react'
import { api } from '../api.js'
import { sounds } from '../sounds.js'

export default function BargainModal({ product, onClose }) {
  const [offer, setOffer] = useState('')
  const [result, setResult] = useState(null)

  async function teklifVer() {
    try {
      const data = await api('/bargain', {
        method: 'POST',
        body: JSON.stringify({ product_id: product.id, offer: parseFloat(offer) }),
      })
      setResult(data)
      data.accepted ? sounds.cash() : sounds.uhoh()
    } catch (e) {
      setResult({ message: e.message, accepted: false })
      sounds.uhoh()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full">
        <h2 className="text-lg font-bold text-orange-400">🤝 Satıcıyla Pazarlık Et</h2>
        <p className="text-sm text-gray-400 mt-1">{product.name} — Liste fiyatı: <b>₺{product.price.toLocaleString('tr-TR')}</b></p>
        {!result ? (
          <>
            <input type="number" value={offer} onChange={e => setOffer(e.target.value)}
              placeholder="Teklifin (TL)"
              className="w-full bg-gray-800 rounded-lg p-3 mt-4" />
            <button onClick={teklifVer}
              className="btn-pop w-full mt-3 bg-orange-500 hover:bg-orange-600 font-bold py-3 rounded-lg">
              Teklif Et 🎯
            </button>
          </>
        ) : (
          <div className="mt-4 text-center">
            <p className={`text-lg font-bold ${result.accepted ? 'text-green-400' : 'text-yellow-400'}`}>
              {result.message}
            </p>
            {result.counter && (
              <button onClick={() => { setOffer(String(result.counter)); setResult(null) }}
                className="btn-pop mt-3 w-full bg-green-600 py-2 rounded-lg">
                {result.counter} TL'yi Kabul Et ✅
              </button>
            )}
            <button onClick={onClose} className="btn-pop mt-3 w-full bg-gray-700 py-2 rounded-lg">Kapat</button>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-3 text-center">💡 İpucu: Listenin %85-95'i arası teklif genelde kabul görür 😉</p>
      </div>
    </div>
  )
}
