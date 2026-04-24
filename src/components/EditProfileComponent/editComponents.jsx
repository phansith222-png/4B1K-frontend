import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ตัวแปรสไตล์ที่ดึงมาจากไฟล์เดิมเป๊ะๆ
const inputContainer = "relative flex flex-col gap-2.5 mb-4 group";

const inputClass = (error) => `
    w-full bg-[#11131a]/80 backdrop-blur-xl px-6 py-4 rounded-[1.5rem] border transition-all duration-300 outline-none
    ${error 
        ? 'border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.15)] text-red-100' 
        : 'border-white/10 text-white hover:border-white/30'
    } 
    font-medium relative z-10
`;

// 1. Component: ข้อความ Error
export const ErrorMessage = ({ error }) => (
    <AnimatePresence>
        {error && (
            <motion.div 
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 mt-1 ml-4 text-red-500"
            >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-xs md:text-sm font-bold uppercase tracking-wide">
                    {error.message}
                </span>
            </motion.div>
        )}
    </AnimatePresence>
);

// 2. Component: ส่วนอัปโหลดรูปภาพ
export const AvatarUpload = ({ previewImage, fileInputRef, handleImageChange }) => (
    <section className="flex flex-col items-center">
        <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#00E5FF] to-[#7000FF] rounded-full opacity-30 group-hover:opacity-100 blur-[20px] transition duration-500" />
            <div className="relative w-40 h-40 rounded-full border-4 border-[#0B0C10] overflow-hidden bg-[#1A1C23] z-10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div
                    onClick={() => fileInputRef.current.click()}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Change</span>
                </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} hidden accept="image/*" />
        </div>
    </section>
);

// 3. Component: ช่องกรอกข้อมูลทั่วไป
export const ProfileInput = ({ label, id, type = "text", placeholder, register, error, focusedInput, setFocusedInput, ...props }) => (
    <div className={inputContainer}>
        <label className="text-[10px] font-black text-gray-400 uppercase ml-6 tracking-[0.2em] mb-1">{label}</label>
        <div className={`animated-border-box ${focusedInput === id && !error ? 'active' : ''}`}>
            <input 
                type={type}
                {...register(id)} 
                onFocus={() => setFocusedInput(id)}
                onBlur={() => setFocusedInput(null)}
                className={inputClass(error)} 
                placeholder={placeholder} 
                {...props}
            />
        </div>
        <ErrorMessage error={error} />
    </div>
);

// 4. Component: ช่องเลือกข้อมูล (Dropdown)
export const ProfileSelect = ({ label, id, register, error, focusedInput, setFocusedInput, options }) => (
    <div className={inputContainer}>
        <label className="text-[10px] font-black text-gray-400 uppercase ml-6 tracking-[0.2em] mb-1">{label}</label>
        <div className={`animated-border-box ${focusedInput === id && !error ? 'active' : ''}`}>
            <select 
                {...register(id)} 
                onFocus={() => setFocusedInput(id)}
                onBlur={() => setFocusedInput(null)}
                className={`${inputClass(error)} appearance-none cursor-pointer`}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#12141A]">
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>
        </div>
        <ErrorMessage error={error} />
    </div>
);
