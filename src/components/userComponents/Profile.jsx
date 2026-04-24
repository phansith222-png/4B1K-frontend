import React from 'react'
import UserIcon from './UserIcon'

function Profile(props) {
    const { imgSrc } = props

    return (
        <div className="relative group flex items-center justify-center">
            {/* 1. ตัวสร้างขอบ Gradient - ปรับให้ Glow เบาลงมาก */}
            <div className="w-[42px] h-[42px] rounded-full p-[1.5px] bg-gradient-to-tr from-[#00E5FF]/80 via-[#7000FF]/80 to-[#00E5FF]/80 shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:scale-105 active:scale-100">
                
                {/* พื้นหลังด้านใน (เพื่อบัง Gradient ให้เหลือแค่ขอบ) */}
                <div className="w-full h-full rounded-full bg-[#0B0C10] overflow-hidden flex items-center justify-center">
                    {imgSrc ? (
                        <img 
                            src={imgSrc} 
                            alt="Profile" 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" // ลด Scale ตอน Hover
                        />
                    ) : (
                        // 2. ปรับลดขนาดไอคอนลงเล็กน้อยเพื่อให้ดูไม่อึดอัด
                        <UserIcon 
                            size={20} 
                            className="text-[#00E5FF]/70" // ลดความสดของสีไอคอนลง
                        />
                    )}
                </div>
            </div>
            
            {/* 3. ลบเอฟเฟกต์แสงฟุ้งจางๆ ด้านหลังไอคอนออกเพื่อความคลีน */}
        </div>
    )
}

export default Profile
