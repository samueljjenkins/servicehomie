import Image from 'next/image';

const serviceCities = [
  { name: 'Dallas, TX', lat: 32.7767, lng: -96.7970 },
  { name: 'Plano, TX', lat: 33.0198, lng: -96.6989 },
  { name: 'Frisco, TX', lat: 33.1507, lng: -96.8236 },
  { name: 'Austin, TX', lat: 30.2672, lng: -97.7431 },
  { name: 'Houston, TX', lat: 29.7604, lng: -95.3698 },
  { name: 'San Antonio, TX', lat: 29.4241, lng: -98.4936 },
  { name: 'Fort Worth, TX', lat: 32.7555, lng: -97.3308 },
  { name: 'Arlington, TX', lat: 32.7357, lng: -97.1081 },
  { name: 'Irving, TX', lat: 32.8140, lng: -96.9489 },
  { name: 'Garland, TX', lat: 32.9126, lng: -96.6389 },
];

export default function ServiceAreaMapPage() {
  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-8">Service Area Map</h1>
          <p className="text-lg text-gray-600 mb-8">
            Service Homie is currently available in the following cities. More locations coming soon!
          </p>
          <div className="flex flex-col items-center mb-8">
            {/* Static US map with pins for cities (SVG for simplicity) */}
            <div className="relative w-full max-w-2xl h-80 mb-6">
              <Image
                src="/us-map.png"
                alt="US Map"
                fill
                className="object-contain rounded-lg border border-gray-200"
                priority
              />
              {/* Pins for cities (absolute positioning, mock for now) */}
              {/* Example: Dallas, Austin, Houston, etc. */}
              <div className="absolute left-[38%] top-[54%] w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-lg" title="Dallas, TX"></div>
              <div className="absolute left-[39%] top-[57%] w-4 h-4 bg-blue-400 rounded-full border-2 border-white shadow" title="Austin, TX"></div>
              <div className="absolute left-[41%] top-[60%] w-4 h-4 bg-blue-400 rounded-full border-2 border-white shadow" title="Houston, TX"></div>
              <div className="absolute left-[38.5%] top-[56%] w-3 h-3 bg-blue-300 rounded-full border-2 border-white shadow" title="Plano, TX"></div>
              <div className="absolute left-[38.7%] top-[55%] w-3 h-3 bg-blue-300 rounded-full border-2 border-white shadow" title="Frisco, TX"></div>
              <div className="absolute left-[37.5%] top-[54.5%] w-3 h-3 bg-blue-300 rounded-full border-2 border-white shadow" title="Fort Worth, TX"></div>
              <div className="absolute left-[38.2%] top-[54.7%] w-3 h-3 bg-blue-300 rounded-full border-2 border-white shadow" title="Arlington, TX"></div>
              <div className="absolute left-[38.3%] top-[54.2%] w-3 h-3 bg-blue-300 rounded-full border-2 border-white shadow" title="Irving, TX"></div>
              <div className="absolute left-[38.6%] top-[54.8%] w-3 h-3 bg-blue-300 rounded-full border-2 border-white shadow" title="Garland, TX"></div>
              <div className="absolute left-[37.8%] top-[58%] w-4 h-4 bg-blue-400 rounded-full border-2 border-white shadow" title="San Antonio, TX"></div>
            </div>
            <div className="text-sm text-gray-400">Map locations are approximate for demonstration purposes.</div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Available Cities</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
            {serviceCities.map((city) => (
              <li key={city.name} className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                {city.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
} 