import React from "react";

const NewEventPage = () => {
  const eventData = {
    title: "SUMMER SONIC BANGKOK 2024",
    description:
      "เตรียมพบกับเทศกาลดนตรีระดับโลกที่ส่งตรงจากญี่ปุ่นสู่กรุงเทพฯ ครั้งแรก! รวบรวมศิลปินแนวหน้าทั้งไทยและสากล พร้อมโปรดักชั่นสุดอลังการที่จะทำให้ซัมเมอร์นี้ร้อนแรงกว่าที่เคย",
    date: "24 - 25 สิงหาคม 2567",
    location: "อิมแพ็ค ชาเลนเจอร์ ฮอลล์ 1-3",
    image:
      "https://media.thaiticketmajor.com/concerts-banner-500/summer-sonic-66.jpg",
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-3xl font-black tracking-tighter text-slate-800">
              4<span className="text-[#BEF264]">B</span>1K
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-sm font-semibold text-slate-600 hover:text-[#BEF264] transition-colors"
            >
              Concert Event
            </a>
            <a
              href="#"
              className="text-sm font-semibold text-slate-600 hover:text-[#BEF264] transition-colors"
            >
              Artist Biology
            </a>
            <a
              href="#"
              className="text-sm font-semibold text-slate-600 hover:text-[#BEF264] transition-colors"
            >
              Community
            </a>
            <a
              href="#"
              className="text-sm font-semibold text-slate-600 hover:text-[#BEF264] transition-colors"
            >
              News
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-full">🔍</button>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-[#BEF264] overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=User" alt="profile" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto pt-12 pb-24 px-6">
        {/* Back Button */}
        <button className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-all">
          <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center">
            ←
          </div>
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        {/* Event Card Container */}
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
          {/* Hero Image Section */}
          <div className="relative h-[450px] w-full">
            <img
              src={eventData.image}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-10">
                <span className="bg-[#BEF264] text-slate-900 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                  Upcoming Event
                </span>
                <h1 className="text-5xl font-black text-white mt-4 tracking-tight">
                  {eventData.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Left: Main Info */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="text-[#BEF264] font-bold text-sm uppercase tracking-[0.2em] mb-4">
                  About the Event
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {eventData.description}
                </p>
              </div>

              <div className="pt-8 border-t border-slate-50">
                <h3 className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em] mb-6">
                  Lineup Highlights
                </h3>
                <div className="flex flex-wrap gap-3">
                  {["Artist A", "Artist B", "Artist C", "Artist D"].map(
                    (artist) => (
                      <span
                        key={artist}
                        className="px-6 py-2 bg-slate-50 border border-slate-100 rounded-full text-sm font-medium hover:border-[#BEF264] transition-colors cursor-default"
                      >
                        {artist}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Right: Meta Info */}
            <div className="bg-slate-50/50 p-8 rounded-[32px] space-y-8">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Date & Time
                </p>
                <p className="text-lg font-bold text-slate-800">
                  {eventData.date}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Location
                </p>
                <p className="text-lg font-bold text-slate-800">
                  {eventData.location}
                </p>
                <p className="text-sm text-slate-500 underline cursor-pointer hover:text-[#BEF264]">
                  Open in Google Maps
                </p>
              </div>

              <div className="pt-4">
                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm">
          © 2026 4B1K Concert Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default NewEventPage;
