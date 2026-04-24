export const avatarUrl = (name, img) => {
  if (!img) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&background=random&color=fff`;
  }
  
  // ถ้าเป็น Path ที่มาจาก Backend (เช่น /uploads/...) ให้เติม URL ของ Backend เข้าไป
  if (img.startsWith('/')) {
    return `http://localhost:5000${img}`;
  }
  
  return img;
};
