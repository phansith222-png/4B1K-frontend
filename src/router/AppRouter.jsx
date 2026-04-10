import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import useUserStore from "../stores/userStore";

const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const NewEvent = lazy(() => import("../pages/NewEvent"));

const guestRouter = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  { path: "/new-event", Component: NewEvent },
  { path: "*", element: <Navigate to="/login" replace /> },
]);

const userRouter = createBrowserRouter([
  {
    path: "/",
    element: <div className="text-white p-10">Home (coming soon)</div>,
  },
  { path: "*", element: <Navigate to="/" replace /> },
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
