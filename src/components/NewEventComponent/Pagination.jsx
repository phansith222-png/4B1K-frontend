import React from 'react';
import Reveal from '../Reveal';

export default function Pagination({ totalPages, currentPage, paginate }) {
    if (totalPages <= 1) return null;

    return (
        <Reveal effect="fade-up">
            <div className="flex justify-center items-center gap-3 mt-16 pb-12">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${currentPage === 1 ? 'border-white/5 text-gray-700 cursor-not-allowed bg-transparent' : 'border-white/10 text-white hover:border-[#00E5FF] hover:text-[#00E5FF] hover:bg-[#00E5FF]/10 hover:shadow-[0_0_25px_rgba(0,229,255,0.3)] bg-[#1A1C23]/80 backdrop-blur-xl hover:-translate-y-1'}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                </button>

                <div className="flex gap-2.5">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={`w-12 h-12 rounded-full text-xs font-black transition-all duration-300 flex items-center justify-center ${currentPage === i + 1 ? 'bg-gradient-to-br from-[#00E5FF] to-[#7000FF] text-white shadow-[0_10px_25px_rgba(112,0,255,0.4)] scale-110 border border-white/20 z-10' : 'bg-[#1A1C23]/80 backdrop-blur-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)]'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${currentPage === totalPages ? 'border-white/5 text-gray-700 cursor-not-allowed bg-transparent' : 'border-white/10 text-white hover:border-[#00E5FF] hover:text-[#00E5FF] hover:bg-[#00E5FF]/10 hover:shadow-[0_0_25px_rgba(0,229,255,0.3)] bg-[#1A1C23]/80 backdrop-blur-xl hover:-translate-y-1'}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </Reveal>
    );
}
