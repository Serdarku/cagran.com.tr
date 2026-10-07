import { useState, useEffect } from 'react'
import { api, getUser } from '../api.js'

export default function Profile() {
  const user = getUser()
  const [profile, setProfile] = useState(null)
  const [quests, setQuests] = useState(null)

  function refresh() {
    api(`/profile/${user.id}`).then(setProfile).catch(() => {})
    api('/daily-quest').then(setQuests).catch(() => {})
  }
  useEffect(refresh, [])

  if (!profile || !quests) return <p className="text-center mt-10">Yükleniyor...</p>

  const QUEST_ADLAR = {
    like5: '❤️ 5 ürün beğen',
    comment2: '✍️ 2 yorum yaz',
    add_cart1: '🛒 1 ürün sepete ekle',
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Kullanıcı kartı */}
      <div className="bg-gray-900 rounded-2xl p-6 flex items-center gap-4">
        <span className="text-6xl">{profile.avatar_emoji}</span>
        <div>
          <h1 className="text-2xl font-black">{profile.username}</h1>
          <p className="text-orange-400 font-bold">
            💰 Sanal Bakiye: ₺{profile.virtual_balance.toLocaleString('tr-TR')}
          </p>
          <p className="text-xs text-gray-500">Kart: •••• {profile.virtual_card_last4} (SANAL)</p>
        </div>
      </div>

      {/* Rozetler */}
      <div className="bg-gray-900 rounded-2xl p-4">
        <h2 className="font-bold mb-3">🏅 Başarı Rozetlerim</h2>
        {profile.badges.length === 0
          ? <p className="text-gray-500 text-sm">Henüz rozet yok — alışverişe devam! 💪</p>
          : <div className="flex gap-2 flex-wrap">
              {profile.badges.map(b => (
                <span key={b} className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold">{b}</span>
              ))}
            </div>}
      </div>

      {/* Günlük görevler */}
      <div className="bg-gray-900 rounded-2xl p-4">
        <h2 className="font-bold mb-3">📋 Günlük Görevler</h2>
        <div className="space-y-2">
          {quests.quests.map(q => (
            <div key={q.id} className="flex justify-between items-center bg-gray-800 rounded-lg p-3">
              <span className={q.completed ? 'line-through text-gray-500' : ''}>
                {QUEST_ADLAR[q.type] || q.type}
              </span>
              <span className={q.completed ? 'text-green-400 font-bold' : 'text-orange-400'}>
                {q.completed ? '✓ Tamamlandı' : `+₺${q.reward}`}
              </span>
            </div>
          ))}
        </div>
        {quests.all_done && (
          <p className="text-center text-yellow-400 font-bold mt-3">🏆 Günlük Uzman rozeti kazandın!</p>
        )}
      </div>

      {/* Sanal Dolap */}
      <div className="bg-gray-900 rounded-2xl p-4">
        <h2 className="font-bold mb-3">👕 Sanal Dolabım ({profile.closet.length} ürün)</h2>
        {profile.closet.length === 0
          ? <p className="text-gray-500 text-sm">Dolabın boş. Bir sipariş teslim al ve kutuyu aç! 📦</p>
          : <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {profile.closet.map(c => (
                <div key={c.id} className="product-card bg-gray-800 rounded-lg overflow-hidden">
                  <img src={c.image_url} className="w-full aspect-square object-cover" alt={c.name} />
                  <p className="text-xs p-2 truncate">{c.name}</p>
                </div>
              ))}
            </div>}
      </div>

      {/* Arkadaşlar */}
      <div className="bg-gray-900 rounded-2xl p-4">
        <h2 className="font-bold mb-3">👥 Arkadaşlarım ({profile.friends.length})</h2>
        <div className="flex gap-3 flex-wrap">
          {profile.friends.map(f => (
            <div key={f.id} className="bg-gray-800 rounded-xl p-3 text-center">
              <span className="text-3xl">{f.avatar}</span>
              <p className="text-sm font-bold">{f.username}</p>
              {f.gift_sent && <p className="text-xs text-pink-400">🎁 Hediye gönderildi</p>}
            </div>
          ))}
          {profile.friends.length === 0 && <p className="text-gray-500 text-sm">Arkadaş ekle, birlikte hayali alışveriş yapın! 😄</p>}
        </div>
      </div>
    </div>
  )
}
________________________________________
9. KURULUM ve ÇALIŞTIRMA
# 1. Backend
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed.py                  # Sahte verileri yükle (100 ürün, 50 kullanıcı, 200 yorum)
uvicorn main:app --reload       # http://localhost:8000

# 2. Frontend (yeni terminal)
cd frontend
npm install
npm run dev                     # http://localhost:5173
Demo giriş: demo / demo123
1 Haftalık Yol Haritası
Gün	İş
1-2	Kurulum + database.py, models.py, seed.py (bu cevaptaki haliyle hazır ✅)
3-4	Backend API’leri — hepsi routers/ altında hazır ✅
5-6	Frontend sayfaları + component’ler — hazır ✅
7	Test: seed → login → sepet → ödeme → kargo takibi → teslim al → unboxing → dolap akışını uçtan uca dene, bug fix et
10. DEPLOYMENT
Backend — Render (ücretsiz): 1. Kodu GitHub’a pushla 2. render.com → New → Web Service → repo’yu seç 3. Build command: pip install -r requirements.txt 4. Start command: uvicorn main:app --host 0.0.0.0 --port $PORT 5. Deploy sonrası Render shell’de python seed.py çalıştır 6. Ortaya çıkan URL’i frontend api.js’teki API sabitine yaz
Frontend — Vercel (ücretsiz): 1. frontend klasörünü GitHub’a pushla 2. vercel.com → Import Project → kök dizin: frontend 3. Framework: Vite (otomatik algılar) 4. Deploy. Backend URL’in CORS listesine (main.py içindeki allow_origins) Vercel domain’ini ekle
________________________________________
İyi kodlamalar! 🪙 Bir sorun çıkarsa (örneğin bcrypt sürüm uyumsuzluğu gibi yaygın bir durum olursa) söyle, çözelim.
________________________________________
