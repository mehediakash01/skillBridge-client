/**
 * Drag and Drop File Uploader Component
 * Handles avatar and document uploads with progress and validation
 */

"use client";

import React, { useState, useRef, useCallback } from "react";
import { Upload, X, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DragDropUploaderProps {
  onFileSelected: (file: File) => void;
  acceptedFormats?: string[];
  maxSizeInMB?: number;
  label: string;
  description?: string;
  currentImageUrl?: string;
  isLoading?: boolean;
  onClear?: () => void;
}

export function DragDropUploader({
  onFileSelected,
  acceptedFormats = ["image/jpeg", "image/png", "image/webp"],
  maxSizeInMB = 5,
  label,
  description,
  currentImageUrl,
  isLoading = false,
  onClear,
}: DragDropUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Check format
    if (!acceptedFormats.includes(file.type)) {
      setError(
        `Invalid format. Accepted: ${acceptedFormats.join(", ").split("/")[1]}`
      );
      return false;
    }

    // Check size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeInMB}MB`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 90) {
          clearInterval(interval);
          setUploadProgress(90);
        } else {
          setUploadProgress(Math.round(progress));
        }
      }, 200);

      onFileSelected(file);

      // Complete the progress
      setTimeout(() => {
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 500);
      }, 500);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>

      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}

      {currentImageUrl && (
        <div className="relative inline-block">
          <img
            src={currentImageUrl}
            alt="Current upload"
            className="w-20 h-20 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-all",
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
          isLoading && "opacity-60 pointer-events-none"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleInputChange}
          accept={acceptedFormats.join(",")}
          className="hidden"
          disabled={isLoading}
        />

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <div
              className="h-full bg-blue-500/20 transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        <div className="relative z-10 space-y-2">
          {uploadProgress === 100 ? (
            <Check className="w-10 h-10 mx-auto text-green-500" />
          ) : (
            <Upload className="w-10 h-10 mx-auto text-gray-400" />
          )}

          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Drag and drop your file here
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              or{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                click to browse
              </button>
            </p>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Max size: {maxSizeInMB}MB
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
