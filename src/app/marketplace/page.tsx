import Link from 'next/link';

const services = [
  {
    title: 'Window Cleaning',
    description: 'Professional window cleaning for a streak-free shine.',
    icon: '🪟',
    href: '/marketplace/window-cleaning',
  },
  {
    title: 'Gutter Cleaning',
    description: 'Keep your gutters clear and your home protected.',
    icon: '🧹',
    href: '/marketplace/gutter-cleaning',
  },
  {
    title: 'Pressure Washing',
    description: 'Restore the look of your driveway, siding, and more.',
    icon: '💦',
    href: '/marketplace/pressure-washing',
  },
];

export default function MarketplaceLanding() {
  return (
    <section className="py-20 bg-gray-50 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">Marketplace</h1>
          <p className="text-lg text-gray-500">Select a service to view available technicians:</p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link key={service.title} href={service.href} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 block cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600">
              <div className="flex flex-col items-center">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-500 text-center">{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 