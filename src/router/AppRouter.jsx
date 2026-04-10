import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import useUserStore from "../stores/userStore";
import MainLayout from "../layouts/MainLayout"; // 1. Import MainLayout เข้ามา
import UserLayout from "../layouts/UserLayout";

// Pages
const LandingPage = lazy(() => import('../pages/LandingPage')) 
const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))
const EditProfile = lazy(() => import('../pages/EditProfile')) 
const HomePage = lazy(() => import('../pages/HomePage')) // ✨ นำเข้าหน้าใหม่
const NewEvent = lazy(() => import("../pages/NewEvent"));

const guestRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // ให้ MainLayout เป็นหน้าหลัก
    children: [
      { path: '/', element: <LandingPage /> }, 
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
       { path: "new-event", Component: NewEvent },
      { path: 'home', element: <HomePage /> }, 
      { path: '*', element: <Navigate to="/" replace /> },
    ]
  }
])

const userRouter = createBrowserRouter([
  {
    path: '/',
    element: <UserLayout />,
    children: [
      { path: '/', element: <HomePage /> }, 
      { path: 'home', element: <HomePage /> }, 
      { path: 'editprofile', Component: EditProfile }, 
      { path: '*', element: <Navigate to="/" replace /> },
    ]
  }
])

export default function AppRouter() {
  const user = useUserStore(state => state.user)

  const router = user ? userRouter : guestRouter

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#111418] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-white" />
      </div>
    }>
      <RouterProvider key={user?.id} router={router} />
    </Suspense>
  )
}
