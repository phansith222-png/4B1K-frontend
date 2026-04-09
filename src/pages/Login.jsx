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

  return (
    // ครอบด้วย min-h-screen และ Flex เพื่อให้จัด Layout เต็มจอได้
    <div className="bg-[#1b1f27] text-base-content min-h-screen flex flex-col font-sans" data-theme="dark">
      
    

      {/* ================= MAIN LAYOUT (แบ่งซ้าย-ขวา) ================= */}
      <main className="relative flex-1 flex overflow-hidden w-full ">
        
        {/* Background ซ้าย (สีเข้มกว่า) และ ขวา (สีพื้นปกติ) */}
        <div className="absolute inset-0 flex w-full h-full">
          {/* ฝั่งซ้าย: มีแสง Orb วงกลม */}
          <div className="relative w-full h-full bg-[#181b22] overflow-hidden">
            <div
              className="absolute pointer-events-none"
              // style={{
              //   right: '-10%', top: '50%',
              //   transform: 'translate(20%, -50%)',
              //   width: 600, height: 600,
              //   borderRadius: '50%',
              //   background: 'radial-gradient(circle, rgba(138,43,226,0.15) 0%, rgba(75,0,130,0.05) 40%, transparent 70%)',
              //   filter: 'blur(40px)',
              // }}
            />
            {/* เงาคน (Silhouette) */}
            <div
              className="absolute right-10 bottom-0 w-64 h-[400px] opacity-20 pointer-events-none hidden lg:block"
              style={{
                background: '#000',
                clipPath: 'polygon(40% 0%,60% 0%,75% 15%,80% 35%,75% 55%,85% 65%,100% 80%,90% 100%,55% 100%,50% 80%,45% 100%,10% 100%,15% 80%,5% 65%,20% 55%,25% 35%,20% 15%)',
                filter: 'blur(2px)',
              }}
            />
          </div>
          {/* ฝั่งขวา */}
          {/* <div className="hidden lg:block lg:w-[45%] h-full bg-[#1b1f27]"></div> */}
        </div>

        {/* ================= CONTENT CONTAINER ================= */}
        <div className="relative z-10 w-full flex items-center justify-center lg:justify-start lg:pl-[12%] xl:pl-[15%] h-full min-h-[calc(100vh-64px)] py-10">
          
          <div className="relative flex items-center w-full max-w-[400px] px-6 lg:px-0 bd">
            
            {/* 1. Login Card (การ์ดกระจก) */}
            <div
              className="w-full rounded-[24px] p-8 md:p-10 relative z-20"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              <h1 className="text-[32px] font-extrabold text-white mb-8 tracking-wide">
                Sign In
              </h1>

              {apiError && (
                <div className="alert alert-error mb-5 text-sm py-2 rounded-xl bg-red-500/20 text-red-200 border-red-500/30">
                  {'⚠️ ' + apiError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

                {/* Email Input */}
                <div className="relative group">
                  <div 
                    className="flex items-center gap-3 bg-white/[0.03] px-4 py-3.5 rounded-xl transition-all duration-300 border border-white/5 group-focus-within:border-[#2B5AE8] group-focus-within:bg-white/[0.05]"
                    style={{ borderColor: errors.email ? 'rgba(239,68,68,0.7)' : '' }}
                  >
                    <span className="text-white/40 group-focus-within:text-[#2B5AE8] transition-colors shrink-0 text-lg font-bold">@</span>
                    <input
                      type="email"
                      name="email"
                      placeholder="test01@mail.com"
                      value={form.email}
                      onChange={handleChange}
                      className="grow bg-transparent text-white placeholder:text-white/30 text-sm outline-none"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs mt-1.5 pl-2 absolute -bottom-5">{errors.email}</p>}
                </div>

                {/* Password Input */}
                <div className="relative group mt-2">
                  <div 
                    className="flex items-center gap-3 bg-white/[0.03] px-4 py-3.5 rounded-xl transition-all duration-300 border border-white/5 group-focus-within:border-[#2B5AE8] group-focus-within:bg-white/[0.05]"
                    style={{ borderColor: errors.password ? 'rgba(239,68,68,0.7)' : '' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/40 group-focus-within:text-[#2B5AE8] transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••"
                      value={form.password}
                      onChange={handleChange}
                      className="grow bg-transparent text-white placeholder:text-white/30 text-sm outline-none"
                    />
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1.5 pl-2 absolute -bottom-5">{errors.password}</p>}
                </div>

                {/* Remember me & Forgot Password */}
                <div className="flex items-center justify-between mt-3">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="peer appearance-none w-[18px] h-[18px] border border-white/20 rounded-md checked:bg-[#2B5AE8] checked:border-[#2B5AE8] transition-all cursor-pointer"
                      />
                      <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-white/60 group-hover:text-white transition-colors">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-[#e84040] hover:text-red-400 hover:underline transition-colors">Forgot Password?</a>
                </div>

                {/* Submit Button (สี #2B5AE8) */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full mt-4 text-white font-bold tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(43,90,232,0.3)] flex items-center justify-center"
                  style={{ backgroundColor: '#2B5AE8' }}
                >
                  {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 my-1">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
                  <span className="text-[10px] font-semibold text-white/30 tracking-widest">OR</span>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
                </div>

                {/* Social Icons (Hover ด้วยสี #CEFF67) */}
                <div className="flex justify-center gap-8">
                  <button type="button" onClick={() => handleSocialLogin('facebook')} className="text-white/30 hover:text-[#CEFF67] hover:scale-110 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>
                  </button>
                  <button type="button" onClick={() => handleSocialLogin('twitter')} className="text-white/30 hover:text-[#CEFF67] hover:scale-110 transition-all">
                    {/* X (Twitter) Logo */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[16px] w-[16px]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </button>
                  <button type="button" onClick={() => handleSocialLogin('google')} className="text-white/30 hover:text-[#CEFF67] hover:scale-110 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064 5.96 5.96 0 014.123 1.632l2.877-2.877A9.994 9.994 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                    </svg>
                  </button>
                </div>

              </form>
            </div>

            {/* 2. Info card (กล่องลอยๆ ทับทางขวาแบบในรูป) */}
            <div
              className="absolute right-0 translate-x-[65%] w-[260px] z-10 hidden xl:block rounded-2xl p-6"
              style={{
                background: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.04)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
              }}
            >
              <p className="text-[13px] text-white/50 leading-relaxed font-light">
                We haven't forgotten about responsive layout. With Startup Framework, you can create a website with full mobile support.
              </p>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  )
}