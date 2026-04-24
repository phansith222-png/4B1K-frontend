import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerFrontendSchema } from '../../../validations/registerSchema'
import mainapi from '../../../api/auth'
import { InputField } from './InputField'
import { GoogleButton } from './GoogleButton'
import { useCyberToast } from '../../../components/CyberToast'

/**
 * Register form panel — rendered on the RIGHT half.
 * @param {{ onSwitch: () => void }} props
 */
export function RegisterForm({ onSwitch }) {
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const { showToast } = useCyberToast()

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(registerFrontendSchema),
    defaultValues: {
      email: '', telephone: '', username: '',
      password: '', confirmPassword: '',
      firstName: '', lastName: '',
      profileImage: '', nationalId: '',
    },
  })
  const { errors, isSubmitting } = formState

  const onSubmit = async (values) => {
    setApiError('')
    try {
      await mainapi.post('/auth/register', {
        username: values.username,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
        confirmPassword: values.confirmPassword,
        email: values.email,
        telephone: values.telephone || undefined,
        profileImage: values.profileImage || null,
        nationalId: values.nationalId || null,
      })
      showToast('Register Success', 'success')
      setTimeout(() => navigate('/home'), 2000)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.'
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
    <div className="w-full max-w-[420px]">
      <h1 className="text-[38px] font-black text-white mb-2 tracking-tight">Create Account</h1>
      <p className="text-gray-400 mb-6 font-medium text-sm">
        Join 10,000+ concert fans — completely free!
      </p>


      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <InputField type="text" placeholder="First name *" registration={register('firstName')} error={errors.firstName} />
          <InputField type="text" placeholder="Last name *" registration={register('lastName')} error={errors.lastName} />
        </div>
        <InputField type="text" placeholder="Username *" registration={register('username')} error={errors.username} className="mt-1" />
        <InputField type="email" placeholder="Email address *" registration={register('email')} error={errors.email} className="mt-1" />
        <InputField 
          type="tel" 
          placeholder="Phone number (optional)" 
          registration={register('telephone')} 
          error={errors.telephone} 
          className="mt-1" 
          maxLength={10}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
          }}
        />
        <div className="grid grid-cols-2 gap-3 mt-1">
          <InputField type="password" placeholder="Password *" registration={register('password')} error={errors.password} />
          <InputField type="password" placeholder="Confirm password *" registration={register('confirmPassword')} error={errors.confirmPassword} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-2xl mt-2 text-[#0B0C10] font-black text-[15px] tracking-wide transition-all duration-300 hover:-translate-y-0.5 shadow-[0_5px_20px_rgba(0,229,255,0.3)] hover:shadow-[0_8px_28px_rgba(0,229,255,0.45)] flex items-center justify-center disabled:opacity-70 bg-gradient-to-r from-[#00E5FF] to-[#00b8d4]"
        >
          {isSubmitting
            ? <span className="animate-spin inline-block w-5 h-5 border-2 border-[#0B0C10]/30 border-t-[#0B0C10] rounded-full" />
            : 'Create Account'}
        </button>

        <div className="flex items-center gap-4 mt-1">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <GoogleButton />

        {/* Mobile-only switch link */}
        <p className="lg:hidden text-center text-sm text-gray-400 mt-1 font-medium">
          Already have an account?{' '}
          <button type="button" onClick={onSwitch} className="text-[#00E5FF] font-bold hover:underline transition-colors">
            Sign in now
          </button>
        </p>
      </form>
    </div>
  )
}
