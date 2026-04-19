import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { useAuthStore } from "./store/authStore";
import { Dashboard } from "./features/dashboard/Dashboard";
import { AppShell } from "./components/AppShell";
import { motion, AnimatePresence } from "motion/react";

import { 
  LayoutDashboard, 
  LogOut, 
  CloudSun, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
  ClipboardList,
  RotateCw,
  CheckSquare,
  UtensilsCrossed,
  Bird,
  FileText,
  Pill,
  ShieldAlert,
  Package,
  PlaneTakeoff,
  Settings,
  AlertCircle,
  Accessibility,
  UserCircle,
  Clock
} from "lucide-react";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate({ from: "/login" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 p-6">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 p-8 bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-100"
      >
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-slate-900">KOA-Manager</h1>
          <p className="text-slate-500 font-medium">V3 Pro Edition</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 bg-blue-600 text-white py-3 border-none rounded-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 min-h-[44px]"
        >
          {isLoading ? "Authenticating..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "_authenticated",
  beforeLoad: () => {
    const session = useAuthStore.getState().session;
    if (!session) {
      throw redirect({ to: "/login" });
    }
  },
  component: AppShell,
});

const indexRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/",
  component: Dashboard,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  authenticatedRoute.addChildren([indexRoute]),
]);

export const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}