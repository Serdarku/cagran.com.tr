import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, getUser } from '../api.js'
import { sounds } from '../sounds.js'
import { confetti } from '../components/SpinWheel.jsx'

export default function Checkout() {
  const [cart, setCart] = useState(null)
  const [profile, setProfile] = useState(null)
  const [address, setAddress] = useState('Hayali Mah. BoşCüzdan Cad. No:1')
  const [result, setResult] = useState(null)
  const user = getUser()
  const nav = useNavigate()

  useEffect(() => {
    api('/cart').then(setCart).catch(() => {})
    api(`/profile/${user.id}`).then(setProfile).catch(() => {})
  }, [])

  async function odemeYap() {
    try {
      const data = await api('/orders/payment', {
        method: 'POST',
        body: JSON.stringify({ shipping_address: address }),
      })
      sounds.cash()
      setResult({ ok: true, ...data })
      confetti()  // Başarılı olunca konfeti!
    } catch (e) {
      sounds.uhoh()
      setResult({ ok: false, message: e.message })
    }
  }

  if (!cart || !profile) return <p className="text-center mt-10">Yükleniyor...</p>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-black">💳 Sanal Ödeme</h1>

      {/* Sanal kart gösterimi */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 shadow-xl">
        <p className="text-sm opacity-80">🪙 BoşCüzdan Sanal Kart</p>
        <p className="text-2xl font-mono tracking-widest mt-4">•••• •••• •••• {profile.virtual_card_last4}</p>
        <div className="flex justify-between mt-4 text-sm">
          <span>{user.username.toUpperCase()}</span>
          <span>SANAL/26</span>
        </div>
      </div>

      {/* Bakiye */}
      <div className="bg-gray-900 rounded-xl p-4 flex justify-between items-center">
        <span>Sanal Bakiyen:</span>
        <span className="text-xl font-bold text-orange-400">
          ₺{profile.virtual_balance.toLocaleString('tr-TR')}
        </span>
      </div>

      {/* Adres */}
      <input value={address} onChange={e => setAddress(e.target.value)}
        className="w-full bg-gray-900 rounded-xl p-4" placeholder="Teslimat adresi (hayali olabilir 😄)" />

      {/* Özet */}
      <div className="bg-gray-900 rounded-xl p-4">
        {cart.items.map(i => (
          <p key={i.id} className="text-sm text-gray-400">{i.quantity}x {i.name} — ₺{i.total.toLocaleString('tr-TR')}</p>
        ))}
        <p className="text-xl font-bold mt-2 border-t border-gray-700 pt-2">
          Toplam: <span className="text-orange-400">₺{cart.total.toLocaleString('tr-TR')}</span>
        </p>
      </div>

      <button onClick={odemeYap}
        className="btn-pop w-full bg-green-500 hover:bg-green-600 font-black text-xl py-4 rounded-xl">
        💰 SANAL CÜZDANDAN ÖDE
      </button>
      <p className="text-center text-xs text-gray-500">🔔 Gerçek para çekilmez. Bu tamamen simülasyondur!</p>

      {/* Ödeme sonucu pop-up */}
      {result && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-8 text-center max-w-sm w-full">
            {result.ok ? (
              <>
                <p className="text-6xl mb-4">🎉</p>
                <p className="text-2xl font-black text-green-400">ÖDEME BAŞARILI!</p>
                <p className="text-gray-400 mt-2">Sipariş No: #{result.order_id}</p>
                <p className="text-gray-400">Kalan bakiye: ₺{result.remaining_balance.toLocaleString('tr-TR')}</p>
                <button onClick={() => nav('/orders')}
                  className="btn-pop mt-4 w-full bg-orange-500 py-3 rounded-xl font-bold">
                  Siparişlerime Git →
                </button>
              </>
            ) : (
              <>
                <p className="text-6xl mb-4">😵</p>
                <p className="text-2xl font-black text-red-400">ÖDEME BAŞARISIZ</p>
                <p className="text-gray-400 mt-2">{result.message}</p>
                <button onClick={() => setResult(null)}
                  className="btn-pop mt-4 w-full bg-gray-700 py-3 rounded-xl font-bold">Tamam</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
