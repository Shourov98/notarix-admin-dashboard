export default function Features() {
  const features = [
    {
      title: "Smart Scheduling",
      description: "Automated booking system that syncs with your calendar perfectly.",
      icon: "📅"
    },
    {
      title: "Digital Signatures",
      description: "Secure and legally binding e-signatures for all your documents.",
      icon: "✍️"
    },
    {
      title: "Revenue Tracking",
      description: "Detailed analytics to help you understand your business growth.",
      icon: "📊"
    }
  ];

  return (
    <section id="features" className="py-24 px-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything you need</h2>
          <p className="text-zinc-600 dark:text-zinc-400">Designed specifically for modern notary professionals.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 bg-white dark:bg-black rounded-2xl border border-zinc-100 dark:border-zinc-900 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
