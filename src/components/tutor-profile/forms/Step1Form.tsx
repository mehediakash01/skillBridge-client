/**
 * Step 1: Identity & Trust Form Component
 * Photo, Headline, and Intro Video
 */

"use client";

import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { AlertCircle, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DragDropUploader } from "./DragDropUploader";
import type { Step1FormData } from "@/lib/schemas/tutor-profile-schema";

interface Step1FormProps {
  onNext?: () => void;
  isSubmitting?: boolean;
}

export function Step1Form({ onNext, isSubmitting = false }: Step1FormProps) {
  const { control, formState: { errors }, watch } = useFormContext<Step1FormData>();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const headlineValue = watch("headline");
  const videoUrlValue = watch("intro_video_url");

  const handleAvatarSelect = async (file: File) => {
    setIsUploadingAvatar(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        setAvatarPreview(preview);
      };
      reader.readAsDataURL(file);

      // In production, upload to Cloudinary or similar
      // For now, we'll use the preview URL
      // After upload, you would call: form.setValue("avatar_url", uploadedUrl)
      
      // Simulate upload completion
      setTimeout(() => {
        setIsUploadingAvatar(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to process avatar:", error);
      setIsUploadingAvatar(false);
    }
  };

  const isVideoUrlValid = videoUrlValue && 
    (videoUrlValue.includes("youtube.com") || 
     videoUrlValue.includes("youtu.be") || 
     videoUrlValue.includes("vimeo.com"));

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Let's Start With Your Identity
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Upload a professional photo and create a compelling headline. This is how students will first see you!
        </p>
      </div>

      {/* Avatar Upload */}
      <div>
        <DragDropUploader
          label="Profile Photo"
          description="Use a clear, professional photo. Square format recommended (min 200x200px)"
          acceptedFormats={["image/jpeg", "image/png", "image/webp"]}
          maxSizeInMB={5}
          currentImageUrl={avatarPreview || undefined}
          isLoading={isUploadingAvatar}
          onFileSelected={handleAvatarSelect}
          onClear={() => setAvatarPreview(null)}
        />
        {errors.avatar_url && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.avatar_url.message}
          </p>
        )}
      </div>

      {/* Headline */}
      <div>
        <Controller
          name="headline"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Professional Headline
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Create a catchy one-liner that describes your expertise (e.g., "Senior Software Engineer @ TechCorp | 5yrs Teaching Next.js")
              </p>
              <textarea
                {...field}
                placeholder="e.g., Full-Stack Developer | Expert in React & Node.js | 8+ years experience"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {headlineValue?.length || 0} / 150 characters
                </p>
                {headlineValue && headlineValue.length >= 10 && (
                  <span className="text-xs text-green-600 dark:text-green-400">✓ Good length</span>
                )}
              </div>
            </div>
          )}
        />
        {errors.headline && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.headline.message}
          </p>
        )}
      </div>

      {/* Intro Video */}
      <div>
        <Controller
          name="intro_video_url"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Introduction Video (Optional)
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Upload a 30-second video from YouTube or Vimeo introducing yourself to potential students
              </p>
              <Input
                {...field}
                type="url"
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                className="border-gray-300 dark:border-gray-600"
              />
              {field.value && (
                <div className="space-y-2">
                  {isVideoUrlValid ? (
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-2">
                      <Play className="w-4 h-4 text-green-600 dark:text-green-400 fill-current" />
                      <span className="text-sm text-green-700 dark:text-green-200">
                        Valid YouTube/Vimeo link
                      </span>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm text-red-700 dark:text-red-200">
                        Must be from YouTube or Vimeo
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        />
        {errors.intro_video_url && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.intro_video_url.message}
          </p>
        )}
      </div>

      {/* Tips */}
      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 space-y-2">
        <h4 className="font-medium text-blue-900 dark:text-blue-200">💡 Tips for Success</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>✓ Use a well-lit, professional headshot</li>
          <li>✓ Make your headline specific to your teaching expertise</li>
          <li>✓ Video intro increases booking rate by 3x!</li>
          <li>✓ Keep video under 30 seconds</li>
        </ul>
      </div>

      {/* Next Button */}
      <Button
        onClick={onNext}
        disabled={isSubmitting || isUploadingAvatar}
        className="w-full"
        size="lg"
      >
        {isSubmitting ? "Saving..." : "Next: Your Expertise"}
      </Button>
    </div>
  );
}
