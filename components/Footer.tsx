import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Emlak</h3>
            <p className="text-gray-400 text-sm">
              Hayalinizdeki evi bulmak için en iyi adres. Güvenilir ve profesyonel hizmet.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/#listings" className="text-gray-400 hover:text-white transition-colors">
                  İlanlar
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="text-gray-400 hover:text-white transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-gray-400 hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kategoriler</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">Satılık İlanlar</li>
              <li className="text-gray-400">Kiralık İlanlar</li>
              <li className="text-gray-400">Daireler</li>
              <li className="text-gray-400">Villalar</li>
              <li className="text-gray-400">Ofisler</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>+90 555 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <span>info@emlak.com</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>İstanbul, Türkiye</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Emlak. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}
