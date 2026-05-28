"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Check, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useAuthStore } from "@/store/auth-store";
import type { Role } from "@/store/auth-store";
import { toast } from "sonner";

const passwordRequirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [formError, setFormError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<Role>(null);
  const [agreedToTerms, setAgreedToTerms] = React.useState(false);

  const router = useRouter();
  const signUp = useAuthStore((state) => state.signUp);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      setFormError("Please select your role.");
      return;
    }
    if (!agreedToTerms) {
      setFormError("You must agree to the Terms of Service to continue.");
      return;
    }

    const allRequirementsMet = passwordRequirements.every((r) => r.test(password));
    if (!allRequirementsMet) {
      setFormError("Password does not meet all requirements.");
      return;
    }

    setLoading(true);
    setFormError("");

    const { error } = await signUp(email, password, `${firstName} ${lastName}`, role);

    if (error) {
      setLoading(false);
      setFormError(error.includes("already registered")
        ? "An account with this email already exists. Try signing in."
        : error);
      return;
    }

    setLoading(false);
    setSuccess(true);
    toast.success("Account created! Check your email to confirm.");
  };

  const strength = passwordRequirements.filter((r) => r.test(password)).length;

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="size-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Check your email</h2>
        <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto">
          We&apos;ve sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
        </p>
        <Button
          className="w-full h-11 bg-crosshere hover:bg-crosshere/90 text-white"
          onClick={() => router.push("/login")}
        >
          Back to sign in
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-semibold tracking-tight mb-1">Create account</h2>
        <p className="text-sm text-muted-foreground mb-8">
          Join CROSSHERE to manage student health emergencies
        </p>
      </motion.div>

      <motion.form variants={staggerItem} onSubmit={handleSubmit} className="space-y-4">
        {/* Error Alert */}
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

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Sarah"
              className="h-11"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Mitchell"
              className="h-11"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-email">Email</Label>
          <Input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nurse@school.edu"
            className="h-11"
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={role ?? ""} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger id="role" className="h-11">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="clinic">Clinic Staff</SelectItem>
              <SelectItem value="parent">Parent / Guardian</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-password">Password</Label>
          <div className="relative">
            <Input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              className="h-11 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute right-1 top-0 bottom-0 my-auto text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          </div>

          {/* Password strength */}
          {password.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      i <= strength
                        ? strength <= 1 ? "bg-red-500"
                          : strength <= 2 ? "bg-amber-500"
                          : strength <= 3 ? "bg-blue-500"
                          : "bg-emerald-500"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <div className="space-y-1">
                {passwordRequirements.map((req) => (
                  <p
                    key={req.label}
                    className={`text-xs flex items-center gap-1.5 transition-colors ${
                      req.test(password) ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                    }`}
                  >
                    <Check className={`size-3 ${req.test(password) ? "opacity-100" : "opacity-30"}`} />
                    {req.label}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-start gap-2 pt-1">
          <Checkbox
            id="terms"
            className="mt-0.5"
            checked={agreedToTerms}
            onCheckedChange={(v) => setAgreedToTerms(!!v)}
          />
          <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground leading-snug cursor-pointer">
            <span>
              I agree to the{" "}
              <Link href="#" className="text-crosshere hover:underline">Terms of Service</Link>{" "}
              and{" "}
              <Link href="#" className="text-crosshere hover:underline">Privacy Policy</Link>
            </span>
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-crosshere hover:bg-crosshere/90 text-white font-medium mt-2"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Create account
              <ArrowRight className="size-4" />
            </span>
          )}
        </Button>
      </motion.form>

      <motion.p
        variants={staggerItem}
        className="text-center text-sm text-muted-foreground mt-8"
      >
        Already have an account?{" "}
        <Link href="/login" className="text-crosshere hover:text-crosshere/80 font-medium transition-colors">
          Sign in
        </Link>
      </motion.p>
    </motion.div>
  );
}
