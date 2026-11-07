export default function Iletisim() {
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">İletişim</h1>
      <p className="text-gray-600">
        Sipariş ve sorularınız için bize ulaşın. WhatsApp üzerinden hızlı yanıt alabilirsiniz.
      </p>
      <div className="rounded-xl border p-5 bg-white space-y-2">
        <p><strong>Telefon / WhatsApp:</strong> <a className="text-emerald-700" href="tel:+905060270551">506 027 0551</a></p>
        <p><strong>E-posta:</strong> <a className="text-emerald-700" href="mailto:serdarcagran@gmail.com">serdarcagran@gmail.com</a></p>
      </div>
      <form className="space-y-3 rounded-xl border p-5 bg-white">
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Adınız" />
        <input className="w-full border rounded-lg px-3 py-2" placeholder="E-posta veya telefon" />
        <textarea className="w-full border rounded-lg px-3 py-2" rows={4} placeholder="Mesajınız" />
        <button type="submit" className="rounded-lg bg-emerald-600 text-white px-5 py-2.5 font-medium">
          Gönder
        </button>
      </form>
      <a
        href="https://wa.me/905060270551"
        className="inline-block rounded-lg bg-green-600 text-white px-5 py-2.5 font-medium"
      >
        WhatsApp ile Yaz
      </a>
    </div>
  );
}
