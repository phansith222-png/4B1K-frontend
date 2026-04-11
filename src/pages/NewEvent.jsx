import React from "react";
import Navbar from "../components/Navbar";

const NewEventPage = () => {
  const categories = [
    "All",
    "Concert",
    "Fan Meeting",
    "Festival",
    "Online Event",
  ];

  const featuredEvent = {
    category: "Upcoming Concert",
    title: "The 2026 World Tour: Beyond the Rhythm",
    description:
      "สัมผัสประสบการณ์ดนตรีรูปแบบใหม่ที่ผสมผสานเทคโนโลยี AI และการแสดงสดสุดตระการตา พบกับศิลปินระดับโลกที่จะมาสร้างความประทับใจในซัมเมอร์นี้",
    date: "APRIL 20, 2026",
    readTime: "LIVE AT IMPACT ARENA",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop",
    author: {
      name: "4B1K Official",
      role: "Event Organizer",
      avatar: "https://ui-avatars.com/api/?name=4B&background=2b5cda&color=fff",
    },
  };

  const otherEvents = [
    {
      category: "Fan Meeting",
      title: "Exclusive Night with Your Favorite Star",
      date: "MAY 12, 2025",
      time: "2 MIN READ",
      image:
        "https://images.unsplash.com/photo-1514525253344-f81f50592667?q=80&w=500&auto=format&fit=crop",
    },
    {
      category: "Festival",
      title: "Neon Summer Festival: Bangkok Edition",
      date: "JUNE 05, 2025",
      time: "4 MIN READ",
      image:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=500&auto=format&fit=crop",
    },
    {
      category: "Workshop",
      title: "Music Production 101 for Beginners",
      date: "JUNE 18, 2025",
      time: "5 MIN READ",
      image:
        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=500&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        {/* Header Section */}
        <section className="mb-12">
          <h1 className="text-5xl font-black tracking-tight mb-4 text-gray-900">
            News & <span className="text-[#2b5cda]">Events</span>
          </h1>
          <p className="text-gray-500 max-w-2xl text-lg leading-relaxed">
            ติดตามทุกความเคลื่อนไหว อัปเดตตารางคอนเสิร์ต และกิจกรรมพิเศษจาก 4B1K
            ที่จะพาคุณไปใกล้ชิดกับศิลปินที่คุณรักมากขึ้น
          </p>
        </section>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 border-b border-gray-100 pb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, index) => (
              <button
                key={index}
                className={`px-5 py-1.5 rounded-md text-sm font-bold transition-all ${
                  index === 0
                    ? "bg-[#1e293b] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button className="p-2 text-gray-400 hover:text-[#2b5cda] transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20 items-center">
          <div className="lg:col-span-7">
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-blue-100 group cursor-pointer">
              <img
                src={featuredEvent.image}
                alt="Featured"
                className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded w-max mb-4">
              {featuredEvent.category}
            </span>
            <h2 className="text-4xl font-black leading-tight mb-5 hover:text-[#2b5cda] cursor-pointer transition-colors">
              {featuredEvent.title}
            </h2>
            <p className="text-gray-500 text-lg mb-6 leading-relaxed">
              {featuredEvent.description}
            </p>
            <div className="text-xs font-black text-gray-400 mb-8 tracking-widest uppercase">
              {featuredEvent.date} — {featuredEvent.readTime}
            </div>

            <div className="flex items-center gap-3">
              <img
                src={featuredEvent.author.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full border border-gray-200"
              />
              <div>
                <p className="text-sm font-black text-gray-800">
                  {featuredEvent.author.name}
                </p>
                <p className="text-xs text-gray-400 font-bold uppercase">
                  {featuredEvent.author.role}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {otherEvents.map((event, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="rounded-2xl overflow-hidden mb-6 aspect-video shadow-lg group-hover:shadow-blue-200/50 transition-all">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="bg-gray-100 text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded w-max mb-3 inline-block">
                {event.category}
              </span>
              <h3 className="text-xl font-black leading-snug mb-3 group-hover:text-[#2b5cda] transition-colors">
                {event.title}
              </h3>
              <div className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
                {event.date} — {event.time}
              </div>
            </div>
          ))}
        </section>
      </main>

      
    </div>
  );
};

export default NewEventPage;
