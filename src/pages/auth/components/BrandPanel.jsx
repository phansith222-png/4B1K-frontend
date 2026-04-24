const AVATAR_IDS = [32, 12, 47]

/**
 * Static branding info panel shown on the inactive side.
 *
 * @param {{ side: 'left' | 'right', onSwitch: () => void }} props
 *   side     - which half the panel is on; used for CTA copy.
 *   onSwitch - callback to switch to the other mode.
 */
export function BrandPanel({ side, onSwitch }) {
  const isOnRight = side === 'right'

  return (
    <div className="w-full max-w-[480px]">

      {/* Badge */}
      <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/8 text-[11px] font-bold text-gray-300 mb-6 tracking-widest uppercase shadow-sm">
        🎵 <span className="text-[#00E5FF]">4B1K</span> — Your Concert Hub
      </div>

      {/* Headline */}
      <h2 className="text-4xl xl:text-5xl font-black text-white mb-6 leading-[1.15] tracking-tight">
        Feel Every<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7000FF]">
          Beat Live.
        </span>
      </h2>

      {/* Description */}
      <p className="text-lg text-gray-400 leading-relaxed font-medium max-w-[380px] mb-10">
        The ultimate hub for{' '}
        <span className="text-[#00E5FF] font-bold">concert lovers</span>. Discover
        trending events, grab tickets instantly, and dive into your favourite{' '}
        <span className="text-[#FF00FF] font-bold">artist&apos;s world</span>.
      </p>

      {/* Social proof */}
      <div className="flex items-center gap-4 mb-10">
        <div className="flex -space-x-3">
          {AVATAR_IDS.map((id) => (
            <div
              key={id}
              className="w-11 h-11 rounded-full border-[3px] border-[#0B0C10] bg-[#1A1C23] overflow-hidden"
            >
              <img
                src={`https://i.pravatar.cc/100?img=${id}`}
                alt="fan"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="w-11 h-11 rounded-full border-[3px] border-[#0B0C10] bg-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.4)] flex items-center justify-center text-[#0B0C10] font-black text-[10px]">
            10k+
          </div>
        </div>
        <span className="text-sm font-bold text-gray-300">Fans already joined</span>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10 mb-8" />

      {/* CTA */}
      <p className="text-gray-400 text-sm mb-4 font-medium">
        {isOnRight
          ? "Don't have an account yet? Join the community!"
          : 'Already have an account? Welcome back!'}
      </p>
      <button
        type="button"
        onClick={onSwitch}
        className="px-8 py-3.5 rounded-2xl border-2 border-[#00E5FF]/40 text-[#00E5FF] font-bold text-sm tracking-wide transition-all duration-300 hover:border-[#00E5FF]/80 hover:bg-[#00E5FF]/8 hover:-translate-y-0.5"
      >
        {isOnRight ? 'Create Account' : 'Sign In'}
      </button>

    </div>
  )
}
