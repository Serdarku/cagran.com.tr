import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, getUser, getToken } from '../api.js'

export default function Header() {
  const [search, setSearch] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const user = getUser()
  const nav = useNavigate()
  useEffect(() => { if (getToken()) api('/cart').then(d => setCartCount(d.items.length)).catch(() => {}) }, [])
  return <>
    <div className="bg-[#173b2a] text-white text-xs text-center py-2 px-3">Giresun'dan sofranıza • Üreticiden tüketiciye • Küçük üreticiyi destekleyin</div>
    <header className="sticky top-0 z-50 bg-[#f7f4ec]/95 backdrop-blur border-b border-[#d9d4c7]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-[74px] flex items-center gap-5">
        <Link to="/" className="shrink-0 flex items-center gap-3">
          <span className="w-11 h-11 rounded-full bg-[#173b2a] text-[#e1b85a] grid place-items-center text-xl">🌰</span>
          <span><strong className="block text-xl tracking-tight text-[#173b2a]">ÇAĞRAN</strong><small className="block text-[10px] uppercase tracking-[.22em] text-[#806d4d]">Giresun • Fındık</small></span>
        </Link>
        <nav className="hidden lg:flex items-center gap-5 ml-5 text-sm font-semibold text-[#425247]">
          <a href="/#findik">Fındığımız</a><a href="/#giresun">Giresun</a><a href="/#hikaye">Hikâyemiz</a><a href="/#uretim">Üretim</a>
        </nav>
        <form className="hidden md:flex flex-1 max-w-md ml-auto" onSubmit={e=>{e.preventDefault();nav(`/?search=${search}`)}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ürün ara..." className="w-full rounded-full border border-[#d5d0c3] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#79946d]" />
        </form>
        <div className="ml-auto md:ml-0 flex items-center gap-3">
          {user && <Link to="/profile" className="hidden sm:block text-sm font-bold text-[#173b2a]">Hesabım</Link>}
          <Link to="/cart" className="relative w-10 h-10 rounded-full border border-[#d5d0c3] grid place-items-center bg-white">🛒{cartCount>0&&<span className="absolute -top-1 -right-1 bg-[#b65b3a] text-white text-[10px] font-bold rounded-full w-5 h-5 grid place-items-center">{cartCount}</span>}</Link>
        </div>
      </div>
    </header>
  </>
}
