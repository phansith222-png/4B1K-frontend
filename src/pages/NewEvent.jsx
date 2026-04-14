import React, { useState } from "react";
import Navbar from "../components/Navbar";

const NewEventPage = () => {
  // State สำหรับเก็บหมวดหมู่ที่ถูกเลือก (ค่าเริ่มต้นคือ "All")
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Concert",
    "Fan Meeting",
    "Festival",
    "Workshop", // เพิ่ม Workshop เพื่อให้ตรงกับข้อมูลที่มี
  ];

  // ข้อมูลข่าวสาร/กิจกรรมทั้งหมด (รวมไว้ที่เดียวเพื่อให้ Filter ง่ายขึ้น)
  const allEvents = [
    {
      id: 1,
      category: "Concert",
      title: "The 2026 World Tour: Beyond the Rhythm",
      description: "สัมผัสประสบการณ์ดนตรีรูปแบบใหม่ที่ผสมผสานเทคโนโลยี AI และการแสดงสดสุดตระการตา พบกับศิลปินระดับโลกที่จะมาสร้างความประทับใจในซัมเมอร์นี้",
      date: "APRIL 20, 2026",
      readTime: "LIVE AT IMPACT ARENA",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop",
      isFeatured: true,
      author: {
        name: "4B1K Official",
        role: "Event Organizer",
        avatar: "https://ui-avatars.com/api/?name=4B&background=00E5FF&color=0B0C10",
      },
    },
    {
      id: 2,
      category: "Fan Meeting",
      title: "Exclusive Night with Your Favorite Star",
      description: "ร่วมสนุกและใกล้ชิดกับดาราคนโปรดของคุณในค่ำคืนสุดพิเศษที่ถูกจัดเตรียมมาเพื่อแฟนคลับตัวจริงเท่านั้น",
      date: "MAY 12, 2025",
      readTime: "2 MIN READ",
      image: "https://images.unsplash.com/photo-1514525253344-f81f50592667?q=80&w=500&auto=format&fit=crop",
      isFeatured: false,
    },
    {
      id: 3,
      category: "Festival",
      title: "Neon Summer Festival: Bangkok Edition",
      description: "ปาร์ตี้แสงสีเสียงระดับประเทศ สนุกไปกับเพลง EDM และโชว์สุดอลังการใจกลางกรุงเทพมหานคร",
      date: "JUNE 05, 2025",
      readTime: "4 MIN READ",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=500&auto=format&fit=crop",
      isFeatured: false,
    },
    {
      id: 4,
      category: "Workshop",
      title: "Music Production 101 for Beginners",
      description: "เริ่มต้นเส้นทางการเป็นโปรดิวเซอร์เพลงกับผู้เชี่ยวชาญในวงการดนตรี เรียนรู้พื้นฐานการทำเพลงแบบเจาะลึก",
      date: "JUNE 18, 2025",
      readTime: "5 MIN READ",
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=500&auto=format&fit=crop",
      isFeatured: false,
    },
  ];

  // Logic การ Filter ข้อมูลตาม activeCategory
  const filteredEvents = activeCategory === "All" 
    ? allEvents 
    : allEvents.filter(event => event.category === activeCategory);

  // แยก Featured Event และ Other Events ออกจากผลลัพธ์ที่ Filter แล้ว
  // ถ้าไม่มี event ตัวไหนเป็น isFeatured ในหมวดนั้นๆ ให้เอาตัวแรกสุดขึ้นมาเป็น Featured แทน
  let featuredEvent = filteredEvents.find(e => e.isFeatured);
  let otherEvents = filteredEvents.filter(e => !e.isFeatured);

  if (!featuredEvent && filteredEvents.length > 0) {
    featuredEvent = filteredEvents[0];
    otherEvents = filteredEvents.slice(1);
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] font-sans text-white relative selection:bg-[#00E5FF] selection:text-black">
      
      {/* Background Noise */}
      <style>{`
        .dark-grain {
            position: fixed; inset: 0; opacity: 0.03; pointer-events: none; z-index: 100;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
      `}</style>
      <div className="dark-grain" />

      {/* Ambient Lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-[10%] w-[500px] h-[500px] bg-[#00E5FF] opacity-[0.03] blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] bg-[#FF00FF] opacity-[0.03] blur-[100px] rounded-full" />
      </div>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-12 relative z-10">
        {/* Header Section */}
        <section className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-white uppercase">
            News & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7000FF]">Events</span>
          </h1>
          <p className="text-gray-400 max-w-2xl text-lg md:text-xl font-medium leading-relaxed tracking-wide">
            ติดตามทุกความเคลื่อนไหว อัปเดตตารางคอนเสิร์ต และกิจกรรมพิเศษจาก 4B1K
            ที่จะพาคุณไปใกล้ชิดกับศิลปินที่คุณรักมากขึ้น
          </p>
        </section>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12 border-b border-white/10 pb-6">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                    : "bg-[#1A1C23] text-gray-400 hover:bg-[#252830] hover:text-[#00E5FF] border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button className="p-2 text-gray-500 hover:text-[#FF00FF] transition-colors bg-[#1A1C23] rounded-full border border-white/5">
            <svg
              className="w-5 h-5"
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

        {/* ตรวจสอบว่ามีข้อมูลในหมวดที่เลือกหรือไม่ */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-bold text-xl uppercase tracking-widest">
            No events found in this category.
          </div>
        ) : (
          <>
            {/* Featured Event Section (แสดง 1 ตัวใหญ่สุด) */}
            {featuredEvent && (
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-center">
                <div className="lg:col-span-7">
                  <div className="rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group cursor-pointer relative">
                    <img
                      src={featuredEvent.image}
                      alt="Featured"
                      className="w-full h-[400px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-black/20 to-transparent opacity-90" />
                  </div>
                </div>
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <span className="bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full w-max mb-6">
                    {featuredEvent.category}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-6 hover:text-[#00E5FF] cursor-pointer transition-colors">
                    {featuredEvent.title}
                  </h2>
                  <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed font-medium">
                    {featuredEvent.description}
                  </p>
                  <div className="text-[11px] font-black text-[#7000FF] mb-10 tracking-[0.2em] uppercase">
                    {featuredEvent.date} <span className="text-gray-600 mx-2">|</span> {featuredEvent.readTime}
                  </div>

                  {featuredEvent.author && (
                    <div className="flex items-center gap-4 bg-[#1A1C23] p-3 pl-4 rounded-full border border-white/5 w-fit">
                      <img
                        src={featuredEvent.author.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full border-2 border-[#00E5FF]"
                      />
                      <div className="pr-4">
                        <p className="text-sm font-black text-white leading-tight">
                          {featuredEvent.author.name}
                        </p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          {featuredEvent.author.role}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Other Events Section (Grid ข่าวรอง) */}
            {otherEvents.length > 0 && (
              <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {otherEvents.map((event, index) => (
                  <div key={index} className="group cursor-pointer flex flex-col">
                    <div className="rounded-[1.5rem] overflow-hidden mb-6 aspect-video shadow-2xl border border-white/5 relative">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-70 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] to-transparent opacity-80" />
                    </div>
                    <span className="text-[#FF00FF] text-[10px] font-black uppercase tracking-[0.2em] mb-3 block">
                      {event.category}
                    </span>
                    <h3 className="text-2xl font-black leading-snug tracking-tight mb-4 group-hover:text-[#00E5FF] transition-colors text-gray-100">
                      {event.title}
                    </h3>
                    <div className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase mt-auto">
                      {event.date} <span className="mx-2">—</span> {event.readTime || event.time}
                    </div>
                  </div>
                ))}
              </section>
            )}
          </>
        )}

      </main>
    </div>
  );
};

export default NewEventPage;