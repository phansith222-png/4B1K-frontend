import { motion } from 'framer-motion';

export default function ErrorPage({ error, resetErrorBoundary }) {
    return (
        <div className="min-h-screen bg-[#0B0C10] flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#d83bb6] opacity-10 blur-[120px] rounded-full" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 text-center"
            >
                <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#d83bb6] to-[#4b1k-blue] mb-4">
                    404
                </h1>
                <h2 className="text-2xl font-bold uppercase tracking-[0.2em] mb-6">System Glitch</h2>
                <p className="text-white/50 max-w-sm mx-auto mb-8 font-light">
                    Something went wrong on our end.
                </p>
                
                <button 
                    onClick={resetErrorBoundary}
                    className="px-8 py-3 bg-transparent border border-[#d83bb6] text-[#d83bb6] font-bold rounded-full hover:bg-[#d83bb6] hover:text-white transition-all duration-300 uppercase text-xs tracking-widest"
                >
                    Back
                </button>
            </motion.div>
        </div>
    );
}