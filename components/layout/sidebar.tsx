"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Cross,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { mainNavItems } from "@/lib/constants";
import { useMediaQuery } from "@/hooks/use-media-query";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function SidebarLogo({ collapsed }: { collapsed: boolean }) {
  return (
    <Link href="/clinic" className={cn("flex items-center gap-3 py-2", collapsed ? "px-0 justify-center" : "px-3")}>
      <div className="size-8 rounded-xl bg-crosshere flex items-center justify-center shrink-0">
        <Cross className="size-4 text-crosshere-foreground" strokeWidth={2.5} />
      </div>
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="text-base font-semibold tracking-tight whitespace-nowrap overflow-hidden"
          >
            CROSSHERE
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

function NavLink({
  item,
  collapsed,
  active,
}: {
  item: (typeof mainNavItems)[0];
  collapsed: boolean;
  active: boolean;
}) {
  const content = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        "hover:bg-accent hover:text-accent-foreground",
        active
          ? "bg-crosshere/10 text-crosshere dark:bg-crosshere/15 dark:text-crosshere"
          : "text-muted-foreground"
      )}
    >
      <item.icon className="size-[18px] shrink-0" strokeWidth={active ? 2 : 1.5} />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="whitespace-nowrap overflow-hidden"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      {item.badge && !collapsed && (
        <span className="ml-auto text-xs bg-crosshere/15 text-crosshere px-1.5 py-0.5 rounded-full font-medium">
          {item.badge}
        </span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

function SidebarContent({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showSignOut, setShowSignOut] = React.useState(false);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || "User";
  const displayRole = profile?.role === 'clinic' ? 'Clinic Staff' : 
                      profile?.role === 'student' ? 'Student' : 
                      profile?.role === 'parent' ? 'Parent / Guardian' : 
                      profile?.role === 'admin' ? 'Administrator' : 'User';
  
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const handleSignOut = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo + Collapse */}
      <div className={cn("flex p-3 h-[60px]", collapsed ? "justify-center" : "items-center justify-between")}>
        {collapsed ? (
          <div 
            className="relative flex items-center justify-center w-10 h-10 group/logo"
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
          >
            <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out group-hover/sidebar:opacity-0 group-hover/sidebar:scale-90">
              <div className="size-8 rounded-xl bg-crosshere flex items-center justify-center shrink-0 shadow-sm">
                <Cross className="size-4 text-crosshere-foreground" strokeWidth={2.5} />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-90 transition-all duration-300 ease-in-out group-hover/sidebar:opacity-100 group-hover/sidebar:scale-100 text-muted-foreground hover:text-foreground">
              <PanelLeftOpen className="size-5" />
            </div>
          </div>
        ) : (
          <>
            <SidebarLogo collapsed={false} />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggle}
              className="shrink-0 text-muted-foreground hover:text-foreground hidden lg:flex"
            >
              <PanelLeftClose className="size-4" />
            </Button>
          </>
        )}
      </div>

      <div className={cn("px-3", collapsed && "px-2")}>
        <Separator />
      </div>

      {/* Nav Items */}
      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              collapsed={collapsed}
              active={
                item.href === "/clinic"
                  ? pathname === "/clinic"
                  : pathname.startsWith(item.href)
              }
            />
          ))}
        </nav>
      </ScrollArea>

      <div className={cn("px-3", collapsed && "px-2")}>
        <Separator />
      </div>

      {/* User Profile */}
      <div className="p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5",
            collapsed && "justify-center px-0"
          )}
        >
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="bg-crosshere/10 text-crosshere text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 min-w-0 overflow-hidden"
              >
                <p className="text-sm font-medium truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{displayRole}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <Button 
              variant="ghost" 
              size="icon-xs" 
              className="text-muted-foreground shrink-0" 
              onClick={() => setShowSignOut(true)}
            >
              <LogOut className="size-3.5" />
            </Button>
          )}
        </div>
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
    </div>
  );
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-3 left-3 z-40"
            id="sidebar-mobile-trigger"
          >
            <PanelLeftOpen className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SidebarContent collapsed={false} onToggle={onToggle} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "h-screen sticky top-0 shrink-0 border-r border-border/50 group/sidebar",
        "bg-sidebar/80 backdrop-blur-xl",
        collapsed && "cursor-pointer"
      )}
      onClick={(e) => {
        if (!collapsed) return;
        const target = e.target as HTMLElement;
        if (!target.closest("a") && !target.closest("button")) {
          onToggle();
        }
      }}
    >
      <SidebarContent collapsed={collapsed} onToggle={onToggle} />
    </motion.aside>
  );
}
