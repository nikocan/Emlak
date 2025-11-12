import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-3xl font-bold text-blue-600">
            Emlak
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Ana Sayfa
            </Link>
            <Link href="/#listings" className="text-gray-700 hover:text-blue-600 transition-colors">
              İlanlar
            </Link>
            <Link href="/analytics" className="text-gray-700 hover:text-blue-600 transition-colors">
              Bölge Analizi
            </Link>
            <Link href="/hakkimizda" className="text-gray-700 hover:text-blue-600 transition-colors">
              Hakkımızda
            </Link>
            <Link href="/iletisim" className="text-gray-700 hover:text-blue-600 transition-colors">
              İletişim
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
