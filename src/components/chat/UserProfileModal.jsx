import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserProfileModal({ isOpen, onClose, user, onChat }) {
  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-[#111318] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Header / Background Glow */}
            <div className="h-32 bg-gradient-to-br from-[#7000FF]/20 to-[#00E5FF]/20 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(112,0,255,0.3),transparent_70%)]" />
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            {/* Profile Info */}
            <div className="px-8 pb-8 -mt-16 relative flex flex-col items-center">
              {/* Avatar with Ring */}
              <div className="relative group mb-6">
                <div className="absolute -inset-1 bg-gradient-to-br from-[#7000FF] to-[#00E5FF] rounded-[38px] blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
                <img
                  src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=7000FF&color=fff`}
                  alt={user.username}
                  className="relative w-32 h-32 rounded-[32px] object-cover border-4 border-[#111318] shadow-2xl"
                />
              </div>

              {/* Name & Title */}
              <h3 className="text-2xl font-black text-white mb-1 tracking-tight text-center uppercase italic">
                {user.username}
              </h3>
              <p className="text-[#00E5FF] text-[10px] font-black uppercase tracking-[0.3em] mb-8 bg-[#00E5FF]/10 px-4 py-1 rounded-full border border-[#00E5FF]/20 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                Community Member
              </p>

              {/* Action Buttons */}
              <div className="w-full grid grid-cols-2 gap-4">
                <button
                  onClick={onClose}
                  className="py-4 rounded-2xl bg-white/5 border border-white/5 text-gray-400 font-bold text-sm hover:bg-white/10 transition-all uppercase tracking-widest"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onChat(user.id);
                    onClose();
                  }}
                  className="relative group py-4 rounded-2xl overflow-hidden shadow-lg shadow-[#7000FF]/20"
                >
                  <div className="absolute inset-0 bg-[#7000FF] group-hover:bg-[#8220FF] transition-colors" />
                  <div className="relative flex items-center justify-center gap-2 text-white font-black text-sm uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                    Chat
                  </div>
                </button>
              </div>
            </div>
            
            {/* Terminal Decoration */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#7000FF]/50 to-transparent opacity-30" />
            <div className="py-2 px-8 flex justify-between">
                <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-white/10" />)}
                </div>
                <span className="text-[8px] font-mono text-white/10 uppercase tracking-widest">User ID: {user.id?.toString().slice(-8)}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
