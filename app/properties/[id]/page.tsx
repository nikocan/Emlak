import { properties, getPropertyById } from '@/data/properties'
import Link from 'next/link'

export async function generateStaticParams() {
  return properties.map((property) => ({
    id: property.id.toString(),
  }))
}

export default function PropertyDetail({ params }: { params: { id: string } }) {
  const property = getPropertyById(parseInt(params.id))

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">İlan Bulunamadı</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-bold text-blue-600">
              Emlak
            </Link>
            <nav className="flex gap-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600">Ana Sayfa</Link>
              <Link href="/#listings" className="text-gray-700 hover:text-blue-600">İlanlar</Link>
              <Link href="/hakkimizda" className="text-gray-700 hover:text-blue-600">Hakkımızda</Link>
              <Link href="/iletisim" className="text-gray-700 hover:text-blue-600">İletişim</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/#listings" className="hover:text-blue-600">İlanlar</Link>
          <span>/</span>
          <span className="text-gray-900">{property.title}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg h-96 flex items-center justify-center mb-6">
              <span className="text-white text-9xl">🏠</span>
            </div>

            {/* Title and Type */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <p className="text-gray-600 flex items-center gap-1">
                    <span>📍</span>
                    {property.location}
                  </p>
                </div>
                <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {property.type}
                </span>
              </div>

              {/* Price */}
              <div className="border-t pt-4">
                <div className="text-4xl font-bold text-blue-600">
                  ₺{property.price}
                  {property.type === 'Kiralık' && <span className="text-2xl text-gray-600">/ay</span>}
                </div>
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Özellikler</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.bedrooms > 0 && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl mb-2">🛏️</div>
                    <div className="font-semibold">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Yatak Odası</div>
                  </div>
                )}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">🚿</div>
                  <div className="font-semibold">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Banyo</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">📐</div>
                  <div className="font-semibold">{property.area}m²</div>
                  <div className="text-sm text-gray-600">Alan</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">🏢</div>
                  <div className="font-semibold">{property.category}</div>
                  <div className="text-sm text-gray-600">Tip</div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {property.yearBuilt && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Yapım Yılı:</span>
                    <span className="font-semibold">{property.yearBuilt}</span>
                  </div>
                )}
                {property.floor !== undefined && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Kat:</span>
                    <span className="font-semibold">{property.floor}/{property.totalFloors}</span>
                  </div>
                )}
                {property.heating && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Isınma:</span>
                    <span className="font-semibold">{property.heating}</span>
                  </div>
                )}
                {property.furnished !== undefined && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Eşyalı:</span>
                    <span className="font-semibold">{property.furnished ? 'Evet' : 'Hayır'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Açıklama</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Özellikler</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-600">✓</span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">İletişim</h2>

              {/* Agent Info */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {property.agent.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{property.agent.name}</div>
                    <div className="text-sm text-gray-600">Emlak Danışmanı</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <a href={`tel:${property.agent.phone}`} className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                    <span>📞</span>
                    {property.agent.phone}
                  </a>
                  <a href={`mailto:${property.agent.email}`} className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                    <span>✉️</span>
                    {property.agent.email}
                  </a>
                </div>
              </div>

              {/* Contact Form */}
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Adınız Soyadınız"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="E-posta Adresiniz"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Telefon Numaranız"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Mesajınız"
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Bilgi Al
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Emlak. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
