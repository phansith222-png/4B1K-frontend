import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const API_URL = 'https://your-api.com/api/auth/login'

const initialForm = { email: '', password: '' }
const initialErrors = { email: '', password: '' }

function validate(form) {
  const errors = { ...initialErrors }
  let isValid = true
  if (!form.email) {
    errors.email = 'กรุณากรอก Email'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'รูปแบบ Email ไม่ถูกต้อง'
    isValid = false
  }
  if (!form.password) {
    errors.password = 'กรุณากรอก Password'
    isValid = false
  }
  return { errors, isValid }
}

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState(initialErrors)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [rememberMe, setRememberMe] = useState(true)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (apiError) setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const { errors: validationErrors, isValid } = validate(form)
    if (!isValid) { setErrors(validationErrors); return }
    setLoading(true)
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) { setApiError(data.message || 'Email หรือ Password ไม่ถูกต้อง'); return }
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem('token', data.token)
      storage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch {
      setApiError('ไม่สามารถเชื่อมต่อ server ได้ กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    window.location.href = `https://your-api.com/api/auth/${provider}`
  }

  const borderStyle = (hasError) => ({
    border: hasError ? '2px solid rgba(239,68,68,0.7)' : '1.5px solid rgba(100,120,255,0.5)',
  })

  return (
    <div className="bg-[#111418] text-base-content min-h-screen flex flex-col" data-theme="dark">
      <Navbar />

      <main
        className="relative flex-1 flex items-center justify-center overflow-hidden"
        style={{
          minHeight: 'calc(100vh - 64px)',
          background: `
            radial-gradient(ellipse 80% 60% at 62% 40%, rgba(80,60,120,0.45) 0%, rgba(40,30,60,0.3) 50%, transparent 80%),
            radial-gradient(ellipse 50% 50% at 30% 70%, rgba(30,80,60,0.3) 0%, transparent 60%),
            #111418
          `,
        }}
      >
        {/* Orb */}
        <div
          className="absolute pointer-events-none"
          style={{
            right: '22%', top: '50%',
            transform: 'translate(50%, -50%)',
            width: 380, height: 380,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 35%, rgba(200,100,80,0.65), rgba(120,60,160,0.5) 50%, rgba(40,40,80,0.05) 80%)',
            filter: 'blur(2px)',
          }}
        />

        {/* Silhouette */}
        <div
          className="absolute right-[14%] bottom-0 w-56 h-96 opacity-40 pointer-events-none hidden lg:block"
          style={{
            background: 'rgba(0,0,0,0.7)',
            clipPath: 'polygon(40% 0%,60% 0%,75% 15%,80% 35%,75% 55%,85% 65%,100% 80%,90% 100%,55% 100%,50% 80%,45% 100%,10% 100%,15% 80%,5% 65%,20% 55%,25% 35%,20% 15%)',
            filter: 'blur(1px)',
          }}
        />

        {/* Card */}
        <div
          className="relative z-10 w-[340px] md:w-[380px] rounded-2xl p-8 md:p-10 -translate-x-10 md:-translate-x-16"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '0.5px solid rgba(255,255,255,0.12)',
          }}
        >
          <h1
            className="text-4xl font-bold text-white mb-1 tracking-wide"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            Sign In
          </h1>
          <br />

          {apiError && (
            <div className="alert alert-error mb-5 text-sm py-2">
              {'⚠️ ' + apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

            {/* Email */}
            <div>
              <label
                className="input input-bordered flex items-center gap-2 bg-white/[0.07] text-white"
                style={borderStyle(errors.email)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={handleChange}
                  className="grow bg-transparent placeholder:text-white/30 text-sm outline-none"
                />
              </label>
              {errors.email && <p className="text-red-400 text-xs mt-1 pl-2">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label
                className="input input-bordered flex items-center gap-2 bg-white/[0.07] text-white"
                style={borderStyle(errors.password)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type="password"
                  name="password"
                  placeholder="Your password"
                  value={form.password}
                  onChange={handleChange}
                  className="grow bg-transparent placeholder:text-white/30 text-sm outline-none"
                />
              </label>
              {errors.password && <p className="text-red-400 text-xs mt-1 pl-2">{errors.password}</p>}
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox checkbox-sm border-white/30"
                />
                <span className="text-sm text-white/60">Remember me</span>
              </label>
              <a href="#" className="text-sm text-red-400 hover:underline">Forgot Password?</a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn rounded-full mt-2 text-white font-medium tracking-wide border-none"
              style={{ background: 'linear-gradient(135deg, #5080e0, #8050d0)' }}
            >
              {loading ? <span className="loading loading-spinner loading-sm" /> : 'Sign In'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-white/30">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Social */}
            <div className="flex justify-center gap-6">
              <button type="button" onClick={() => handleSocialLogin('facebook')} className="text-white/50 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </button>
              <button type="button" onClick={() => handleSocialLogin('twitter')} className="text-white/50 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button type="button" onClick={() => handleSocialLogin('google')} className="text-white/50 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064 5.96 5.96 0 014.123 1.632l2.877-2.877A9.994 9.994 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                </svg>
              </button>
            </div>

          </form>
        </div>

        {/* Info card */}
        <div
          className="absolute right-[6%] top-1/2 -translate-y-[45%] w-64 z-10 hidden lg:block rounded-2xl p-6"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(8px)',
            border: '0.5px solid rgba(255,255,255,0.1)',
          }}
        >
          <p className="text-sm text-white/70 leading-relaxed">
            We haven't forgotten about responsive layout. With Startup Framework, you can create a website with full mobile support.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#111418] px-6 md:px-10 pt-6 pb-0">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <span className="text-lg tracking-widest text-white/35" style={{ fontFamily: 'Rajdhani, sans-serif' }}>4B1K</span>
          <div className="flex gap-5">
            <a href="#" className="link link-hover text-sm text-white/40">Privacy Policy</a>
            <a href="#" className="link link-hover text-sm text-white/40">Terms</a>
          </div>
          <div className="flex gap-4">
            {['𝕏', 'f', 'G+'].map(s => (
              <a key={s} href="#" className="text-white/35 hover:text-white/70 text-sm transition-colors">{s}</a>
            ))}
          </div>
        </div>
        <div className="divider my-0 opacity-10" />
        <div className="flex flex-wrap items-center justify-between py-3 gap-3">
          <nav className="flex flex-wrap gap-4">
            {['Features', 'Concert event', 'Artist', 'Our Works', 'News', 'About us'].map(item => (
              <a key={item} href="#" className="link link-hover text-xs text-white/30">{item}</a>
            ))}
          </nav>
          <span className="text-xs text-white/20">© 2026 4B1K. cooperation</span>
        </div>
      </footer>
    </div>
  )
}