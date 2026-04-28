import React from 'react';
import Reveal from '../Reveal';

export default function HeroSection() {
    return (
        <Reveal effect="fade-up">
            <section className="text-center md:text-left mt-4 px-2">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-3xl">
                        <span className="text-[#00E5FF] font-black text-[10px] md:text-xs uppercase tracking-[0.5em] mb-4 block">Event Portal</span>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-white uppercase leading-none">
                            Concert <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#7000FF] to-[#FF007F]">Events</span>
                        </h1>
                        <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed tracking-wide border-l-[2px] border-[#7000FF] pl-5 py-1">
                            Discover live performances and exclusive fan meetings. <br className="hidden lg:block"/> Secure your tickets and join the heartbeat of the music scene.
                        </p>
                    </div>
                    

                </div>
            </section>
        </Reveal>
    );
}
