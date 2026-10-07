import { useState, useEffect } from 'react'
import { api } from '../api.js'
import { sounds } from '../sounds.js'

export default function GiftModal({ product, onClose }) {
  const [friends, setFriends] = useState([])
  const [friendId, setFriendId] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    api('/friends').then(setFriends).catch(() => {})
  }, [])

  async function gonder() {
    try {
      await api('/gift', {
        method: 'POST',
        body: JSON.stringify({ friend_id: parseInt(friendId), product_id: product.id }),
      })
      setSent(true); sounds.ding()
    } catch (e) { alert(e.message) }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full">
        <h2 className="text-lg font-bold text-orange-400">🎁 Arkadaşına Gönder</h2>
        {!sent ? (
          <>
            <p className="text-sm text-gray-400 mt-1">{product.name}</p>
            <select value={friendId} onChange={e => setFriendId(e.target.value)}
              className="w-full bg-gray-800 rounded-lg p-3 mt-4">
              <option value="">Arkadaş seç...</option>
              {friends.map(f => (
                <option key={f.friend_id} value={f.friend_id}>
                  {f.avatar} {f.username}
                </option>
              ))}
            </select>
            <button onClick={gonder} disabled={!friendId}
              className="btn-pop w-full mt-3 bg-pink-500 hover:bg-pink-600 font-bold py-3 rounded-lg disabled:opacity-50">
              Hediyeyi Gönder 🚀
            </button>
          </>
        ) : (
          <p className="text-center text-green-400 font-bold text-lg mt-4">
            🎉 Hediye gönderildi! Arkadaşın çok sevinecek!
          </p>
        )}
        <button onClick={onClose} className="btn-pop w-full mt-3 bg-gray-700 py-2 rounded-lg">Kapat</button>
      </div>
    </div>
  )
}
