export default function Urunler() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ürünler</h1>
      <p className="text-gray-600">2026 Giresun hasadı fındık çeşitleri. Fiyatlar yakında güncellenecek.</p>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { name: "Kabuklu Fındık", desc: "Doğal, kabuğuyla taze fındık." },
          { name: "İç Fındık", desc: "Kabuğu soyulmuş, temiz iç fındık." },
          { name: "Kavrulmuş Fındık", desc: "Kavrulmuş, hazır tüketim." },
        ].map((p) => (
          <div key={p.name} className="rounded-xl border p-5 bg-white">
            <h2 className="font-semibold">{p.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{p.desc}</p>
            <p className="mt-3 font-bold text-emerald-700">Fiyat yakında</p>
            <a
              href="https://wa.me/905060270551"
              className="inline-block mt-3 text-sm text-emerald-700 underline"
            >
              WhatsApp ile sipariş
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
