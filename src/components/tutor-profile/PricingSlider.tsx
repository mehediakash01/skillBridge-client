/**
 * Modern Pricing Slider Component
 * Visual pricing input with platform fee breakdown
 */

"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, Info } from "lucide-react";
import { calculatePlatformFee, calculateTutorEarnings } from "@/lib/utils/tutor-profile";

interface PricingSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  description?: string;
  label?: string;
}

export function PricingSlider({
  value,
  onChange,
  min = 5,
  max = 500,
  step = 5,
  error,
  description,
  label = "Hourly Rate",
}: PricingSliderProps) {
  const [hoveredPrice, setHoveredPrice] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState(value.toString());

  const displayPrice = hoveredPrice !== null ? hoveredPrice : value;
  const platformFee = calculatePlatformFee(displayPrice);
  const tutorEarnings = calculateTutorEarnings(displayPrice);

  // Calculate percentage for slider fill
  const percentage = ((value - min) / (max - min)) * 100;

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.currentTarget.value);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setInputValue(inputVal);

    if (inputVal === "") return;

    const numValue = Number(inputVal);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleInputBlur = () => {
    if (inputValue === "" || isNaN(Number(inputValue))) {
      setInputValue(value.toString());
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${displayPrice.toFixed(2)}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">per hour</p>
        </div>
      </div>

      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}

      {/* Slider */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleSliderChange}
            onMouseEnter={() => setHoveredPrice(value)}
            onMouseLeave={() => setHoveredPrice(null)}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
            }}
          />
          <style>{`
            input[type='range'].slider {
              -webkit-appearance: none;
              appearance: none;
            }
            input[type='range'].slider::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: white;
              border: 3px solid #3b82f6;
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            input[type='range'].slider::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: white;
              border: 3px solid #3b82f6;
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
          `}</style>

          {/* Tooltip */}
          {hoveredPrice !== null && (
            <div
              className="absolute top-8 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none z-50"
              style={{ left: `${percentage}%` }}
            >
              ${hoveredPrice.toFixed(2)}
            </div>
          )}
        </div>

        {/* Min and Max Labels */}
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>${min}</span>
          <span>${max}</span>
        </div>
      </div>

      {/* Direct Input */}
      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <DollarSign className="w-4 h-4 text-gray-400" />
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          min={min}
          max={max}
          step={step}
          className="flex-1 bg-transparent text-sm font-medium text-gray-900 dark:text-white outline-none"
          placeholder="Enter custom rate"
        />
        <span className="text-sm text-gray-500 dark:text-gray-400">/hr</span>
      </div>

      {/* Platform Fee Breakdown */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Earnings Breakdown
          </h4>
        </div>

        <div className="space-y-2 text-sm">
          {/* Student Pays */}
          <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded border border-blue-100 dark:border-blue-900">
            <span className="text-gray-600 dark:text-gray-300">Student pays:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              ${displayPrice.toFixed(2)}
            </span>
          </div>

          {/* Platform Fee */}
          <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded border border-red-100 dark:border-red-900/30">
            <span className="text-gray-600 dark:text-gray-300">
              Skill Bridge fee ({platformFee > displayPrice * 0.15 ? "12%" : "15%"}):
            </span>
            <span className="font-semibold text-red-600 dark:text-red-400">
              -${platformFee.toFixed(2)}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

          {/* You Earn */}
          <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-100 dark:border-green-900">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              You earn:
            </span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              ${tutorEarnings.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Fee Info */}
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Fee varies based on rate: 15% for rates up to $50/hr, 12% for higher rates
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Price Suggestions */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
          Quick select:
        </p>
        <div className="grid grid-cols-4 gap-2">
          {[25, 50, 75, 100].map((price) => (
            <button
              key={price}
              type="button"
              onClick={() => onChange(price)}
              className={`p-2 rounded border text-sm font-medium transition-all ${
                value === price
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
              }`}
            >
              ${price}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
