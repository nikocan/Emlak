import PropertyCard from '@/components/PropertyCard'

export default function Home() {
  const properties = [
    {
      id: 1,
      title: 'Lüks Villa',
      location: 'İstanbul, Beşiktaş',
      price: '15.000.000',
      bedrooms: 4,
      bathrooms: 3,
      area: 250,
      image: '/placeholder.jpg',
      type: 'Satılık'
    },
    {
      id: 2,
      title: 'Modern Daire',
      location: 'Ankara, Çankaya',
      price: '3.500.000',
      bedrooms: 3,
      bathrooms: 2,
      area: 150,
      image: '/placeholder.jpg',
      type: 'Satılık'
    },
    {
      id: 3,
      title: 'Deniz Manzaralı Villa',
      location: 'İzmir, Çeşme',
      price: '25.000.000',
      bedrooms: 5,
      bathrooms: 4,
      area: 350,
      image: '/placeholder.jpg',
      type: 'Satılık'
    },
    {
      id: 4,
      title: 'Merkezi Ofis',
      location: 'İstanbul, Maslak',
      price: '45.000',
      bedrooms: 0,
      bathrooms: 2,
      area: 120,
      image: '/placeholder.jpg',
      type: 'Kiralık'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-blue-600">Emlak</h1>
            <nav className="flex gap-6">
              <a href="#" className="text-gray-700 hover:text-blue-600">Ana Sayfa</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Satılık</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Kiralık</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">İletişim</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-4">Hayalinizdeki Evi Bulun</h2>
          <p className="text-xl mb-8">Binlerce emlak ilanı arasından size en uygun olanı seçin</p>
          <div className="flex gap-4 justify-center max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Şehir, semt veya mahalle..."
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Ara
            </button>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-3xl font-bold text-gray-900 mb-8">Öne Çıkan İlanlar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Emlak. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
