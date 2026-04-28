import { motion, AnimatePresence } from "framer-motion";

export default function CreateRoomModal({ isOpen, onClose, newRoomName, setNewRoomName, onSubmit, isCreating }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm relative group"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-[20px] blur opacity-40 group-hover:opacity-70 transition duration-1000" />

            <div className="relative bg-[#13141a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-7 shadow-2xl">
              <div className="mb-8 text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30 transform rotate-3">
                  <span className="text-3xl filter drop-shadow-md -rotate-3">🚀</span>
                </div>
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight mb-2">
                  Create Community
                </h3>
                <p className="text-[13px] text-gray-400 font-medium">Start a new space for conversations and connections.</p>
              </div>

              <form onSubmit={onSubmit}>
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">ชื่อห้อง</label>
                  <input
                    autoFocus
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="เช่น คนรักเสียงเพลง, กิจกรรมวันหยุด..."
                    className="w-full bg-[#2a2d35] border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newRoomName.trim() || isCreating}
                    className="flex-1 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-purple-600/25 disabled:opacity-50 disabled:shadow-none transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {isCreating ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
