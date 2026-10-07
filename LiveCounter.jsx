import { useState, useEffect } from 'react'

// Sahte "X kişi inceliyor" sayacı — her 3-7 sn'de değişir
export default function LiveCounter({ initial = 5 }) {
  const [count, setCount] = useState(initial)

  useEffect(() => {
    function tick() {
      setCount(2 + Math.floor(Math.random() * 19))  // 2-20 arası
      setTimeout(tick, 3000 + Math.random() * 4000) // 3-7 sn
    }
    const t = setTimeout(tick, 3000 + Math.random() * 4000)
    return () => clearTimeout(t)
  }, [])

  return (
    <span className="inline-flex items-center gap-1 text-xs text-green-400">
      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      {count} kişi şu an inceliyor
    </span>
  )
}
