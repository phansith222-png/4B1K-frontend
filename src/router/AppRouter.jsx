import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import useUserStore from '../stores/userStore'
import MainLayout from '../layouts/MainLayout'
import UserLayout from '../layouts/UserLayout'

const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))
const EditProfile = lazy(() => import('../pages/EditProfile'))

// 1. Import หน้า PagePop เข้ามา
const PagePop = lazy(() => import('../pages/PagePop')) 
const PageRock = lazy(() => import('../pages/PageRock')) 
const PageClassic = lazy(() => import('../pages/PageClassic')) 
const PageEntertainment = lazy(() => import('../pages/PageEntertainment')) 
const PageEtc = lazy(() => import('../pages/PageEtc')) 
const PageAllArtist = lazy(() => import('../pages/PageAllArtist')) 

const guestRouter = createBrowserRouter([
  // 2. เพิ่ม Path '/pop' ไว้ด้านนอกสุด (เพื่อไม่ให้โดน MainLayout ที่มี Navbar/Footer ครอบ)
  {
    path: '/poppage',
    Component: PagePop
  },
  {
    path: '/rockpage',
    Component: PageRock
  },
  {
    path: '/classicpage',
    Component: PageClassic
  },

  {
    path: '/entertainmentpage',
    Component: PageEntertainment
  },
  {
    path: '/etcpage',
    Component: PageEtc
  },
  {
    path: '/allartists',
    Component: PageAllArtist
  },
  {
    path: '/',
    element: <MainLayout />, 
    children: [
      { path: '/', element: <Navigate to="/login" replace /> },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: '*', element: <Navigate to="/login" replace /> },
    ]
  }
])

const userRouter = createBrowserRouter([
  // เพิ่มให้ผู้ใช้ที่ Login แล้วดูได้ด้วยเหมือนกัน (ไว้ด้านนอกสุดเช่นกัน)
  {
    path: '/poppage',
    Component: PagePop
  },
  {
    path: '/',
    element: <UserLayout />,
    children: [
      { path: '/', element: <div className="text-black p-10 mt-20">Home (coming soon)</div> },
      { path: 'profile/edit', Component: EditProfile },
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
        <span className="loading loading-spinner loading-lg text-[#FF007F]" />
      </div>
    }>
      <RouterProvider key={user?.id} router={router} />
    </Suspense>
  )
}