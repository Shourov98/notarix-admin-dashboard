export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center py-24 px-8 text-center max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
        Modern Notary <span className="text-zinc-500">Management</span>
      </h1>
      <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl leading-relaxed">
        Streamline your notary business with our all-in-one dashboard. Handle signings, manage clients, and track your revenue with ease.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform">
          Start Free Trial
        </button>
        <button className="border border-zinc-200 dark:border-zinc-800 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
          View Demo
        </button>
      </div>
    </section>
  );
}
