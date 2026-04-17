import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';
import { useForm } from 'react-hook-form';
import { profileSchema } from '../validations/profileSchema';
import { motion, AnimatePresence } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadToCloudinary } from '../utils/uploadCloud';
import { toast } from 'react-toastify';
export default function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user, editProfile, getProfile } = useUserStore();

  useEffect(() => {
    getProfile()
  }, [])
  // State สำหรับรูปพรีวิวโปรไฟล์
  const [previewImage, setPreviewImage] = useState(user?.profileImage || 'https://i.pravatar.cc/150?img=32');
  const [selectedFile, setSelectedFile] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      Gender: user?.gender || '',
      nationalId: user?.nationalId || '',
      username: user?.username || '',
      telephone: user?.telephone || '',
      email: user?.email || '',
      // bio: user?.bio || '',
    }
  });

  // จัดการเมื่อเลือกรูปภาพใหม่
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ฟังก์ชันบันทึกข้อมูล
  const onSubmit = async (data) => {
    try {
      let imageUrl = user?.profileImage; // ใช้รูปเดิมเป็นค่าเริ่มต้น

      // ถ้ามีการเลือกไฟล์ใหม่ ให้โหลดขึ้น Cloudinary ก่อน
      if (selectedFile) {
        const cloudUrl = await uploadToCloudinary(selectedFile);
        if (cloudUrl) {
          imageUrl = cloudUrl;
        }
      }

      // ส่งข้อมูลทั้งหมดรวมถึง URL รูปใหม่ไปยัง Backend
      const finalData = { ...data, profileImage: imageUrl };
      const success = await editProfile(finalData);

      if (success) {
        // แนะนำให้ Refresh profile ใน store หลังจากแก้เสร็จ
        await getProfile(); 
        setTimeout(() => {
          navigate(-1);
        }, 500);
      }
    } catch (error) {
      console.error("Update profile failed:", error);
    }
  };

  const inputContainer = "relative flex flex-col gap-2.5 mb-2";

// ปรับปรุงคลาส Input ให้เน้นขอบแดงชัดๆ เมื่อมี Error
const inputClass = (error) => `
  w-full bg-[#1A1C23] px-6 py-4 rounded-2xl border-2 transition-all duration-300 outline-none
  ${error 
    ? 'border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.1)] focus:border-red-500' 
    : 'border-white/5 focus:border-[#00E5FF] focus:ring-4 focus:ring-[#00E5FF]/10 hover:border-white/20'
  } 
  text-white font-medium
`;
const ErrorMessage = ({ error }) => (
    <AnimatePresence>
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-2 mt-2 ml-2 text-red-500"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-sm md:text-base font-black uppercase tracking-tighter">
            {error.message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="bg-[#0B0C10] min-h-screen text-white pb-24 relative overflow-x-hidden font-sans"
    >
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#7000FF]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#00E5FF]/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-10">
        
        {/* Header Section - Perfect Centering */}
        <div className="relative flex items-center justify-between mb-16">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-20"
          >
            <div className="p-2.5 rounded-full bg-white/5 group-hover:bg-[#00E5FF]/20 transition-all border border-white/5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="font-bold uppercase text-xs tracking-widest hidden sm:inline">Cancel</span>
          </button>

          <h1 className="absolute left-1/2 -translate-x-1/2 text-xl md:text-2xl font-black tracking-[0.2em] uppercase text-[#00E5FF] whitespace-nowrap z-10">
            Profile Settings
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* 1. Avatar Update */}
          <section className="flex flex-col items-center">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#00E5FF] to-[#7000FF] rounded-full opacity-30 group-hover:opacity-100 blur-lg transition duration-500" />
              <div className="relative w-36 h-36 rounded-full border-4 border-[#0B0C10] overflow-hidden bg-[#1A1C23] z-10">
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} hidden accept="image/*" />
            </div>
          </section>

          {/* 2. Form Grid */}
          <div className="bg-[#12141A]/90 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-8 md:p-14 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              
              {/* Personal Info fields with Big Errors */}
              <div className={inputContainer}>
                <label className="text-[10px] font-black text-gray-500 uppercase ml-5 tracking-[0.2em]">First Name</label>
                <input {...register("firstName")} className={inputClass(errors.firstName)} placeholder="Your name" />
                <ErrorMessage error={errors.firstName} />
              </div>

              <div className={inputContainer}>
                <label className="text-[10px] font-black text-gray-500 uppercase ml-5 tracking-[0.2em]">Last Name</label>
                <input {...register("lastName")} className={inputClass(errors.lastName)} placeholder="Your surname" />
                <ErrorMessage error={errors.lastName} />
              </div>

              <div className={inputContainer}>
                <label className="text-[10px] font-black text-gray-500 uppercase ml-5 tracking-[0.2em]">National ID</label>
                <input {...register("nationalId")} className={inputClass(errors.nationalId)} placeholder="13 digits" />
                <ErrorMessage error={errors.nationalId} />
              </div>

              <div className={inputContainer}>
                <label className="text-[10px] font-black text-gray-500 uppercase ml-5 tracking-[0.2em]">Gender</label>
                <select {...register("Gender")} className={inputClass(errors.gender)}>
                  <option value="MALE" className="bg-[#1A1C23]">Male</option>
                  <option value="FEMALE" className="bg-[#1A1C23]">Female</option>
                  <option value="OTHER" className="bg-[#1A1C23]">Other</option>
                </select>
                <ErrorMessage error={errors.gender} />
              </div>

              <div className="md:col-span-2 py-4">
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>

              <div className={inputContainer}>
                <label className="text-[10px] font-black text-gray-500 uppercase ml-5 tracking-[0.2em]">Phone Number</label>
                <input {...register("telephone")} className={inputClass(errors.telephone)} placeholder="08x-xxx-xxxx" />
                <ErrorMessage error={errors.telephone} />
              </div>

              <div className={inputContainer}>
                <label className="text-[10px] font-black text-gray-500 uppercase ml-5 tracking-[0.2em]">Email Address</label>
                <input type="email" {...register("email")} className={inputClass(errors.email)} placeholder="example@mail.com" />
                <ErrorMessage error={errors.email} />
              </div>

              {/* <div className={`${inputContainer} md:col-span-2`}>
                <label className="text-[10px] font-black text-gray-500 uppercase ml-5 tracking-[0.2em]">Bio</label>
                <textarea {...register("bio")} rows={3} className={`${inputClass(errors.bio)} resize-none rounded-3xl`} placeholder="Write something about yourself..." />
                <ErrorMessage error={errors.bio} />
              </div> */}
            </div>

            {/* Save Button */}
            <div className="mt-16 flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative px-20 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] to-[#7000FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 group-hover:text-white transition-colors">
                  {isSubmitting ? "Processing..." : "Save Changes"}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}