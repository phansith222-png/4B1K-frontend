import React from 'react';
import { motion } from 'framer-motion';

export default function HeroSection({ artist, events }) {
    return (
        <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center py-20 px-6 z-10 border-b border-gray-900">
            <div className="relative w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full md:w-3/4 h-[400px] md:h-[600px]"
                >
                    {/* Frame ตกแต่งแบบ Pulse */}
                    <motion.div 
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -top-6 -left-6 w-32 h-32 border-t-4 border-l-4 border-[#2B5AE8] rounded-tl-3xl"
                    />
                    <motion.div 
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                        className="absolute -bottom-6 -right-6 w-32 h-32 border-b-4 border-r-4 border-[#CEFF67] rounded-br-3xl"
                    />

                    {/* รูปศิลปิน */}
                    <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-[#111]">
                        <img
                            src={artist.profileImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2000&auto=format&fit=crop"}
                            alt={artist.artistName}
                            className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#2B5AE8]/10 to-transparent opacity-90"></div>

                        <div className="absolute bottom-10 left-10 md:left-14 z-20">
                            <span className="bg-[#CEFF67]/20 text-[#CEFF67] border border-[#CEFF67]/30 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest mb-3 inline-block">
                                Featured Artist
                            </span>
                            <motion.h1 
                                whileHover={{ skewX: -5 }}
                                className="text-5xl md:text-8xl lg:text-9xl font-black italic tracking-tighter text-white drop-shadow-[0_10px_20px_rgba(43,90,232,0.8)] cursor-default uppercase line-clamp-2"
                            >
                                {artist.artistName}
                            </motion.h1>
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="relative z-20 mt-16 flex flex-col md:flex-row items-center gap-8 w-full max-w-6xl bg-gray-900/30 backdrop-blur-xl p-8 rounded-[2rem] border border-gray-800"
            >
                <div className="flex-1">
                    <h2 className="text-3xl font-black tracking-widest uppercase text-[#2B5AE8]">{artist.agency?.name || 'Exclusive Artist'}</h2>
                    <div className="flex items-center gap-4 mt-3">
                        {events.length > 0 ? (
                            <>
                                <span className="text-[#CEFF67] font-black text-xl">
                                    {new Date(events[0].event?.startTime || events[0].startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                                </span>
                                <span className="w-px h-6 bg-gray-600"></span>
                                <span className="text-gray-300 font-medium">
                                    {events[0].event?.eventName || events[0].eventName}
                                </span>
                            </>
                        ) : (
                            <span className="text-gray-500 font-medium uppercase">No upcoming tours available</span>
                        )}
                    </div>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: '#2B5AE8', color: '#FFFFFF', borderColor: '#2B5AE8' }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#CEFF67] text-black px-12 py-4 rounded-full font-black tracking-widest uppercase text-lg shadow-[0_10px_30px_rgba(206,255,103,0.2)] border border-[#CEFF67] transition-colors"
                >
                    Get Tickets
                </motion.button>
            </motion.div>
        </section>
    );
}