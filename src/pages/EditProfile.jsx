import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ข้อมูลจำลองสำหรับ Profile
  const [profile, setProfile] = useState({
    firstname: 'John',
    lastname: 'Doe',
    username: 'johndoe99',
    email: 'john.doe@example.com',
    phone: '+66 81 234 5678',
    bio: 'Music lover. Concert goer. Always looking for the next live rhythm.',
  });

  // State สำหรับรูปพรีวิวโปรไฟล์
  const [previewImage, setPreviewImage] = useState('https://i.pravatar.cc/150?img=32');
  const [loading, setLoading] = useState(false);

  // จัดการการพิมพ์ในช่อง Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // จัดการเมื่อเลือกรูปภาพใหม่
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ฟังก์ชันบันทึกข้อมูล
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // จำลองการส่ง API
    setTimeout(() => {
      setLoading(false);
      navigate('/'); // บันทึกเสร็จกลับหน้าแรก
    }, 1500);
  };

  // Tailwind Class สำหรับ Input ในธีมมืดที่ดู Premium
  const inputClass = "w-full bg-[#1A1C23] px-6 py-4 rounded-full border border-white/5 focus:bg-[#1A1C23] focus:border-[#00E5FF] focus:ring-4 focus:ring-[#00E5FF]/20 text-white placeholder:text-gray-500 text-sm outline-none font-medium transition-all duration-300 hover:border-white/20";

  return (
    <div className="bg-[#0B0C10] min-h-screen text-white pb-24 relative overflow-hidden selection:bg-[#00E5FF] selection:text-black">
      
      {/* เพิ่ม Style สำหรับเส้นแนวนอนและพื้นหลัง */}
      <style>{`
        @keyframes horizontalGradientRun {
          0% { background-position: 200% 0; }
          100% { background-position: 0% 0; }
        }
        .animated-horizontal-divider {
          background: linear-gradient(90deg, #00E5FF, #FF00FF, #7000FF, #00E5FF);
          background-size: 200% auto;
          animation: horizontalGradientRun 4s linear infinite;
        }
        .dark-grain {
          position: fixed; inset: 0; opacity: 0.03; pointer-events: none; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
      `}</style>

      <div className="dark-grain" />

      {/* เอฟเฟกต์แสง Background เพิ่มมิติ */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#FF00FF] rounded-full opacity-10 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-[#00E5FF] rounded-full opacity-10 blur-[120px] pointer-events-none z-0"></div>

      {/* ================= HEADER ================= */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-8 pb-4">
        <div className="flex justify-between items-center bg-[#1A1C23]/60 backdrop-blur-lg px-6 py-4 rounded-full border border-white/5 shadow-lg shadow-[#00E5FF]/5">
            <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-gray-400 hover:text-[#00E5FF] font-semibold transition-all group"
            >
            <div className="bg-[#0B0C10] p-2.5 rounded-full border border-white/10 group-hover:border-[#00E5FF]/50 group-hover:shadow-[0_0_10px_rgba(0,229,255,0.3)] group-hover:-translate-x-1 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </div>
            <span>Back to Home</span>
            </button>
            <div className="text-sm font-bold text-[#FF00FF] tracking-widest uppercase">Edit Profile</div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 mt-12">
        
        {/* การ์ดฟอร์ม ทรงแคปซูลนุ่มๆ (Dark Theme) */}
        <div className="bg-[#12141A] rounded-[3rem] p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 relative">
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-12">

            {/* ส่วนเปลี่ยนรูปโปรไฟล์ ดีไซน์ใหม่ (Neon Glow) */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                {/* วงกลมซ้อนกันเพิ่มมิติ */}
                <div className="absolute inset-0 rounded-full animated-horizontal-divider opacity-50 blur-md transform group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
                {/* รูป Profile */}
                <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full border-[4px] border-[#0B0C10] overflow-hidden bg-[#1A1C23] z-10">
                  <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  {/* Overlay ตอน Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                     </svg>
                  </div>
                </div>
                {/* ปุ่มกล้องถ่ายรูปด้านล่าง */}
                <div className="absolute bottom-2 right-2 bg-[#0B0C10] text-[#00E5FF] p-3 rounded-full hover:scale-110 hover:text-white hover:bg-[#00E5FF] hover:shadow-[0_0_15px_rgba(0,229,255,0.5)] transition-all border border-white/10 z-20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-extrabold text-white tracking-tight">John Doe</h3>
                <p className="text-sm text-[#00E5FF] font-bold">@johndoe99</p>
              </div>
            </div>

            {/* ส่วนกรอกข้อมูล (Grid) จัดระเบียบใหม่ */}
            <div className="flex flex-col gap-10">
                
                {/* เส้นที่ 1 (Info) */}
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest -mb-4 flex items-center gap-4">
                    <span className="w-8 h-[2px] animated-horizontal-divider opacity-70"></span>
                    Personal Info
                    <span className="flex-1 h-[2px] animated-horizontal-divider opacity-70"></span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* First Name */}
                <div className="space-y-2">
                    <label className="pl-5 text-xs font-bold text-gray-400 uppercase tracking-wider">First Name</label>
                    <input type="text" name="firstname" value={profile.firstname} onChange={handleChange} className={inputClass} placeholder="John" />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                    <label className="pl-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Last Name</label>
                    <input type="text" name="lastname" value={profile.lastname} onChange={handleChange} className={inputClass} placeholder="Doe" />
                </div>
                </div>

                {/* เส้นที่ 2 (Contact) */}
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest -mb-4 mt-4 flex items-center gap-4">
                    <span className="w-8 h-[2px] animated-horizontal-divider opacity-70"></span>
                    Contact Info
                    <span className="flex-1 h-[2px] animated-horizontal-divider opacity-70"></span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Username */}
                <div className="space-y-2">
                    <label className="pl-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Username</label>
                    <div className="relative flex items-center group">
                        <span className="absolute left-6 text-gray-500 group-focus-within:text-[#00E5FF] font-bold transition-colors">@</span>
                        <input type="text" name="username" value={profile.username} onChange={handleChange} className={`${inputClass} pl-12`} />
                    </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                    <label className="pl-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
                    <input type="text" name="phone" value={profile.phone} onChange={handleChange} className={inputClass} />
                </div>

                {/* Email (เต็มบรรทัด) */}
                <div className="md:col-span-2 space-y-2">
                    <label className="pl-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                    <input type="email" name="email" value={profile.email} onChange={handleChange} className={inputClass} />
                </div>

                {/* Bio (เต็มบรรทัด) */}
                <div className="md:col-span-2 space-y-2">
                    <label className="pl-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Bio / About me</label>
                    <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    rows="4"
                    className={`${inputClass} resize-none rounded-3xl`}
                    placeholder="Tell us a little bit about yourself..."
                    ></textarea>
                </div>
                </div>
            </div>

            {/* เส้นที่ 3 (ล่างสุด) แบบสีวิ่ง */}
            <div className="relative flex flex-col sm:flex-row justify-end items-center gap-5 mt-8 pt-8">
              <div className="absolute top-0 left-0 w-full h-[2px] animated-horizontal-divider opacity-30"></div>
              <button 
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto px-10 py-4 rounded-full text-gray-400 font-bold hover:bg-[#1A1C23] hover:text-white border border-transparent hover:border-white/10 transition-all duration-300"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="relative overflow-hidden group w-full sm:w-auto px-12 py-4 rounded-full text-white font-black text-[15px] tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(112,0,255,0.4)] flex items-center justify-center min-w-[200px] disabled:opacity-70 bg-gradient-to-r from-[#00E5FF] to-[#7000FF]"
              >
                {/* เอฟเฟกต์ Shine ตอน Hover */}
                <div className="absolute inset-0 w-1/2 h-full bg-white opacity-20 skew-x-[-30deg] transform translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-700 pointer-events-none"></div>
                
                {loading ? (
                    <span className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <span className="relative z-10">Save Changes</span>
                )}
              </button>
            </div>

          </form>
        </div>

      </main>
    </div>
  );
}