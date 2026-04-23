import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '../Reveal';

export default function HeroSection({ artist, events }) {
    const navigate = useNavigate();
    return (
        <section className="relative w-full min-h-screen flex flex-col justify-center items-center py-20 px-6 z-10 overflow-hidden">
            <div className="relative w-full max-w-7xl mx-auto flex flex-col items-start gap-12">

                <div className="relative w-full flex flex-col md:flex-row items-center gap-16">
                    <div className="w-full md:w-1/2">
                        <Reveal delay={0.1}>
                            <span className="text-[#d83bb6] font-sub tracking-[0.4em] text-sm md:text-lg mb-6 block uppercase drop-shadow-[0_0_10px_rgba(216,59,182,0.5)]">
                                {artist.agency?.name || "The Soul Frequency"}
                            </span>
                        </Reveal>
                        <Reveal delay={0.3}>
                            <h1 className="text-5xl md:text-[6.5rem] lg:text-[8rem] font-classic font-black leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-[#f9c1db] to-[#b266c5] uppercase break-words drop-shadow-[0_10px_30px_rgba(155,45,150,0.4)]">
                                {artist.artistName}
                            </h1>
                        </Reveal>
                    </div>

                    <div className="w-full md:w-1/2 relative flex justify-center md:justify-end">
                        <div className="relative w-[70%] aspect-[3/4] border-2 border-[#9b2d96]/40 rounded-2xl translate-x-8 translate-y-8 opacity-60 shadow-[0_0_50px_rgba(178,102,197,0.3)]" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="absolute top-0 right-0 w-[90%] aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(48,41,78,0.9)] group border border-[#b266c5]/20"
                        >
                            <img
                                src={artist.profileImage || "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2000&auto=format&fit=crop"}
                                alt={artist.artistName}
                                className="w-full h-full object-cover grayscale-[20%] brightness-95 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-[7s] ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1c172e] via-transparent to-transparent opacity-90" />
                        </motion.div>
                    </div>
                </div>

                <Reveal delay={0.5} effect="fade-up">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="w-full max-w-5xl mt-24 flex flex-col md:flex-row items-center justify-between border border-[#b266c5]/20 py-10 px-10 bg-[#30294e]/40 backdrop-blur-2xl rounded-3xl shadow-[0_20px_40px_rgba(48,41,78,0.6)]"
                    >
                        <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
                            <h2 className="font-sub tracking-[0.3em] text-[#f9c1db] text-sm md:text-base uppercase font-bold">Upcoming Tour</h2>
                            {events.length > 0 ? (
                                <p className="font-classic text-2xl md:text-3xl text-white mt-3 font-bold">
                                    {events[0].event?.eventName || events[0].eventName} — <span className="text-[#b266c5]">{new Date(events[0].event?.startTime || events[0].startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                </p>
                            ) : (
                                <p className="font-classic text-xl text-[#f9c1db]/50 mt-3 tracking-wider">More dates to be announced</p>
                            )}
                        </div>
                        <motion.button
                            onClick={() => navigate('/new-event')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="ml-50 bg-gradient-to-r from-[#d83bb6] to-[#9b2d96] text-white px-12 py-4 rounded-full font-black tracking-widest uppercase text-sm md:text-base shadow-[0_10px_30px_rgba(216,59,182,0.4)] border border-[#f9c1db]/30 hover:border-white transition-all whitespace-nowrap"
                        >
                            Join Event
                        </motion.button>
                    </motion.div>
                </Reveal>
            </div>
        </section>
    );
}