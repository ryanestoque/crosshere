"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, AlertCircle, GraduationCap, Users, ShieldAlert, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useAuthStore } from "@/store/auth-store";
import type { Role } from "@/store/auth-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const roles = [
  {
    id: "student",
    title: "Student",
    description: "Access your health profile and emergency contacts.",
    icon: GraduationCap,
  },
  {
    id: "clinic",
    title: "Clinic Staff",
    description: "Manage incidents, records, and treatments.",
    icon: HeartPulse,
  },
  {
    id: "parent",
    title: "Parent / Guardian",
    description: "Monitor your child's health and incidents.",
    icon: Users,
  },
  {
    id: "admin",
    title: "Administrator",
    description: "Manage users, settings, and system data.",
    icon: ShieldAlert,
  },
] as const;

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = React.useState<Role>(null);
  const [loading, setLoading] = React.useState(false);
  const [formError, setFormError] = React.useState("");

  const router = useRouter();
  const setRole = useAuthStore((state) => state.setRole);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      setFormError("Please select a role to continue.");
      return;
    }

    setLoading(true);
    setFormError("");

    const { error } = await setRole(selectedRole);

    if (error) {
      setLoading(false);
      setFormError(error);
      return;
    }

    toast.success("Role updated successfully!");
    
    // Redirect to the appropriate portal
    router.push(`/${selectedRole}`);
    router.refresh();
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="w-full">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-semibold tracking-tight mb-1">Welcome to CROSSHERE</h2>
        <p className="text-sm text-muted-foreground mb-8">
          To get started, please tell us how you'll be using the platform.
        </p>
      </motion.div>

      <motion.form variants={staggerItem} onSubmit={handleSubmit} className="space-y-6">
        {formError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
          >
            <AlertCircle className="size-4 mt-0.5 shrink-0" />
            {formError}
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  setSelectedRole(role.id as Role);
                  setFormError("");
                }}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200",
                  isSelected 
                    ? "border-crosshere bg-crosshere/5 shadow-sm" 
                    : "border-border hover:border-crosshere/40 hover:bg-accent/50"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg shrink-0 transition-colors",
                  isSelected ? "bg-crosshere text-white" : "bg-muted text-muted-foreground"
                )}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-medium">{role.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                    {role.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-crosshere hover:bg-crosshere/90 text-white font-medium"
          disabled={loading || !selectedRole}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Continue
              <ArrowRight className="size-4" />
            </span>
          )}
        </Button>
      </motion.form>
    </motion.div>
  );
}
