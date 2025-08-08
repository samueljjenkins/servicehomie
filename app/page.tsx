export default function Page() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<h1 className="text-5xl font-bold text-gray-900 mb-6">
						Service Homie
					</h1>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
						Professional booking system for service providers. Streamline your business, 
						manage appointments, and grow your client base with our powerful platform.
					</p>
					<div className="flex justify-center gap-4">
						<a
							href="/discover"
							className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
						>
							Get Started
						</a>
						<a
							href="/experiences/demo"
							className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-8 rounded-lg border border-blue-600 transition-colors"
						>
							View Demo
						</a>
					</div>
				</div>

				{/* Features Section */}
				<div className="grid md:grid-cols-3 gap-8 mb-16">
					<div className="bg-white p-6 rounded-xl shadow-md">
						<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
							<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Scheduling</h3>
						<p className="text-gray-600">Automated appointment booking with real-time availability and instant confirmations.</p>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-md">
						<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
							<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Processing</h3>
						<p className="text-gray-600">Secure payment handling with multiple payment methods and automated invoicing.</p>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-md">
						<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
							<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics & Reports</h3>
						<p className="text-gray-600">Comprehensive insights into your business performance and client trends.</p>
					</div>
				</div>

				{/* CTA Section */}
				<div className="bg-blue-600 rounded-xl p-8 text-center text-white">
					<h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
					<p className="text-xl mb-6 opacity-90">
						Join thousands of service providers who trust Service Homie to manage their bookings.
					</p>
					<a
						href="/discover"
						className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors inline-block"
					>
						Start Your Free Trial
					</a>
				</div>
			</div>
		</div>
	);
}
