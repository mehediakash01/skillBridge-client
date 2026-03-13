"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, GraduationCap, KeyRound, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { easeInOut } from "framer-motion";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    password: z.string().min(8, "Minimum 8 characters"),
    confirmPassword: z.string().min(8, "Minimum 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeInOut },
  },
};

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm({
    defaultValues: { password: "", confirmPassword: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      if (!token) {
        toast.error("Invalid or missing reset token. Please request a new link.");
        return;
      }
      setIsSubmitting(true);
      const toastId = toast.loading("Resetting your password…");
      try {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newPassword: value.password,
            token,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          toast.error((data as { message?: string }).message ?? "Failed to reset password.", { id: toastId });
        } else {
          toast.success("Password reset successfully!", { id: toastId });
          setIsSuccess(true);
          setTimeout(() => router.push("/login"), 3000);
        }
      } catch {
        toast.error("Something went wrong. Try again.", { id: toastId });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <KeyRound className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">Invalid Reset Link</h1>
          <p className="text-muted-foreground text-sm">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link href="/forgot-password">
            <Button className="mt-2 rounded-xl">Request New Link</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">

      {/* ── Left panel — branding ─────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-primary px-12 py-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-125 h-125 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full translate-y-1/3 -translate-x-1/4" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,white/5_1px,transparent_1px),linear-gradient(to_bottom,white/5_1px,transparent_1px)] bg-size-[40px_40px] opacity-30" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5 relative"
        >
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">SkillBridge</span>
        </motion.div>

        <div className="relative space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-4">
              Almost there
            </p>
            <h2
              className="text-5xl font-black text-white leading-[1.1]"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              New Password,
              <span className="block italic font-light opacity-80 mt-1">
                Fresh Start.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-white/70 text-base leading-relaxed max-w-sm"
          >
            Choose a strong password to keep your account secure and get back to learning.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="space-y-3 pt-2"
          >
            {[
              { icon: "🔐", text: "Use at least 8 characters" },
              { icon: "💪", text: "Mix letters, numbers & symbols" },
              { icon: "🚫", text: "Avoid using personal info" },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-white/80 text-sm">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="relative bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/15"
        >
          <p className="text-white/90 text-sm leading-relaxed italic">
            "Security is not a product, but a process. Keep your account safe."
          </p>
          <p className="text-white/50 text-xs mt-2">— SkillBridge Security</p>
        </motion.div>
      </div>

      {/* ── Right panel — form ────────────────────────── */}
      <div className="flex flex-col justify-center items-center px-6 py-12 bg-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full translate-y-1/3 -translate-x-1/3" />
        </div>

        <div className="w-full max-w-md relative">

          {/* Mobile logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:hidden flex items-center gap-2 mb-8"
          >
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">SkillBridge</span>
          </motion.div>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Header */}
                <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <KeyRound className="w-6 h-6 text-primary" />
                  </div>
                  <h1
                    className="text-3xl font-black tracking-tight"
                    style={{ fontFamily: "Fraunces, serif" }}
                  >
                    Set a new password
                  </h1>
                  <p className="text-muted-foreground text-sm mt-2">
                    Your new password must be at least 8 characters long.
                  </p>
                </motion.div>

                {/* Form */}
                <form
                  onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
                  className="space-y-4"
                >
                  {/* New password */}
                  <motion.div variants={fadeUp} initial="hidden" animate="show">
                    <form.Field name="password">
                      {(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                        return (
                          <div className="space-y-1.5">
                            <label htmlFor="password" className="text-sm font-medium">
                              New password
                            </label>
                            <div className="relative">
                              <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className={`h-11 rounded-xl pr-11 transition-all ${
                                  isInvalid
                                    ? "border-destructive ring-1 ring-destructive"
                                    : "focus:ring-2 focus:ring-primary/20"
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                            <AnimatePresence>
                              {isInvalid && (
                                <motion.p
                                  initial={{ opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -4 }}
                                  className="text-xs text-destructive"
                                >
                                  {field.state.meta.errors?.[0]?.toString()}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      }}
                    </form.Field>
                  </motion.div>

                  {/* Confirm password */}
                  <motion.div variants={fadeUp} initial="hidden" animate="show">
                    <form.Field name="confirmPassword">
                      {(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                        return (
                          <div className="space-y-1.5">
                            <label htmlFor="confirmPassword" className="text-sm font-medium">
                              Confirm new password
                            </label>
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                type={showConfirm ? "text" : "password"}
                                placeholder="••••••••"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className={`h-11 rounded-xl pr-11 transition-all ${
                                  isInvalid
                                    ? "border-destructive ring-1 ring-destructive"
                                    : "focus:ring-2 focus:ring-primary/20"
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                            <AnimatePresence>
                              {isInvalid && (
                                <motion.p
                                  initial={{ opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -4 }}
                                  className="text-xs text-destructive"
                                >
                                  {field.state.meta.errors?.[0]?.toString()}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      }}
                    </form.Field>
                  </motion.div>

                  {/* Submit */}
                  <motion.div variants={fadeUp} initial="hidden" animate="show" className="pt-1">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-xl text-base font-semibold gap-2 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        />
                      ) : (
                        <>
                          Reset Password
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>

                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  className="mt-6 text-center"
                >
                  <p className="text-xs text-muted-foreground">
                    Remembered your password?{" "}
                    <Link href="/login" className="text-primary font-medium hover:underline">
                      Sign in
                    </Link>
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h1
                  className="text-3xl font-black tracking-tight mb-3"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  Password reset!
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs mx-auto">
                  Your password has been successfully reset. You'll be redirected to the login page in a moment.
                </p>
                <Link href="/login">
                  <Button className="rounded-xl gap-2">
                    Sign in now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
