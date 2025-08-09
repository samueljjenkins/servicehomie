export default function DiscoverPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-whop-blue/10 dark:from-slate-950 dark:to-black">
			<div className="max-w-4xl mx-auto px-4 py-16">
				{/* Title */}
					<h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
					Discover your app
				</h1>
				{/* Main Description Card */}
					<div className="bg-white dark:bg-gray-900 dark:border dark:border-gray-800 rounded-xl p-8 shadow-md text-center mb-16">
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
						This is your app's discover page—showcase what your app does and how
						it helps creators.
					</p>
                    <p className="text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-2">
						Share real success stories, link to thriving Whop communities using
						your app, and add referral links to earn affiliate fees when people
						install your app.
					</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 max-w-2xl mx-auto">
						💡 <strong>Tip:</strong> Clearly explain your app's value
						proposition and how it helps creators make money or grow their
						communities.
					</p>
				</div>

				{/* Pro Tips Section */}
				<div className="grid md:grid-cols-2 gap-6 mb-10">
					<div className="bg-white dark:bg-gray-900 dark:border dark:border-gray-800 rounded-xl p-6 shadow-md flex flex-col gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
							Showcase Real Success
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-300">
							Link to real Whop communities using your app, with revenue and
							member stats.
						</p>
					</div>
					<div className="bg-white dark:bg-gray-900 dark:border dark:border-gray-800 rounded-xl p-6 shadow-md flex flex-col gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
							Include Referral Links
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-300">
							Add <code>?a=your_app_id</code> to Whop links to earn affiliate
							commissions.
						</p>
					</div>
				</div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
					Examples of Success Stories
				</h2>

				{/* Main Content Cards */}
				<div className="grid md:grid-cols-2 gap-6">
					{/* Success Story Card 1 */}
					<div className="bg-white dark:bg-gray-900 dark:border dark:border-gray-800 rounded-xl p-6 shadow-md flex flex-col justify-between">
						<div>
							<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
								CryptoKings
							</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Trading Community</p>
							<p className="text-gray-700 dark:text-gray-200 mb-4 text-sm">
								"Grew to{" "}
								<span className="font-bold text-whop-blue">2,500+ members</span>{" "}
								and <span className="font-bold text-whop-blue">$18,000+/mo</span>{" "}
								with automated signals. Members love the real-time alerts!"
							</p>
						</div>
						<a
							href="https://whop.com/cryptokings/?a=your_app_id"
							className="mt-auto block w-full bg-whop-blue hover:bg-whop-blue/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center text-sm"
						>
							Visit CryptoKings
						</a>
					</div>

					{/* Success Story Card 2 */}
					<div className="bg-white dark:bg-gray-900 dark:border dark:border-gray-800 rounded-xl p-6 shadow-md flex flex-col justify-between">
						<div>
							<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
								SignalPro
							</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Premium Signals</p>
							<p className="text-gray-700 dark:text-gray-200 mb-4 text-sm">
								"Retention jumped to{" "}
								<span className="font-bold text-whop-blue">92%</span>. Affiliate
								program brought in{" "}
								<span className="font-bold text-whop-blue">$4,000+</span> last
								quarter."
							</p>
						</div>
						<a
							href="https://whop.com/signalpro/?app=your_app_id"
							className="mt-auto block w-full bg-whop-blue hover:bg-whop-blue/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center text-sm"
						>
							Visit SignalPro
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
