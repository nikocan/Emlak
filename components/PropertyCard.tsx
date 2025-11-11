interface Property {
  id: number
  title: string
  location: string
  price: string
  bedrooms: number
  bathrooms: number
  area: number
  image: string
  type: string
}

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
        <span className="text-white text-6xl">🏠</span>
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {property.type}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
        <p className="text-gray-600 mb-3 flex items-center gap-1">
          <span>📍</span>
          {property.location}
        </p>

        <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              🛏️ {property.bedrooms}
            </span>
          )}
          <span className="flex items-center gap-1">
            🚿 {property.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            📐 {property.area}m²
          </span>
        </div>

        <div className="border-t pt-3 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-blue-600">
              ₺{property.price}
            </span>
            {property.type === 'Kiralık' && (
              <span className="text-gray-600 text-sm">/ay</span>
            )}
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Detay
          </button>
        </div>
      </div>
    </div>
  )
}
