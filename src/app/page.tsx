export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-serif font-bold text-center mb-8 text-purple-700">
          Welcome to Beykush Winery
        </h1>
        <p className="text-xl text-center text-burgundy-700 mb-12">
          Premium Ukrainian wines crafted with passion
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <div className="px-8 py-4 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors cursor-pointer">
            Shop Wines
          </div>
          <div className="px-8 py-4 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 transition-colors cursor-pointer">
            Wine Club
          </div>
          <div className="px-8 py-4 border-2 border-gold-600 text-gold-600 rounded-lg hover:bg-gold-50 transition-colors cursor-pointer">
            Our Story
          </div>
        </div>
      </div>
    </main>
  );
}
