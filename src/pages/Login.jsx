


import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
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
      username: '', // เปลี่ยนจาก email เป็น username
      password: ''
    }
  })

  const { errors, isSubmitting } = formState
  const onSubmit = async (data) => {
    setApiError('')
    try {
      // 1. ยิง API ไปที่ Backend ของคุณ
      const resp = await mainapi.post('/auth/login', data)

      console.log('Login Success:', resp.data)

      const userData = resp.data.user;
      const authToken = resp.data.token;

      // แล้วค่อยส่งเข้า Store โดยเรียงลำดับ (user, token) ให้ตรงกับที่คุณเขียนไว้
      setUser(userData, authToken);

      // 3. พาไปหน้าถัดไป (เช่น /dashboard หรือ /home)
      // navigate('/dashboard') 

    } catch (err) {
      // ดึงข้อความ Error จาก Backend มาแสดง
      const errorMsg = err.response?.data?.message || 'Invalid username or password'
      setApiError(errorMsg)
    }
  }

  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost:5000/auth/${provider}`
  }

  return (
    <div className="bg-[#F9F8F3] text-gray-900 min-h-screen flex flex-col font-sans">
      
      <style>{`
        @keyframes verticalGradientRun {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 200%; }
        }
        .animated-vertical-divider {
          background: linear-gradient(180deg, #CEFF67, #2B5AE8, #CEFF67);
          background-size: 100% 200%;
          animation: verticalGradientRun 3s linear infinite;
        }
      `}</style>

      <main className="flex-1 flex flex-col lg:flex-row w-full max-w-[1440px] mx-auto relative z-10">
        
        {/* ================= ฝั่งซ้าย: LOGIN FORM ================= */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 xl:p-20 relative z-10">
          
          <div className="w-full max-w-[380px]">
            
            <h1 className="text-[40px] font-black text-gray-900 mb-2 tracking-tight">
              Sign In
            </h1>
            <p className="text-gray-500 mb-8 font-medium">
              Welcome back! Please enter your details.
            </p>

            {apiError && (
              <div className="mb-6 text-sm py-3 px-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center gap-2 shadow-sm">
                <span className="font-bold">⚠️</span> {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4.5" noValidate>

              {/* Username Input (เปลี่ยนจาก Email) */}
              <div className="relative">
                <input
                  type="text" // เปลี่ยน type เป็น text
                  placeholder="Username" // เปลี่ยน Placeholder
                  {...register('username')} // register เป็น username
                  className="w-full bg-white px-5 py-4 rounded-2xl transition-all duration-300 border border-gray-200 focus:border-[#2B5AE8] focus:ring-4 focus:ring-[#2B5AE8]/10 text-gray-900 placeholder:text-gray-400 text-sm outline-none font-medium shadow-sm hover:border-gray-300"
                  style={{ borderColor: errors.username ? '#ef4444' : '' }}
                />
                {errors.username && <p className="text-red-500 text-[10px] mt-1 pl-2 absolute -bottom-5">{errors.username.message}</p>}
              </div>

              {/* Password Input */}
              <div className="relative mt-2">
                <input
                  type="password"
                  placeholder="Password"
                  {...register('password')}
                  className="w-full bg-white px-5 py-4 rounded-2xl transition-all duration-300 border border-gray-200 focus:border-[#2B5AE8] focus:ring-4 focus:ring-[#2B5AE8]/10 text-gray-900 placeholder:text-gray-400 text-sm outline-none font-medium shadow-sm hover:border-gray-300"
                  style={{ borderColor: errors.password ? '#ef4444' : '' }}
                />
                {errors.password && <p className="text-red-500 text-[10px] mt-1 pl-2 absolute -bottom-5">{errors.password.message}</p>}
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between mt-3 px-1">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer appearance-none w-5 h-5 border-2 border-gray-300 bg-white rounded-[6px] checked:bg-gray-900 checked:border-gray-900 transition-all cursor-pointer hover:border-gray-400"
                    />
                    <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-500 group-hover:text-gray-900 transition-colors font-semibold">Remember me</span>
                </label>
                <a href="#" className="text-sm text-gray-500 hover:text-[#2B5AE8] hover:underline transition-colors font-bold">Forgot Password?</a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl mt-4 text-[#1b1f27] font-black text-[15px] tracking-wide transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_20px_rgba(206,255,103,0.3)] hover:shadow-[0_12px_25px_rgba(206,255,103,0.4)] flex items-center justify-center disabled:opacity-70"
                style={{ backgroundColor: '#CEFF67' }}
              >
                {isSubmitting ? <span className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" /> : 'Sign In'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 mt-6 mb-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">OR Sign in with</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Social Icons */}
              <div className="flex justify-center gap-5">
                {['google', 'facebook', 'twitter'].map(provider => (
                  <button key={provider} type="button" onClick={() => handleSocialLogin(provider)} 
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:border-[#2B5AE8] transition-all hover:-translate-y-1">
                    <span className="capitalize text-[10px] font-bold text-gray-500">{provider[0]}</span>
                  </button>
                ))}
              </div>

              {/* Link to Register */}
              <p className="text-center text-sm text-gray-500 mt-6 font-medium">
                Don't have an account? <a href="/register" className="text-[#2B5AE8] font-bold hover:underline">Sign up now</a>
              </p>

            </form>
          </div>
        </div>

        {/* ================= ฝั่งขวา: TEXT INFO ================= */}
        <div className="hidden lg:flex w-1/2 items-center justify-center p-12 xl:p-20 relative">
          
          <div className="absolute left-0 top-[15%] bottom-[15%] w-[2px] animated-vertical-divider rounded-full hidden lg:block opacity-90 shadow-[0_0_10px_rgba(43,90,232,0.3)] z-20"></div>

          <div className="max-w-[480px]">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-gray-200 text-[11px] font-bold text-gray-500 mb-6 tracking-widest uppercase shadow-sm">
              Discover <span className="text-[#2B5AE8]">Live Music</span>
            </div>
            
            <h2 className="text-4xl xl:text-5xl font-black text-gray-900 mb-6 leading-[1.2] tracking-tight">
              Connect with the <br/> <span className="text-[#2B5AE8]">Live Rhythm</span> & Fans.
            </h2>
            
            <p className="text-lg text-gray-500 leading-relaxed font-medium">
              Dive into the ultimate hub for <span className="text-[#2B5AE8] font-bold">concert lovers</span>. Discover trending events, connect with passionate fans, and explore deep into your favorite <span className="text-[#2B5AE8] font-bold">artist's biology</span>.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[32, 12, 47].map(imgId => (
                  <div key={imgId} className="w-11 h-11 rounded-full border-[3px] border-[#F9F8F3] bg-gray-200 shadow-sm overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${imgId}`} alt="user" className="w-full h-full object-cover"/>
                  </div>
                ))}
                <div className="w-11 h-11 rounded-full border-[3px] border-[#F9F8F3] bg-[#CEFF67] shadow-sm flex items-center justify-center text-gray-900 font-bold text-[10px]">
                  10k+
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900">Fans already joined</span>
            </div>
          </div>
          
        </div>

      </main>

    </div>
    // <div className="bg-[#F9F8F3] text-gray-900 min-h-screen flex flex-col font-sans">

    //   {/* Style สำหรับเส้นสีวิ่งแนวตั้ง */}
    //   <style>{`
    //     @keyframes verticalGradientRun {
    //       0% { background-position: 0% 0%; }
    //       100% { background-position: 0% 200%; }
    //     }
    //     .animated-vertical-divider {
    //       background: linear-gradient(180deg, #CEFF67, #2B5AE8, #CEFF67);
    //       background-size: 100% 200%;
    //       animation: verticalGradientRun 3s linear infinite;
    //     }
    //   `}</style>

    //   {/* ================= MAIN LAYOUT (แบ่งซ้าย-ขวา 50/50) ================= */}
    //   <main className="flex-1 flex flex-col lg:flex-row w-full max-w-[1440px] mx-auto">

    //     {/* ================= ฝั่งซ้าย: LOGIN FORM (สวยขึ้น & ไม่มีโลโก้) ================= */}
    //     <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 xl:p-20 relative z-10">

    //       <div className="w-full max-w-[380px]">

    //         <h1 className="text-[40px] font-black text-gray-900 mb-2 tracking-tight">
    //           Sign In
    //         </h1>
    //         <p className="text-gray-500 mb-8 font-medium">
    //           Welcome back! Please enter your details.
    //         </p>

    //         {apiError && (
    //           <div className="mb-6 text-sm py-3 px-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center gap-2 shadow-sm">
    //             <span className="font-bold">⚠️</span> {apiError}
    //           </div>
    //         )}

    //         <form onSubmit={handleSubmit} className="flex flex-col gap-4.5" noValidate>

    //           {/* Email Input */}
    //           <div className="relative">
    //             <input
    //               type="email"
    //               name="email"
    //               placeholder="Email address"
    //               // value={form.email}
    //               // onChange={handleChange}
    //               className="w-full bg-white px-5 py-4 rounded-2xl transition-all duration-300 border border-gray-200 focus:border-[#2B5AE8] focus:ring-4 focus:ring-[#2B5AE8]/10 text-gray-900 placeholder:text-gray-400 text-sm outline-none font-medium shadow-sm hover:border-gray-300"
    //               style={{ borderColor: errors.email ? '#ef4444' : '' }}
    //             />
    //             {errors.email && <p className="text-red-500 text-xs mt-1 pl-2 absolute -bottom-5">{errors.email}</p>}
    //           </div>

    //           {/* Password Input */}
    //           <div className="relative mt-2">
    //             <input
    //               type="password"
    //               name="password"
    //               placeholder="Password"
    //               // value={form.password}
    //               // onChange={handleChange}
    //               className="w-full bg-white px-5 py-4 rounded-2xl transition-all duration-300 border border-gray-200 focus:border-[#2B5AE8] focus:ring-4 focus:ring-[#2B5AE8]/10 text-gray-900 placeholder:text-gray-400 text-sm outline-none font-medium shadow-sm hover:border-gray-300"
    //               style={{ borderColor: errors.password ? '#ef4444' : '' }}
    //             />
    //             {errors.password && <p className="text-red-500 text-xs mt-1 pl-2 absolute -bottom-5">{errors.password}</p>}
    //           </div>

    //           {/* Remember me & Forgot Password */}
    //           <div className="flex items-center justify-between mt-3 px-1">
    //             <label className="flex items-center gap-2.5 cursor-pointer group">
    //               <div className="relative flex items-center justify-center">
    //                 <input
    //                   type="checkbox"
    //                   checked={rememberMe}
    //                   onChange={(e) => setRememberMe(e.target.checked)}
    //                   className="peer appearance-none w-5 h-5 border-2 border-gray-300 bg-white rounded-[6px] checked:bg-gray-900 checked:border-gray-900 transition-all cursor-pointer hover:border-gray-400"
    //                 />
    //                 <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    //                   <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    //                 </svg>
    //               </div>
    //               <span className="text-sm text-gray-500 group-hover:text-gray-900 transition-colors font-semibold">Remember me</span>
    //             </label>
    //             <a href="#" className="text-sm text-gray-500 hover:text-[#2B5AE8] hover:underline transition-colors font-bold">Forgot Password?</a>
    //           </div>

    //           {/* Submit Button */}
    //           <button
    //             type="submit"
    //             disabled={isSubmitting}
    //             className="w-full py-4 rounded-2xl mt-4 text-[#1b1f27] font-black text-[15px] tracking-wide transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_20px_rgba(206,255,103,0.3)] hover:shadow-[0_12px_25px_rgba(206,255,103,0.4)] flex items-center justify-center"
    //             style={{ backgroundColor: '#CEFF67' }}
    //           >
    //             {isSubmitting ? <span className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" /> : 'Sign In'}
    //           </button>

    //           {/* Divider */}
    //           <div className="flex items-center gap-4 mt-6 mb-4">
    //             <div className="flex-1 h-px bg-gray-200" />
    //             <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">OR Sign in with</span>
    //             <div className="flex-1 h-px bg-gray-200" />
    //           </div>

    //           {/* Social Icons (แบบวงกลมสวยๆ) */}
    //           <div className="flex justify-center gap-5">
    //             {/* Google */}
    //             <button 
    //               type="button" 
    //               onClick={() => handleSocialLogin('google')} 
    //               className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#2B5AE8] text-gray-500 hover:text-[#2B5AE8] transition-all hover:-translate-y-1"
    //             >
    //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    //                 <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064 5.96 5.96 0 014.123 1.632l2.877-2.877A9.994 9.994 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
    //               </svg>
    //             </button>

    //             {/* Facebook */}
    //             <button 
    //               type="button" 
    //               onClick={() => handleSocialLogin('facebook')} 
    //               className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#2B5AE8] text-gray-500 hover:text-[#2B5AE8] transition-all hover:-translate-y-1"
    //             >
    //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    //                 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    //               </svg>
    //             </button>

    //             {/* Twitter / X */}
    //             <button 
    //               type="button" 
    //               onClick={() => handleSocialLogin('twitter')} 
    //               className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#2B5AE8] text-gray-500 hover:text-[#2B5AE8] transition-all hover:-translate-y-1"
    //             >
    //               <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24">
    //                 <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    //               </svg>
    //             </button>
    //           </div>

    //           {/* Link to Register */}
    //           <p className="text-center text-sm text-gray-500 mt-6 font-medium">
    //             Don't have an account? <a href="/register" className="text-[#2B5AE8] font-bold hover:underline">Sign up now</a>
    //           </p>

    //         </form>
    //       </div>
    //     </div>

    //     {/* ================= ฝั่งขวา: TEXT INFO ================= */}
    //     <div className="hidden lg:flex w-1/2 items-center justify-center p-12 xl:p-20 relative">

    //       {/* ขีดเส้นคั่นกลางแบบสีวิ่ง */}
    //       <div className="absolute left-0 top-[15%] bottom-[15%] w-[2px] animated-vertical-divider rounded-full hidden lg:block opacity-90 shadow-[0_0_10px_rgba(43,90,232,0.3)] z-20"></div>

    //       <div className="max-w-[480px]">
    //         {/* Badge */}
    //         <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-gray-200 text-[11px] font-bold text-gray-500 mb-6 tracking-widest uppercase shadow-sm">
    //           Discover <span className="text-[#2B5AE8]">Live Music</span>
    //         </div>

    //         <h2 className="text-4xl xl:text-5xl font-black text-gray-900 mb-6 leading-[1.2] tracking-tight">
    //           Connect with the <br/> <span className="text-[#2B5AE8]">Live Rhythm</span> & Fans.
    //         </h2>

    //         <p className="text-lg text-gray-500 leading-relaxed font-medium">
    //           Dive into the ultimate hub for <span className="text-[#2B5AE8] font-bold">concert lovers</span>. Discover trending events, connect with passionate fans, and explore deep into your favorite <span className="text-[#2B5AE8] font-bold">artist's biology</span>.
    //         </p>

    //         {/* Social Proof Avatars */}
    //         <div className="mt-10 flex items-center gap-4">
    //           <div className="flex -space-x-3">
    //             <div className="w-11 h-11 rounded-full border-[3px] border-[#F9F8F3] bg-gray-200 shadow-sm">
    //               <img src="https://i.pravatar.cc/100?img=32" alt="user" className="w-full h-full rounded-full object-cover"/>
    //             </div>
    //             <div className="w-11 h-11 rounded-full border-[3px] border-[#F9F8F3] bg-gray-300 shadow-sm">
    //               <img src="https://i.pravatar.cc/100?img=12" alt="user" className="w-full h-full rounded-full object-cover"/>
    //             </div>
    //             <div className="w-11 h-11 rounded-full border-[3px] border-[#F9F8F3] bg-gray-400 shadow-sm">
    //               <img src="https://i.pravatar.cc/100?img=47" alt="user" className="w-full h-full rounded-full object-cover"/>
    //             </div>
    //             <div className="w-11 h-11 rounded-full border-[3px] border-[#F9F8F3] bg-[#CEFF67] shadow-sm flex items-center justify-center text-gray-900 font-bold text-[10px]">
    //               10k+
    //             </div>
    //           </div>
    //           <span className="text-sm font-bold text-gray-900">Fans already joined</span>
    //         </div>
    //       </div>

    //     </div>

    //   </main>

    // </div>
  )
}