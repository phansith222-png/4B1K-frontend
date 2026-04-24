import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function StartSquadCard() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-[#FF007F]/10 to-transparent border border-[#FF007F]/20 rounded-3xl p-6 relative overflow-hidden group">
      {/* Background Effect */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#FF007F] rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity" />
      
      <h4 className="font-bold text-lg mb-2 relative z-10">Start a New Squad?</h4>
      <p className="text-xs text-gray-400 mb-5 relative z-10 leading-relaxed">Find rave mates and chat about your favorite concerts.</p>
      <button 
        onClick={() => navigate('/chat')}
        className="w-full bg-[#00F5D4] text-black py-3 rounded-2xl text-sm font-black hover:scale-[1.03] transition-transform relative z-10 shadow-[0_0_20px_rgba(0,245,212,0.3)]"
      >
        GO TO CHAT
      </button>
    </div>
  );
}
