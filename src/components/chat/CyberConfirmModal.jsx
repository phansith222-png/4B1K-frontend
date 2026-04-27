import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";

export default function CyberConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?", 
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) {
  const accentColor = type === "danger" ? "#FF0055" : type === "warning" ? "#FFB800" : "#00E5FF";
  const glowColor = type === "danger" ? "rgba(255,0,85,0.3)" : type === "warning" ? "rgba(255,184,0,0.3)" : "rgba(0,229,255,0.3)";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-[#0B0C10] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
          >
            {/* Top Accent Bar */}
            <div 
              className="h-1.5 w-full" 
              style={{ backgroundColor: accentColor, boxShadow: `0 0 20px ${glowColor}` }} 
            />

            <div className="p-8">
              {/* Icon & Title */}
              <div className="flex flex-col items-center text-center mb-6">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 relative"
                  style={{ backgroundColor: `${accentColor}10`, border: `1px solid ${accentColor}30` }}
                >
                  <div className="absolute inset-0 blur-xl opacity-20" style={{ backgroundColor: accentColor }} />
                  {type === "danger" ? (
                    <Trash2 size={32} style={{ color: accentColor }} />
                  ) : (
                    <AlertTriangle size={32} style={{ color: accentColor }} />
                  )}
                </div>
                
                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">
                  {title}
                </h3>
                <p className="text-gray-400 text-sm font-bold leading-relaxed uppercase tracking-wider opacity-80">
                  {message}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all"
                  style={{ 
                    backgroundColor: accentColor, 
                    color: "#fff",
                    boxShadow: `0 10px 30px ${glowColor}`
                  }}
                >
                  {confirmText}
                </motion.button>
                
                <motion.button
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-gray-300 transition-all border border-transparent hover:border-white/5"
                >
                  {cancelText}
                </motion.button>
              </div>
            </div>

            {/* Decorative Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[-1] bg-grid-white/[0.2] bg-[size:20px_20px]" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
