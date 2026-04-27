import React from 'react';
import InfoPageLayout from '../components/InfoPageLayout';

export default function PageContact() {
    return (
        <InfoPageLayout 
            title="Contact Us" 
            subtitle="We're here to help you navigate the 4B1K Universe."
            accentColor="#CEFF67"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Get in Touch</h2>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                        Have a question about an upcoming concert, need help with your account, 
                        or want to report an issue in the community? Reach out to our support team.
                    </p>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-300">
                            <svg className="w-5 h-5 text-[#CEFF67]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>support@4b1k.com</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <svg className="w-5 h-5 text-[#CEFF67]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Bangkok, Thailand</span>
                        </div>
                    </div>
                </div>

                <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                    <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Name</label>
                            <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#CEFF67] outline-none transition-colors" placeholder="Your name" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
                            <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#CEFF67] outline-none transition-colors" placeholder="your@email.com" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Message</label>
                            <textarea rows="4" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#CEFF67] outline-none transition-colors resize-none" placeholder="How can we help?"></textarea>
                        </div>
                        <button type="submit" className="bg-[#CEFF67] text-black font-bold py-3 rounded-xl mt-2 hover:bg-white transition-colors">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </InfoPageLayout>
    );
}
