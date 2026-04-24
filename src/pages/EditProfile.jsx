import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';
import { useForm } from 'react-hook-form';
import { profileSchema } from '../validations/profileSchema';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadToCloudinary } from '../utils/uploadCloud';
import { useCyberToast } from '../components/CyberToast';
// 📌 Import Components ที่แยกไว้
import { AvatarUpload, ProfileInput, ProfileSelect } from '../components/EditProfileComponent/editComponents';

export default function EditProfile() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const { user, editProfile, getProfile } = useUserStore();
    const { showToast } = useCyberToast();

    useEffect(() => {
        getProfile()
    }, [])

    const [previewImage, setPreviewImage] = useState(user?.profileImage || 'https://i.pravatar.cc/150?img=32');
    const [selectedFile, setSelectedFile] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null); // สำหรับทำเส้นวิ่ง

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(profileSchema),
        mode: 'onTouched',
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            gender: user?.gender || '',
            nationalId: user?.nationalId || '',
            username: user?.username || '',
            telephone: user?.telephone || '',
            email: user?.email || '',
        }
    });

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

    const onSubmit = async (data) => {
        try {
            let imageUrl = user?.profileImage;

            if (selectedFile) {
                const cloudUrl = await uploadToCloudinary(selectedFile);
                if (cloudUrl) {
                    imageUrl = cloudUrl;
                }
            }

            const finalData = { ...data, profileImage: imageUrl };
            const result = await editProfile(finalData);
            
            if (result.success) {
                await getProfile(); 
                showToast("Edit Success", "success");
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                showToast(result.error, "error");
            }
        } catch (error) {
            console.error("Update profile failed:", error);
            showToast('Failed to update profile.', 'error');
        }
    };

    const onInvalid = (errors) => {
        const firstError = Object.values(errors)[0];
        if (firstError) {
            showToast(firstError.message, 'error');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-[#0B0C10] min-h-screen text-white pb-24 relative overflow-hidden font-sans"
        >
            {/* Custom Styles for Animated Border */}
            <style>{`
                .animated-border-box {
                    position: relative;
                    border-radius: 1.5rem;
                    background: transparent;
                }
                .animated-border-box::before {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    border-radius: 1.6rem;
                    background: conic-gradient(from var(--angle), transparent 20%, #00E5FF, #7000FF, transparent 80%);
                    animation: spin 3s linear infinite;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    z-index: 0;
                }
                .animated-border-box.active::before { opacity: 0.15; }
                @property --angle {
                    syntax: '<angle>';
                    initial-value: 0deg;
                    inherits: false;
                }
                @keyframes spin {
                    from { --angle: 0deg; }
                    to { --angle: 360deg; }
                }
                .dark-grain {
                    position: fixed; inset: 0; opacity: 0.03; pointer-events: none; z-index: 50;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                }
            `}</style>
            <div className="dark-grain" />

            {/* Background Ambient Decor (ขยับช้าๆ) */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div 
                    animate={{ x: [0, 50, -30, 0], y: [0, -30, 50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[5%] right-[10%] w-[500px] h-[500px] bg-[#7000FF] opacity-[0.08] blur-[150px] rounded-full" 
                />
                <motion.div 
                    animate={{ x: [0, -40, 30, 0], y: [0, 40, -20, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[5%] left-[5%] w-[600px] h-[600px] bg-[#00E5FF] opacity-[0.08] blur-[150px] rounded-full" 
                />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 pt-16">
                
                {/* Header Section */}
                <div className="relative flex items-center justify-between mb-20">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-3 text-gray-400 hover:text-[#00E5FF] transition-colors z-20"
                    >
                        <div className="p-3 rounded-full bg-[#1A1C23]/80 backdrop-blur-md group-hover:bg-[#00E5FF]/10 transition-all border border-white/5 group-hover:border-[#00E5FF]/50 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </div>
                        <span className="font-bold uppercase text-xs tracking-widest hidden sm:inline">Back</span>
                    </button>

                    <div className="absolute left-1/2 -translate-x-1/2 text-center">
                        <span className="text-[#00E5FF] font-black text-[10px] uppercase tracking-[0.3em] block mb-1">Configuration</span>
                        <h1 className="text-2xl md:text-3xl font-black tracking-[0.1em] uppercase text-white whitespace-nowrap z-10">
                            Edit Profile
                        </h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-12">
                    
                    {/* 1. Avatar Update (รูปโปรไฟล์) */}
                    <AvatarUpload 
                        previewImage={previewImage}
                        fileInputRef={fileInputRef}
                        handleImageChange={handleImageChange}
                    />

                    {/* 2. Form Grid (ฟอร์มกรอกข้อมูล) */}
                    <div className="bg-[#12141A]/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 md:p-14 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
                        
                        {/* แสง Glow ด้านในกล่องฟอร์ม */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7000FF] opacity-[0.03] blur-[80px] rounded-full pointer-events-none"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 relative z-10">
                            
                            <ProfileInput id="firstName" label="First Name" placeholder="Your name" register={register} error={errors.firstName} focusedInput={focusedInput} setFocusedInput={setFocusedInput} />
                            
                            <ProfileInput id="lastName" label="Last Name" placeholder="Your surname" register={register} error={errors.lastName} focusedInput={focusedInput} setFocusedInput={setFocusedInput} />
                            
                            <ProfileInput 
                                id="nationalId" 
                                label="National ID" 
                                placeholder="13 digits" 
                                register={register} 
                                error={errors.nationalId} 
                                focusedInput={focusedInput} 
                                setFocusedInput={setFocusedInput} 
                                maxLength={13}
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                }}
                            />
                            
                            <ProfileSelect 
                                id="gender" label="Gender" register={register} error={errors.gender} focusedInput={focusedInput} setFocusedInput={setFocusedInput}
                                options={[
                                    { value: "MALE", label: "Male" },
                                    { value: "FEMALE", label: "Female" },
                                    { value: "OTHER", label: "Other" }
                                ]}
                            />

                            <div className="md:col-span-2 py-4">
                                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            </div>

                            <ProfileInput 
                                id="telephone" 
                                label="Phone Number" 
                                placeholder="08xxxxxxxx" 
                                register={register} 
                                error={errors.telephone} 
                                focusedInput={focusedInput} 
                                setFocusedInput={setFocusedInput} 
                                maxLength={10}
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                }}
                            />
                            
                            <ProfileInput id="email" type="email" label="Email Address" placeholder="example@mail.com" register={register} error={errors.email} focusedInput={focusedInput} setFocusedInput={setFocusedInput} />
                        </div>

                        {/* Save Button */}
                        <div className="mt-16 flex justify-center relative z-10">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group relative px-20 py-5 bg-[#0B0C10] text-white border border-white/10 font-black uppercase tracking-[0.2em] rounded-[1.5rem] overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-[0_15px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(0,229,255,0.2)]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] to-[#7000FF] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute inset-[2px] bg-[#12141A] rounded-[1.4rem] transition-colors duration-500 group-hover:bg-transparent" />
                                <span className="relative z-10 group-hover:text-white transition-colors duration-500 text-sm">
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
