"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, Package, CalendarCheck, Users, ArrowLeft } from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (status === "authenticated" && session?.user?.role !== "admin") router.push("/");
  }, [status, session, router]);

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" /></div>;
  if (session?.user?.role !== "admin") return null;

  return (
    <div className="min-h-screen pt-20 bg-gray-100 dark:bg-gray-950">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-900 shadow-lg min-h-[calc(100vh-80px)] p-6 hidden lg:block">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-red-500">Admin Panel</h2>
            <p className="text-gray-500 text-sm mt-1">{session.user.email}</p>
          </div>
          <nav className="space-y-2">
            {adminLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${pathname === link.href ? "bg-red-500 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
                <link.icon size={20} />{link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-10">
            <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition">
              <ArrowLeft size={16} />Back to Site
            </Link>
          </div>
        </aside>

        {/* Mobile nav */}
        <div className="lg:hidden w-full bg-white dark:bg-gray-900 px-4 py-3 flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800 fixed top-16 z-40">
          {adminLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap ${pathname === link.href ? "bg-red-500 text-white" : "bg-gray-100 dark:bg-gray-800"}`}>
              <link.icon size={16} />{link.label}
            </Link>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-10 mt-12 lg:mt-0">{children}</main>
      </div>
    </div>
  );
}
