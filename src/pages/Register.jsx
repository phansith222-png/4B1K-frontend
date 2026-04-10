import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const API_URL = 'https://your-api.com/api/auth/register' // ← เปลี่ยน URL ตรงนี้

const initialForm = {
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  firstname: '',
  lastname: '',
}

const initialErrors = {
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  firstname: '',
  lastname: '',
}

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

  if (!form.username) {
    errors.username = 'กรุณากรอก Username'
    isValid = false
  } else if (form.username.length < 3) {
    errors.username = 'Username ต้องมีอย่างน้อย 3 ตัวอักษร'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'กรุณากรอก Password'
    isValid = false
  } else if (form.password.length < 8) {
    errors.password = 'Password ต้องมีอย่างน้อย 8 ตัวอักษร'
    isValid = false
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'กรุณายืนยัน Password'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Password ไม่ตรงกัน'
    isValid = false
  }

  if (!form.firstname) {
    errors.firstname = 'กรุณากรอกชื่อ'
    isValid = false
  }

  if (!form.lastname) {
    errors.lastname = 'กรุณากรอกนามสกุล'
    isValid = false
  }

  return { errors, isValid }
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState(initialErrors)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // clear error on type
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')

    const { errors: validationErrors, isValid } = validate(form)
    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          username: form.username,
          password: form.password,
          firstname: form.firstname,
          lastname: form.lastname,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setApiError(data.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
        return
      }

      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setApiError('ไม่สามารถเชื่อมต่อ server ได้ กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    window.location.href = `https://your-api.com/api/auth/${provider}` // ← เปลี่ยน URL
  }

  return (
    <div className="bg-[#111418] text-base-content min-h-screen flex flex-col" data-theme="dark">
      <Navbar />

      <main
        className="relative flex-1 flex items-center justify-end overflow-hidden px-6 md:px-16"
        style={{
          minHeight: 'calc(100vh - 64px)',
          background: `
            radial-gradient(ellipse 80% 60% at 45% 40%, rgba(80,60,120,0.45) 0%, rgba(40,30,60,0.3) 50%, transparent 80%),
            radial-gradient(ellipse 50% 50% at 20% 70%, rgba(30,80,60,0.3) 0%, transparent 60%),
            #111418
          `,
        }}
      >
        {/* Orb */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: '38%', top: '45%',
            transform: 'translate(-50%, -50%)',
            width: 360, height: 360,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 35%, rgba(200,100,80,0.65), rgba(120,60,160,0.5) 50%, rgba(40,40,80,0.05) 80%)',
            filter: 'blur(2px)',
          }}
        />

        {/* Info card */}
        <div
          className="absolute left-[6%] top-1/2 -translate-y-1/2 w-72 z-10 hidden lg:block rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(14px)',
            border: '0.5px solid rgba(255,255,255,0.12)',
          }}
        >
          <p className="text-base text-white/75 leading-relaxed">
            We haven't forgotten about responsive layout. With Startup Framework, you can create a website with full mobile support.
          </p>
        </div>

        {/* Form */}
        <div className="relative z-10 w-full max-w-lg mr-0 lg:mr-8 py-12">

          <h1
            className="text-5xl font-bold mb-3 tracking-wide"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              background: 'linear-gradient(90deg, #6070ff, #a060ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Create an Account
          </h1>

          <p className="text-sm text-white/55 mb-8">
            By signing up, you agree to the{' '}
            <a href="#" className="text-white/75 hover:underline">Terms of Service</a>.
          </p>

          {/* Success alert */}
          {success && (
            <div className="alert alert-success mb-6 text-sm">
              ✅ สมัครสมาชิกสำเร็จ! กำลังพาไปหน้า Login...
            </div>
          )}

          {/* API error */}
          {apiError && (
            <div className="alert alert-error mb-6 text-sm">
              ⚠️ {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold tracking-[0.15em] text-white/60 mb-2">E-MAIL</label>
              <input
                type="email"
                name="email"
                placeholder="Your email"
                value={form.email}
                onChange={handleChange}
                className={`w-full px-5 py-3 rounded-full bg-transparent text-white/70 placeholder:text-white/35 text-sm outline-none transition-all ${
                  errors.email
                    ? 'border-2 border-red-500/70'
                    : 'border border-[rgba(100,120,255,0.5)] focus:border-[rgba(160,220,80,0.8)]'
                }`}
                style={{ border: errors.email ? '2px solid rgba(239,68,68,0.7)' : '1.5px solid rgba(100,120,255,0.5)' }}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1 pl-2">{errors.email}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold tracking-[0.15em] text-white/60 mb-2">USERNAME</label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-full bg-transparent text-white/70 placeholder:text-white/35 text-sm outline-none transition-all"
                style={{ border: errors.username ? '2px solid rgba(239,68,68,0.7)' : '1.5px solid rgba(100,120,255,0.5)' }}
              />
              {errors.username && <p className="text-red-400 text-xs mt-1 pl-2">{errors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold tracking-[0.15em] text-white/60 mb-2">PASSWORD</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-5 py-3 rounded-full bg-transparent text-white/70 placeholder:text-white/35 text-sm outline-none transition-all"
                    style={{ border: errors.password ? '2px solid rgba(239,68,68,0.7)' : '1.5px solid rgba(80,140,255,0.5)' }}
                  />
                  {errors.password && <p className="text-red-400 text-xs mt-1 pl-2">{errors.password}</p>}
                </div>
                <div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-5 py-3 rounded-full bg-transparent text-white/70 placeholder:text-white/35 text-sm outline-none transition-all"
                    style={{ border: errors.confirmPassword ? '2px solid rgba(239,68,68,0.7)' : '1.5px solid rgba(80,140,255,0.5)' }}
                  />
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 pl-2">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {/* Firstname / Lastname */}
            <div>
              <label className="block text-xs font-semibold tracking-[0.15em] text-white/60 mb-2">FIRSTNAME / LASTNAME</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    name="firstname"
                    placeholder="Firstname"
                    value={form.firstname}
                    onChange={handleChange}
                    className="w-full px-5 py-3 rounded-full bg-transparent text-white/70 placeholder:text-white/35 text-sm outline-none transition-all"
                    style={{ border: errors.firstname ? '2px solid rgba(239,68,68,0.7)' : '1.5px solid rgba(80,140,255,0.5)' }}
                  />
                  {errors.firstname && <p className="text-red-400 text-xs mt-1 pl-2">{errors.firstname}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Lastname"
                    value={form.lastname}
                    onChange={handleChange}
                    className="w-full px-5 py-3 rounded-full bg-transparent text-white/70 placeholder:text-white/35 text-sm outline-none transition-all"
                    style={{ border: errors.lastname ? '2px solid rgba(239,68,68,0.7)' : '1.5px solid rgba(80,140,255,0.5)' }}
                  />
                  {errors.lastname && <p className="text-red-400 text-xs mt-1 pl-2">{errors.lastname}</p>}
                </div>
              </div>
            </div>

            {/* Submit + Social */}
            <div className="flex items-center gap-5 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn rounded-full px-8 text-white font-medium tracking-wide border-none text-base"
                style={{ background: 'linear-gradient(135deg, #5080e0, #a8e060)' }}
              >
                {loading ? <span className="loading loading-spinner loading-sm" /> : 'Sign Up'}
              </button>

              <span className="text-sm text-white/40 font-medium">OR</span>

              <button
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('twitter')}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064 5.96 5.96 0 014.123 1.632l2.877-2.877A9.994 9.994 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"/>
                </svg>
              </button>
            </div>

          </form>
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
            <a href="#" className="text-white/35 hover:text-white/70 text-sm transition-colors">𝕏</a>
            <a href="#" className="text-white/35 hover:text-white/70 text-sm transition-colors">f</a>
            <a href="#" className="text-white/35 hover:text-white/70 text-sm transition-colors">G+</a>
          </div>
        </div>
        <div className="divider my-0 opacity-10" />
        <div className="flex flex-wrap items-center justify-between py-3 gap-3">
          <nav className="flex flex-wrap gap-4">
            {['Features','Concert event','Artist','Our Works','News','About us'].map(item => (
              <a key={item} href="#" className="link link-hover text-xs text-white/30">{item}</a>
            ))}
          </nav>
          <span className="text-xs text-white/20">© 2026 4B1K. cooperation</span>
        </div>
      </footer>
    </div>
  )
}