import React, { useState, useEffect } from "react";
import { Outlet, Link, useRouterState } from "@tanstack/react-router";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  ClipboardList, 
  RotateCw, 
  CheckSquare, 
  CalendarClock, 
  Bird, 
  FileText, 
  Pill, 
  ShieldAlert, 
  ArrowRightLeft, 
  PlaneTakeoff, 
  Wrench, 
  AlertCircle, 
  Accessibility, 
  LogOut,
  ChevronLeft,
  Clock
} from "lucide-react";

export const AppShell = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const user = useAuthStore((state) => state.session?.user);
  const router = useRouterState();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navSections = [
    {
      title: "OVERVIEW",
      items: [{ label: "Dashboard", icon: LayoutDashboard, to: "/" }],
    },
    {
      title: "HUSBANDRY",
      items: [
        { label: "Daily Logs", icon: ClipboardList, to: "/daily-logs" },
        { label: "Daily Rounds", icon: RotateCw, to: "/daily-rounds" },
        { label: "Tasks", icon: CheckSquare, to: "/tasks" },
        { label: "Feeding Schedule", icon: CalendarClock, to: "/feeding" },
      ],
    },
    {
      title: "ANIMALS",
      items: [
        { label: "Animals", icon: Bird, to: "/animals" },
        { label: "Clinical Notes", icon: FileText, to: "/clinical-notes" },
        { label: "Medications", icon: Pill, to: "/medications" },
        { label: "Quarantine", icon: ShieldAlert, to: "/quarantine" },
      ],
    },
    {
      title: "LOGISTICS",
      items: [
        { label: "Movements", icon: ArrowRightLeft, to: "/movements" },
        { label: "Flight Records", icon: PlaneTakeoff, to: "/flight-records" },
      ],
    },
    {
      title: "SAFETY",
      items: [
        { label: "Maintenance", icon: Wrench, to: "/maintenance" },
        { label: "Incidents", icon: AlertCircle, to: "/incidents" },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.aside
          initial={false}
          animate={{ width: isCollapsed ? 80 : 260 }}
          className="bg-slate-900 text-slate-300 flex flex-col shrink-0 relative transition-all ease-in-out z-20 shadow-xl"
        >
          <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  <h2 className="text-lg font-bold text-white tracking-tight leading-none">KOA Manager</h2>
                </motion.div>
              )}
            </AnimatePresence>
            {isCollapsed && (
              <div className="w-full flex justify-center font-bold text-white uppercase tracking-tighter">KM</div>
            )}
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
            <div className="space-y-6">
              {navSections.map((section) => (
                <div key={section.title} className="space-y-1">
                  {!isCollapsed && (
                    <h3 className="px-6 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {section.title}
                    </h3>
                  )}
                  <div className="space-y-0.5 px-3">
                    {section.items.map((item) => {
                      const isActive = router.location.pathname === item.to;
                      return (
                        <Link
                          key={item.label}
                          to={item.to as any}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all min-h-[40px]
                            ${isActive ? 'bg-[#00a651] text-white font-medium shadow-sm' : 'hover:bg-white/5 hover:text-white'}`}
                        >
                          <item.icon size={18} className="shrink-0" />
                          {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          <div className="p-3 border-t border-white/10 space-y-0.5">
            <Link
              to={"/accessibility" as any}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5 hover:text-white min-h-[40px]"
            >
              <Accessibility size={18} className="shrink-0" />
              {!isCollapsed && <span>Accessibility</span>}
            </Link>
            <button
              onClick={() => supabase.auth.signOut()}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5 hover:text-white min-h-[40px]"
            >
              <LogOut size={18} className="shrink-0" />
              {!isCollapsed && <span>Log Out</span>}
            </button>
          </div>
        </motion.aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shrink-0 z-10 shadow-sm relative">
          <div className="flex items-center gap-4">
            {!isMobile && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 border border-slate-200 hover:bg-slate-50 rounded-md transition-colors text-slate-500 min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <ChevronLeft className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-6">
            <button className="hidden sm:flex items-center gap-2 px-4 py-1.5 border border-[#00a651] text-[#00a651] rounded-md text-xs font-semibold hover:bg-[#00a651]/5 transition-colors shadow-sm">
              <Clock size={14} />
              CLOCK IN
            </button>
            
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6 h-8">
              <span className="text-sm font-medium text-slate-700 hidden sm:block">
                {user?.email?.split('@')[0] || "Charlotte Davis-Whytock"}
              </span>
              <div className="w-8 h-8 bg-emerald-100 text-[#00a651] border border-emerald-200 rounded-full flex items-center justify-center font-bold text-sm uppercase">
                {user?.email?.charAt(0) || 'C'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <AnimatePresence>
        {isMobile && (
          <motion.nav 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-4 left-4 right-4 h-16 bg-slate-900 text-slate-400 rounded-xl flex items-center justify-around px-2 z-50 shadow-2xl overflow-hidden"
          >
            {[
              { to: "/", icon: LayoutDashboard, label: "Home" },
              { to: "/tasks", icon: CheckSquare, label: "Tasks" },
              { to: "/animals", icon: Bird, label: "Animals" },
              { to: "/logs", icon: ClipboardList, label: "Logs" },
            ].map((item) => {
              const isActive = router.location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to as any}
                  className={`flex flex-col items-center justify-center gap-1 min-h-[44px] min-w-[44px] flex-1
                    ${isActive ? 'text-emerald-400' : 'hover:text-slate-200'}`}
                >
                  <item.icon size={20} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};
