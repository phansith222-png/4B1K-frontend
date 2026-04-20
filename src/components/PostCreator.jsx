import React, { useRef, useState } from 'react';
import { Plus, Music4 } from 'lucide-react';
import { PostToolButton } from '../icon/icon'; // เช็ค path ให้ตรงกับโปรเจกต์ของคุณด้วยนะครับ
import useUserStore from '../stores/userStore';
import usePostStore from '../stores/postStore';

// ถ้ามี Store สำหรับสร้างโพสต์แล้ว ให้ import มาเตรียมไว้เลยครับ
// import usePostStore from '../store/postStore';
// import useUserStore from '../store/userStore';

export default function PostCreator() {
    const [content, setContent] = useState(''); // State สำหรับเก็บข้อความที่พิมพ์
    const [files, setFiles] = useState([]); // เก็บไฟล์ที่จะส่งไป Backend
    const [imagePreviews, setImagePreviews] = useState([]); // เก็บ URL สำหรับแสดงตัวอย่างภาพ
    const fileInputRef = useRef(null); // ตัวอ้างอิงไปยัง input file
    
    const createPost = usePostStore(state => state.createPost)
    const user = useUserStore(state => state.user);


    // ฟังก์ชันเมื่อเลือกไฟล์
    const hdlFileChange = (e) => {
        const selectedFile = Array.form(e.target.files[0]);
        setFiles((prev) => [...prev,selectedFile])

        const newPreviews = selectedFile.map()
        setImagePreviews((prev) => [...prev, ...newPreviews])
    };

    const hdlSubmitPost = async () => {
       if (!content.trim() && !files) return; 

        try {
            // สร้าง FormData เพราะมีการส่งไฟล์รูปภาพ
            const formData = new FormData();
            formData.append('content', content);
            if (file) {
                formData.append('image', file); // ชื่อ key 'image' ต้องตรงกับที่ Backend รับ
            }
            await createPost(formData);
            // ล้างข้อมูลหลังโพสต์สำเร็จ
            setContent('');
            setFiles(null);
            setImagePreviews(null);
        } catch (error) {
            console.error("Create post failed:", error);
        }
    };

    return (
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
            <div className="flex gap-4">
                {/* ถ้าดึง User มาได้แล้ว ให้ใช้แท็ก img ด้านล่างนี้แทนครับ */}
                         <img 
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=random&color=fff`} 
                    className="w-12 h-12 rounded-full border border-white/10 object-cover shrink-0" 
                    alt={user?.username || 'User Avatar'} 
                />
               
                <textarea 
                    value={content} // ผูกค่ากับ State
                    onChange={(e) => setContent(e.target.value)} // อัปเดต State ทุกครั้งที่พิมพ์
                    placeholder="Share your concert vibes, ask questions, or find squad mates..." 
                    className="w-full bg-transparent border-none outline-none resize-none pt-2 text-lg text-white placeholder:text-gray-600 h-20 custom-scrollbar"
                />
            </div>
            
            <div className="flex justify-between items-center mt-5 pt-5 border-t border-white/5">
                <div className="flex gap-2">
                    <PostToolButton icon={<Plus size={18} />} label="Media" />
                    <PostToolButton icon={<Music4 size={18} />} label="Artist" />
                </div>
                
                <button 
                    onClick={hdlSubmitPost}
                    disabled={!content.trim()} // ปิดปุ่มไว้ถ้ายังไม่ได้พิมพ์อะไร (ช่วยกันบั๊กได้ดีมาก)
                    className="bg-[#c6ff00] text-black px-8 py-3 rounded-full font-black text-sm hover:bg-white transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Post
                </button>
            </div>
        </div>
    );
}