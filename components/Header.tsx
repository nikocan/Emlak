import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-3xl font-bold text-blue-600">
            Emlak
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Ana Sayfa
            </Link>
            <Link href="/create-listing" className="text-gray-700 hover:text-blue-600 transition-colors">
              🤖 İlan Oluştur
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
              Fiyatlandırma
            </Link>
            <Link href="/analytics" className="text-gray-700 hover:text-blue-600 transition-colors">
              Bölge Analizi
            </Link>
            <Link href="/admin/scrapers" className="text-gray-700 hover:text-blue-600 transition-colors">
              Veri Çekme
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Giriş Yap
            </Link>
            <Link
              href="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Başlayın
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
