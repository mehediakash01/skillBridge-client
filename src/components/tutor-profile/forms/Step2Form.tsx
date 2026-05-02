/**
 * Step 2: Expertise Form Component
 * Bio, Experience, Languages, Education, and Subjects
 */

"use client";

import React, { useState } from "react";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { Plus, Trash2, AlertCircle, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TagCloudInput, type TagOption } from "./TagCloudInput";
import type { Step2FormData, LanguageFormData, EducationFormData } from "@/lib/schemas/tutor-profile-schema";

interface Step2FormProps {
  onNext?: () => void;
  onBack?: () => void;
  isSubmitting?: boolean;
  categories?: TagOption[];
}

const LANGUAGE_LEVELS = [
  { value: "Native", label: "Native Speaker" },
  { value: "Fluent", label: "Fluent" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Beginner", label: "Beginner" },
];

export function Step2Form({
  onNext,
  onBack,
  isSubmitting = false,
  categories = [],
}: Step2FormProps) {
  const { control, formState: { errors }, watch } = useFormContext<Step2FormData>();
  const bioLongValue = watch("bio_long");

  // Languages field array
  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: "languages",
  });

  // Education field array
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Showcase Your Expertise
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Tell students about your teaching style, experience, and qualifications
        </p>
      </div>

      {/* Teaching Bio */}
      <div>
        <Controller
          name="bio_long"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Teaching Methodology & Bio
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Describe your teaching approach, experience, and what makes you unique (50-1000 characters)
              </p>
              <textarea
                {...field}
                placeholder="Share your teaching philosophy, experience level, and what students can expect from lessons with you..."
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {bioLongValue?.length || 0} / 1000 characters
                </p>
                {bioLongValue && bioLongValue.length >= 50 && (
                  <span className="text-xs text-green-600 dark:text-green-400">✓ Good length</span>
                )}
              </div>
            </div>
          )}
        />
        {errors.bio_long && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.bio_long.message}
          </p>
        )}
      </div>

      {/* Experience Years */}
      <div>
        <Controller
          name="experience_years"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Years of Professional Experience
              </label>
              <div className="flex items-center gap-2">
                <Input
                  {...field}
                  type="number"
                  min="0"
                  max="70"
                  placeholder="0"
                  className="border-gray-300 dark:border-gray-600"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">years</span>
              </div>
            </div>
          )}
        />
        {errors.experience_years && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.experience_years.message}
          </p>
        )}
      </div>

      {/* Languages */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Languages You Teach
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Add all the languages you can teach in
          </p>
        </div>

        {languageFields.length > 0 && (
          <div className="space-y-2">
            {languageFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex-1 space-y-2">
                  <Controller
                    name={`languages.${index}.lang`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="e.g., English, Spanish"
                        className="border-gray-300 dark:border-gray-600"
                      />
                    )}
                  />
                  <Controller
                    name={`languages.${index}.level`}
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                      >
                        <option value="">Select proficiency level</option>
                        {LANGUAGE_LEVELS.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() =>
            appendLanguage({
              id: undefined,
              lang: "",
              level: "Native",
            } as LanguageFormData)
          }
          className="w-full py-2 px-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Language
        </button>
      </div>

      {/* Education */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Education & Certifications
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            List your degrees, certifications, and credentials
          </p>
        </div>

        {educationFields.length > 0 && (
          <div className="space-y-2">
            {educationFields.map((field, index) => (
              <div key={field.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Controller
                    name={`education.${index}.degree`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="e.g., B.S., M.A."
                        className="border-gray-300 dark:border-gray-600"
                      />
                    )}
                  />
                  <Controller
                    name={`education.${index}.field`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="e.g., Computer Science"
                        className="border-gray-300 dark:border-gray-600"
                      />
                    )}
                  />
                </div>
                <Controller
                  name={`education.${index}.school`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="School/University"
                      className="border-gray-300 dark:border-gray-600"
                    />
                  )}
                />
                <div className="grid grid-cols-2 gap-2 items-center">
                  <Controller
                    name={`education.${index}.year`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        placeholder="Year"
                        className="border-gray-300 dark:border-gray-600"
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() =>
            appendEducation({
              id: undefined,
              degree: "",
              field: "",
              school: "",
              year: new Date().getFullYear(),
              verified: false,
            } as EducationFormData)
          }
          className="w-full py-2 px-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      {/* Subjects Selection */}
      <div>
        <Controller
          name="subjects"
          control={control}
          render={({ field }) => (
            <TagCloudInput
              label="Teaching Subjects"
              description="Select the subjects you teach (click on each subject)"
              options={categories}
              selectedIds={field.value || []}
              onSelectionChange={field.onChange}
              maxSelection={10}
            />
          )}
        />
        {errors.subjects && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.subjects.message}
          </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={isSubmitting}
          className="flex-1"
          size="lg"
        >
          {isSubmitting ? "Saving..." : "Next: Logistics"}
        </Button>
      </div>
    </div>
  );
}
