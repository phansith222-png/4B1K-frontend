/**
 * 📌 ฟังก์ชันดึงสีให้ตรงกับ Theme ของแต่ละหมวดหมู่
 */
export const getCategoryStyle = (type) => {
    const t = (type || "").toLowerCase();
    if (t === 'all') return 'bg-gradient-to-br from-[#00E5FF] to-[#7000FF] text-white shadow-[0_10px_25px_rgba(0,229,255,0.3)] border border-white/20';
    if (t.includes('pop')) return 'bg-gradient-to-br from-[#FF00FF] to-[#7000FF] text-white shadow-[0_10px_20px_rgba(255,0,255,0.3)] border border-white/20';
    if (t.includes('rock')) return 'bg-gradient-to-br from-[#FF4D4D] to-[#D3131F] text-white shadow-[0_10px_20px_rgba(211,19,31,0.3)] border border-white/20';
    if (t.includes('hip') || t.includes('edm') || t.includes('rap')) return 'bg-gradient-to-br from-[#CEFF67] to-[#88B04B] text-black shadow-[0_10px_20px_rgba(206,255,103,0.3)] border border-black/10';
    if (t.includes('r&b') || t.includes('classic') || t.includes('soul')) return 'bg-gradient-to-br from-[#d83bb6] to-[#7000FF] text-white shadow-[0_10px_20px_rgba(216,59,182,0.3)] border border-white/20';
    return 'bg-gradient-to-br from-[#00E5FF] to-[#00A3FF] text-black shadow-[0_10px_20px_rgba(0,229,255,0.3)] border border-black/10'; // Default
};
