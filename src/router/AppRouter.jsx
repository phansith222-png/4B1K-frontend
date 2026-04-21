import { lazy, Suspense, useEffect } from "react"; // 📌 นำเข้า useEffect
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useLocation // 📌 นำเข้า useLocation
} from "react-router-dom";
import useUserStore from "../stores/userStore";
import MainLayout from "../layouts/MainLayout";
import UserLayout from "../layouts/UserLayout";
import OAuthCallback from "../pages/OAuthCallback";

// Pages (หน้าเดิมที่มีอยู่)
const LandingPage = lazy(() => import("../pages/LandingPage"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const EditProfile = lazy(() => import("../pages/EditProfile"));
const HomePage = lazy(() => import("../pages/HomePage"));
const NewEvent = lazy(() => import("../pages/NewEvent"));
const Chat = lazy(() => import("../pages/ChatPage"));

// ✨ Pages (หน้าใหม่ที่เพิ่มเข้ามา)
const PagePop = lazy(() => import("../pages/PagePop"));
const PageRock = lazy(() => import("../pages/PageRock"));
const PageClassic = lazy(() => import("../pages/PageClassic"));
const PageEtc = lazy(() => import("../pages/PageEtc"));
const PageEntertainment = lazy(() => import("../pages/PageEntertainment"));
const AllArtist = lazy(() => import("../pages/PageAllArtist"));

const guestRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // ให้ MainLayout เป็นหน้าหลัก
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "new-event", Component: NewEvent },
      { path: "home", element: <HomePage /> },

      // 👉 เพิ่ม Route หน้าใหม่ สำหรับ Guest
      { path: "pop", element: <PagePop /> },
      { path: "rock", element: <PageRock /> },
      { path: "classic", element: <PageClassic /> },
      { path: "etc", element: <PageEtc /> },
      { path: "entertainment", element: <PageEntertainment /> },
      { path: "artists", element: <AllArtist /> },
      { path: "oauth/callback", element: <OAuthCallback /> },

      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

const userRouter = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "home", element: <HomePage /> },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "editprofile", Component: EditProfile },
      { path: "new-event", element: <NewEvent /> },
      { path: "chat", element: <Chat /> },

      // 👉 เพิ่ม Route หน้าใหม่ สำหรับ User ที่ Login แล้วด้วย
      { path: "pop", element: <PagePop /> },
      { path: "rock", element: <PageRock /> },
      { path: "classic", element: <PageClassic /> },
      { path: "etc", element: <PageEtc /> },
      { path: "entertainment", element: <PageEntertainment /> },
      { path: "artists", element: <AllArtist /> },
      { path: "oauth/callback", element: <OAuthCallback /> },

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
