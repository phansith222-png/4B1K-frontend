export default function SectionErrorFallback({ error, resetErrorBoundary }) {
    return (
        <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10 m-6">
            <p className="text-[#d83bb6] font-bold uppercase tracking-widest text-sm mb-2">Oops!</p>
            <p className="text-white/60 text-xs mb-4">Could not load this section.</p>
            <button onClick={resetErrorBoundary} className="text-[10px] text-white underline opacity-50 hover:opacity-100">
                Try Again
            </button>
        </div>
    );
}