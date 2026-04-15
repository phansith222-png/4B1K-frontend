import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginSchema } from '../validations/loginSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { mainapi } from '../api/auth'
import { useForm } from 'react-hook-form'
import useUserStore from '../stores/userStore'

export default function Login() {
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const setUser = useUserStore(state => state.setUser)

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const { errors, isSubmitting } = formState


  const onSubmit = async (data) => {
    console.log('okc ');
    setApiError('')
    try {
      const resp = await mainapi.post('/auth/login', data)
      console.log('Login Success:', resp.data)

      const userData = resp.data.user;
      const authToken = resp.data.token;

      setUser(userData, authToken);

      navigate('/') 

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid username or password'
      setApiError(errorMsg)
    }
  }

  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost:5000/auth/${provider}`
  }

  return (
    <div className="bg-[#0B0C10] text-white min-h-screen flex flex-col font-sans relative selection:bg-[#00E5FF] selection:text-black">
      
      {/* Background Noise & Animations */}
      <style>{`
        @keyframes verticalGradientRun {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 200%; }
        }
        .animated-vertical-divider {
          background: linear-gradient(180deg, #00E5FF, #FF00FF, #7000FF, #00E5FF);
          background-size: 100% 200%;
          animation: verticalGradientRun 3s linear infinite;
        }
        .dark-grain {
          position: fixed; inset: 0; opacity: 0.03; pointer-events: none; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
      `}</style>
      
      <div className="dark-grain" />

      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00E5FF] opacity-10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#7000FF] opacity-10 blur-[120px] rounded-full pointer-events-none z-0" />

      <main className="flex-1 flex flex-col lg:flex-row w-full max-w-[1440px] mx-auto relative z-10">
        
        {/* ================= ฝั่งซ้าย: LOGIN FORM ================= */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 xl:p-20 relative z-10">
          
          <div className="w-full max-w-[380px]">
            
            <h1 className="text-[40px] font-black text-white mb-2 tracking-tight">
              Sign In
            </h1>
            <p className="text-gray-400 mb-8 font-medium">
              Welcome back! Please enter your details.
            </p>

            {apiError && (
              <div className="mb-6 text-sm py-3 px-4 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                <span className="font-bold text-lg leading-none">⚠</span> {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>

              {/* Username Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Username"
                  {...register('username')}
                  className="w-full bg-[#1A1C23] px-5 py-4 rounded-2xl transition-all duration-300 border border-white/5 focus:border-[#00E5FF] focus:ring-4 focus:ring-[#00E5FF]/20 text-white placeholder:text-gray-500 text-sm outline-none font-medium shadow-sm hover:border-white/20"
                  style={{ borderColor: errors.username ? '#ef4444' : '' }}
                />
                {errors.username && <p className="text-red-400 text-[10px] mt-1 pl-2 absolute -bottom-5">{errors.username.message}</p>}
              </div>

              {/* Password Input */}
              <div className="relative mt-2">
                <input
                  type="password"
                  placeholder="Password"
                  {...register('password')}
                  className="w-full bg-[#1A1C23] px-5 py-4 rounded-2xl transition-all duration-300 border border-white/5 focus:border-[#00E5FF] focus:ring-4 focus:ring-[#00E5FF]/20 text-white placeholder:text-gray-500 text-sm outline-none font-medium shadow-sm hover:border-white/20"
                  style={{ borderColor: errors.password ? '#ef4444' : '' }}
                />
                {errors.password && <p className="text-red-400 text-[10px] mt-1 pl-2 absolute -bottom-5">{errors.password.message}</p>}
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between mt-2 px-1">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer appearance-none w-5 h-5 border-2 border-white/20 bg-[#1A1C23] rounded-[6px] checked:bg-[#00E5FF] checked:border-[#00E5FF] transition-all cursor-pointer hover:border-[#00E5FF]/50"
                    />
                    <svg className="absolute w-3.5 h-3.5 text-[#0B0C10] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors font-semibold">Remember me</span>
                </label>
                <a href="#" className="text-sm text-gray-400 hover:text-[#00E5FF] hover:underline transition-colors font-bold">Forgot Password?</a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl mt-4 text-white font-black text-[15px] tracking-wide transition-all duration-300 hover:-translate-y-1 shadow-[0_5px_20px_rgba(0,229,255,0.2)] hover:shadow-[0_10px_30px_rgba(112,0,255,0.4)] flex items-center justify-center disabled:opacity-70 bg-gradient-to-r from-[#00E5FF] to-[#7000FF]"
              >
                {isSubmitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 mt-6 mb-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Or Sign In With</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Social Icons (Beautiful SVG & Glassmorphism) */}
              <div className="flex justify-center gap-5">
                
                {/* Google */}
                <button type="button" onClick={() => handleSocialLogin('google')} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#1A1C23] border border-white/5 shadow-sm hover:border-[#00E5FF] hover:shadow-[0_5px_15px_rgba(0,229,255,0.2)] text-gray-400 hover:text-white transition-all hover:-translate-y-1 group">
                  <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </button>

                {/* Facebook */}
                <button type="button" onClick={() => handleSocialLogin('facebook')} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#1A1C23] border border-white/5 shadow-sm hover:border-[#2B5AE8] hover:shadow-[0_5px_15px_rgba(43,90,232,0.3)] text-gray-400 hover:text-white transition-all hover:-translate-y-1 group">
                  <svg className="w-6 h-6 transition-transform group-hover:scale-110 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>

                {/* X (Twitter) */}
                <button type="button" onClick={() => handleSocialLogin('twitter')} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#1A1C23] border border-white/5 shadow-sm hover:border-white hover:shadow-[0_5px_15px_rgba(255,255,255,0.15)] text-gray-400 hover:text-white transition-all hover:-translate-y-1 group">
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>

              </div>

              {/* Link to Register */}
              <p className="text-center text-sm text-gray-400 mt-5 font-medium">
                Don't have an account? <a href="/register" className="text-[#00E5FF] font-bold hover:underline hover:text-[#FF00FF] transition-colors">Sign up now</a>
              </p>

            </form>
          </div>
        </div>

        {/* ================= ฝั่งขวา: TEXT INFO ================= */}
        <div className="hidden lg:flex w-1/2 items-center justify-center p-12 xl:p-20 relative">
          
          <div className="absolute left-0 top-[15%] bottom-[15%] w-[2px] animated-vertical-divider rounded-full hidden lg:block opacity-70 shadow-[0_0_15px_rgba(0,229,255,0.5)] z-20"></div>

          <div className="max-w-[480px]">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#1A1C23] border border-white/10 text-[11px] font-bold text-gray-300 mb-6 tracking-widest uppercase shadow-sm">
              Discover <span className="text-[#00E5FF]">Live Music</span>
            </div>
            
            <h2 className="text-4xl xl:text-5xl font-black text-white mb-6 leading-[1.2] tracking-tight">
              Connect with the <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7000FF]">Live Rhythm</span> & Fans.
            </h2>
            
            <p className="text-lg text-gray-400 leading-relaxed font-medium">
              Dive into the ultimate hub for <span className="text-[#00E5FF] font-bold">concert lovers</span>. Discover trending events, connect with passionate fans, and explore deep into your favorite <span className="text-[#FF00FF] font-bold">artist's biology</span>.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[32, 12, 47].map(imgId => (
                  <div key={imgId} className="w-11 h-11 rounded-full border-[3px] border-[#0B0C10] bg-[#1A1C23] shadow-sm overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${imgId}`} alt="user" className="w-full h-full object-cover"/>
                  </div>
                ))}
                <div className="w-11 h-11 rounded-full border-[3px] border-[#0B0C10] bg-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.4)] flex items-center justify-center text-[#0B0C10] font-black text-[10px]">
                  10k+
                </div>
              </div>
              <span className="text-sm font-bold text-gray-300">Fans already joined</span>
            </div>
          </div>
          
        </div>

      </main>

    </div>
  )
}