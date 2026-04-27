import React from 'react';

export default function PageLoader({ bg = "#0B0C10", color = "#00E5FF", text = "" }) {
    return (
        <div 
            className="min-h-screen flex flex-col items-center justify-center transition-opacity duration-300" 
            style={{ backgroundColor: bg }}
        >
            <div 
                className="w-12 h-12 border-4 border-white/10 rounded-full animate-spin"
                style={{ borderTopColor: color }}
            />
            {text && (
                <p className="mt-4 text-white/50 text-sm font-medium tracking-widest uppercase">
                    {text}
                </p>
            )}
        </div>
    );
}
