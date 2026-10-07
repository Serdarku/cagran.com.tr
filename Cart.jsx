import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'

export default function Cart() {
  const [cart, setCart] = useState(null)

  function refresh() { api('/cart').then(setCart).catch(() => {}) }
  useEffect(refresh, [])

  if (!cart) return <p className="text-center mt-10">Yükleniyor...</p>
  if (cart.items.length === 0)
    return (
      <div className="text-center mt-20">
        <p className="text-5xl mb-4">🛒</p>
        <p className="text-xl font-bold">Sepetin bomboş!</p>
        <Link to="/" className="text-orange-400 underline">Hayali alışverişe başla →</Link>
      </div>
    )

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-black mb-6">🛒 Sepetim</h1>
      <div className="space-y-3">
        {cart.items.map(item => (
          <div key={item.id} className="bg-gray-900 rounded-xl p-4 flex items-center gap-4">
            <img src={item.image_url} className="w-20 h-20 rounded-lg object-cover" alt={item.name} />
            <div className="flex-1">
              <p className="font-bold">{item.name}</p>
              {item.variant && <p className="text-xs text-gray-400">{item.variant}</p>}
              <p className="text-orange-400 font-bold">₺{item.unit_price.toLocaleString('tr-TR')}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-pop bg-gray-800 w-8 h-8 rounded-lg"
                onClick={() => api(`/cart/${item.id}`, { method: 'PUT', body: JSON.stringify({ quantity: item.quantity - 1 }) }).then(refresh)}>-</button>
              <span className="w-8 text-center font-bold">{item.quantity}</span>
              <button className="btn-pop bg-gray-800 w-8 h-8 rounded-lg"
                onClick={() => api(`/cart/${item.id}`, { method: 'PUT', body: JSON.stringify({ quantity: item.quantity + 1 }) }).then(refresh)}>+</button>
            </div>
            <button className="btn-pop text-red-400 text-xl" title="Sil"
              onClick={() => api(`/cart/${item.id}`, { method: 'DELETE' }).then(refresh)}>🗑</button>
          </div>
        ))}
      </div>
      <div className="bg-gray-900 rounded-xl p-4 mt-4 flex items-center justify-between">
        <p className="text-xl font-bold">Toplam: <span className="text-orange-400">₺{cart.total.toLocaleString('tr-TR')}</span></p>
        <Link to="/checkout"
          className="btn-pop bg-orange-500 hover:bg-orange-600 font-bold px-8 py-3 rounded-xl">
          Ödeme Yap →
        </Link>
      </div>
      {/* Story Paylaş */}
      <a href={cart.items[0]?.image_url} download="boscuzdan-story.jpg"
        className="block text-center mt-4 text-sm text-pink-400 underline">
        📸 Story Paylaş (ilk ürünün görselini indir)
      </a>
    </div>
  )
}
