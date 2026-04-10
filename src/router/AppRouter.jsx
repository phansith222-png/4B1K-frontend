import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import useUserStore from '../stores/userStore'
import MainLayout from '../layouts/MainLayout'
import UserLayout from '../layouts/UserLayout'

// Pages
const LandingPage = lazy(() => import('../pages/LandingPage')) 
const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))
const EditProfile = lazy(() => import('../pages/EditProfile')) 
const HomePage = lazy(() => import('../pages/HomePage')) // ✨ นำเข้าหน้าใหม่

const guestRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // ใช้ Layout ปกติ (หน้าขาว)
    children: [
      { path: '/', element: <LandingPage /> }, 
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      // ✨ เพิ่มบรรทัดนี้: ทำให้พิมพ์ /home ได้เลยแม้ไม่ได้ Login
      { path: 'home', element: <HomePage /> }, 
      { path: '*', element: <Navigate to="/" replace /> },
    ]
  }
])

const userRouter = createBrowserRouter([
  {
    path: '/',
    element: <UserLayout />, // ใช้ Layout อลังการ (หน้าดำ)
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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-[#c6ff00]" />
      </div>
    }>
      <RouterProvider key={user?.id} router={router} />
    </Suspense>
  ) 
}