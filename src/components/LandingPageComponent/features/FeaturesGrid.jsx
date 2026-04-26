import React from 'react';
import { motion } from 'framer-motion';
import { Mic2, Ticket, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
    {
        icon: <Mic2 className="text-[#00E5FF]" size={36} />,
        title: "1. Discover Artists",
        desc: "Explore top charting artists, stream their latest hits, and read exclusive biographies.",
        linkTo: "/artists",
        linkColor: "hover:bg-[#00E5FF]/10 hover:border-[#00E5FF]/30",
        btnColor: "group-hover:text-[#00E5FF]"
    },
    {
        icon: <Ticket className="text-[#FF007F]" size={36} />,
        title: "2. Join Concerts",
        desc: "Never miss a live show. Check upcoming schedules, venues, and secure your tickets.",
        linkTo: "/new-event",
        linkColor: "hover:bg-[#FF007F]/10 hover:border-[#FF007F]/30",
        btnColor: "group-hover:text-[#FF007F]"
    },
    {
        icon: <Users className="text-[#CEFF67]" size={36} />,
        title: "3. Join Community",
        desc: "Create an account to connect with fans, review concerts, and share your experiences.",
        linkTo: "/register",
        linkColor: "hover:bg-[#CEFF67]/10 hover:border-[#CEFF67]/30",
        btnColor: "group-hover:text-[#CEFF67]"
    }
];

export default function FeaturesGrid() {
    return (
        <div className="w-full">
            <div className="text-center mb-16 px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-[clamp(2rem,4vw,3rem)] font-black tracking-tight text-white mb-4"
                >
                    How 4B1K Works
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-400 max-w-2xl mx-auto font-medium text-[clamp(1rem,1.5vw,1.1rem)]"
                >
                    Three simple steps to get closer to your favorite artists and live experiences. Click any card to start exploring!
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-6">
                {features.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: idx * 0.15 }}
                        className="h-full"
                    >
                        <Link
                            to={item.linkTo}
                            className={`p-8 md:p-10 rounded-[2rem] bg-[#12141A]/80 backdrop-blur-xl border border-white/5 transition-all duration-500 group flex flex-col items-start shadow-lg hover:shadow-2xl hover:-translate-y-2 h-full cursor-pointer block ${item.linkColor}`}
                        >
                            <div className="mb-6 p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                {item.icon}
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3 text-white tracking-wide">{item.title}</h3>
                            <p className="text-gray-400 leading-relaxed text-sm md:text-base font-medium mb-8 flex-grow">{item.desc}</p>

                            <div className={`mt-auto flex items-center gap-2 text-sm font-black tracking-widest uppercase text-gray-500 transition-colors ${item.btnColor}`}>
                                Explore Now
                                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
