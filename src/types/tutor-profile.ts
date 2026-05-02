/**
 * Tutor Profile Types
 * Comprehensive type definitions for the Tutor Profile Input System
 */

// Language proficiency level
export type LanguageLevel = "Native" | "Fluent" | "Intermediate" | "Beginner";

// Education entry
export interface EducationEntry {
  id?: string;
  degree: string; // e.g., "B.S.", "M.A.", "Certification"
  field: string; // e.g., "Computer Science"
  school: string; // e.g., "MIT"
  year?: number; // Graduation/completion year
  verified: boolean;
  verificationUrl?: string;
}

// Language entry
export interface LanguageEntry {
  id?: string;
  lang: string; // e.g., "English", "Spanish"
  level: LanguageLevel;
}

// Badge types
export type BadgeType = "Verified" | "Fast Responder" | "Top 1%" | "Certified" | "Super Tutor";

// Profile draft data (auto-saved)
export interface ProfileDraft {
  step1?: Step1Data;
  step2?: Step2Data;
  step3?: Step3Data;
  lastSaved?: string; // ISO timestamp
}

// Step 1: Identity & Trust
export interface Step1Data {
  avatar_url?: string;
  headline: string;
  intro_video_url?: string;
}

// Step 2: Expertise
export interface Step2Data {
  bio_long: string;
  experience_years: number;
  languages: LanguageEntry[];
  education: EducationEntry[];
  subjects: number[]; // Category IDs
}

// Step 3: Logistics
export interface Step3Data {
  hourlyRate: number;
  platformFee: number; // Calculated, shown for transparency
  availability: AvailabilityEntry[];
  payoutMethod?: string;
}

// Availability entry
export interface AvailabilityEntry {
  dayOfWeek: "sat" | "sun" | "mon" | "tue" | "wed" | "thu" | "fri";
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}

// Complete tutor profile
export interface TutorProfileInput {
  id?: string;
  userId: string;
  headline: string;
  bio: string;
  bio_long: string;
  intro_video_url?: string;
  badges: BadgeType[];
  experience_years: number;
  languages: LanguageEntry[];
  education: EducationEntry[];
  avatar_url?: string;
  id_verified: boolean;
  hourlyRate: number;
  experience: number;
  profile_draft?: ProfileDraft;
  is_published: boolean;
}

// API Response types
export interface TutorProfileResponse {
  success: boolean;
  data?: TutorProfileInput;
  message?: string;
  errors?: Record<string, string>;
}

// Profile completeness metadata
export interface ProfileCompleteness {
  totalFields: number;
  completedFields: number;
  percentage: number;
  missingFields: string[];
}
