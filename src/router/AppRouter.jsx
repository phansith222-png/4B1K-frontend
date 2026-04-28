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
const PageRnb = lazy(() => import("../pages/PageRnb"));
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

// Combined Router to prevent resetting the router state on refresh/auth change
const combinedRouter = createBrowserRouter([
  {
    path: "/",
    // The root element will handle its own layout switching
    element: <RootLayoutSwitcher />,
    children: [
      // Common routes for both Guest and User
      { path: "/", element: <HomeLandingSwitcher /> },
      { path: "landing", element: <LandingPage /> },
      { path: "home", element: <AuthProtectedRoute element={<HomePage />} /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "editprofile", element: <EditProfile /> },
      { path: "new-event", element: <NewEvent /> },
      { path: "chat", element: <AuthProtectedRoute element={<Chat />} /> },
      { path: "pop", element: <PagePop /> },
      { path: "rock", element: <PageRock /> },
      { path: "rnb", element: <PageRnb /> },
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

// ── Helper Components for the Single Router ────────────────────────────────

function RootLayoutSwitcher() {
  const user = useUserStore((state) => state.user);
  return user ? <UserLayout /> : <MainLayout />;
}

function HomeLandingSwitcher() {
  const user = useUserStore((state) => state.user);
  return user ? <HomePage /> : <LandingPage />;
}

function AuthProtectedRoute({ element }) {
  const user = useUserStore((state) => state.user);
  const _hasHydrated = useUserStore((state) => state._hasHydrated);

  if (!_hasHydrated) return null; // Wait for hydration
  if (!user) return <Navigate to="/login" replace />;
  return element;
}

export default function AppRouter() {
  const _hasHydrated = useUserStore((state) => state._hasHydrated);

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-[#7000FF] opacity-[0.03] blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[10%] right-[20%] w-[600px] h-[600px] bg-[#7000FF] opacity-[0.05] blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="flex gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-8 bg-[#7000FF] rounded-full animate-bounce shadow-[0_0_15px_#7000FF]" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
          <span className="text-white text-xs font-black tracking-[0.5em] uppercase opacity-50 ml-[0.5em]">Initializing 4B1K</span>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-[#7000FF] opacity-[0.03] blur-[150px] rounded-full animate-pulse" />
            <div className="absolute bottom-[10%] right-[20%] w-[600px] h-[600px] bg-[#7000FF] opacity-[0.05] blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-8 bg-[#7000FF] rounded-full animate-bounce shadow-[0_0_15px_#7000FF]" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <span className="text-white text-xs font-black tracking-[0.5em] uppercase opacity-50 ml-[0.5em]">Initializing 4B1K</span>
          </div>
        </div>
      }
    >
      <RouterProvider router={combinedRouter} />
    </Suspense>
  );
}

