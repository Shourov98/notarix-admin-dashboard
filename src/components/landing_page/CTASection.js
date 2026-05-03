export default function CTASection() {
  return (
    <section className="bg-white py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#1a4fdb] rounded-[40px] py-20 px-8 md:px-16 text-center text-white shadow-2xl shadow-blue-200">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Start Your Notary Process Today
          </h2>
          <p className="text-blue-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium">
            Professional remote notarization built for accuracy, security, and ease.
          </p>
          <button className="bg-white text-[#1a4fdb] px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
}
