import React from 'react';

export default function LineupSection({ artist }) {
    return (
        <section className="relative w-full py-24 px-6 bg-gradient-to-b from-[#0a0a0a] via-[#110505] to-[#0a0a0a] overflow-hidden border-y border-white/5 noise-bg">
            <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col gap-4">
                <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 tracking-tighter hover:from-[#D3131F] hover:to-red-900 transition-all duration-500 cursor-default uppercase">
                    {artist.artistName}
                </h2>
                <h2 className="text-4xl md:text-6xl font-black text-gray-500 tracking-tighter hover:text-white transition-all duration-300 cursor-default uppercase">
                    {artist.agency?.name || 'ROCK ICON'}
                </h2>
                <h2 className="text-4xl md:text-6xl font-black text-gray-600 tracking-tighter hover:text-[#D3131F] transition-all duration-300 cursor-default uppercase">
                    ROCK MUSIC
                </h2>
                
                <div className="mt-12 pt-12 border-t border-white/5 max-w-3xl mx-auto">
                    <p className="text-sm md:text-base font-medium text-gray-400 tracking-widest leading-loose uppercase">
                        {artist.biography || "Biography not available at the moment. Keep streaming and supporting the artist!"}
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-4">
                        <div className="w-12 h-[2px] bg-[#D3131F]"></div>
                        <p className="text-lg md:text-xl font-black text-white tracking-[0.2em] uppercase">
                            {artist.agency?.name || 'ROCK'} RECORDS
                        </p>
                        <div className="w-12 h-[2px] bg-[#D3131F]"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}