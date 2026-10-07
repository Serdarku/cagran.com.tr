import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { sounds } from '../sounds.js'

export default function Orders() {
  const [orders, setOrders] = useState([])

  function refresh() { api('/orders').then(setOrders).catch(() => {}) }
  useEffect(refresh, [])

  async function iadeEt(orderId) {
    const reason = prompt('İade sebebi?')
    if (!reason) return
    try {
      const data = await api(`/orders/${orderId}/return`, {
        method: 'POST', body: JSON.stringify({ reason }),
      })
      sounds.cash()
      alert(`✅ İade onaylandı! ₺${data.refund} bakiyene eklendi.`)
      refresh()
    } catch (e) { sounds.uhoh(); alert(e.message) }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-black mb-6">📦 Siparişlerim</h1>
      {orders.length === 0 && <p className="text-center text-gray-400 mt-10">Henüz siparişin yok 😢</p>}
      <div className="space-y-4">
        {orders.map(o => (
          <div key={o.id} className="bg-gray-900 rounded-xl p-4">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <p className="font-bold">Sipariş #{o.id}</p>
                <p className="text-xs text-gray-500">{new Date(o.order_date).toLocaleString('tr-TR')}</p>
                <p className="text-xs text-gray-400">Takip No: {o.tracking_number}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                o.status === 'Teslim Edildi' ? 'bg-green-500/20 text-green-400' :
                o.status === 'Yolda' ? 'bg-blue-500/20 text-blue-400' :
                'bg-yellow-500/20 text-yellow-400'}`}>
                {o.status}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              {o.items.map((i, idx) => <p key={idx}>{i.quantity}x {i.name}</p>)}
            </div>
            <div className="flex justify-between items-center mt-3">
              <p className="font-bold text-orange-400">₺{o.total_amount.toLocaleString('tr-TR')}</p>
              <div className="flex gap-2">
                <Link to={`/orders/${o.id}/track`}
                  className="btn-pop bg-gray-800 px-4 py-2 rounded-lg text-sm font-bold">
                  🚚 Kargo Takibi
                </Link>
                {o.status !== 'Teslim Edildi' && (
                  <button onClick={() => iadeEt(o.id)}
                    className="btn-pop bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-bold">
                    İade Et
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
