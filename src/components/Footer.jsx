import { Link } from 'react-router-dom'
import useUserStore from '../stores/userStore'

/* ─── Site links that map to real routes ─── */
const NAV_COLUMNS = [
  {
    heading: 'Explore',
    links: [
      { label: 'Concert Events', to: '/new-event' },
      { label: 'Artist Biology', to: '/artists' },
      { label: 'Pop',            to: '/pop' },
      { label: 'Rock',           to: '/rock' },
      { label: 'Classic',        to: '/classic' },
      { label: 'Entertainment',  to: '/entertainment' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Sign In',        to: '/login' },
      { label: 'Create Account', to: '/register' },
      { label: 'Edit Profile',   to: '/editprofile' },
      { label: 'Community Chat', to: '/chat' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About 4B1K',    to: '/' },
      { label: 'Privacy Policy', to: '/' },
      { label: 'Terms of Use',   to: '/' },
      { label: 'Contact Us',     to: '/' },
    ],
  },
]

/* ─── Google social icon ─── */
function GoogleIcon() {
  return (
    <a
      href="http://localhost:5000/auth/google"
      aria-label="Sign in with Google"
      className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/8 transition-all duration-300 hover:-translate-y-0.5"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    </a>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()
  const user = useUserStore((state) => state.user)

  // Filter columns based on auth status
  const columns = NAV_COLUMNS.map(col => {
    if (col.heading === 'Account' && user) {
      return {
        ...col,
        links: col.links.filter(link => 
          link.label !== 'Sign In' && link.label !== 'Create Account'
        )
      }
    }
    return col
  })

  return (
    <footer className="bg-[#0B0C10] border-t border-white/8 pt-14 pb-8 px-6 md:px-10 font-sans text-white relative z-10 overflow-hidden">

      <style>{`
        @keyframes footerGradientRun {
          0%   { background-position: 200% 0; }
          100% { background-position:   0% 0; }
        }
        .footer-logo-shine {
          background: linear-gradient(120deg,#fff 0%,#fff 40%,#00E5FF 50%,#fff 60%,#fff 100%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: footerGradientRun 4s linear infinite;
        }
        .footer-divider {
          background: linear-gradient(90deg, transparent, #00E5FF, #FF00FF, #7000FF, transparent);
          background-size: 200% auto;
          animation: footerGradientRun 5s linear infinite;
        }
      `}</style>

      {/* Subtle ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-32 bg-[#00E5FF] opacity-[0.04] blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Top row: logo + tagline + google ── */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">

          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-[260px]">
            <Link to="/" className="text-[32px] font-black italic tracking-tighter footer-logo-shine w-max">
              4B1K
            </Link>
            <p className="text-gray-500 text-[13px] leading-relaxed font-medium">
              Your concert universe — discover live events, explore artists, and connect with fans who share your beat.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <GoogleIcon />
              <span className="text-[11px] text-gray-600 font-semibold">Quick access with Google</span>
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-8">
            {columns.map((col) => (
              <div key={col.heading}>
                <h4 className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-4">
                  {col.heading}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-[13px] text-gray-400 font-medium hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="footer-divider h-[1px] w-full opacity-30 mb-7" />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-gray-600 font-semibold">
          <span>© {year} 4B1K. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <Link to="/" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-gray-400 transition-colors">Terms of Use</Link>
            <Link to="/" className="hover:text-gray-400 transition-colors">Contact</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
