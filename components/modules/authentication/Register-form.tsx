"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/src/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, GraduationCap, BookOpen, Users, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { useRouter } from "next/navigation";


const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Minimum 8 characters"),
  role: z.enum(["STUDENT", "TUTOR"]),
});

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

const TUTOR_PERKS = [
  { icon: "💰", text: "Set your own hourly rate" },
  { icon: "📅", text: "Full control of your schedule" },
  { icon: "🌍", text: "Teach students globally" },
];

const STUDENT_PERKS = [
  { icon: "🎯", text: "1-on-1 personalized sessions" },
  { icon: "⭐", text: "Verified, rated tutors" },
  { icon: "📱", text: "Book in under 2 minutes" },
];

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"STUDENT" | "TUTOR">("STUDENT");
  const router = useRouter();
  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:3000",
    });
  };

  const form = useForm({
    defaultValues: { name: "", email: "", password: "", role: "STUDENT" as "STUDENT" | "TUTOR" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      const toastId = toast.loading("Creating your account…");
      try {
        const { error } = await authClient.signUp.email({ email: value.email, name: value.name, password: value.password });
        if (error) {
          toast.error(error.message, { id: toastId });
        } else {
          toast.success("Account created! Welcome to SkillBridge 🎉", { id: toastId });
          router.push("/"); 
        }
      } catch {
        toast.error("Something went wrong. Try again.", { id: toastId });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const perks = selectedRole === "TUTOR" ? TUTOR_PERKS : STUDENT_PERKS;

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">

      {/* ── Left panel — branding ─────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-primary px-12 py-14">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-125 h-125 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full translate-y-1/3 -translate-x-1/4" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,white/5_1px,transparent_1px),linear-gradient(to_bottom,white/5_1px,transparent_1px)] bg-size-[40px_40px] opacity-30" />
        </div>

        {/* Logo */}
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

        {/* Main copy — changes based on role */}
        <div className="relative space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-4">
              Join SkillBridge
            </p>
            <AnimatePresence mode="wait">
              <motion.h2
                key={selectedRole}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="text-5xl font-black text-white leading-[1.1]"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                {selectedRole === "TUTOR" ? (
                  <>Share Your<span className="block italic font-light opacity-80 mt-1">Expertise</span></>
                ) : (
                  <>Start Your<span className="block italic font-light opacity-80 mt-1">Learning Journey</span></>
                )}
              </motion.h2>
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={selectedRole + "-desc"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="text-white/70 text-base leading-relaxed max-w-sm"
              >
                {selectedRole === "TUTOR"
                  ? "Create your profile, set your schedule and start earning by teaching what you love."
                  : "Connect with expert tutors for live 1-on-1 sessions. Learn anything, on your schedule."
                }
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Dynamic perks */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRole + "-perks"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 pt-2"
            >
              {perks.map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.35 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-white/80 text-sm">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="relative grid grid-cols-3 gap-4"
        >
          {[
            { value: "500+", label: "Expert Tutors" },
            { value: "10k+", label: "Sessions Done" },
            { value: "4.9★", label: "Avg Rating" },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/15 text-center">
              <p className="text-white text-xl font-black" style={{ fontFamily: "Fraunces, serif" }}>{s.value}</p>
              <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Right panel — form ────────────────────────── */}
      <div className="flex flex-col justify-center items-center px-6 py-12 bg-background relative overflow-hidden">
        {/* Subtle background blobs */}
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

          {/* Header */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show" className="mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/8 px-3 py-1 rounded-full mb-4">
              <Sparkles className="w-3 h-3" />
              Free to join
            </div>
            <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>
              Create your account
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>

          {/* Role selector */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show" className="mb-6">
            <p className="text-sm font-medium mb-3">I want to join as</p>
            <form.Field name="role">
              {(field) => (
                <div className="grid grid-cols-2 gap-3">
                  {(["STUDENT", "TUTOR"] as const).map((role) => {
                    const isSelected = field.state.value === role;
                    const Icon = role === "STUDENT" ? BookOpen : Users;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          field.handleChange(role);
                          setSelectedRole(role);
                        }}
                        className={cn(
                          "relative flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-all",
                          isSelected
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-border hover:border-primary/30 hover:bg-muted text-muted-foreground"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {role === "STUDENT" ? "Student" : "Tutor"}
                        {isSelected && (
                          <motion.div
                            layoutId="role-indicator"
                            className="absolute -top-px -right-px w-4 h-4 bg-primary rounded-bl-lg rounded-tr-xl flex items-center justify-center"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </form.Field>
          </motion.div>

          {/* Google button */}
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 rounded-xl border bg-background px-4 py-3 text-sm font-medium shadow-sm hover:bg-muted transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </motion.div>

          {/* Divider */}
          <motion.div
            custom={3} variants={fadeUp} initial="hidden" animate="show"
            className="flex items-center gap-3 my-5"
          >
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or register with email</span>
            <div className="flex-1 h-px bg-border" />
          </motion.div>

          {/* Form fields */}
          <form
            onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
            className="space-y-4"
          >
            {/* Name */}
            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show">
              <form.Field name="name">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={cn("h-11 rounded-xl", isInvalid && "border-destructive ring-1 ring-destructive")}
                      />
                      <AnimatePresence>
                        {isInvalid && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs text-destructive">
                            {(field.state.meta.errors?.[0] as any)?.message || "Invalid input"}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }}
              </form.Field>
            </motion.div>

            {/* Email */}
            <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show">
              <form.Field name="email">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={cn("h-11 rounded-xl", isInvalid && "border-destructive ring-1 ring-destructive")}
                      />
                      <AnimatePresence>
                        {isInvalid && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs text-destructive">
                            {(field.state.meta.errors?.[0] as any)?.message || "Invalid input"}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }}
              </form.Field>
            </motion.div>

            {/* Password */}
            <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show">
              <form.Field name="password">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  const strength = field.state.value.length === 0 ? 0 : field.state.value.length < 8 ? 1 : field.state.value.length < 12 ? 2 : 3;
                  const strengthLabel = ["", "Weak", "Good", "Strong"][strength];
                  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-green-400"][strength];
                  return (
                    <div className="space-y-1.5">
                      <label htmlFor="password" className="text-sm font-medium">Password</label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Min. 8 characters"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={cn("h-11 rounded-xl pr-11", isInvalid && "border-destructive ring-1 ring-destructive")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password strength bar */}
                      {field.state.value.length > 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
                          <div className="flex gap-1">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i <= strength ? strengthColor : "bg-muted")} />
                            ))}
                          </div>
                          <p className={cn("text-xs", strength === 1 ? "text-red-500" : strength === 2 ? "text-yellow-600" : "text-green-600")}>
                            {strengthLabel} password
                          </p>
                        </motion.div>
                      )}

                      <AnimatePresence>
                        {isInvalid && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs text-destructive">
                            {(field.state.meta.errors?.[0] as any)?.message || "Invalid input"}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }}
              </form.Field>
            </motion.div>

            {/* Submit */}
            <motion.div custom={7} variants={fadeUp} initial="hidden" animate="show" className="pt-1">
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
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.p
            custom={8} variants={fadeUp} initial="hidden" animate="show"
            className="text-center text-xs text-muted-foreground mt-8"
          >
            By signing up, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">Terms</Link>
            {" & "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">Privacy Policy</Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
}