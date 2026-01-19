import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              مشوار - جسر بين المواهب والإبداع
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              منصة ذكية تربط بين الشركات والمواهب الإبداعية المحلية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                ابدأ الآن
              </Link>
              <Link
                href="/search"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition"
              >
                استكشف المواهب
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            المميزات الرئيسية
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">مطابقة ذكية</h3>
              <p className="text-gray-600">
                نظام مطابقة تلقائي بين الشركات والمواهب حسب المهارات والميزانية والموقع
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">معارض إبداعية</h3>
              <p className="text-gray-600">
                معرض كامل لكل موهبة إبداعية يعرض أعمالها ومشاريعها وخدماتها
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">نظام التوصيات</h3>
              <p className="text-gray-600">
                توصيات مبنية على تقييمات العملاء والأداء وجودة المشاريع السابقة
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">مساحة التعاون</h3>
              <p className="text-gray-600">
                إدارة المشاريع ومتابعة المراحل ومشاركة الملفات والدردشة في الوقت الفعلي
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">الموارد والتدريب</h3>
              <p className="text-gray-600">
                دروس وإرشادات لمساعدة المواهب على تحسين مهاراتها
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2">محلي وموثوق</h3>
              <p className="text-gray-600">
                تركيز على المواهب المحلية في العالم العربي مع ضمان الجودة والموثوقية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">جاهز للبدء؟</h2>
          <p className="text-xl mb-8 text-gray-100">
            انضم إلى مجتمعنا المتنامي من الشركات والمواهب الإبداعية
          </p>
          <Link
            href="/auth/signup"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
          >
            إنشاء حساب مجاني
          </Link>
        </div>
      </section>
    </div>
  )
}

