"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight">SkillBridge</h1>
      <p className="mt-4 text-xl text-muted-foreground">
        Connect with Expert Tutors • Learn Anything
      </p>

      <div className="mt-10">
        <Button
          size="lg"
          onClick={() =>
            toast.success("Phase 1 complete!", {
              description: "Setup with shadcn Sonner, Query, Navbar & Footer done.",
            })
          }
        >
          Test Notification
        </Button>
      </div>
    </div>
  );
}