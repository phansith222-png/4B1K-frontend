import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import useUserStore from "../stores/userStore";
import MainLayout from "../layouts/MainLayout"; // 1. Import MainLayout เข้ามา
import UserLayout from "../layouts/UserLayout";

const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const NewEvent = lazy(() => import("../pages/NewEvent"));
const EditProfile = lazy(() => import("../pages/EditProfile"));

// 2. ปรับแก้ guestRouter โดยเอา MainLayout ครอบไว้ด้านนอกสุด
const guestRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // ให้ MainLayout เป็นหน้าหลัก
    children: [
      { path: "/", element: <Navigate to="/login" replace /> },
      { path: "login", Component: Login }, // ลบ / ด้านหน้าออกเพื่อให้ต่อจาก path หลัก
      { path: "register", Component: Register },
      { path: "new-event", Component: NewEvent },
      { path: "*", element: <Navigate to="/login" replace /> },
      { path: "editprofile", Component: EditProfile },
    ],
  },
]);

// 3. ปรับแก้ userRouter ให้มี UserLayout ครอบเช่นเดียวกัน
const userRouter = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        path: "/",
        element: (
          <div className="text-black p-10 mt-20">Home (coming soon)</div>
        ),
      },
      // เพิ่มบรรทัดนี้: ตั้งค่า Path สำหรับหน้า EditProfile
      { path: "editprofile", Component: EditProfile },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export default function AppRouter() {
  const user = useUserStore((state) => state.user);
  const router = user ? userRouter : guestRouter;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#111418] flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-white" />
        </div>
      }
    >
      <RouterProvider key={user?.id} router={router} />
    </Suspense>
  );
}
