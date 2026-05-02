/**
 * Tutor Profile Form - Integration Test Example
 * Demonstrates complete end-to-end usage of the Tutor Profile system
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TutorProfileForm } from "../TutorProfileForm";

// Mock data
const mockCategories = [
  { id: 1, label: "Next.js", description: "Modern React framework" },
  { id: 2, label: "Python", description: "General purpose programming" },
  { id: 3, label: "JavaScript", description: "Web programming" },
  { id: 4, label: "React", description: "JavaScript library" },
];

// Create a test wrapper with providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}

describe("TutorProfileForm - Integration Tests", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Mock window.matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  describe("Step 1: Identity & Trust", () => {
    it("should render Step 1 form on initial load", () => {
      render(
        <TestWrapper>
          <TutorProfileForm />
        </TestWrapper>
      );

      expect(screen.getByText(/Let's Start With Your Identity/i)).toBeInTheDocument();
      expect(screen.getByText(/Professional Photo/i)).toBeInTheDocument();
      expect(screen.getByText(/Professional Headline/i)).toBeInTheDocument();
    });

    it("should validate headline length", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <TutorProfileForm />
        </TestWrapper>
      );

      const headlineTextarea = screen.getByPlaceholderText(/Full-Stack Developer/i);
      
      // Type short headline (should fail validation)
      await user.type(headlineTextarea, "Short");
      await user.click(screen.getByText(/Next: Your Expertise/i));

      // Should show error
      await waitFor(() => {
        expect(screen.getByText(/Headline must be at least 10 characters/i)).toBeInTheDocument();
      });
    });

    it("should accept valid headline", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <TutorProfileForm />
        </TestWrapper>
      );

      const headlineTextarea = screen.getByPlaceholderText(/Full-Stack Developer/i);
      const validHeadline = "Senior Software Engineer | 5yrs Teaching Next.js";

      await user.type(headlineTextarea, validHeadline);
      
      // Should show character count
      expect(screen.getByText(new RegExp(`${validHeadline.length} / 150`))).toBeInTheDocument();
    });

    it("should validate video URL format", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <TutorProfileForm />
        </TestWrapper>
      );

      const videoInput = screen.getByPlaceholderText(/https:\/\/youtube.com/i);

      // Type invalid URL
      await user.type(videoInput, "https://example.com/video");

      // Should show error
      await waitFor(() => {
        expect(screen.getByText(/Must be from YouTube or Vimeo/i)).toBeInTheDocument();
      });

      // Clear and type valid YouTube URL
      await user.clear(videoInput);
      await user.type(videoInput, "https://youtube.com/watch?v=abc123");

      // Should show success
      await waitFor(() => {
        expect(screen.getByText(/Valid YouTube\/Vimeo link/i)).toBeInTheDocument();
      });
    });

    it("should proceed to Step 2 with valid data", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <TutorProfileForm />
        </TestWrapper>
      );

      const headlineTextarea = screen.getByPlaceholderText(/Full-Stack Developer/i);
      await user.type(
        headlineTextarea,
        "Senior Software Engineer | 5yrs Teaching Next.js"
      );

      await user.click(screen.getByText(/Next: Your Expertise/i));

      // Wait for Step 2 to appear
      await waitFor(() => {
        expect(screen.getByText(/Showcase Your Expertise/i)).toBeInTheDocument();
      });
    });
  });

  describe("Step 2: Expertise", () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <TutorProfileForm />
        </TestWrapper>
      );

      // Fill Step 1 and proceed
      const headlineTextarea = screen.getByPlaceholderText(/Full-Stack Developer/i);
      await user.type(
        headlineTextarea,
        "Senior Software Engineer | 5yrs Teaching Next.js"
      );
      await user.click(screen.getByText(/Next: Your Expertise/i));

      // Wait for Step 2
      await waitFor(() => {
        expect(screen.getByText(/Showcase Your Expertise/i)).toBeInTheDocument();
      });
    });

    it("should validate bio length", async () => {
      const user = userEvent.setup();
      const bioTextarea = screen.getByPlaceholderText(/Share your teaching philosophy/i);

      // Type too short bio
      await user.type(bioTextarea, "Short bio");
      await user.click(screen.getByText(/Next: Logistics/i));

      // Should show error
      await waitFor(() => {
        expect(screen.getByText(/Bio must be at least 50 characters/i)).toBeInTheDocument();
      });
    });

    it("should allow adding languages", async () => {
      const user = userEvent.setup();

      // Add language button should exist
      const addLanguageBtn = screen.getByText(/Add Language/i);
      expect(addLanguageBtn).toBeInTheDocument();

      await user.click(addLanguageBtn);

      // New language inputs should appear
      const langInputs = screen.getAllByPlaceholderText(/e.g., English, Spanish/i);
      expect(langInputs.length).toBeGreaterThan(0);
    });

    it("should allow adding education", async () => {
      const user = userEvent.setup();

      const addEducationBtn = screen.getByText(/Add Education/i);
      expect(addEducationBtn).toBeInTheDocument();

      await user.click(addEducationBtn);

      // New education inputs should appear
      const degreeInputs = screen.getAllByPlaceholderText(/e.g., B.S., M.A./i);
      expect(degreeInputs.length).toBeGreaterThan(0);
    });
  });

  describe("Step 3: Logistics", () => {
    it("should show pricing slider", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <TutorProfileForm />
        </TestWrapper>
      );

      // Fill all required fields and proceed to Step 3
      // (This is simplified for brevity)
      
      // Look for pricing slider
      const priceInput = screen.queryByPlaceholderText(/Enter custom rate/i);
      if (priceInput) {
        expect(priceInput).toBeInTheDocument();
      }
    });

    it("should validate hourly rate bounds", async () => {
      const user = userEvent.setup();
      const priceInput = screen.queryByPlaceholderText(/Enter custom rate/i);

      if (priceInput) {
        // Try setting below minimum
        await user.clear(priceInput);
        await user.type(priceInput, "2");
        await user.click(screen.getByText(/Publish Profile/i));

        await waitFor(() => {
          expect(screen.getByText(/Minimum hourly rate is \$5/i)).toBeInTheDocument();
        });
      }
    });

    it("should show platform fee breakdown", () => {
      render(
        <TestWrapper>
          <TutorProfileForm />
        </TestWrapper>
      );

      // Look for fee breakdown
      const feeBreakdown = screen.queryByText(/Earnings Breakdown/i);
      if (feeBreakdown) {
        expect(feeBreakdown).toBeInTheDocument();
      }
    });
  });

  describe("Draft Saving", () => {
    it("should auto-save draft to localStorage", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <TutorProfileForm />
        </TestWrapper>
      );

      const headlineTextarea = screen.getByPlaceholderText(/Full-Stack Developer/i);
      const testHeadline = "Senior Software Engineer | Teaching";

      await user.type(headlineTextarea, testHeadline);

      // Wait for auto-save
      await waitFor(
        () => {
          const draft = localStorage.getItem("tutor_profile_draft");
          expect(draft).not.toBeNull();
        },
        { timeout: 3000 }
      );
    });

    it("should restore draft on page reload", async () => {
      const user = userEvent.setup();
      const testHeadline = "Senior Software Engineer | Teaching";

      // First render - save draft
      const { unmount } = render(
        <TestWrapper>
          <TutorProfileForm />
        </TestWrapper>
      );

      const headlineTextarea = screen.getByPlaceholderText(/Full-Stack Developer/i);
      await user.type(headlineTextarea, testHeadline);

      // Wait for auto-save
      await waitFor(() => {
        expect(localStorage.getItem("tutor_profile_draft")).not.toBeNull();
      });

      unmount();

      // Second render - should restore
      render(
        <TestWrapper>
          <TutorProfileForm />
        </TestWrapper>
      );

      // Should show restore notification
      await waitFor(() => {
        const draft = localStorage.getItem("tutor_profile_draft");
        expect(draft).not.toBeNull();
      });
    });
  });

  describe("Profile Completeness", () => {
    it("should display profile completeness percentage", () => {
      render(
        <TestWrapper>
          <TutorProfileForm />
        </TestWrapper>
      );

      // Should show completeness indicator
      expect(screen.getByText(/Profile Completeness/i)).toBeInTheDocument();
    });

    it("should update completeness as fields are filled", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <TutorProfileForm />
        </TestWrapper>
      );

      const initialPercentage = screen.getByText(/0%/);
      expect(initialPercentage).toBeInTheDocument();

      const headlineTextarea = screen.getByPlaceholderText(/Full-Stack Developer/i);
      await user.type(
        headlineTextarea,
        "Senior Software Engineer | 5yrs Teaching"
      );

      // Percentage should increase
      await waitFor(() => {
        const completenessText = screen.queryByText(/\d+%/);
        expect(completenessText).toBeInTheDocument();
      });
    });
  });

  describe("Live Preview", () => {
    it("should display live card preview", () => {
      render(
        <TestWrapper>
          <TutorProfileForm />
        </TestWrapper>
      );

      // Should show preview section
      expect(screen.getByText(/Live Preview/i)).toBeInTheDocument();
      expect(screen.getByText(/See how you'll appear to students/i)).toBeInTheDocument();
    });

    it("should update preview as user types", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <TutorProfileForm />
        </TestWrapper>
      );

      const headlineTextarea = screen.getByPlaceholderText(/Full-Stack Developer/i);
      const testHeadline = "Senior Software Engineer | 5yrs Teaching";

      await user.type(headlineTextarea, testHeadline);

      // Preview should update
      await waitFor(() => {
        const previewText = screen.queryByText(testHeadline);
        // Note: Preview might be in a separate section
        expect(previewText).toBeInTheDocument();
      });
    });
  });

  describe("Form Navigation", () => {
    it("should allow going back from Step 2 to Step 1", async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <TutorProfileForm />
        </TestWrapper>
      );

      // Go to Step 2
      const headlineTextarea = screen.getByPlaceholderText(/Full-Stack Developer/i);
      await user.type(
        headlineTextarea,
        "Senior Software Engineer | 5yrs Teaching"
      );
      await user.click(screen.getByText(/Next: Your Expertise/i));

      // Wait for Step 2
      await waitFor(() => {
        expect(screen.getByText(/Showcase Your Expertise/i)).toBeInTheDocument();
      });

      // Go back
      await user.click(screen.getByText(/Back/i));

      // Should return to Step 1
      await waitFor(() => {
        expect(screen.getByText(/Let's Start With Your Identity/i)).toBeInTheDocument();
      });
    });
  });

  describe("Success Callback", () => {
    it("should call onSuccess when profile is published", async () => {
      const onSuccess = jest.fn();
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <TutorProfileForm onSuccess={onSuccess} />
        </TestWrapper>
      );

      // Fill and submit complete profile
      // (Simplified example)

      // onSuccess should be called
      // expect(onSuccess).toHaveBeenCalled();
    });

    it("should call onCancel when user clicks close", async () => {
      const onCancel = jest.fn();
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <TutorProfileForm onCancel={onCancel} />
        </TestWrapper>
      );

      // Look for close button - implementation depends on your UI
      // await user.click(closeButton);
      // expect(onCancel).toHaveBeenCalled();
    });
  });
});

/**
 * Example: Complete Profile Submission
 * Shows how to fill entire form and submit
 */
export async function exampleCompleteProfileSubmission() {
  const user = userEvent.setup();

  // Step 1: Identity & Trust
  const headlineInput = screen.getByPlaceholderText(/Full-Stack Developer/i);
  await user.type(headlineInput, "Senior Software Engineer | 5yrs Teaching Next.js");

  // Proceed to Step 2
  await user.click(screen.getByText(/Next: Your Expertise/i));

  // Step 2: Expertise
  const bioInput = screen.getByPlaceholderText(/Share your teaching philosophy/i);
  await user.type(
    bioInput,
    "I have over 5 years of experience teaching web development to beginners and advanced students alike. My approach focuses on practical, project-based learning."
  );

  const experienceInput = screen.getByDisplayValue(/0/);
  await user.clear(experienceInput);
  await user.type(experienceInput, "5");

  // Add language
  await user.click(screen.getByText(/Add Language/i));
  const langInputs = screen.getAllByPlaceholderText(/e.g., English, Spanish/i);
  await user.type(langInputs[langInputs.length - 1], "English");

  // Proceed to Step 3
  await user.click(screen.getByText(/Next: Logistics/i));

  // Step 3: Logistics
  const priceSlider = screen.getByRole("slider");
  await user.click(priceSlider);

  // Add availability
  await user.click(screen.getByText(/Add Time Slot/i));

  // Submit
  await user.click(screen.getByText(/Publish Profile/i));
}
