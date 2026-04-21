import React from 'react';
import { motion } from 'framer-motion';
import { Users, Ticket, MessageSquare } from 'lucide-react';

export default function FeatureSection() {
  const features = [
    { icon: <Users className="text-[#00E5FF]" size={36} />, title: "SQUAD FINDER", desc: "Match with friends based on your favorite artists and seating zones." },
    { icon: <Ticket className="text-[#c6ff00]" size={36} />, title: "WAR ROOM", desc: "Simulate ticket purchasing with the most accurate strategies and instant alerts." },
    { icon: <MessageSquare className="text-[#d000ff]" size={36} />, title: "AFTER PARTY", desc: "Share photos, videos, and post-show reviews with people who share your vibe." }
  ];

  return (
    <section className="relative z-20 py-32 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((item, idx) => (
          <motion.div 
            key={idx}
            // 📌 เอฟเฟกต์พลิก 3 มิติ ขึ้นมาจากด้านล่าง
            initial={{ opacity: 0, y: 80, rotateX: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: idx * 0.15 }}
            className="p-10 rounded-[2.5rem] bg-[#12141A]/60 border border-white/5 backdrop-blur-xl hover:bg-[#1A1C23] hover:border-white/10 transition-all duration-500 group shadow-lg hover:shadow-2xl"
          >
            <div className="mb-8 p-4 bg-white/5 w-fit rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
              {item.icon}
            </div>
            <h3 className="text-xl font-black mb-4 tracking-widest text-white">{item.title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base font-medium">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}