import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Stethoscope,
  Calendar,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const sidebarLinks = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Doctors",
    path: "/admin/doctors",
    icon: Stethoscope,
  },
  {
    label: "Appointments",
    path: "/admin/appointments",
    icon: Calendar,
  },
];

import { useLogout, useUser } from "../../hooks/useAuth";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useUser();
  const { mutate: logoutMutate } = useLogout();

  const handleLogout = () => {
    logoutMutate();
  };

  return (
    <div className="flex h-screen bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground">
              Med<span className="text-primary">Book</span>
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-muted hover:text-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/admin"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:bg-surface-muted hover:text-foreground"
                }`
              }
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-border p-4">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary capitalize">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-bold text-foreground capitalize">
                {user?.name || "Admin"}
              </p>
              <p className="truncate text-xs text-muted">
                {user?.email || "admin@example.com"}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-danger transition hover:bg-danger/10"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-muted hover:text-foreground lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary capitalize">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-foreground">{user?.name || "Administrator"}</p>
                <p className="text-[10px] uppercase font-bold text-primary tracking-wider">System Access</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}