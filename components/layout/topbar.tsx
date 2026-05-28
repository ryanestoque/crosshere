"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Search, Bell } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PulseIndicator } from "@/components/shared/pulse-indicator";
import { cn } from "@/lib/utils";

interface TopbarProps {
  onSearchOpen: () => void;
}

import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function Topbar({ onSearchOpen }: TopbarProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [showSignOut, setShowSignOut] = React.useState(false);
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || "User";
  const displayEmail = user?.email || "";
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const handleSignOut = () => {
    logout();
    router.replace("/login");
  };

  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between h-14 px-4 lg:px-6 transition-all duration-200",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      )}
    >
      {/* Left — spacer for mobile menu button */}
      <div className="lg:hidden w-10" />

      {/* Search */}
      <Button
        variant="outline"
        className="hidden sm:flex items-center gap-2 text-muted-foreground font-normal h-9 w-64 justify-start px-3"
        onClick={onSearchOpen}
        id="search-trigger"
      >
        <Search className="size-4 shrink-0" />
        <span className="text-sm">Search...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </Button>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden text-muted-foreground"
          onClick={onSearchOpen}
          aria-label="Search"
        >
          <Search className="size-[18px]" />
        </Button>

        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground" id="notification-bell">
              <Bell className="size-[18px]" />
              <span className="absolute top-1.5 right-1.5">
                <PulseIndicator color="red" size="sm" />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <p className="text-sm font-medium">Notifications</p>
              <Badge variant="secondary" className="text-[10px] bg-crosshere/10 text-crosshere hover:bg-crosshere/10 border-transparent">
                3 New
              </Badge>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-1">
              {[
                { title: "Critical: Asthma Emergency", desc: "Emma Rodriguez — Building C", time: "2m ago", unread: true },
                { title: "Seizure Reported", desc: "Noah Williams — Science Lab", time: "5m ago", unread: true },
                { title: "Incident Resolved", desc: "Liam Chen — Fever/Infection", time: "1h ago", unread: false },
              ].map((notif, i) => (
                <div key={i} className={cn("px-3 py-2.5 rounded-lg mb-1 hover:bg-muted/50 cursor-pointer flex flex-col gap-1 transition-colors", notif.unread && "bg-muted/30")}>
                  <div className="flex items-center justify-between">
                    <p className={cn("text-sm font-medium", notif.unread ? "text-foreground" : "text-muted-foreground")}>
                      {notif.title}
                    </p>
                    {notif.unread && <span className="size-2 rounded-full bg-crosshere shrink-0" />}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="truncate pr-4">{notif.desc}</span>
                    <span className="shrink-0">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-1 border-t border-border/50">
              <DropdownMenuItem asChild className="w-full justify-center text-xs cursor-pointer text-muted-foreground mt-1">
                <Link href="/clinic/notifications">View all notifications</Link>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full ml-1">
              <Avatar className="size-8">
                <AvatarFallback className="bg-crosshere/10 text-crosshere text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <p className="font-medium truncate">{displayName}</p>
              <p className="text-xs font-normal text-muted-foreground truncate">{displayEmail}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/clinic/settings">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/clinic/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
              onSelect={() => setShowSignOut(true)}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showSignOut} onOpenChange={setShowSignOut}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of CROSSHERE?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be returned to the login screen and will need to authenticate again to access the dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSignOut}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
