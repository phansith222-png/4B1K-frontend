import { useState, useEffect, useRef } from 'react'
import { LoginForm } from './components/LoginForm'
import { RegisterForm } from './components/RegisterForm'
import { BrandPanel } from './components/BrandPanel'

const GRAIN_SVG = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/**
 * AuthPage — Unified Login + Register page.
 *
 * Layout (desktop):
 *   Login mode    → LOGIN FORM  on LEFT  |  BRAND PANEL on RIGHT
 *   Register mode → BRAND PANEL on LEFT  |  REGISTER FORM on RIGHT
 *
 * Animation:
 *   Both halves slide+fade independently when switching.
 *   Login→Register : left exits LEFT,  right exits RIGHT
 *                    left enters RIGHT, right enters LEFT
 *   Register→Login : reverse
 *
 * Entry from Navbar:
 *   Page always mounts in 'login' visual state first, then animates
 *   to 'register' if initialMode='register' — same motion as the
 *   in-page switch button.
 *
 * @param {{ initialMode?: 'login' | 'register' }} props
 */
export default function AuthPage({ initialMode = 'login' }) {
  const [mode, setMode]           = useState('login') // always start visually in login
  const [animating, setAnimating] = useState(false)
  const isLogin                   = mode === 'login'
  const didMount                  = useRef(false)

  // Declared before useEffect so it's in scope for the rAF callback
  const triggerSwitch = () => {
    setAnimating(true)
    setTimeout(() => {
      setMode(m => (m === 'login' ? 'register' : 'login'))
      setAnimating(false)
    }, 380)
  }

  const switchMode = () => { if (!animating) triggerSwitch() }

  // Entry animation: if we arrive at /register (from Navbar or direct URL),
  // start in login state then animate to register after the first paint —
  // same motion as clicking the switch button inside the page.
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      if (initialMode === 'register') {
        const id = requestAnimationFrame(() => triggerSwitch())
        return () => cancelAnimationFrame(id)
      }
      return
    }
    // Subsequent prop changes (e.g. programmatic navigation)
    setMode(initialMode)
  }, [initialMode]) // eslint-disable-line

  /*
   * Animation classes per panel:
   *
   *   Login mode, not animating  → left: enter-left,  right: enter-right
   *   Login mode, animating out  → left: exit-left,   right: exit-right
   *   Reg  mode, not animating   → left: enter-right, right: enter-left
   *   Reg  mode, animating out   → left: exit-right,  right: exit-left
   */
  const leftClass  = isLogin
    ? (animating ? 'auth-exit-left'  : 'auth-enter-left')
    : (animating ? 'auth-exit-right' : 'auth-enter-right')

  const rightClass = isLogin
    ? (animating ? 'auth-exit-right' : 'auth-enter-right')
    : (animating ? 'auth-exit-left'  : 'auth-enter-left')

  return (
    <div className="bg-[#0B0C10] text-white min-h-screen flex flex-col font-sans relative selection:bg-[#00E5FF] selection:text-black overflow-hidden">

      <style>{`
        @keyframes authGradientRun {
          0%   { background-position: 0% 0%;   }
          100% { background-position: 0% 200%; }
        }
        .auth-divider {
          background: linear-gradient(180deg, #00E5FF, #FF00FF, #7000FF, #00E5FF);
          background-size: 100% 200%;
          animation: authGradientRun 3s linear infinite;
        }

        @keyframes authEnterLeft  { from { opacity:0; transform:translateX(-44px); } to { opacity:1; transform:translateX(0); } }
        @keyframes authEnterRight { from { opacity:0; transform:translateX(44px);  } to { opacity:1; transform:translateX(0); } }
        @keyframes authExitLeft   { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(-44px); } }
        @keyframes authExitRight  { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(44px);  } }

        .auth-enter-left  { animation: authEnterLeft  0.38s cubic-bezier(0.4,0,0.2,1) both; }
        .auth-enter-right { animation: authEnterRight 0.38s cubic-bezier(0.4,0,0.2,1) both; }
        .auth-exit-left   { animation: authExitLeft   0.38s cubic-bezier(0.4,0,0.2,1) both; }
        .auth-exit-right  { animation: authExitRight  0.38s cubic-bezier(0.4,0,0.2,1) both; }
      `}</style>

      {/* Grain */}
      <div style={{ position: 'fixed', inset: 0, opacity: 0.03, pointerEvents: 'none', zIndex: 0, backgroundImage: GRAIN_SVG }} />

      {/* Ambient glows — shift with mode */}
      <div
        className="absolute top-[-10%] left-[-8%] w-[480px] h-[480px] rounded-full pointer-events-none z-0 blur-[110px] transition-colors duration-700"
        style={{ backgroundColor: isLogin ? '#00E5FF' : '#7000FF', opacity: 0.09 }}
      />
      <div
        className="absolute bottom-[-10%] right-[-8%] w-[480px] h-[480px] rounded-full pointer-events-none z-0 blur-[110px] transition-colors duration-700"
        style={{ backgroundColor: isLogin ? '#7000FF' : '#FF00FF', opacity: 0.09 }}
      />

      {/* ══ DESKTOP ══ */}
      <main className="hidden lg:flex flex-row flex-1 w-full max-w-[1440px] mx-auto relative z-10 min-h-screen">

        {/* LEFT half — outer div stays mounted; inner is keyed so it re-mounts */}
        <div className="w-1/2 flex items-center justify-center p-12 xl:p-20 relative">
          <div key={`left-${mode}`} className={`w-full flex justify-center ${leftClass}`}>
            {isLogin
              ? <LoginForm onSwitch={switchMode} />
              : <BrandPanel side="left" onSwitch={switchMode} />}
          </div>
        </div>

        {/* Centre divider */}
        <div className="flex items-stretch py-[12%] pointer-events-none">
          <div className="auth-divider w-[2px] rounded-full opacity-70 shadow-[0_0_12px_rgba(0,229,255,0.4)]" />
        </div>

        {/* RIGHT half */}
        <div className="w-1/2 flex items-center justify-center p-12 xl:p-20 relative">
          <div key={`right-${mode}`} className={`w-full flex justify-center ${rightClass}`}>
            {isLogin
              ? <BrandPanel side="right" onSwitch={switchMode} />
              : <RegisterForm onSwitch={switchMode} />}
          </div>
        </div>

      </main>

      {/* ══ MOBILE ══ */}
      <div className="lg:hidden flex-1 flex items-center justify-center p-6 relative z-10 min-h-screen">
        {isLogin
          ? <LoginForm onSwitch={switchMode} />
          : <RegisterForm onSwitch={switchMode} />}
      </div>

    </div>
  )
}
