import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import mainapi from "../api/auth";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const [status, setStatus] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    // ถ้าผู้ใช้ล็อกอินอยู่แล้ว (เช่น router remount หลังจาก setUser)
    // ให้กลับไปหน้า home ได้เลย ไม่ต้องถือว่าเป็นข้อผิดพลาด
    if (user) {
      navigate("/home", { replace: true });
      return;
    }

    if (ran.current) return;
    ran.current = true;

    async function handleCallback() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setStatus("error");
        setErrorMsg("No token received. OAuth login may have failed.");
        setTimeout(() => navigate("/login", { replace: true }), 2500);
        return;
      }

      try {
        const resp = await mainapi.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = resp.data.user;
        setUser(userData, token);
        // navigate() จะถูกเรียกจากการเช็ก user ด้านบนในการ render รอบถัดไป
      } catch (err) {
        console.error("OAuth callback error:", err);
        setStatus("error");
        setErrorMsg("Failed to complete login. Please try again.");
        setTimeout(() => navigate("/login", { replace: true }), 2500);
      }
    }

    handleCallback();
  }, [navigate, setUser, user]); // ให้รันใหม่เมื่อ state ของ user เปลี่ยน เพื่อให้ redirect ทำงานหลัง setUser

  if (status === "error") {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex flex-col items-center justify-center gap-4">
        <div className="size-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-2">
          <span className="text-red-400 text-xl font-bold">!</span>
        </div>
        <p className="text-red-400 font-semibold">{errorMsg}</p>
        <p className="text-gray-500 text-sm">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] flex flex-col items-center justify-center gap-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-100 bg-[#00E5FF] opacity-5 blur-[120px] rounded-full pointer-events-none" />
      <span className="size-10 border-2 border-white/10 border-t-[#00E5FF] rounded-full animate-spin" />
      <p className="text-white font-semibold text-lg tracking-wide">
        Signing you in...
      </p>
      <p className="text-gray-500 text-sm">Please wait a moment</p>
    </div>
  );
}
