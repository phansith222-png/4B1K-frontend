import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';

export default function HeroSection({ floatingNotes, spotlightArtist }) {
    const navigate = useNavigate();
    const scrollToNext = () => {
        const nextSection = document.getElementById('artists-content');
        if (!nextSection) return;

        const targetPosition = nextSection.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1500; // 1.5 seconds for a slower, premium feel
        let start = null;

        const animation = (currentTime) => {
            if (!start) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        // Cubic easing out
        const ease = (t, b, c, d) => {
            t /= d;
            t--;
            return c * (t * t * t + 1) + b;
        };

        requestAnimationFrame(animation);
    };

    return (
        <section className="relative w-full min-h-screen flex items-center justify-center">
            {/* Background Ambient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C10] via-[#0B0C10] to-[#0B0C10] z-0"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#FF00FF] via-[#7000FF] to-[#00E5FF] rounded-full blur-[150px] opacity-15 pointer-events-none"></div>

            <div className="w-full mx-auto px-8 md:px-16 lg:px-24 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0 pt-24 md:pt-0">

                {/* ฝั่งข้อความ */}
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-20 overflow-visible">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[#00E5FF] font-black text-sm uppercase tracking-[0.4em] mb-4 block">Artist Directory</span>
                        <h1 className="text-[clamp(2.8rem,5.5vw,6.5rem)] font-black italic tracking-tight leading-[0.9] text-white drop-shadow-2xl overflow-visible pb-2">
                            DISCOVER <br />
                            <span className="inline-block pr-4 text-transparent bg-clip-text bg-gradient-to-r from-[#FF00FF] to-[#00E5FF]">THE TALENT</span>
                        </h1>
                        <p className="mt-8 text-gray-400 text-sm md:text-base tracking-widest uppercase leading-relaxed max-w-lg border-l-2 border-[#FF00FF] pl-4">
                            Explore over 100+ active artists across all major labels and independent scenes. The heartbeat of the music industry.
                        </p>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={scrollToNext}
                        className="mt-12 flex items-center gap-3 text-[#00E5FF] font-bold uppercase tracking-widest text-xs hover:text-white transition-colors group"
                    >
                        <span className="w-10 h-10 rounded-full border border-[#00E5FF] flex items-center justify-center group-hover:bg-[#00E5FF] transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                            <svg className="w-4 h-4 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                        </span>
                        Scroll to Explore
                    </motion.button>
                </div>

                {/* ฝั่งกราฟิก (แผ่นไวนิลและ Spotlight Artist) */}
                <div className="w-full md:w-[48%] flex justify-center md:justify-end relative h-[450px] md:h-[680px] overflow-visible">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="absolute top-1/2 left-1/2 md:left-1/3 -translate-x-1/2 -translate-y-1/2 z-10"
                    >
                        <div className="w-[300px] h-[300px] md:w-[520px] md:h-[520px] lg:w-[580px] lg:h-[580px] hero-vinyl relative rounded-full flex items-center justify-center">
                            <div className="w-1/3 h-1/3 rounded-full bg-gradient-to-br from-[#FF00FF] to-[#00E5FF] flex items-center justify-center p-2 shadow-inner z-10">
                                <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center border-2 border-white/20">
                                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white shadow-[0_0_15px_white]"></div>
                                </div>
                            </div>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none mix-blend-overlay"></div>
                        </div>
                    </motion.div>

                    {/* Spotlight Card with Animation */}
                    <AnimatePresence mode="wait">
                        {spotlightArtist && (
                            <motion.div
                                key={spotlightArtist.id}
                                initial={{ opacity: 0, x: 50, scale: 0.9, rotate: 5 }}
                                animate={{ opacity: 1, x: 0, scale: 1, rotate: -5 }}
                                exit={{ opacity: 0, x: -50, scale: 0.9, rotate: -10 }}
                                transition={{ duration: 0.8, ease: "anticipate" }}
                                className="absolute top-[50%] right-[18%] md:right-[12%] -translate-y-[10%] z-30 bg-[#12141A]/90 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-[200px] md:w-[230px] group cursor-pointer"
                                onClick={() => {
                                    const genre = spotlightArtist.genres?.[0]?.genre?.name?.toLowerCase() || "";
                                    let path = "/etc";
                                    if (genre.includes("pop")) path = "/pop";
                                    else if (genre.includes("rock")) path = "/rock";
                                    else if (genre.includes("r&b") || genre.includes("classic")) path = "/classic";
                                    navigate(`${path}?artistId=${spotlightArtist.id}`);
                                }}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></div>
                                    <span className="text-[10px] font-black text-[#00E5FF] uppercase tracking-[0.3em]">Spotlight Artist</span>
                                </div>
                                <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-[#0B0C10]">
                                    <img
                                        src={getImageUrl(spotlightArtist.profileImage, "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800")}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt={spotlightArtist.artistName}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] to-transparent opacity-60"></div>
                                </div>
                                <h4 className="text-xl font-black uppercase tracking-tighter text-white mb-1 truncate">{spotlightArtist.artistName}</h4>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">
                                    Trending in {spotlightArtist.genres?.[0]?.genre?.name || "Music Universe"}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Floating music notes */}
                    {floatingNotes.map((note) => (
                        <motion.div
                            key={note.id}
                            className="absolute z-0 font-bold pointer-events-none"
                            style={{
                                fontSize: note.size,
                                left: `50%`,
                                top: `50%`,
                                color: note.color,
                                filter: `blur(${note.blur}px)`,
                                textShadow: `0 0 20px ${note.color}60`,
                                x: (Math.random() - 0.5) * 40, // Small initial random offset
                                y: (Math.random() - 0.5) * 40,
                            }}
                            animate={{
                                y: [0, -150, -450, -700],
                                x: [0, note.left * 0.3 + note.sway, note.left * 0.7 - note.sway, note.left],
                                opacity: [0, 1, 1, 0],
                                rotate: [0, note.sway, -note.sway, note.sway * 2],
                                scale: [0.4, 1.1, 0.9, 0.6]
                            }}
                            transition={{
                                duration: note.duration,
                                delay: note.delay,
                                repeat: Infinity,
                                ease: [0.45, 0.05, 0.55, 0.95] // Custom smooth ease
                            }}
                        >
                            {note.symbol}
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
