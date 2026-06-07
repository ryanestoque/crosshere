"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [isResending, setIsResending] = React.useState(false);

  const handleResend = () => {
    setIsResending(true);
    // Simulate resend API call
    setTimeout(() => {
      setIsResending(false);
      // could show a toast here if sonner is available
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col items-center justify-center text-center w-full"
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-crosshere/20 rounded-full blur-2xl animate-pulse" />
        <div className="mx-auto w-24 h-24 rounded-[2rem] bg-crosshere/10 border border-crosshere/20 flex items-center justify-center relative shadow-sm">
          <Mail className="size-12 text-crosshere" strokeWidth={1.5} />
        </div>
      </div>
      
      <h2 className="text-3xl font-semibold tracking-tight mb-4">Check your email</h2>
      <p className="text-base text-muted-foreground mb-10 max-w-[340px] mx-auto leading-relaxed text-balance">
        We&apos;ve sent a verification link to{" "}
        <strong className="text-foreground font-medium">{email || "your email address"}</strong>. 
        Please check your inbox and click the link to activate your account.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-[340px]">
        <Button
          className="w-full h-12 text-base font-medium bg-crosshere hover:bg-crosshere-crimson text-white border-none"
          onClick={() => router.push("/login")}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to sign in
        </Button>
        <Button
          variant="outline"
          className="w-full h-12 text-base font-medium"
          onClick={handleResend}
          disabled={isResending}
        >
          {isResending ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="size-4 animate-spin" />
              Resending...
            </span>
          ) : (
            "Resend verification email"
          )}
        </Button>
      </div>
    </motion.div>
  );
}

export default function VerifyEmailPage() {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="size-8 border-2 border-crosshere border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </React.Suspense>
  );
}
