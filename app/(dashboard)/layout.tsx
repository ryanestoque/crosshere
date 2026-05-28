"use client";

import * as React from "react";
import { useAuthStore } from "@/store/auth-store";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const role = useAuthStore((state) => state.role);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isLoading) {
      // Not authenticated → redirect to login
      if (!isAuthenticated) {
        router.push(`/login?redirect=${pathname}`);
        return;
      }

      // Enforce role boundaries — prevent cross-role access
      if (role) {
        if (pathname.startsWith("/student") && role !== "student") {
          router.push(`/${role}`);
        } else if (pathname.startsWith("/clinic") && role !== "clinic") {
          router.push(`/${role}`);
        } else if (pathname.startsWith("/parent") && role !== "parent") {
          router.push(`/${role}`);
        } else if (pathname.startsWith("/admin") && role !== "admin") {
          router.push(`/${role}`);
        }
      }
    }
  }, [isLoading, isAuthenticated, router, pathname, role]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-crosshere" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-background">
      {/* Light Mode Desktop Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-opacity duration-300 hidden md:block dark:hidden blur-[6px] scale-105 opacity-[0.15]"
        style={{ backgroundImage: "url('/dashboard-bg-light.png')" }}
      />
      {/* Dark Mode Desktop Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-opacity duration-300 hidden dark:md:block blur-[6px] scale-105 opacity-[0.08]"
        style={{ backgroundImage: "url('/dashboard-bg.png')" }}
      />

      {/* Light Mode Mobile Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-opacity duration-300 block md:hidden dark:hidden blur-[6px] scale-105 opacity-[0.15]"
        style={{ backgroundImage: "url('/dashboard-bg-mobile-light.png')" }}
      />
      {/* Dark Mode Mobile Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-opacity duration-300 hidden dark:block dark:md:hidden blur-[6px] scale-105 opacity-[0.08]"
        style={{ backgroundImage: "url('/dashboard-bg-mobile.png')" }}
      />
      {/* Layout Content */}
      <div className="relative z-10 min-h-screen w-full flex flex-col">
        {children}
      </div>
    </div>
  );
}
