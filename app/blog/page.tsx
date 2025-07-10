"use client";
import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    title: "5 Essential Spring Cleaning Tips for Your Home",
    excerpt: "Spring is the perfect time to give your home a thorough cleaning. From deep cleaning carpets to organizing closets, these tips will help you get your home in top shape.",
    author: "Sarah Johnson",
    date: "January 15, 2024",
    readTime: "5 min read",
    category: "Cleaning Tips",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
    featured: true,
  },
  {
    id: 2,
    title: "Why Regular Gutter Maintenance is Crucial",
    excerpt: "Clogged gutters can lead to serious water damage and foundation issues. Learn why regular gutter cleaning should be a priority for every homeowner.",
    author: "Mike Chen",
    date: "January 12, 2024",
    readTime: "4 min read",
    category: "Maintenance",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop",
    featured: false,
  },
  {
    id: 3,
    title: "The Ultimate Guide to Window Cleaning",
    excerpt: "Clean windows not only improve your home's appearance but also let in more natural light. Discover professional techniques for streak-free windows.",
    author: "Emily Rodriguez",
    date: "January 10, 2024",
    readTime: "6 min read",
    category: "Window Care",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
    featured: false,
  },
  {
    id: 4,
    title: "Pressure Washing: DIY vs Professional Service",
    excerpt: "While DIY pressure washing can save money, professional services offer expertise and safety. Compare the options to make the best choice for your home.",
    author: "David Thompson",
    date: "January 8, 2024",
    readTime: "7 min read",
    category: "Pressure Washing",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop",
    featured: false,
  },
  {
    id: 5,
    title: "Home Maintenance Checklist for New Homeowners",
    excerpt: "Moving into a new home? This comprehensive checklist will help you stay on top of essential maintenance tasks throughout the year.",
    author: "Lisa Park",
    date: "January 5, 2024",
    readTime: "8 min read",
    category: "Home Care",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
    featured: false,
  },
  {
    id: 6,
    title: "How to Choose the Right Home Service Provider",
    excerpt: "With so many options available, selecting the right service provider can be overwhelming. Learn what to look for and questions to ask.",
    author: "Robert Wilson",
    date: "January 3, 2024",
    readTime: "5 min read",
    category: "Tips & Advice",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop",
    featured: false,
  },
];

export default function BlogPage() {
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-4">Service Homie Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert tips, maintenance guides, and industry insights to help you keep your home in perfect condition.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Article</h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {featuredPost.category}
                    </span>
                    <span className="text-gray-500 text-sm">{featuredPost.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{featuredPost.title}</h3>
                  <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">By {featuredPost.author}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 text-sm">{featuredPost.date}</span>
                    </div>
                    <Link
                      href={`/blog/${featuredPost.id}`}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map(post => (
              <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-sm">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">By {post.author}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 text-sm">{post.date}</span>
                    </div>
                    <Link
                      href={`/blog/${post.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-blue-600 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
          <p className="text-blue-100 mb-6">
            Get the latest home maintenance tips and service updates delivered to your inbox.
          </p>
          <div className="flex max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md focus:ring-2 focus:ring-white outline-none"
            />
            <button className="bg-white text-blue-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 