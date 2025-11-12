import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function HakkimizdaPage() {
  const team = [
    {
      name: 'Ahmet Yılmaz',
      position: 'Genel Müdür',
      description: '20 yıllık emlak sektörü deneyimi',
      icon: '👨‍💼'
    },
    {
      name: 'Ayşe Demir',
      position: 'Satış Müdürü',
      description: '15 yıllık satış ve pazarlama deneyimi',
      icon: '👩‍💼'
    },
    {
      name: 'Mehmet Kaya',
      position: 'Kiralama Uzmanı',
      description: '10 yıllık kiralama danışmanlığı',
      icon: '👨‍💻'
    },
    {
      name: 'Zeynep Şahin',
      position: 'Yatırım Danışmanı',
      description: 'Gayrimenkul yatırım uzmanı',
      icon: '👩‍💻'
    }
  ]

  const stats = [
    { number: '10+', label: 'Yıllık Deneyim' },
    { number: '1000+', label: 'Mutlu Müşteri' },
    { number: '500+', label: 'Satılan Emlak' },
    { number: '50+', label: 'Uzman Ekip' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Hakkımızda</h1>
          <p className="text-xl">Türkiye'nin önde gelen emlak platformu</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Hikayemiz</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                2014 yılında kurulan Emlak, Türkiye'nin en güvenilir gayrimenkul platformlarından
                biri haline gelmiştir. Müşterilerimize en iyi hizmeti sunma vizyonuyla yola çıktık
                ve bugün binlerce mutlu müşteriye hizmet vermenin gururunu yaşıyoruz.
              </p>
              <p>
                Profesyonel ekibimiz, geniş portföyümüz ve müşteri memnuniyeti odaklı yaklaşımımız
                ile sektörde fark yaratıyoruz. Her türlü gayrimenkul ihtiyacınız için yanınızdayız.
              </p>
              <p>
                Teknoloji ve yenilikçilikten yana olan firmamız, sürekli gelişen altyapımız ve
                güvenilir hizmet anlayışımızla, gayrimenkul sektöründe öncü olmaya devam ediyoruz.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg h-96 flex items-center justify-center">
            <span className="text-white text-9xl">🏢</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Rakamlarla Biz</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Değerlerimiz</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Müşteri Odaklılık</h3>
            <p className="text-gray-600">
              Müşterilerimizin ihtiyaçlarını anlamak ve en iyi çözümü sunmak önceliğimizdir.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Güvenilirlik</h3>
            <p className="text-gray-600">
              Şeffaflık ve dürüstlük ilkesiyle, her zaman güvenilir bir partner oluyoruz.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Yenilikçilik</h3>
            <p className="text-gray-600">
              Teknoloji ve yenilikçiliği kullanarak sürekli gelişiyor ve iyileştiriyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">Ekibimiz</h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Profesyonel ve deneyimli ekibimizle size hizmet vermekten gurur duyuyoruz
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-6xl mb-4">{member.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.position}</p>
                <p className="text-sm text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-6">Misyonumuz</h2>
          <p className="text-xl leading-relaxed max-w-3xl mx-auto">
            İnsanların hayallerindeki evi bulmalarına yardımcı olmak ve gayrimenkul sektöründe
            güvenilir, şeffaf ve yenilikçi hizmet sunarak sektöre değer katmaktır.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Hayalinizdeki Evi Birlikte Bulalım
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Profesyonel ekibimiz size yardımcı olmak için hazır
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/#listings"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              İlanları İncele
            </a>
            <a
              href="/iletisim"
              className="bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              İletişime Geç
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
