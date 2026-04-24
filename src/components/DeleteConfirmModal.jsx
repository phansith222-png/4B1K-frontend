import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Loader2 } from 'lucide-react';

function DeleteConfirmModal({ onConfirm, onCancel, isDeleting }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-10 bg-[#1c1c1c] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl"
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl mx-auto mb-4">
          <Trash2 size={22} className="text-red-400" />
        </div>

        <h2 className="text-white font-bold text-center text-lg">Delete Comment?</h2>
        <p className="text-gray-400 text-sm text-center mt-1 mb-6">
          Are you sure you want to delete this comment?<br />
          <span className="text-gray-500 text-xs">This action cannot be undone.</span>
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-full border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default DeleteConfirmModal;
