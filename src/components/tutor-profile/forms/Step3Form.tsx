/**
 * Step 3: Logistics Form Component
 * Pricing, Availability, and Payout Method
 */

"use client";

import React from "react";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { Plus, Trash2, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PricingSlider } from "./PricingSlider";
import type { Step3FormData } from "@/lib/schemas/tutor-profile-schema";

interface Step3FormProps {
  onBack?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

const DAYS_OF_WEEK = [
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
  { value: "fri", label: "Friday" },
  { value: "sat", label: "Saturday" },
  { value: "sun", label: "Sunday" },
];

const TIME_SLOTS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
];

export function Step3Form({
  onBack,
  onSubmit,
  isSubmitting = false,
}: Step3FormProps) {
  const { control, formState: { errors }, watch } = useFormContext<Step3FormData>();

  const {
    fields: availabilityFields,
    append: appendAvailability,
    remove: removeAvailability,
  } = useFieldArray({
    control,
    name: "availability",
  });

  const hourlyRateValue = watch("hourlyRate");

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Logistics & Availability
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Set your pricing and when you're available to teach
        </p>
      </div>

      {/* Pricing Slider */}
      <div>
        <Controller
          name="hourlyRate"
          control={control}
          render={({ field }) => (
            <PricingSlider
              value={field.value}
              onChange={field.onChange}
              min={5}
              max={500}
              step={5}
              error={errors.hourlyRate?.message}
              description="Set your hourly teaching rate. Students will see transparent platform fees."
              label="Hourly Rate"
            />
          )}
        />
      </div>

      {/* Availability */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Teaching Availability
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Add your available time slots. Students will book from these times.
          </p>
        </div>

        {availabilityFields.length > 0 && (
          <div className="space-y-2">
            {availabilityFields.map((field, index) => (
              <div key={field.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
                <div className="grid grid-cols-3 gap-2 items-end">
                  <Controller
                    name={`availability.${index}.dayOfWeek`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
                          Day
                        </label>
                        <select
                          {...field}
                          className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm outline-none"
                        >
                          {DAYS_OF_WEEK.map((day) => (
                            <option key={day.value} value={day.value}>
                              {day.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  />

                  <Controller
                    name={`availability.${index}.startTime`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
                          Start
                        </label>
                        <select
                          {...field}
                          className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm outline-none"
                        >
                          <option value="">Select time</option>
                          {TIME_SLOTS.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  />

                  <Controller
                    name={`availability.${index}.endTime`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
                          End
                        </label>
                        <select
                          {...field}
                          className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm outline-none"
                        >
                          <option value="">Select time</option>
                          {TIME_SLOTS.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeAvailability(index)}
                  className="w-full py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() =>
            appendAvailability({
              dayOfWeek: "mon",
              startTime: "09:00",
              endTime: "17:00",
            })
          }
          className="w-full py-2 px-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Time Slot
        </button>

        {errors.availability && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.availability.message}
          </p>
        )}
      </div>

      {/* Payout Method */}
      <div>
        <Controller
          name="payoutMethod"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Payout Method (Optional)
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Choose how you'd like to receive your earnings
              </p>
              <div className="space-y-2">
                {[
                  { value: "bank_transfer", label: "Bank Transfer", desc: "Direct to your bank account" },
                  { value: "paypal", label: "PayPal", desc: "Fast and convenient" },
                  { value: "stripe", label: "Stripe Connect", desc: "Recommended for international transfers" },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <input
                      type="radio"
                      {...field}
                      value={option.value}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {option.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        />
      </div>

      {/* Summary Info */}
      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 space-y-2">
        <h4 className="font-medium text-blue-900 dark:text-blue-200">📋 Summary</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Your rate: ${hourlyRateValue || "TBD"}/hour</li>
          <li>• Availability slots: {availabilityFields.length || "None added yet"}</li>
          <li>• Review and publish your profile once complete!</li>
        </ul>
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
          onClick={onSubmit}
          disabled={isSubmitting || availabilityFields.length === 0}
          className="flex-1"
          size="lg"
        >
          {isSubmitting ? "Publishing..." : "Publish Profile"}
        </Button>
      </div>
    </div>
  );
}
