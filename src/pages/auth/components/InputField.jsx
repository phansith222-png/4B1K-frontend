/**
 * Reusable styled input with inline validation error.
 * @param {{ type?:string, placeholder:string, registration:object, error?:object, className?:string }} props
 */
export function InputField({ type = 'text', placeholder, registration, error, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        placeholder={placeholder}
        {...registration}
        className="w-full bg-white/5 px-5 py-4 rounded-2xl transition-all duration-300 border border-white/5 focus:border-[#00E5FF] focus:ring-4 focus:ring-[#00E5FF]/20 text-white placeholder:text-gray-500 text-sm outline-none font-medium hover:border-white/15"
        style={{ borderColor: error ? '#ef4444' : '' }}
      />
      {error && (
        <p className="text-red-400 text-[10px] mt-1 pl-2 absolute -bottom-5">{error.message}</p>
      )}
    </div>
  )
}
