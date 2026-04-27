import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Heart } from 'lucide-react';

export default function DeleteConfirmModal({ onConfirm, onCancel }) {
  // ── Scroll Lock ──
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Background Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-[#1a1a1a] border border-white/10 p-8 rounded-[32px] max-w-sm w-full shadow-2xl text-center z-10"
      >
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart size={32} className="text-red-500 fill-red-500" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">
          Delete Vibe?
        </h3>
        <p className="text-gray-400 mb-8 font-light text-sm">
          Are you sure you want to permanently delete this post? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-2xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/5"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
