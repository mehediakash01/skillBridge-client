/**
 * Tutor Profile System - Barrel Exports
 * Import all components and utilities from a single location
 */

// Components
export { TutorProfileForm } from "./TutorProfileForm";
export { DragDropUploader } from "./DragDropUploader";
export { TagCloudInput } from "./TagCloudInput";
export { PricingSlider } from "./PricingSlider";
export { ProfileCompletenessBar } from "./ProfileCompletenessBar";
export { LiveCardPreview } from "./LiveCardPreview";

// Form Steps
export { Step1Form } from "./forms/Step1Form";
export { Step2Form } from "./forms/Step2Form";
export { Step3Form } from "./forms/Step3Form";

// Utility Functions
export {
  calculateProfileCompleteness,
  saveDraftToLocalStorage,
  loadDraftFromLocalStorage,
  clearDraftFromLocalStorage,
  isDraftValid,
  getStepCompleteness,
  mergeDraftWithFormData,
  formatTimeRange,
  calculatePlatformFee,
  calculateTutorEarnings,
  generateProfileShareUrl,
  isValidVideoUrl,
  extractVideoId,
  getBadgeColor,
  getLanguageLevelDescription,
} from "@/lib/utils/tutor-profile";

// Validation Schemas
export {
  Step1Schema,
  Step2Schema,
  Step3Schema,
  TutorProfileSchema,
  ProfileDraftSchema,
  LanguageSchema,
  EducationSchema,
  type Step1FormData,
  type Step2FormData,
  type Step3FormData,
  type TutorProfileFormData,
  type ProfileDraftData,
  type LanguageFormData,
  type EducationFormData,
} from "@/lib/schemas/tutor-profile-schema";

// Types
export type {
  TutorProfileInput,
  Step1Data,
  Step2Data,
  Step3Data,
  ProfileDraft,
  LanguageEntry,
  EducationEntry,
  AvailabilityEntry,
  BadgeType,
  LanguageLevel,
  ProfileCompleteness,
  TutorProfileResponse,
} from "@/types/tutor-profile";

// Re-export commonly used types from TagCloudInput
export type { TagOption } from "./TagCloudInput";
