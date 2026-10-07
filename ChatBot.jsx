import { useState } from 'react'
const PHONE='905XXXXXXXXX'
export default function ChatBot(){
 const [open,setOpen]=useState(false)
 const go=(text)=>window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`,'_blank','noopener,noreferrer')
 return <div className="fixed right-4 bottom-4 z-[60]">
  {open&&<div className="whatsapp-panel mb-3 w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-3xl border border-[#d9d4c7] bg-[#fdfbf6]">
   <div className="bg-[#173b2a] text-white p-4 flex items-center gap-3"><div className="w-11 h-11 rounded-full bg-[#e1b85a] grid place-items-center text-xl">🌰</div><div className="flex-1"><b className="block">Çağran • Üretici</b><span className="text-xs text-white/65">WhatsApp'ta buradayız</span></div><button onClick={()=>setOpen(false)} className="text-white/70 text-xl">×</button></div>
   <div className="p-4 bg-[#f3efe5]"><div className="bg-white rounded-2xl rounded-tl-sm p-3 text-sm text-[#334239] shadow-sm">Merhaba 👋 Giresun fındığı, ürünlerimiz veya üretim süreci hakkında doğrudan bize yazabilirsiniz.</div><div className="grid grid-cols-1 gap-2 mt-3"><button onClick={()=>go('Merhaba, Giresun fındığı hakkında bilgi almak istiyorum.')} className="text-left bg-white border border-[#ddd7c9] rounded-xl px-3 py-2 text-sm">🌰 Fındık hakkında bilgi almak istiyorum</button><button onClick={()=>go('Merhaba, bu yılki mahsulden almak istiyorum.')} className="text-left bg-white border border-[#ddd7c9] rounded-xl px-3 py-2 text-sm">🧺 Bu yılki mahsulden almak istiyorum</button><button onClick={()=>go('Merhaba, kargo ve fiyat bilgisi alabilir miyim?')} className="text-left bg-white border border-[#ddd7c9] rounded-xl px-3 py-2 text-sm">📦 Fiyat ve kargo bilgisi</button></div></div>
   <button onClick={()=>go('Merhaba, Çağran fındık ürünleri hakkında bilgi almak istiyorum.')} className="w-full bg-[#25D366] text-white font-bold py-3">WhatsApp'tan Yaz</button>
  </div>}
  <button onClick={()=>setOpen(!open)} className="whatsapp-launcher btn-pop flex items-center gap-3 rounded-full bg-[#173b2a] text-white pl-3 pr-5 py-3 border border-white/20"><span className="relative w-10 h-10 rounded-full bg-[#25D366] grid place-items-center text-xl">⌕<span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#e1b85a] rounded-full border-2 border-[#173b2a]"></span></span><span className="hidden sm:block text-left"><b className="block text-sm">Üreticiye yaz</b><small className="text-white/60">WhatsApp'tan ulaşın</small></span></button>
 </div>
}
