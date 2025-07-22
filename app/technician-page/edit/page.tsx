"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@clerk/nextjs';

const defaultServices = [
  {
    name: "Window Cleaning",
    description: "Streak-free window cleaning for homes and businesses.",
    price: "$120",
    icon: "🪟",
  },
  {
    name: "Gutter Cleaning",
    description: "Remove debris and ensure proper water flow.",
    price: "$80",
    icon: "🧹",
  },
  {
    name: "Pressure Washing",
    description: "Restore your surfaces to like-new condition.",
    price: "$150",
    icon: "💦",
  },
];

const defaultReviews = [
  {
    name: "Sarah J.",
    rating: 5,
    text: "Alex did an amazing job! My windows have never looked better. Highly recommend!",
  },
  {
    name: "Mike C.",
    rating: 5,
    text: "Prompt, professional, and thorough. Will book again!",
  },
  {
    name: "Lisa T.",
    rating: 4,
    text: "Great service and friendly technician. Scheduling was easy.",
  },
];

const socials = [
  { name: "Instagram", href: "https://instagram.com/", icon: "📸" },
  { name: "TikTok", href: "https://tiktok.com/", icon: "🎵" },
  { name: "Facebook", href: "https://facebook.com/", icon: "📘" },
];

export default function TechnicianPageEdit() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [avatar, setAvatar] = useState("https://randomuser.me/api/portraits/men/32.jpg");
  const [name, setName] = useState("Alex Carter");
  const [location, setLocation] = useState("Dallas, TX");
  const [bio, setBio] = useState("Professional window & gutter cleaning. Reliable, friendly, and always on time.");
  const [services, setServices] = useState(defaultServices);
  const [reviews, setReviews] = useState(defaultReviews);
  const [email, setEmail] = useState("alex@carterclean.com");
  const [editingServiceIdx, setEditingServiceIdx] = useState<number | null>(null);
  const [editingReviewIdx, setEditingReviewIdx] = useState<number | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null; // Will redirect to login
  }

  function handleServiceChange(idx: number, field: string, value: string) {
    setServices(svcs => svcs.map((svc, i) => i === idx ? { ...svc, [field]: value } : svc));
  }
  function handleReviewChange(idx: number, field: string, value: string) {
    setReviews(revs => revs.map((rev, i) => i === idx ? { ...rev, [field]: value } : rev));
  }
  function handleSave() {
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
      router.push("/technician-dashboard");
    }, 1200);
  }
  function handleCancel() {
    window.location.href = "/technician-page";
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-b from-blue-50 via-white to-blue-100 px-2 pb-10">
      {/* Hero Section */}
      <section className="w-full max-w-lg mx-auto flex flex-col items-center pt-10 pb-6">
        <div className="relative mb-4">
          <img src={avatar} alt={name} className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl" />
          <input
            type="text"
            className="block w-full mt-4 text-center text-2xl font-bold bg-transparent focus:bg-white/80 rounded p-2 border border-transparent focus:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ fontFamily: 'inherit' }}
          />
          <input
            type="text"
            className="block w-full mt-1 text-center text-blue-600 font-medium bg-transparent focus:bg-white/80 rounded p-2 border border-transparent focus:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={location}
            onChange={e => setLocation(e.target.value)}
            style={{ fontFamily: 'inherit' }}
          />
        </div>
        <textarea
          className="w-full text-center text-gray-700 mb-4 max-w-md bg-transparent focus:bg-white/80 rounded p-2 border border-transparent focus:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={bio}
          onChange={e => setBio(e.target.value)}
          rows={2}
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full shadow-lg transition mb-2 text-lg cursor-default opacity-60">Book a Service</button>
      </section>

      {/* Services Showcase */}
      <section className="w-full max-w-lg mx-auto pb-2">
        <h2 className="text-lg font-bold text-gray-900 mb-4 text-left">Services</h2>
        <div className="flex flex-col gap-6">
          {services.map((service, i) => (
            <div key={i} className="flex items-center bg-white rounded-2xl shadow-lg px-6 py-5 justify-between border border-blue-100">
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-3xl cursor-pointer" onClick={() => setEditingServiceIdx(i)}>{service.icon}</span>
                <div className="min-w-0">
                  {editingServiceIdx === i ? (
                    <>
                      <input
                        className="font-semibold text-gray-900 bg-white/80 rounded p-1 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-1 w-full"
                        value={service.name}
                        onChange={e => handleServiceChange(i, "name", e.target.value)}
                      />
                      <input
                        className="text-gray-500 text-sm bg-white/80 rounded p-1 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        value={service.description}
                        onChange={e => handleServiceChange(i, "description", e.target.value)}
                      />
                      <input
                        className="font-bold text-blue-600 text-lg bg-white/80 rounded p-1 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1 w-20"
                        value={service.price}
                        onChange={e => handleServiceChange(i, "price", e.target.value)}
                      />
                      <input
                        className="w-12 text-center bg-white/80 rounded p-1 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1"
                        value={service.icon}
                        onChange={e => handleServiceChange(i, "icon", e.target.value)}
                        maxLength={2}
                      />
                      <button className="ml-2 text-blue-600 underline text-xs" onClick={() => setEditingServiceIdx(null)}>Done</button>
                    </>
                  ) : (
                    <>
                      <div className="font-semibold text-gray-900 truncate">{service.name}</div>
                      <div className="text-gray-500 text-sm truncate">{service.description}</div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="font-bold text-blue-600 text-lg">{service.price}</div>
                <button className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-full text-sm shadow transition opacity-60 cursor-default">Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="w-full max-w-lg mx-auto py-6 px-2">
        <h2 className="text-lg font-bold text-gray-900 mb-4 text-left">Customer Reviews</h2>
        <div className="flex flex-col gap-4">
          {reviews.map((review, i) => (
            <div key={i} className="bg-white rounded-2xl shadow p-4 flex flex-col border border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                {editingReviewIdx === i ? (
                  <>
                    <input
                      className="font-semibold text-gray-900 bg-white/80 rounded p-1 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={review.name}
                      onChange={e => handleReviewChange(i, "name", e.target.value)}
                    />
                    <input
                      className="w-12 text-center bg-white/80 rounded p-1 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={review.rating}
                      onChange={e => handleReviewChange(i, "rating", e.target.value)}
                      type="number"
                      min={1}
                      max={5}
                    />
                    <button className="ml-2 text-blue-600 underline text-xs" onClick={() => setEditingReviewIdx(null)}>Done</button>
                  </>
                ) : (
                  <span className="font-semibold text-gray-900 cursor-pointer" onClick={() => setEditingReviewIdx(i)}>{review.name}</span>
                )}
                <span className="flex gap-0.5">
                  {[...Array(5)].map((_, idx) => (
                    <svg key={idx} className={`w-4 h-4 ${idx < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                  ))}
                </span>
              </div>
              <div className="text-gray-700 text-sm">
                {editingReviewIdx === i ? (
                  <textarea
                    className="w-full bg-white/80 rounded p-1 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={review.text}
                    onChange={e => handleReviewChange(i, "text", e.target.value)}
                  />
                ) : (
                  <span onClick={() => setEditingReviewIdx(i)} className="cursor-pointer">{review.text}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Socials */}
      <section className="w-full max-w-lg mx-auto py-6 flex flex-col items-center">
        <div className="text-gray-700 font-semibold mb-2">Contact</div>
        <input
          type="email"
          className="text-blue-600 hover:underline mb-4 bg-white/70 rounded p-2 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <div className="flex gap-4">
          {socials.map((social, i) => (
            <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="bg-white/80 backdrop-blur rounded-full p-3 shadow hover:bg-blue-100 transition border border-blue-100" aria-label={social.name}>
              <span className="text-2xl">{social.icon}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Save/Cancel */}
      <div className="w-full max-w-lg mx-auto flex justify-end gap-4 py-6 px-2">
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-full shadow transition" onClick={handleCancel}>Cancel</button>
        <button className="bg-blue-600 text-white font-bold px-8 py-2 rounded-full shadow-lg transition" onClick={handleSave}>Save</button>
        {showSaved && <span className="ml-4 text-green-600 font-semibold self-center">Saved!</span>}
      </div>
    </div>
  );
} 