export default function Home() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-emerald-50 p-8">
        <h1 className="text-3xl font-bold text-emerald-800">Çağran Fındık</h1>
        <p className="mt-2 text-gray-700">
          Kendi bahçemizden, taze hasat Giresun fındığı. Kabuklu, iç ve kavrulmuş çeşitler.
        </p>
        <a
          href="https://wa.me/905060270551"
          className="inline-block mt-4 rounded-lg bg-emerald-600 text-white px-5 py-2.5 font-medium"
        >
          WhatsApp ile Sipariş Ver
        </a>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {["Kabuklu Fındık", "İç Fındık", "Kavrulmuş Fındık"].map((title) => (
          <div key={title} className="rounded-xl border p-5 bg-white">
            <h2 className="font-semibold">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">2026 Giresun hasadı — taze ve kaliteli.</p>
            <p className="mt-3 font-bold text-emerald-700">Fiyat yakında</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border p-5 bg-white">
        <h2 className="font-semibold">İletişim</h2>
        <p className="text-sm text-gray-600 mt-1">
          Tel/WhatsApp: <a href="tel:+905060270551" className="text-emerald-700">506 027 0551</a><br />
          E-posta: <a href="mailto:serdarcagran@gmail.com" className="text-emerald-700">serdarcagran@gmail.com</a>
        </p>
      </section>
    </div>
  );
}
