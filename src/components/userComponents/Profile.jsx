import React from 'react'
import UserIcon from './UserIcon'

function Profile(props) {
    const { imgSrc } = props

    return (
        <div className="relative group flex items-center justify-center">
            {/* 1. Gradient border wrapper - Adjusted for subtle glow */}
            <div className="w-[42px] h-[42px] rounded-full p-[1.5px] bg-gradient-to-tr from-[#00E5FF]/80 via-[#7000FF]/80 to-[#00E5FF]/80 shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:scale-105 active:scale-100">
                
                {/* Inner background (to hide gradient leaving only border) */}
                <div className="w-full h-full rounded-full bg-[#0B0C10] overflow-hidden flex items-center justify-center">
                    {imgSrc ? (
                        <img 
                            src={imgSrc} 
                            alt="Profile" 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" // Reduce scale on hover
                        />
                    ) : (
                        // 2. Slightly reduce icon size
                        <UserIcon 
                            size={20} 
                            className="text-[#00E5FF]/70" // Reduce icon color saturation
                        />
                    )}
                </div>
            </div>
            
            {/* 3. Removed background glow effect for clean look */}
        </div>
    )
}

export default Profile
