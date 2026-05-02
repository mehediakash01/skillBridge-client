/**
 * Live Card Preview Component
 * Real-time preview of how tutor profile appears to students
 */

"use client";

import React from "react";
import { Star, MapPin, Video, Award, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { Step1Data, Step2Data, LanguageEntry, BadgeType } from "@/types/tutor-profile";
import { getBadgeColor, getLanguageLevelDescription } from "@/lib/utils/tutor-profile";

interface LiveCardPreviewProps {
  step1Data?: Step1Data;
  step2Data?: Step2Data;
  hourlyRate?: number;
  badges?: BadgeType[];
  isLoading?: boolean;
  showSkeleton?: boolean;
}

export function LiveCardPreview({
  step1Data,
  step2Data,
  hourlyRate = 50,
  badges = [],
  isLoading = false,
  showSkeleton = false,
}: LiveCardPreviewProps) {
  // Show skeleton while loading
  if (isLoading || showSkeleton) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Skeleton Header */}
        <div className="h-24 bg-gradient-to-r from-blue-400 to-purple-400" />

        {/* Skeleton Avatar */}
        <div className="px-4 pb-4 pt-0 transform -translate-y-10">
          <Skeleton className="w-16 h-16 rounded-full" />
        </div>

        {/* Skeleton Content */}
        <div className="px-4 pb-4 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    );
  }

  const hasHeadline = step1Data?.headline && step1Data.headline.length > 0;
  const hasVideo = step1Data?.intro_video_url;
  const hasAvatar = step1Data?.avatar_url;
  const hasLanguages = step2Data?.languages && step2Data.languages.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow">
      {/* Card Header */}
      <div className="h-24 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600" />

      {/* Profile Section */}
      <div className="px-4 pb-4 pt-0">
        {/* Avatar */}
        <div className="transform -translate-y-10 mb-3">
          {hasAvatar ? (
            <img
              src={step1Data.avatar_url}
              alt="Avatar"
              className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 bg-gray-300 dark:bg-gray-600 flex items-center justify-center shadow-md">
              <span className="text-gray-500 dark:text-gray-400 text-2xl">?</span>
            </div>
          )}
        </div>

        {/* Headline */}
        {hasHeadline ? (
          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">
            {step1Data.headline}
          </h3>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-1">
            Add a professional headline
          </p>
        )}

        {/* Rating (Placeholder) */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3 h-3 text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600"
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">No reviews yet</span>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {badges.map((badge) => (
              <Badge
                key={badge}
                className={`text-xs ${getBadgeColor(badge)}`}
                variant="outline"
              >
                {badge}
              </Badge>
            ))}
          </div>
        )}

        {/* Bio Preview */}
        {step2Data?.bio_long ? (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {step2Data.bio_long}
          </p>
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-3">
            Add a teaching bio
          </p>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-t border-gray-200 dark:border-gray-700 pt-3">
          {/* Experience */}
          {step2Data?.experience_years !== undefined && (
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Experience</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {step2Data.experience_years}+ yrs
                </p>
              </div>
            </div>
          )}

          {/* Hourly Rate */}
          {hourlyRate && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Rate</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  ${hourlyRate}/hr
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Languages */}
        {hasLanguages && (
          <div className="flex items-start gap-2 mb-3 pb-3 border-t border-gray-200 dark:border-gray-700 pt-3">
            <Globe className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Languages</p>
              <div className="flex flex-wrap gap-1">
                {step2Data.languages.map((lang: LanguageEntry, idx: number) => (
                  <span
                    key={idx}
                    className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded text-xs"
                    title={getLanguageLevelDescription(lang.level)}
                  >
                    {lang.lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Video Badge */}
        {hasVideo && (
          <div className="flex items-center gap-2 p-2 rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <Video className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span className="text-xs font-medium text-blue-900 dark:text-blue-200">
              Intro video
            </span>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          disabled
          className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-75 disabled:cursor-default"
        >
          Book a Session
        </button>
      </div>
    </div>
  );
}
