/**
 * Tag Cloud Input Component
 * Multi-select component with autocomplete and visual feedback
 */

"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TagOption {
  id: number | string;
  label: string;
  description?: string;
  category?: string;
}

interface TagCloudInputProps {
  label: string;
  placeholder?: string;
  options: TagOption[];
  selectedIds: (number | string)[];
  onSelectionChange: (ids: (number | string)[]) => void;
  maxSelection?: number;
  searchable?: boolean;
  error?: string;
  description?: string;
}

export function TagCloudInput({
  label,
  placeholder = "Search and select items...",
  options,
  selectedIds,
  onSelectionChange,
  maxSelection,
  searchable = true,
  error,
  description,
}: TagCloudInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  useEffect(() => {
    if (!searchable) {
      setFilteredOptions(options);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(term) ||
        opt.description?.toLowerCase().includes(term) ||
        opt.category?.toLowerCase().includes(term)
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options, searchable]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.filter((opt) => selectedIds.includes(opt.id));

  const handleToggleOption = useCallback(
    (optionId: number | string) => {
      if (selectedIds.includes(optionId)) {
        onSelectionChange(selectedIds.filter((id) => id !== optionId));
      } else if (!maxSelection || selectedIds.length < maxSelection) {
        onSelectionChange([...selectedIds, optionId]);
      }
    },
    [selectedIds, onSelectionChange, maxSelection]
  );

  const handleRemoveTag = (optionId: number | string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    handleToggleOption(optionId);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        handleToggleOption(filteredOptions[0].id);
        setSearchTerm("");
      }
    }
  };

  return (
    <div className="space-y-3" ref={containerRef}>
      <div className="flex justify-between items-start">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {maxSelection && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {selectedIds.length} / {maxSelection}
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}

      <div
        className={cn(
          "relative border rounded-lg transition-all",
          isOpen
            ? "border-blue-500 ring-1 ring-blue-500"
            : "border-gray-300 dark:border-gray-600",
          error && "border-red-500 ring-1 ring-red-500"
        )}
      >
        {/* Selected Tags Display */}
        <div className="p-3 space-y-2">
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selected.map((tag) => (
                <div
                  key={tag.id}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium"
                >
                  {tag.label}
                  <button
                    type="button"
                    onClick={(e) => handleRemoveTag(tag.id, e)}
                    className="hover:opacity-70 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Search Input */}
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder={selected.length > 0 ? "Add more..." : placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              disabled={!!(maxSelection && selectedIds.length >= maxSelection)}
              className={cn(
                "flex-1 outline-none bg-transparent text-sm dark:text-white",
                maxSelection &&
                  selectedIds.length >= maxSelection &&
                  "opacity-50 cursor-not-allowed"
              )}
            />
            <ChevronDown
              className={cn(
                "w-4 h-4 text-gray-400 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    handleToggleOption(option.id);
                    setSearchTerm("");
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2",
                    selectedIds.includes(option.id) &&
                      "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200"
                  )}
                >
                  <div className="flex-shrink-0 w-4 h-4 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                    {selectedIds.includes(option.id) && (
                      <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-sm" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{option.label}</p>
                    {option.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {option.description}
                      </p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Clear All Button */}
      {selectedIds.length > 0 && (
        <button
          type="button"
          onClick={handleClearAll}
          className="text-xs text-blue-600 hover:underline dark:text-blue-400"
        >
          Clear all selections
        </button>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
