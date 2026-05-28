"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cross } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { cn } from "@/lib/utils";

export function ParentTopbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [showSignOut, setShowSignOut] = React.useState(false);
  const router = useRouter();
  
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || "Parent";
  const displayEmail = user?.email || "";
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSignOut = () => {
    logout();
    router.replace("/login");
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 border-b border-border/50 transition-all duration-200 px-4",
          scrolled ? "bg-background/80 backdrop-blur-xl shadow-sm" : "bg-background/80 backdrop-blur-xl"
        )}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between h-14">
          <Link href="/parent" className="flex items-center gap-2.5 group">
            <div className="size-8 rounded-xl bg-crosshere flex items-center justify-center transition-transform group-hover:scale-105">
              <Cross className="size-4 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <span className="text-base font-bold tracking-tight leading-none">
                CROSSHERE
              </span>
              <span className="text-[10px] uppercase tracking-widest text-crosshere font-semibold mt-0.5">
                Parent Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            
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
                <DropdownMenuItem 
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                  onSelect={() => setShowSignOut(true)}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <AlertDialog open={showSignOut} onOpenChange={setShowSignOut}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of CROSSHERE?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be returned to the login screen and will need to authenticate again to access the parent portal.
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
    </>
  );
}
