import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api, getToken, getUser } from '../api.js'
import { sounds } from '../sounds.js'
import LiveCounter from '../components/LiveCounter.jsx'
import BargainModal from '../components/BargainModal.jsx'
import GiftModal from '../components/GiftModal.jsx'
import ProductCard from '../components/ProductCard.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const [p, setP] = useState(null)
  const [variant, setVariant] = useState(null)
  const [showBargain, setShowBargain] = useState(false)
  const [showGift, setShowGift] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [zoom, setZoom] = useState(false)
  const user = getUser()

  useEffect(() => {
    api(`/products/${id}`).then(setP).catch(() => {})
  }, [id])

  if (!p) return <p className="text-center mt-10">Yükleniyor...</p>

  async function sepeteEkle() {
    try {
      await api('/cart', {
        method: 'POST',
        body: JSON.stringify({ product_id: p.id, variant_id: variant?.id, quantity: 1 }),
      })
      sounds.ding()
      alert('✅ Sepete eklendi!')
    } catch (e) { alert(e.message) }
  }

  async function yorumYap(e) {
    e.preventDefault()
    try {
      await api(`/products/${p.id}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment }),
      })
      sounds.ding()
      const fresh = await api(`/products/${p.id}`)
      setP(fresh); setComment('')
    } catch (e2) { alert(e2.message) }
  }

  const variantGroups = {}
  p.variants.forEach(v => {
    variantGroups[v.variant_type] = variantGroups[v.variant_type] || []
    variantGroups[v.variant_type].push(v)
  })

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Büyük görsel + zoom efekti */}
        <div className="relative overflow-hidden rounded-2xl cursor-zoom-in bg-gray-900"
          onMouseEnter={() => setZoom(true)} onMouseLeave={() => setZoom(false)}>
          <img src={p.image_url} alt={p.name}
            className={`w-full transition-transform duration-300 ${zoom ? 'scale-150' : ''}`} />
        </div>

        {/* Bilgiler */}
        <div>
          <p className="text-sm text-gray-500">{p.category} • {p.brand}</p>
          <h1 className="text-3xl font-black mt-1">{p.name}</h1>
          <p className="text-yellow-400 mt-2">⭐ {p.rating_avg} • {p.reviews.length} yorum • 👁 {p.views} görüntülenme</p>
          <LiveCounter initial={p.views_now} />
          <p className="text-4xl font-black text-orange-400 mt-3">
            ₺{(p.price + (variant?.additional_price || 0)).toLocaleString('tr-TR')}
          </p>
          <p className="text-gray-400 mt-3">{p.description}</p>
          {p.stock === 0
            ? <p className="text-red-400 font-bold mt-2">TÜKENDİ 😭</p>
            : <p className="text-green-400 text-sm mt-2">✓ Stokta {p.stock} adet</p>}

          {/* Varyant seçimi */}
          {Object.entries(variantGroups).map(([type, variants]) => (
            <div key={type} className="mt-4">
              <p className="text-sm font-bold mb-2">{type}:</p>
              <div className="flex gap-2 flex-wrap">
                {variants.map(v => (
                  <button key={v.id} onClick={() => setVariant(v)}
                    className={`btn-pop px-3 py-1 rounded-lg text-sm ${
                      variant?.id === v.id ? 'bg-orange-500' : 'bg-gray-800'}`}>
                    {v.variant_value}{v.additional_price > 0 && ` +₺${v.additional_price}`}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Aksiyon butonları */}
          <div className="flex gap-3 mt-6 flex-wrap">
            <button onClick={sepeteEkle} disabled={p.stock === 0}
              className="btn-pop flex-1 bg-orange-500 hover:bg-orange-600 font-bold py-3 rounded-xl disabled:opacity-50">
              🛒 Sepete Ekle
            </button>
            <button onClick={() => setShowBargain(true)}
              className="btn-pop bg-gray-800 hover:bg-gray-700 font-bold py-3 px-4 rounded-xl">
              🤝 Pazarlık Et
            </button>
            <button onClick={() => setShowGift(true)}
              className="btn-pop bg-pink-600 hover:bg-pink-700 font-bold py-3 px-4 rounded-xl">
              🎁 Gönder
            </button>
          </div>
        </div>
      </div>

      {/* Yorumlar */}
      <div>
        <h2 className="text-xl font-bold mb-4">💬 Yorumlar ({p.reviews.length})</h2>
        <div className="space-y-3 mb-6">
          {p.reviews.map(r => (
            <div key={r.id} className="bg-gray-900 rounded-xl p-4">
              <p className="font-bold">{r.avatar} {r.username}
                <span className="text-yellow-400 ml-2">{'⭐'.repeat(r.rating)}</span></p>
              <p className="text-gray-300 mt-1">{r.comment}</p>
            </div>
          ))}
        </div>

        {/* Yeni yorum */}
        {getToken() && (
          <form onSubmit={yorumYap} className="bg-gray-900 rounded-xl p-4 space-y-3">
            <div className="flex gap-1">
              {[1,2,3,4,5].map(n => (
                <button type="button" key={n} onClick={() => setRating(n)}
                  className={`text-2xl ${n <= rating ? 'opacity-100' : 'opacity-30'}`}>⭐</button>
              ))}
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)}
              placeholder="Deneyimini paylaş..." required rows="2"
              className="w-full bg-gray-800 rounded-lg p-3" />
            <button className="btn-pop bg-orange-500 px-6 py-2 rounded-lg font-bold">Yorumu Gönder</button>
          </form>
        )}
      </div>

      {/* Benzer ürünler */}
      {p.similar.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">🔍 Benzer Ürünler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {p.similar.map(s => <ProductCard key={s.id} p={s} />)}
          </div>
        </div>
      )}

      {showBargain && <BargainModal product={p} onClose={() => setShowBargain(false)} />}
      {showGift && <GiftModal product={p} onClose={() => setShowGift(false)} />}
    </div>
  )
}
