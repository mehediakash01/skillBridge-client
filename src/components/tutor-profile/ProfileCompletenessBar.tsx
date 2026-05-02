/**
 * Profile Completeness Bar Component
 * Visual progress indicator with missing fields guidance
 */

"use client";

import React from "react";
import { ChevronDown, AlertCircle, Check } from "lucide-react";
import type { ProfileCompleteness } from "@/types/tutor-profile";

interface ProfileCompletenessBarProps {
  completeness: ProfileCompleteness;
  onFieldClick?: (field: string) => void;
  expandable?: boolean;
}

// Human-readable field names
const FIELD_NAMES: Record<string, string> = {
  headline: "Professional Headline",
  bio_long: "Teaching Bio",
  intro_video_url: "Introduction Video",
  experience_years: "Years of Experience",
  languages: "Languages",
  education: "Education",
  avatar_url: "Profile Photo",
  hourlyRate: "Hourly Rate",
};

const FIELD_DESCRIPTIONS: Record<string, string> = {
  headline: "Add a professional hook (e.g., 'Senior Software Engineer | 5yrs Teaching')",
  bio_long: "Write about your teaching methodology (50-1000 characters)",
  intro_video_url: "Upload a 30-second intro video from YouTube or Vimeo",
  experience_years: "Specify your years of professional experience",
  languages: "Add languages you teach in",
  education: "List your degrees and certifications",
  avatar_url: "Upload a high-resolution profile photo",
  hourlyRate: "Set your hourly teaching rate ($5-$500)",
};

export function ProfileCompletenessBar({
  completeness,
  onFieldClick,
  expandable = true,
}: ProfileCompletenessBarProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Determine color based on percentage
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 70) return "bg-blue-500";
    if (percentage >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 100) return "Profile Complete! 🎉";
    if (percentage >= 90) return "Almost there!";
    if (percentage >= 70) return "Good progress";
    if (percentage >= 50) return "Halfway there";
    return "Just getting started";
  };

  return (
    <div className="space-y-3">
      {/* Main Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Profile Completeness
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {getStatusText(completeness.percentage)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {completeness.percentage}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {completeness.completedFields} of {completeness.totalFields} fields
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${getProgressColor(
              completeness.percentage
            )} transition-all duration-500 ease-out`}
            style={{ width: `${completeness.percentage}%` }}
          />
        </div>
      </div>

      {/* Missing Fields */}
      {completeness.missingFields.length > 0 && (
        <div
          className={`border rounded-lg transition-all ${
            isExpanded
              ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20"
              : "border-gray-200 dark:border-gray-700"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              if (expandable) setIsExpanded(!isExpanded);
            }}
            disabled={!expandable}
            className="w-full flex items-center justify-between gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:hover:bg-transparent"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {completeness.missingFields.length} fields to complete
              </span>
            </div>
            {expandable && (
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isExpanded && "rotate-180"
                }`}
              />
            )}
          </button>

          {/* Expandable Missing Fields */}
          {isExpanded && (
            <div className="border-t border-amber-200 dark:border-amber-800 p-3 space-y-2">
              {completeness.missingFields.map((field) => (
                <div
                  key={field}
                  className="flex items-start gap-3 p-2 rounded hover:bg-white dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {FIELD_NAMES[field] || field}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {FIELD_DESCRIPTIONS[field] || "Complete this field to improve your profile"}
                    </p>
                  </div>
                  {onFieldClick && (
                    <button
                      type="button"
                      onClick={() => onFieldClick(field)}
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0"
                    >
                      Add
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Completed Message */}
      {completeness.percentage >= 100 && (
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-3">
          <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              Your profile is complete!
            </p>
            <p className="text-xs text-green-700 dark:text-green-200">
              You can now publish your profile to start receiving student inquiries.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
