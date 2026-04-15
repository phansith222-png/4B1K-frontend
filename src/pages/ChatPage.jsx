import React, { useState } from 'react';

export default function ChatPage() {
  // ข้อมูลจำลองสำหรับรายชื่อแชท
  const [activeChat, setActiveChat] = useState(1);
  const contacts = [
    { id: 1, name: 'DJ_AstroNinja', message: 'เจอกันที่งาน Nebula นะ!', time: '5m', unread: 2, avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Blackpink Fanclub', message: 'มีใครกดบัตรได้บ้างมั้ย?', time: '1h', unread: 0, avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'LANY Squad', message: 'เจอกันหน้าฮอลล์ตอน 5 โมง', time: '2h', unread: 0, avatar: 'https://i.pravatar.cc/150?u=3' },
  ];

  return (
    // ปรับความสูงให้พอดีกับหน้าจอ หักลบ Navbar (สมมติ Navbar สูงประมาณ 80px)
    <div className="flex h-[calc(100vh-80px)] w-full bg-[#09090b] text-white overflow-hidden p-4 gap-4">
      
      {/* Sidebar: รายชื่อคนคุย */}
      <div className="w-1/3 max-w-sm bg-[#121212] rounded-2xl border border-white/5 flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-[#c6ff00]">
            Messages
          </h2>
          <button className="btn btn-circle btn-sm btn-ghost text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <label className="input input-bordered flex items-center gap-2 bg-[#1a1a1a] border-white/10 rounded-xl focus-within:border-[#c6ff00] focus-within:ring-1 focus-within:ring-[#c6ff00]/50 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-50"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
            <input type="text" className="grow text-sm" placeholder="Search rave mates..." />
          </label>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-thin scrollbar-thumb-white/10">
          {contacts.map((contact) => (
            <div 
              key={contact.id}
              onClick={() => setActiveChat(contact.id)}
              className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 ${activeChat === contact.id ? 'bg-white/10 shadow-md' : 'hover:bg-white/5'}`}
            >
              <div className="avatar">
                <div className="w-12 rounded-full ring ring-offset-base-100 ring-offset-2 ring-transparent">
                  <img src={contact.avatar} alt="avatar" />
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-sm truncate">{contact.name}</h3>
                  <span className="text-xs text-gray-500">{contact.time}</span>
                </div>
                <p className={`text-xs truncate ${contact.unread > 0 ? 'text-white font-medium' : 'text-gray-500'}`}>
                  {contact.message}
                </p>
              </div>
              {contact.unread > 0 && (
                <div className="badge border-none bg-[#c6ff00] text-black font-bold text-xs p-1">
                  {contact.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-[#121212] rounded-2xl border border-white/5 flex flex-col shadow-xl relative overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/5 flex items-center gap-4 bg-white/5 backdrop-blur-md z-10">
          <div className="avatar online">
            <div className="w-10 rounded-full">
              <img src="https://i.pravatar.cc/150?u=1" alt="active" />
            </div>
          </div>
          <div>
            <h2 className="font-bold">DJ_AstroNinja</h2>
            <p className="text-xs text-[#c6ff00]">Active now</p>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="btn btn-circle btn-sm btn-ghost hover:bg-white/10"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0l6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.614c.11.459-.026.93-.356 1.229l-1.993 1.992c1.4 2.8 3.7 5.1 6.5 6.5l1.992-1.993c.3-.33.77-.466 1.229-.356l4.614 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" /></svg></button>
            <button className="btn btn-circle btn-sm btn-ghost hover:bg-white/10"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-2 scrollbar-thin scrollbar-thumb-white/10">
          
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-8 rounded-full">
                <img alt="Tailwind CSS chat bubble component" src="https://i.pravatar.cc/150?u=1" />
              </div>
            </div>
            <div className="chat-bubble bg-[#1a1a1a] text-white">นายไปงาน Nebula Festival ใช่มั้ย?</div>
            <div className="chat-footer opacity-50 text-xs mt-1">12:45</div>
          </div>

          <div className="chat chat-end">
            <div className="chat-bubble bg-gradient-to-r from-[#c6ff00] to-[#b0e600] text-black font-medium">ใช่ๆ ไปกับแก๊งค์เพื่อน 3 คน นายไปป่าว?</div>
            <div className="chat-footer opacity-50 text-xs mt-1">12:47</div>
          </div>

          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-8 rounded-full">
                <img alt="Tailwind CSS chat bubble component" src="https://i.pravatar.cc/150?u=1" />
              </div>
            </div>
            <div className="chat-bubble bg-[#1a1a1a] text-white">ไปดิๆ งั้นเดี๋ยวเจอกันที่งานนะ!</div>
            <div className="chat-footer opacity-50 text-xs mt-1">12:50</div>
          </div>

        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/5 bg-[#121212]">
          <div className="flex items-center gap-3 bg-[#1a1a1a] p-2 rounded-2xl border border-white/10 focus-within:border-[#c6ff00] transition-colors">
            <button className="btn btn-circle btn-sm btn-ghost text-gray-400 hover:text-[#c6ff00]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </button>
            <input type="text" placeholder="Type a message..." className="input input-sm flex-1 bg-transparent border-none focus:outline-none text-white placeholder-gray-500" />
            <button className="btn btn-circle btn-sm bg-[#c6ff00] hover:bg-[#b0e600] border-none text-black">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1"><path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" /></svg>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

