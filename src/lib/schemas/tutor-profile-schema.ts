/**
 * Tutor Profile Zod Schemas
 * Comprehensive validation for the entire profile input system
 */

import { z } from "zod";

// Language validation
export const LanguageSchema = z.object({
  id: z.string().optional(),
  lang: z.string().min(1, "Language required").max(50),
  level: z.enum(["Native", "Fluent", "Intermediate", "Beginner"]),
});

// Education validation
export const EducationSchema = z.object({
  id: z.string().optional(),
  degree: z.string().min(1, "Degree required").max(50),
  field: z.string().min(1, "Field required").max(100),
  school: z.string().min(1, "School name required").max(100),
  year: z.number().int().min(1950).max(new Date().getFullYear()).optional(),
  verified: z.boolean().default(false),
  verificationUrl: z.string().url().optional(),
});

// Step 1: Identity & Trust
export const Step1Schema = z.object({
  avatar_url: z.string().url("Invalid avatar URL").optional(),
  headline: z
    .string()
    .min(10, "Headline must be at least 10 characters")
    .max(150, "Headline must not exceed 150 characters")
    .describe("Professional hook (e.g., 'Senior Software Engineer @ TechCorp | 5yrs Teaching Next.js')"),
  intro_video_url: z
    .string()
    .url("Invalid video URL")
    .optional()
    .refine(
      (url) => {
        if (!url) return true;
        return (
          url.includes("youtube.com") ||
          url.includes("youtu.be") ||
          url.includes("vimeo.com")
        );
      },
      "Video must be from YouTube or Vimeo"
    ),
});

// Step 2: Expertise
export const Step2Schema = z.object({
  bio_long: z
    .string()
    .min(50, "Bio must be at least 50 characters")
    .max(1000, "Bio must not exceed 1000 characters")
    .describe("Detailed teaching methodology (Rich text)"),
  experience_years: z
    .number()
    .int()
    .min(0, "Experience years must be 0 or more")
    .max(70, "Experience years cannot exceed 70"),
  languages: z
    .array(LanguageSchema)
    .min(1, "At least one language required"),
  education: z
    .array(EducationSchema)
    .min(1, "At least one education entry required"),
  subjects: z
    .array(z.number().int().positive("Valid subject ID required"))
    .min(1, "Select at least one subject")
    .max(10, "Maximum 10 subjects allowed"),
});

// Step 3: Logistics
export const Step3Schema = z.object({
  hourlyRate: z
    .number()
    .min(5, "Minimum hourly rate is $5")
    .max(500, "Maximum hourly rate is $500"),
  platformFee: z.number().min(0).max(100).optional(),
  availability: z
    .array(
      z.object({
        dayOfWeek: z.enum(["sat", "sun", "mon", "tue", "wed", "thu", "fri"]),
        startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
        endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
      })
    )
    .min(1, "At least one availability slot required")
    .refine((slots) => {
      // Validate that end time is after start time for each slot
      return slots.every((slot) => {
        const [startHour, startMin] = slot.startTime.split(":").map(Number);
        const [endHour, endMin] = slot.endTime.split(":").map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        return endMinutes > startMinutes;
      });
    }, "End time must be after start time"),
  payoutMethod: z
    .enum(["bank_transfer", "paypal", "stripe"])
    .optional(),
});

// Complete profile schema (all steps combined)
export const TutorProfileSchema = z.object({
  id: z.string().optional(),
  userId: z.string().min(1, "User ID required"),
  headline: Step1Schema.shape.headline,
  bio: z.string().optional(),
  bio_long: Step2Schema.shape.bio_long,
  intro_video_url: Step1Schema.shape.intro_video_url,
  badges: z.array(
    z.enum(["Verified", "Fast Responder", "Top 1%", "Certified", "Super Tutor"])
  ).optional(),
  experience_years: Step2Schema.shape.experience_years,
  languages: Step2Schema.shape.languages,
  education: Step2Schema.shape.education,
  avatar_url: Step1Schema.shape.avatar_url,
  id_verified: z.boolean().optional(),
  hourlyRate: Step3Schema.shape.hourlyRate,
  experience: z.number().int().min(0),
  is_published: z.boolean().optional(),
  profile_draft: z.object({
    step1: Step1Schema.optional(),
    step2: Step2Schema.optional(),
    step3: Step3Schema.optional(),
    lastSaved: z.string().optional(),
  }).optional(),
});

// Draft data schema (partial, allows incomplete data)
export const ProfileDraftSchema = z.object({
  step1: Step1Schema.partial().optional(),
  step2: Step2Schema.partial().optional(),
  step3: Step3Schema.partial().optional(),
  lastSaved: z.string().optional(),
});

// Type exports
export type Step1FormData = z.infer<typeof Step1Schema>;
export type Step2FormData = z.infer<typeof Step2Schema>;
export type Step3FormData = z.infer<typeof Step3Schema>;
export type TutorProfileFormData = z.infer<typeof TutorProfileSchema>;
export type ProfileDraftData = z.infer<typeof ProfileDraftSchema>;
export type LanguageFormData = z.infer<typeof LanguageSchema>;
export type EducationFormData = z.infer<typeof EducationSchema>;
