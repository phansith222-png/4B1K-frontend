import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0B0C10] pt-12 pb-8 px-6 md:px-10 font-sans text-white border-t border-white/10 relative z-10">
      <style>{`
        /* ================= เอฟเฟคสีวิ่ง (Animation) ================= */
        @keyframes runGradient {
          0% { background-position: 200% 0; }
          100% { background-position: 0% 0; }
        }

        /* โลโก้ตัวอักษร 4B1K สีวิ่ง (Neon Theme) */
        .footer-logo-animated {
          background: linear-gradient(120deg, #FFFFFF 0%, #FFFFFF 40%, #00E5FF 50%, #FFFFFF 60%, #FFFFFF 100%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: runGradient 4s linear infinite;
        }

        /* เส้นคั่นสีวิ่ง (Cyan - Magenta - Purple) */
        .divider-animated {
          background: linear-gradient(90deg, transparent, #00E5FF, #FF00FF, #7000FF, transparent);
          background-size: 200% auto;
          animation: runGradient 4s linear infinite;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ================= Top Section ================= */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-6">
          
          {/* Logo (ใส่ Class สีวิ่ง) */}
          <div className="text-[32px] font-black italic tracking-tighter footer-logo-animated cursor-pointer hover:opacity-80 transition-opacity pb-1">
            4B1K
          </div>

          {/* Links & Socials */}
          <div className="flex items-center gap-5 text-[12px] font-bold text-gray-400 uppercase tracking-widest">
            <a href="#" className="hover:text-[#00E5FF] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#FF00FF] transition-colors">Terms</a>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4 ml-3">
              {/* Twitter Icon */}
              <a href="#" className="text-gray-500 hover:text-[#00E5FF] transition-colors hover:-translate-y-1 transform duration-300" aria-label="Twitter">
                <svg className="w-[15px] h-[15px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              {/* Facebook Icon */}
              <a href="#" className="text-gray-500 hover:text-[#7000FF] transition-colors hover:-translate-y-1 transform duration-300" aria-label="Facebook">
                <svg className="w-[15px] h-[15px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              {/* Google+ Text Icon (Changed hover color to Magenta) */}
              <a href="#" className="text-gray-500 hover:text-[#FF00FF] transition-colors hover:-translate-y-1 transform duration-300 font-black text-[15px] tracking-tight" aria-label="Google Plus">
                G+
              </a>
            </div>
          </div>
        </div>

        {/* ================= Divider (Gradient Line ใส่ Class สีวิ่ง) ================= */}
        <div className="h-[2px] w-full divider-animated my-8 opacity-40"></div>

        {/* ================= Bottom Section ================= */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[12px]">
          
          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 font-bold text-gray-400 uppercase tracking-widest">
            <a href="#" className="hover:text-[#00E5FF] transition-colors">Features</a>
            <a href="#" className="hover:text-[#FF00FF] transition-colors">Concert event</a>
            <a href="#" className="hover:text-[#7000FF] transition-colors">Artist</a>
            <a href="#" className="hover:text-[#00E5FF] transition-colors">Our Works</a>
            <a href="#" className="hover:text-[#FF00FF] transition-colors">News</a>
            <a href="#" className="hover:text-[#7000FF] transition-colors">About us</a>
          </nav>

          {/* Copyright */}
          <div className="text-gray-600 font-bold uppercase tracking-widest text-[10px]">
            © 2026 4B1K. COOPERATION
          </div>
        </div>

      </div>

      {/* Ambient background glow for the footer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[#00E5FF] opacity-[0.03] blur-[60px] pointer-events-none"></div>
    </footer>
  );
}