/**
 * Main Tutor Profile Input Form
 * Multi-step form with progressive onboarding and real-time preview
 */

"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import {
  TutorProfileSchema,
  Step1Schema,
  Step2Schema,
  Step3Schema,
  type TutorProfileFormData,
} from "@/lib/schemas/tutor-profile-schema";
import {
  calculateProfileCompleteness,
  saveDraftToLocalStorage,
  loadDraftFromLocalStorage,
  isDraftValid,
  mergeDraftWithFormData,
} from "@/lib/utils/tutor-profile";
import { Step1Form } from "./forms/Step1Form";
import { Step2Form } from "./forms/Step2Form";
import { Step3Form } from "./forms/Step3Form";
import { LiveCardPreview } from "./LiveCardPreview";
import { ProfileCompletenessBar } from "./ProfileCompletenessBar";
import type { TagOption } from "./TagCloudInput";
import type { ProfileCompleteness } from "@/types/tutor-profile";

interface TutorProfileFormProps {
  tutorId?: string;
  initialData?: Partial<TutorProfileFormData>;
  onSuccess?: (data: TutorProfileFormData) => void;
  onCancel?: () => void;
}

type Step = 1 | 2 | 3;

export function TutorProfileForm({
  tutorId,
  initialData,
  onSuccess,
  onCancel,
}: TutorProfileFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [profileCompleteness, setProfileCompleteness] =
    useState<ProfileCompleteness>({
      totalFields: 8,
      completedFields: 0,
      percentage: 0,
      missingFields: [],
    });
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Fetch categories for subject selection
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      // Replace with actual API call
      return [
        { id: 1, label: "Next.js", description: "Modern React framework" },
        { id: 2, label: "Python", description: "General purpose programming" },
        { id: 3, label: "JavaScript", description: "Web programming" },
        { id: 4, label: "React", description: "JavaScript library" },
        { id: 5, label: "Node.js", description: "Server-side JavaScript" },
        { id: 6, label: "TypeScript", description: "JavaScript with types" },
        { id: 7, label: "MongoDB", description: "NoSQL database" },
        { id: 8, label: "SQL", description: "Relational databases" },
      ] as TagOption[];
    },
  });

  // Mutation for saving profile
  const saveMutation = useMutation({
    mutationFn: async (data: TutorProfileFormData) => {
      // Replace with actual API call
      console.log("Saving profile:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return data;
    },
    onSuccess: (data) => {
      toast.success("Profile published successfully!");
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error("Failed to save profile. Please try again.");
      console.error("Save error:", error);
    },
  });

  // Initialize form with React Hook Form
  const methods = useForm<TutorProfileFormData>({
    resolver: zodResolver(TutorProfileSchema),
    mode: "onChange",
    defaultValues: initialData || {
      headline: "",
      bio: "",
      bio_long: "",
      intro_video_url: "",
      badges: [],
      experience_years: 0,
      languages: [{ lang: "", level: "Native" }],
      education: [{ degree: "", field: "", school: "", verified: false }],
      hourlyRate: 50,
      experience: 0,
      is_published: false,
    },
  });

  // Simulate initial load delay
  useEffect(() => {
    setTimeout(() => setShowSkeleton(false), 800);
  }, []);

  // Load draft if available
  useEffect(() => {
    const draft = loadDraftFromLocalStorage();
    if (draft && isDraftValid(draft)) {
      const confirmRestore = window.confirm(
        "Found a saved draft from your last session. Would you like to restore it?"
      );
      if (confirmRestore) {
        const merged = mergeDraftWithFormData(draft, methods.getValues());
        methods.reset(merged as TutorProfileFormData);
        toast.info("Draft restored successfully");
      }
    }
  }, []);

  // Auto-save draft on form changes
  useEffect(() => {
    const subscription = methods.watch((data) => {
      saveDraftToLocalStorage({
        step1:
          currentStep >= 1
            ? {
                headline: data.headline,
                intro_video_url: data.intro_video_url,
                avatar_url: data.avatar_url,
              }
            : undefined,
        step2:
          currentStep >= 2
            ? {
                bio_long: data.bio_long,
                experience_years: data.experience_years,
                languages: data.languages,
                education: data.education,
                subjects: data.education?.map(() => 1) || [], // Placeholder
              }
            : undefined,
        step3:
          currentStep >= 3
            ? {
                hourlyRate: data.hourlyRate,
                platformFee: 0,
                availability: [],
                payoutMethod: undefined,
              }
            : undefined,
      });

      // Update completeness
      const completeness = calculateProfileCompleteness(data);
      setProfileCompleteness(completeness);
    });

    return () => subscription.unsubscribe();
  }, [methods, currentStep]);

  // Handle step validation and progression
  const handleNextStep = async () => {
    if (currentStep === 1) {
      const valid = await methods.trigger(["headline", "avatar_url", "intro_video_url"]);
      if (valid) setCurrentStep(2);
    } else if (currentStep === 2) {
      const valid = await methods.trigger([
        "bio_long",
        "experience_years",
        "languages",
        "education",
      ]);
      if (valid) setCurrentStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handlePublish = async () => {
    const valid = await methods.trigger();
    if (valid) {
      saveMutation.mutate(methods.getValues());
    }
  };

  const formValues = methods.watch();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Your Tutor Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Step {currentStep} of 3 - {
              currentStep === 1
                ? "Identity & Trust"
                : currentStep === 2
                  ? "Expertise"
                  : "Logistics"
            }
          </p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            Close
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${(currentStep / 3) * 100}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <FormProvider {...methods}>
            <form className="space-y-6">
              {currentStep === 1 && (
                <Step1Form onNext={handleNextStep} isSubmitting={saveMutation.isPending} />
              )}
              {currentStep === 2 && (
                <Step2Form
                  onNext={handleNextStep}
                  onBack={handlePreviousStep}
                  isSubmitting={saveMutation.isPending}
                  categories={categories}
                />
              )}
              {currentStep === 3 && (
                <Step3Form
                  onBack={handlePreviousStep}
                  onSubmit={handlePublish}
                  isSubmitting={saveMutation.isPending}
                />
              )}
            </form>
          </FormProvider>
        </div>

        {/* Preview Section */}
        <div className="space-y-4">
          {/* Profile Completeness */}
          <div className="sticky top-4 space-y-4">
            <ProfileCompletenessBar
              completeness={profileCompleteness}
              expandable={false}
            />

            {/* Live Preview */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Live Preview
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                See how you'll appear to students
              </p>
              <LiveCardPreview
                step1Data={{
                  headline: formValues.headline || "",
                  avatar_url: formValues.avatar_url,
                  intro_video_url: formValues.intro_video_url,
                }}
                step2Data={{
                  bio_long: formValues.bio_long || "",
                  experience_years: formValues.experience_years || 0,
                  languages: formValues.languages || [],
                  education: formValues.education || [],
                  subjects: [],
                }}
                hourlyRate={formValues.hourlyRate}
                badges={formValues.badges || []}
                showSkeleton={showSkeleton}
              />
            </div>

            {/* Draft Auto-Save Indicator */}
            <div className="flex items-center gap-2 p-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs">
              <Save className="w-3 h-3" />
              <span>Auto-saving your draft...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Step Indicators */}
      <div className="lg:hidden flex gap-2">
        {[1, 2, 3].map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => setCurrentStep(step as Step)}
            className={`flex-1 py-2 rounded font-medium transition ${
              currentStep === step
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Step {step}
          </button>
        ))}
      </div>
    </div>
  );
}
