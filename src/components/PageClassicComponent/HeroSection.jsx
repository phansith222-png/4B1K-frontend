import React from 'react';
import { motion } from 'framer-motion';

export default function HeroSection({ artist, events }) {
    return (
        <section className="relative w-full min-h-screen flex flex-col justify-center items-center py-20 px-6 z-10 overflow-hidden">
            <div className="relative w-full max-w-7xl mx-auto flex flex-col items-start gap-12">
                
                <div className="relative w-full flex flex-col md:flex-row items-center gap-16">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="w-full md:w-1/2"
                    >
                        <span className="text-[#D4AF37] font-sub tracking-[0.5em] text-sm md:text-lg mb-6 block uppercase drop-shadow-md">
                            {artist.agency?.name || "The Voice of an Era"}
                        </span>
                        <h1 className="text-5xl md:text-[6.5rem] lg:text-[8rem] font-classic font-black leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 uppercase break-words drop-shadow-xl">
                            {artist.artistName}
                        </h1>
                    </motion.div>

                    <div className="w-full md:w-1/2 relative flex justify-center md:justify-end">
                        <div className="relative w-[70%] aspect-[3/4] border border-[#D4AF37]/30 rounded-2xl translate-x-8 translate-y-8 opacity-40 shadow-[0_0_40px_rgba(212,175,55,0.15)]" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="absolute top-0 right-0 w-[90%] aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] group border border-white/5"
                        >
                            <img
                                src={artist.profileImage || "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2000&auto=format&fit=crop"}
                                alt={artist.artistName}
                                className="w-full h-full object-cover grayscale-[15%] sepia-[15%] brightness-90 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-[7s] ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-80" />
                        </motion.div>
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="w-full max-w-5xl mt-24 flex flex-col md:flex-row items-center justify-between border border-[#D4AF37]/10 py-10 px-10 bg-[#1e293b]/30 backdrop-blur-xl rounded-3xl shadow-2xl"
                >
                    <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
                        <h2 className="font-sub tracking-[0.4em] text-[#D4AF37] text-sm md:text-base uppercase font-bold">Upcoming Tour</h2>
                        {events.length > 0 ? (
                            <p className="font-classic italic text-2xl md:text-3xl text-gray-200 mt-3">
                                {events[0].event?.eventName || events[0].eventName} — <span className="text-white/80">{new Date(events[0].event?.startTime || events[0].startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </p>
                        ) : (
                            <p className="font-classic italic text-xl text-gray-500 mt-3 tracking-wider">More dates to be announced</p>
                        )}
                    </div>
                    <motion.button 
                        whileHover={{ backgroundColor: "#D4AF37", color: "#0F172A", scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="border border-[#D4AF37] text-[#D4AF37] bg-transparent px-12 py-4 rounded-full font-classic tracking-widest text-sm uppercase transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                    >
                        Reserve Tickets
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}