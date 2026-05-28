"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { studentProfile } from "@/lib/mock-data";
import {
  ArrowLeft,
  Droplets,
  AlertCircle,
  Heart,
  Pill,
  Users,
  Phone,
  Mail,
  QrCode,
  Calendar,
  Ruler,
  Weight,
  Shield,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function HealthProfilePage() {
  const authProfile = useAuthStore((s) => s.profile);
  const displayName = authProfile?.full_name ?? studentProfile.name;
  const initials = authProfile?.full_name 
    ? authProfile.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : studentProfile.initials;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-5 pt-2"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="flex items-center gap-3">
        <Link href="/student" className="p-2 -ml-2 rounded-xl hover:bg-muted/50">
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-lg font-semibold tracking-tight">Health Profile</h1>
      </motion.div>

      {/* Student Header Card */}
      <motion.div variants={staggerItem}>
        <GlassCard size="sm" intensity="medium">
          <GlassCardContent>
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarFallback className="bg-crosshere/10 text-crosshere text-xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-base font-semibold">{displayName}</h2>
                <p className="text-sm text-muted-foreground">{studentProfile.grade} • {studentProfile.section}</p>
                <p className="text-xs text-muted-foreground mt-0.5">ID: {studentProfile.studentId}</p>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>
      </motion.div>

      {/* Vitals Grid */}
      <motion.div variants={staggerItem}>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-2xl bg-card/50 dark:bg-card/30 border border-border/30">
            <Droplets className="size-5 text-red-500 mx-auto mb-1.5" />
            <p className="text-[10px] text-muted-foreground">Blood Type</p>
            <p className="text-base font-bold">{studentProfile.bloodType}</p>
          </div>
          <div className="text-center p-3 rounded-2xl bg-card/50 dark:bg-card/30 border border-border/30">
            <Ruler className="size-5 text-blue-500 mx-auto mb-1.5" />
            <p className="text-[10px] text-muted-foreground">Height</p>
            <p className="text-base font-bold">{studentProfile.height}</p>
          </div>
          <div className="text-center p-3 rounded-2xl bg-card/50 dark:bg-card/30 border border-border/30">
            <Weight className="size-5 text-emerald-500 mx-auto mb-1.5" />
            <p className="text-[10px] text-muted-foreground">Weight</p>
            <p className="text-base font-bold">{studentProfile.weight}</p>
          </div>
        </div>
      </motion.div>

      {/* Allergies */}
      <motion.div variants={staggerItem}>
        <GlassCard size="sm" intensity="subtle">
          <GlassCardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-amber-500/10 p-2">
                <AlertCircle className="size-4 text-amber-500" />
              </div>
              <h3 className="text-sm font-semibold">Allergies</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {studentProfile.allergies.map((a) => (
                <Badge key={a} variant="outline" className="text-sm px-3 py-1 rounded-xl border-amber-500/25 text-amber-700 dark:text-amber-400">
                  {a}
                </Badge>
              ))}
            </div>
          </GlassCardContent>
        </GlassCard>
      </motion.div>

      {/* Medical Conditions */}
      <motion.div variants={staggerItem}>
        <GlassCard size="sm" intensity="subtle">
          <GlassCardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-blue-500/10 p-2">
                <Heart className="size-4 text-blue-500" />
              </div>
              <h3 className="text-sm font-semibold">Medical Conditions</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {studentProfile.conditions.map((c) => (
                <Badge key={c} variant="outline" className="text-sm px-3 py-1 rounded-xl border-blue-500/25 text-blue-700 dark:text-blue-400">
                  {c}
                </Badge>
              ))}
            </div>
          </GlassCardContent>
        </GlassCard>
      </motion.div>

      {/* Medications */}
      <motion.div variants={staggerItem}>
        <GlassCard size="sm" intensity="subtle">
          <GlassCardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-purple-500/10 p-2">
                <Pill className="size-4 text-purple-500" />
              </div>
              <h3 className="text-sm font-semibold">Medications</h3>
            </div>
            <div className="space-y-2">
              {studentProfile.medications.map((m) => (
                <div key={m} className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/30">
                  <Pill className="size-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm">{m}</span>
                </div>
              ))}
            </div>
          </GlassCardContent>
        </GlassCard>
      </motion.div>

      {/* Guardian Information */}
      <motion.div variants={staggerItem}>
        <GlassCard size="sm" intensity="subtle">
          <GlassCardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-crosshere/10 p-2">
                <Users className="size-4 text-crosshere" />
              </div>
              <h3 className="text-sm font-semibold">Guardian Information</h3>
            </div>
            <div className="space-y-3">
              {[studentProfile.guardian, studentProfile.secondaryGuardian].map((g) => (
                <div key={g.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{g.name}</p>
                      <p className="text-xs text-muted-foreground">{g.relation}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon-xs"
                        onClick={() => window.location.href = `tel:${g.phone}`}
                      >
                        <Phone className="size-3.5 text-crosshere" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon-xs"
                        onClick={() => window.location.href = `mailto:${g.email}`}
                      >
                        <Mail className="size-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <p>{g.phone}</p>
                    <p>{g.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCardContent>
        </GlassCard>
      </motion.div>

      {/* Emergency QR Card */}
      <motion.div variants={staggerItem}>
        <GlassCard size="sm" intensity="medium" glow>
          <GlassCardContent>
            <div className="flex items-center gap-4">
              <div className="size-20 rounded-2xl bg-muted/50 border border-border/30 flex items-center justify-center">
                <QrCode className="size-10 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1.5">
                <h3 className="text-sm font-semibold">Emergency QR Card</h3>
                <p className="text-xs text-muted-foreground">
                  Show this QR code to any responder for instant access to your health information.
                </p>
                <div className="flex items-center gap-1 text-xs text-crosshere font-medium">
                  <Shield className="size-3" />
                  <span>Encrypted & Secure</span>
                </div>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>
      </motion.div>

      {/* Personal Info */}
      <motion.div variants={staggerItem}>
        <GlassCard size="sm" intensity="subtle">
          <GlassCardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-muted/50 p-2">
                <Calendar className="size-4 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold">Personal Info</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date of Birth</span>
                <span className="font-medium">March 15, 2011</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Student ID</span>
                <span className="font-medium">{studentProfile.studentId}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Grade & Section</span>
                <span className="font-medium">{studentProfile.grade} • {studentProfile.section}</span>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
