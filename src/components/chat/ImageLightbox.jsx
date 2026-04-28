import { motion, AnimatePresence } from "framer-motion";

export default function ImageLightbox({ src, onClose }) {
  return (
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt="Fullscreen Preview"
              className="max-w-full max-h-[90dvh] rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10"
            />
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-white/60 hover:text-white flex items-center gap-2 group transition-colors"
            >
              <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Close Terminal</span>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
