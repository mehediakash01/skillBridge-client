/**
 * Tutor Profile Utility Functions
 * Helper functions for profile management, completeness calculation, and draft handling
 */

import type {
  TutorProfileInput,
  ProfileCompleteness,
  ProfileDraft,
  Step1Data,
  Step2Data,
  Step3Data,
} from "@/types/tutor-profile";

const DRAFT_STORAGE_KEY = "tutor_profile_draft";

/**
 * Calculate profile completeness percentage and missing fields
 */
export function calculateProfileCompleteness(
  profile: Partial<TutorProfileInput>
): ProfileCompleteness {
  const requiredFields = [
    "headline",
    "bio_long",
    "intro_video_url",
    "experience_years",
    "languages",
    "education",
    "avatar_url",
    "hourlyRate",
  ];

  let completedFields = 0;
  const missingFields: string[] = [];

  requiredFields.forEach((field) => {
    const value = profile[field as keyof TutorProfileInput];

    if (value === undefined || value === null || value === "") {
      missingFields.push(field);
    } else if (Array.isArray(value) && value.length === 0) {
      missingFields.push(field);
    } else {
      completedFields++;
    }
  });

  const percentage = Math.round(
    (completedFields / requiredFields.length) * 100
  );

  return {
    totalFields: requiredFields.length,
    completedFields,
    percentage,
    missingFields,
  };
}

/**
 * Save draft to localStorage
 */
export function saveDraftToLocalStorage(draft: ProfileDraft): void {
  try {
    const draftWithTimestamp: ProfileDraft = {
      ...draft,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftWithTimestamp));
  } catch (error) {
    console.error("Failed to save draft to localStorage:", error);
  }
}

/**
 * Load draft from localStorage
 */
export function loadDraftFromLocalStorage(): ProfileDraft | null {
  try {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to load draft from localStorage:", error);
    return null;
  }
}

/**
 * Clear draft from localStorage
 */
export function clearDraftFromLocalStorage(): void {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear draft from localStorage:", error);
  }
}

/**
 * Check if draft exists and is not too old (24 hours)
 */
export function isDraftValid(draft: ProfileDraft | null): boolean {
  if (!draft || !draft.lastSaved) return false;

  const lastSavedTime = new Date(draft.lastSaved).getTime();
  const now = new Date().getTime();
  const twentyFourHoursMs = 24 * 60 * 60 * 1000;

  return now - lastSavedTime < twentyFourHoursMs;
}

/**
 * Get step completeness status
 */
export function getStepCompleteness(
  step: "step1" | "step2" | "step3",
  data: Step1Data | Step2Data | Step3Data | undefined
): boolean {
  if (!data) return false;

  switch (step) {
    case "step1": {
      const step1 = data as Step1Data;
      return !!(step1.headline && step1.headline.length >= 10);
    }
    case "step2": {
      const step2 = data as Step2Data;
      return !!(
        step2.bio_long &&
        step2.bio_long.length >= 50 &&
        step2.experience_years !== undefined &&
        step2.languages &&
        step2.languages.length > 0 &&
        step2.education &&
        step2.education.length > 0 &&
        step2.subjects &&
        step2.subjects.length > 0
      );
    }
    case "step3": {
      const step3 = data as Step3Data;
      return !!(
        step3.hourlyRate &&
        step3.hourlyRate > 0 &&
        step3.availability &&
        step3.availability.length > 0
      );
    }
    default:
      return false;
  }
}

/**
 * Merge draft data with form data
 */
export function mergeDraftWithFormData(
  draft: ProfileDraft,
  currentFormData: Partial<TutorProfileInput>
): Partial<TutorProfileInput> {
  return {
    ...currentFormData,
    headline: draft.step1?.headline || currentFormData.headline,
    intro_video_url:
      draft.step1?.intro_video_url || currentFormData.intro_video_url,
    avatar_url: draft.step1?.avatar_url || currentFormData.avatar_url,
    bio_long: draft.step2?.bio_long || currentFormData.bio_long,
    experience_years:
      draft.step2?.experience_years || currentFormData.experience_years,
    languages: draft.step2?.languages || currentFormData.languages,
    education: draft.step2?.education || currentFormData.education,
    hourlyRate: draft.step3?.hourlyRate || currentFormData.hourlyRate,
  };
}

/**
 * Format time for display (HH:MM to readable)
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

/**
 * Calculate platform fee based on hourly rate
 */
export function calculatePlatformFee(hourlyRate: number): number {
  // Example: 15% fee for rates up to $50, 12% for higher rates
  if (hourlyRate <= 50) {
    return Math.round(hourlyRate * 0.15 * 100) / 100;
  }
  return Math.round(hourlyRate * 0.12 * 100) / 100;
}

/**
 * Calculate tutor earnings after platform fee
 */
export function calculateTutorEarnings(hourlyRate: number): number {
  const fee = calculatePlatformFee(hourlyRate);
  return Math.round((hourlyRate - fee) * 100) / 100;
}

/**
 * Generate profile URL for sharing
 */
export function generateProfileShareUrl(tutorId: string): string {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://skillbridge.app";
  return `${baseUrl}/tutors/${tutorId}`;
}

/**
 * Validate video URL format
 */
export function isValidVideoUrl(url?: string): boolean {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname.includes("youtube.com") ||
      urlObj.hostname.includes("youtu.be") ||
      urlObj.hostname.includes("vimeo.com")
    );
  } catch {
    return false;
  }
}

/**
 * Extract video ID from URL
 */
export function extractVideoId(url: string): string | null {
  try {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const urlObj = new URL(url);
      return (
        urlObj.searchParams.get("v") ||
        urlObj.pathname.split("/").pop() ||
        null
      );
    } else if (url.includes("vimeo.com")) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? match[1] : null;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Get badge color based on badge type
 */
export function getBadgeColor(badge: string): string {
  const colors: Record<string, string> = {
    Verified: "bg-green-100 text-green-800 border-green-200",
    "Fast Responder":
      "bg-blue-100 text-blue-800 border-blue-200",
    "Top 1%": "bg-purple-100 text-purple-800 border-purple-200",
    Certified: "bg-amber-100 text-amber-800 border-amber-200",
    "Super Tutor": "bg-red-100 text-red-800 border-red-200",
  };
  return colors[badge] || "bg-gray-100 text-gray-800 border-gray-200";
}

/**
 * Get language level description
 */
export function getLanguageLevelDescription(level: string): string {
  const descriptions: Record<string, string> = {
    Native: "Native speaker",
    Fluent: "Fluent (near-native)",
    Intermediate: "Intermediate proficiency",
    Beginner: "Basic proficiency",
  };
  return descriptions[level] || level;
}
