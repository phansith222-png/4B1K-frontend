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

  // Tailwind Class สำหรบ Input ที่ดู Premium
  const inputClass = "w-full bg-white px-6 py-4 rounded-full border border-gray-100 shadow-inner focus:bg-white focus:border-[#CEFF67] focus:ring-2 focus:ring-[#CEFF67]/30 text-gray-900 placeholder:text-gray-400 text-sm outline-none font-medium transition-all duration-300 hover:border-gray-200 hover:shadow-sm";

  return (
    // เปลี่ยน Background เป็นสี Off-White ที่ดูแพงขึ้น และเพิ่ม Radial Gradient เบาๆ
    <div className="bg-[#F9F8F3] min-h-screen text-gray-900 pb-24 relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px', backgroundOpacity: '0.5' }}>
      
      {/* เพิ่ม Style สำหรับเส้นแนวนอนสีวิ่ง */}
      <style>{`
        @keyframes horizontalGradientRun {
          0% { background-position: 200% 0; }
          100% { background-position: 0% 0; }
        }
        .animated-horizontal-divider {
          background: linear-gradient(90deg, #2B5AE8, #CEFF67, #2B5AE8);
          background-size: 200% auto;
          animation: horizontalGradientRun 3s linear infinite;
        }
      `}</style>

      {/* เอฟเฟกต์แสง Background เพิ่มมิติ */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#CEFF67] rounded-full opacity-20 blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 -left-40 w-80 h-80 bg-[#2B5AE8] rounded-full opacity-10 blur-[100px] pointer-events-none"></div>

      {/* ================= HEADER ================= */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-8 pb-4">
        <div className="flex justify-between items-center bg-white/50 backdrop-blur-lg px-6 py-4 rounded-full border border-white/50 shadow-lg shadow-black/5">
            <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2.5 text-gray-500 hover:text-[#2B5AE8] font-semibold transition-all group"
            >
            <div className="bg-white p-2.5 rounded-full shadow border border-gray-100 group-hover:shadow-md group-hover:-translate-x-1 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </div>
            <span>Back to Home</span>
            </button>
            <div className="text-sm font-bold text-gray-400 tracking-widest uppercase">Edit Profile</div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 mt-12">
        
        {/* หัวข้อหน้า จัดกึ่งกลาง */}
        <div className="text-center mb-16">
        </div>

        {/* การ์ดฟอร์ม ทรงแคปซูลนุ่มๆ */}
        <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-gray-200/50 border border-gray-50 relative">
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-12">

            {/* ส่วนเปลี่ยนรูปโปรไฟล์ ดีไซน์ใหม่ */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                {/* วงกลมซ้อนกันเพิ่มมิติ */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#CEFF67] to-[#2B5AE8] opacity-20 blur-sm transform group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
                {/* รูป Profile */}
                <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full border-[6px] border-white shadow-2xl overflow-hidden bg-gray-100 ring-1 ring-gray-100">
                  <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  {/* Overlay ตอน Hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current.click()}>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                     </svg>
                  </div>
                </div>
                {/* ปุ่มกล้องถ่ายรูปด้านล่าง */}
                <button 
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-2 right-2 bg-white text-[#2B5AE8] p-3 rounded-full shadow-xl hover:scale-110 hover:text-white hover:bg-[#2B5AE8] transition-all border border-gray-100 cursor-pointer z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-extrabold text-gray-950 tracking-tight">John Doe</h3>
                <p className="text-sm text-[#2B5AE8] font-bold">@johndoe99</p>
              </div>
            </div>

            {/* ส่วนกรอกข้อมูล (Grid) จัดระเบียบใหม่ */}
            <div className="flex flex-col gap-10">
                
                {/* เส้นที่ 1 (Info) */}
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest -mb-4 flex items-center gap-3">
                    <span className="w-8 h-[2px] animated-horizontal-divider"></span>
                    Info
                    <span className="flex-1 h-[2px] animated-horizontal-divider"></span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* First Name */}
                <div className="space-y-2">
                    <label className="pl-5 text-sm font-bold text-gray-800">First Name</label>
                    <input type="text" name="firstname" value={profile.firstname} onChange={handleChange} className={inputClass} placeholder="John" />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                    <label className="pl-5 text-sm font-bold text-gray-800">Last Name</label>
                    <input type="text" name="lastname" value={profile.lastname} onChange={handleChange} className={inputClass} placeholder="Doe" />
                </div>
                </div>

                {/* เส้นที่ 2 (Contact) */}
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest -mb-4 mt-4 flex items-center gap-3">
                    <span className="w-8 h-[2px] animated-horizontal-divider"></span>
                    Contact
                    <span className="flex-1 h-[2px] animated-horizontal-divider"></span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Username */}
                <div className="space-y-2">
                    <label className="pl-5 text-sm font-bold text-gray-800">Username</label>
                    <div className="relative flex items-center group">
                        <span className="absolute left-6 text-gray-400 group-focus-within:text-[#2B5AE8] font-bold transition-colors">@</span>
                        <input type="text" name="username" value={profile.username} onChange={handleChange} className={`${inputClass} pl-12`} />
                    </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                    <label className="pl-5 text-sm font-bold text-gray-800">Phone Number</label>
                    <input type="text" name="phone" value={profile.phone} onChange={handleChange} className={inputClass} />
                </div>

                {/* Email (เต็มบรรทัด) */}
                <div className="md:col-span-2 space-y-2">
                    <label className="pl-5 text-sm font-bold text-gray-800">Email Address</label>
                    <input type="email" name="email" value={profile.email} onChange={handleChange} className={inputClass} />
                </div>

                {/* Bio (เต็มบรรทัด) */}
                <div className="md:col-span-2 space-y-2">
                    <label className="pl-5 text-sm font-bold text-gray-800">Bio / About me</label>
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
              <div className="absolute top-0 left-0 w-full h-[2px] animated-horizontal-divider"></div>
              <button 
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto px-10 py-4 rounded-full text-gray-600 font-bold hover:bg-gray-50 hover:text-gray-900 transition-all duration-300"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="relative overflow-hidden group w-full sm:w-auto px-12 py-4 rounded-full text-[#1b1f27] font-black text-base tracking-wide transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#CEFF67]/30 flex items-center justify-center min-w-[200px]"
                style={{ backgroundColor: '#CEFF67' }}
              >
                {/* เอฟเฟกต์ Shine ตอน Hover */}
                <div className="absolute inset-0 w-1/2 h-full bg-white opacity-20 skew-x-[-30deg] transform translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-700 pointer-events-none"></div>
                
                {loading ? (
                    <span className="w-6 h-6 border-4 border-gray-900/20 border-t-gray-900 rounded-full animate-spin" />
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