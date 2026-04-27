import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider
} from "react-router-dom";
import useUserStore from "../stores/userStore";
import MainLayout from "../layouts/MainLayout";
import UserLayout from "../layouts/UserLayout";
import OAuthCallback from "../pages/OAuthCallback";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "../pages/ErrorPage";
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
const PageEdm = lazy(() => import("../pages/PageEdm"));
const PageEntertainment = lazy(() => import("../pages/PageEntertainment"));
const AllArtist = lazy(() => import("../pages/PageAllArtist"));
const PageNearbyEvents = lazy(() => import("../pages/PageNearbyEvents"));

// 🏢 Company Pages
const PageAbout = lazy(() => import("../pages/PageAbout"));
const PagePrivacy = lazy(() => import("../pages/PagePrivacy"));
const PageTerms = lazy(() => import("../pages/PageTerms"));
const PageContact = lazy(() => import("../pages/PageContact"));

const guestRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // ให้ MainLayout เป็นหน้าหลัก
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "landing", element: <LandingPage /> },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "new-event", Component: NewEvent },

      // 👉 เพิ่ม Route หน้าใหม่ สำหรับ Guest
      { path: "pop", element: <PagePop /> },
      { path: "rock", element: <PageRock /> },
      { path: "classic", element: <PageClassic /> },
      { path: "edm", element: <PageEdm /> },
      { path: "etc", element: <PageEtc /> },
      { path: "entertainment", element: <PageEntertainment /> },
      { path: "artists", element: <AllArtist /> },
      { path: "nearby-events", element: <PageNearbyEvents /> },
      { path: "about", element: <PageAbout /> },
      { path: "privacy", element: <PagePrivacy /> },
      { path: "terms", element: <PageTerms /> },
      { path: "contact", element: <PageContact /> },
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
      { path: "landing", element: <LandingPage /> },
      { path: "home", element: <HomePage /> },
      { path: "editprofile", Component: EditProfile },
      { path: "new-event", element: <NewEvent /> },
      { path: "chat", element: <Chat /> },

      // 👉 เพิ่ม Route หน้าใหม่ สำหรับ User ที่ Login แล้วด้วย
      { path: "pop", element: <PagePop /> },
      { path: "rock", element: <PageRock /> },
      { path: "classic", element: <PageClassic /> },
      { path: "edm", element: <PageEdm /> },
      { path: "etc", element: <PageEtc /> },
      { path: "entertainment", element: <PageEntertainment /> },
      { path: "artists", element: <AllArtist /> },
      { path: "nearby-events", element: <PageNearbyEvents /> },
      { path: "about", element: <PageAbout /> },
      { path: "privacy", element: <PagePrivacy /> },
      { path: "terms", element: <PageTerms /> },
      { path: "contact", element: <PageContact /> },
      { path: "oauth/callback", element: <OAuthCallback /> },

      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export default function AppRouter() {
  const user = useUserStore((state) => state.user);

  const router = user ? userRouter : guestRouter;

  // Use a stable key that forces remount when auth state changes.
  // Support both 'id' and '_id' (common in MongoDB)
  const routerKey = user ? (user.id || user._id || 'auth-user') : 'guest';

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center relative overflow-hidden">
          {/* Theme Background for loading state */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-[#00E5FF] opacity-[0.05] blur-[150px] rounded-full animate-pulse" />
            <div className="absolute bottom-[10%] right-[20%] w-[600px] h-[600px] bg-[#7000FF] opacity-[0.05] blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-8 bg-[#00E5FF] rounded-full animate-bounce shadow-[0_0_15px_#00E5FF]" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <span className="text-white text-xs font-black tracking-[0.5em] uppercase opacity-50 ml-[0.5em]">Initializing 4B1K</span>
          </div>
        </div>
      }
    >
      <RouterProvider key={routerKey} router={router} />
    </Suspense>
  );
}

