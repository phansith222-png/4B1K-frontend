import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../stores/userStore';

export default function FloatingChat() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const isAuthenticated = useUserStore(s => s.isAuthenticated);

    if (!isAuthenticated) return null;

    return (
        <div className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[110]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="absolute bottom-20 right-0 w-[320px] md:w-[380px] h-[500px] bg-[#1a1d24] border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="bg-[#00E5FF] p-5 flex items-center justify-between text-black">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center font-black text-white">4</div>
                                <div>
                                    <h3 className="font-black leading-none">4B1K Support</h3>
                                    <span className="text-[10px] font-bold opacity-70">Always active</span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-1 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area (Mock) */}
                        <div className="flex-grow p-6 flex flex-col gap-4 overflow-y-auto">
                            <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none self-start max-w-[80%] text-sm text-gray-300">
                                Hi there! How can we help you today?
                            </div>
                            <div className="bg-[#00E5FF] p-3 rounded-2xl rounded-tr-none self-end max-w-[80%] text-sm text-black font-medium">
                                I'm looking for tickets to the next EDM event!
                            </div>
                        </div>

                        {/* Footer / Input */}
                        <div className="p-4 bg-black/20 border-t border-white/5 flex items-center gap-3">
                            <input 
                                type="text" 
                                placeholder="Type a message..."
                                className="flex-grow bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#00E5FF] transition-all"
                            />
                            <button className="bg-[#00E5FF] text-black p-2 rounded-full hover:scale-110 transition-transform">
                                <Send size={18} />
                            </button>
                        </div>
                        
                        <div className="p-2 text-center">
                            <button 
                                onClick={() => { navigate('/chat'); setIsOpen(false); }}
                                className="text-[10px] font-black text-gray-500 hover:text-[#00E5FF] transition-colors"
                            >
                                GO TO FULL MESSENGER
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Bubble */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
                    isOpen ? 'bg-red-500 rotate-90' : 'bg-[#00E5FF] hover:bg-[#00E5FF]/80'
                }`}
            >
                {isOpen ? (
                    <X size={30} className="text-white" />
                ) : (
                    <MessageCircle size={30} className="text-black" />
                )}
                
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-[#111418] flex items-center justify-center text-[10px] font-bold text-white">
                        1
                    </span>
                )}
            </motion.button>
        </div>
    );
}
