import { Navigate, Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { RouteFade } from "@/components/layout/RouteFade";
import { isAdminAuthenticated } from "@/services/adminApi";

export function AdminShell() {
  const isAuth = isAdminAuthenticated();

  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_-10%,rgba(var(--accent2),0.10),transparent_50%),radial-gradient(circle_at_70%_0%,rgba(var(--gold),0.08),transparent_45%)]">
      <div className="mx-auto flex w-full max-w-[1400px] gap-4 px-3 py-3 sm:px-6 sm:py-6">
        <AdminSidebar />
        <div className="min-w-0 flex-1">
          <AdminTopbar />
          <main className="mt-4 min-w-0">
            <RouteFade>
              <Outlet />
            </RouteFade>
          </main>
        </div>
      </div>
    </div>
  );
}
