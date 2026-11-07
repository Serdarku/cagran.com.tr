import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Çağran Fındık — Giresun'dan Evinize",
  description: "Kendi bahçemizden toplanan taze Giresun fındığı. Kabuklu, iç ve kavrulmuş çeşitler.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col">
        <header className="border-b bg-white">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <span className="font-bold text-emerald-700 text-lg">Çağran Fındık</span>
            <nav className="flex gap-4 text-sm">
              <a href="/">Ana Sayfa</a>
              <a href="/urunler">Ürünler</a>
              <a href="/iletisim">İletişim</a>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">{children}</main>
        <footer className="border-t bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600">
            <p>Çağran Fındık — Giresun'dan sofranıza.</p>
            <p>Tel/WhatsApp: 506 027 0551 · E-posta: serdarcagran@gmail.com</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
