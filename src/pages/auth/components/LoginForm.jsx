import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../../validations/loginSchema'
import mainapi from '../../../api/auth'
import useUserStore from '../../../stores/userStore'
import { InputField } from './InputField'
import { GoogleButton } from './GoogleButton'
import { useCyberToast } from '../../../components/CyberToast'

/**
 * Login form panel — rendered on the LEFT half.
 * @param {{ onSwitch: () => void }} props
 */
export function LoginForm({ onSwitch }) {
  const navigate = useNavigate()
  const setUser = useUserStore((s) => s.setUser)
  const [apiError, setApiError] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const { showToast } = useCyberToast()

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })
  const { errors, isSubmitting } = formState

  const onSubmit = async (data) => {
    setApiError('')
    try {
      const resp = await mainapi.post('/auth/login', data)
      setUser(resp.data.user, resp.data.token)
      showToast('Login Success', 'success')
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid username or password.'
      setApiError(msg)
      showToast(msg, 'error')
    }
  }

  const onInvalid = (errors) => {
    const firstError = Object.values(errors)[0]
    if (firstError) {
      showToast(firstError.message, 'error')
    }
  }

  return (
    <div className="w-full max-w-[380px]">
      <h1 className="text-[38px] font-black text-white mb-2 tracking-tight">Sign In</h1>
      <p className="text-gray-400 mb-8 font-medium text-sm">
        Welcome back! Enter your credentials to continue.
      </p>


      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex flex-col gap-5" noValidate>
        <InputField
          type="text"
          placeholder="Username"
          registration={register('username')}
          error={errors.username}
        />
        <InputField
          type="password"
          placeholder="Password"
          registration={register('password')}
          error={errors.password}
          className="mt-1"
        />

        {/* Remember me & Forgot */}
        <div className="flex items-center justify-between mt-1 px-1">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="peer appearance-none w-5 h-5 border-2 border-white/20 bg-white/5 rounded-[6px] checked:bg-[#00E5FF] checked:border-[#00E5FF] transition-all cursor-pointer"
              />
              <svg className="absolute w-3.5 h-3.5 text-[#0B0C10] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors font-semibold">Remember me</span>
          </label>
          <a href="#" className="text-sm text-gray-400 hover:text-[#00E5FF] transition-colors font-bold">Forgot Password?</a>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-2xl mt-1 text-[#0B0C10] font-black text-[15px] tracking-wide transition-all duration-300 hover:-translate-y-0.5 shadow-[0_5px_20px_rgba(0,229,255,0.3)] hover:shadow-[0_8px_28px_rgba(0,229,255,0.45)] flex items-center justify-center disabled:opacity-70 bg-gradient-to-r from-[#00E5FF] to-[#00b8d4]"
        >
          {isSubmitting
            ? <span className="w-5 h-5 border-2 border-[#0B0C10]/30 border-t-[#0B0C10] rounded-full animate-spin" />
            : 'Sign In'}
        </button>

        <div className="flex items-center gap-4 mt-1">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <GoogleButton />

        {/* Mobile-only switch link */}
        <p className="lg:hidden text-center text-sm text-gray-400 mt-1 font-medium">
          Don&apos;t have an account?{' '}
          <button type="button" onClick={onSwitch} className="text-[#00E5FF] font-bold hover:underline transition-colors">
            Sign up now
          </button>
        </p>
      </form>
    </div>
  )
}
