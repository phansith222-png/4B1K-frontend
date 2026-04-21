import React, { useRef, useState } from 'react';
import { Plus, Music4, X } from 'lucide-react';
import { PostToolButton } from '../icon/icon'; // เช็ค path ให้ตรงกับโปรเจกต์ของคุณด้วยนะครับ
import useUserStore from '../stores/userStore';
import usePostStore from '../stores/postStore';


export default function PostCreator() {
    const [content, setContent] = useState(''); // State สำหรับเก็บข้อความที่พิมพ์
    const [files, setFiles] = useState([]); // เก็บไฟล์ที่จะส่งไป Backend
    const [imagePreviews, setImagePreviews] = useState([]); // เก็บ URL สำหรับแสดงตัวอย่างภาพ
    const fileInputRef = useRef(null); // ตัวอ้างอิงไปยัง input file
    
    const createPost = usePostStore(state => state.createPost)
    const user = useUserStore(state => state.user);


    // ฟังก์ชันเมื่อเลือกไฟล์
    const hdlFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;
        setFiles((prev) => [...prev,...selectedFiles])

        // สร้างพรีวิวทีละรูป
        const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
        
        // ล้างค่า input เพื่อให้สามารถเลือกรูปเดิมซ้ำได้ (ในกรณีที่เผลอลบไป)
        e.target.value = null;


    };

    // 2. ฟังก์ชันลบรูปบางรูปออกก่อนโพสต์
    const removeImage = (index) => {
        setFiles((prev) => prev.filter((item, i) => i !== index));
        setImagePreviews((prev) => prev.filter((item, i) => i !== index));
    };

    const hdlSubmitPost = async () => {
       if (!content.trim() && !files) 
        return

        try {
            const formData = new FormData();
            formData.append('content', content);
            
            // ✅ แก้ไข: วนลูปเพื่อใส่ไฟล์ทุกไฟล์ลงใน FormData
            // Backend จะได้รับเป็น Array ของไฟล์ใน key ที่ชื่อว่า 'images'
            files.forEach((file) => {
                formData.append('images', file); 
            });

            await createPost(formData);
            
            // ล้างข้อมูลทั้งหมดหลังโพสต์สำเร็จ
            setContent('');
            setFiles([]);
            setImagePreviews([]);
        } catch (error) {
            console.error("Create post failed:", error);
        }
    };

    return (
      <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
            {/* Input รับไฟล์ (ซ่อนไว้) */}
            <input 
                type="file" 
                multiple 
                className="hidden" 
                ref={fileInputRef} 
                onChange={hdlFileChange}
                accept="image/*"
            />

            <div className="flex gap-4">
                <img 
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=random&color=fff`} 
                    className="w-12 h-12 rounded-full border border-white/10 object-cover shrink-0" 
                    alt="User Avatar" 
                />
               
                <div className="flex-1">
                    <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share your concert vibes, ask questions, or find squad mates..." 
                        className="w-full bg-transparent border-none outline-none resize-none pt-2 text-lg text-white placeholder:text-gray-600 h-20 custom-scrollbar"
                    />

                    {/* ✅ ส่วนแสดงพรีวิว: จะโชว์ก็ต่อเมื่อมีการเลือกไฟล์มาแล้วเท่านั้น */}
                    {imagePreviews.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-4">
                            {imagePreviews.map((url, index) => (
                                <div key={index} className="relative w-24 h-24 group">
                                    <img 
                                        src={url} 
                                        className="w-full h-full object-cover rounded-xl border border-white/10 shadow-lg" 
                                        alt={`preview-${index}`} 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-md z-10"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex justify-between items-center mt-5 pt-5 border-t border-white/5">
                <div className="flex gap-2">
                    {/* ✅ เมื่อกดปุ่ม Media จะไปสั่งคลิก input file ที่ซ่อนอยู่ */}
                    <div onClick={() => fileInputRef.current.click()}>
                        <PostToolButton 
                            icon={<Plus size={18} />} 
                            label={files.length > 0 ? `Images (${files.length})` : "Media"} 
                        />
                    </div>
                    <PostToolButton icon={<Music4 size={18} />} label="Artist" />
                </div>
                
                <button 
                    onClick={hdlSubmitPost}
                    disabled={!content.trim() && files.length === 0}
                    className="bg-[#c6ff00] text-black px-8 py-3 rounded-full font-black text-sm hover:bg-white transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Post
                </button>
            </div>
        </div>
    );
}