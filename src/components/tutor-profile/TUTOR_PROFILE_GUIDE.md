# Skill Bridge Tutor Profile System Documentation

## Overview

The Tutor Profile Input System is a comprehensive, professional-grade solution for tutors to create and manage their profiles on the Skill Bridge platform. It features progressive onboarding, real-time preview, automatic draft saving, and extensive validation.

## Features

### 1. **Progressive Onboarding (3 Steps)**

#### Step 1: Identity & Trust
- Professional photo upload with drag-and-drop
- Compelling headline creation
- Optional introduction video (YouTube/Vimeo)
- Real-time validation and feedback

#### Step 2: Expertise
- Detailed teaching methodology (bio_long)
- Years of professional experience
- Multi-language support with proficiency levels
- Education & certifications with verification status
- Subject/category selection (up to 10)

#### Step 3: Logistics & Payment
- Visual pricing slider with platform fee breakdown
- Real-time earnings calculation
- Availability time slot management
- Payout method selection (Bank Transfer, PayPal, Stripe)

### 2. **Real-Time Features**

- **Live Card Preview**: Students see exactly how the tutor appears
- **Profile Completeness Bar**: Visual progress with missing fields guidance
- **Auto-Save Drafts**: LocalStorage-based draft saving every 30 seconds
- **Skeleton Loading States**: Professional loading indicators

### 3. **Advanced Components**

- **DragDropUploader**: Intuitive file upload with progress tracking
- **TagCloudInput**: Multi-select component with autocomplete
- **PricingSlider**: Modern visual pricing with fee breakdown
- **ProfileCompletenessBar**: Comprehensive progress tracking

## Data Schema

### Enhanced TutorProfile Model

```prisma
model TutorProfile {
  id                  String      @id @default(uuid())
  userId              String      @unique
  headline            String?     // Professional hook
  bio                 String?     // Short bio
  bio_long            String?     // Rich text methodology
  intro_video_url     String?     // YouTube/Vimeo link
  badges              String[]    // ["Verified", "Fast Responder", "Top 1%"]
  experience_years    Int?        // Professional experience
  languages           Json?       // [{ lang: "English", level: "Native" }]
  education           Json?       // [{ degree: "B.S.", field: "CS", school: "MIT", verified: true }]
  avatar_url          String?     // High-res profile photo
  id_verified         Boolean     // ID verification status
  hourlyRate          Decimal     // Teaching rate
  profile_draft       Json?       // Auto-saved draft data
  is_published        Boolean     // Publication status
  
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
}
```

## Usage Guide

### Basic Implementation

```tsx
import { TutorProfileForm } from "@/components/tutor-profile/TutorProfileForm";

export default function TutorProfilePage() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <TutorProfileForm
        onSuccess={(data) => {
          console.log("Profile published:", data);
          // Redirect or show success message
        }}
        onCancel={() => {
          // Handle cancel
        }}
      />
    </div>
  );
}
```

### Using Individual Components

#### Step 1 Form
```tsx
import { Step1Form } from "@/components/tutor-profile/forms/Step1Form";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Step1Schema } from "@/lib/schemas/tutor-profile-schema";

export function MyStep1() {
  const methods = useForm({
    resolver: zodResolver(Step1Schema),
  });

  return (
    <FormProvider {...methods}>
      <Step1Form onNext={() => console.log(methods.getValues())} />
    </FormProvider>
  );
}
```

#### Drag Drop Uploader
```tsx
import { DragDropUploader } from "@/components/tutor-profile/DragDropUploader";

export function PhotoUpload() {
  return (
    <DragDropUploader
      label="Profile Photo"
      onFileSelected={(file) => {
        // Upload to Cloudinary or your service
      }}
      maxSizeInMB={5}
      acceptedFormats={["image/jpeg", "image/png", "image/webp"]}
    />
  );
}
```

#### Live Card Preview
```tsx
import { LiveCardPreview } from "@/components/tutor-profile/LiveCardPreview";

export function PreviewCard() {
  return (
    <LiveCardPreview
      step1Data={{
        headline: "Senior Software Engineer | 5yrs Teaching",
        avatar_url: "https://...",
        intro_video_url: "https://youtube.com/...",
      }}
      step2Data={{
        bio_long: "I teach...",
        experience_years: 5,
        languages: [{ lang: "English", level: "Native" }],
        education: [],
      }}
      hourlyRate={50}
      badges={["Verified", "Fast Responder"]}
    />
  );
}
```

### API Endpoints

#### Create Profile
```bash
POST /api/tutor-profile
Content-Type: application/json
Authorization: Bearer {token}

{
  "userId": "user-123",
  "headline": "Senior Software Engineer...",
  "bio_long": "I teach web development...",
  "experience_years": 5,
  "languages": [{ "lang": "English", "level": "Native" }],
  "education": [{ "degree": "B.S.", "field": "CS", "school": "MIT", "verified": true }],
  "hourlyRate": 50,
  "subjects": [1, 2, 3],
  "avatar_url": "https://...",
  "availability": [
    { "dayOfWeek": "mon", "startTime": "09:00", "endTime": "17:00" }
  ]
}
```

#### Update Profile
```bash
PUT /api/tutor-profile/:userId
Content-Type: application/json
Authorization: Bearer {token}

{
  "headline": "Updated headline...",
  // other fields to update
}
```

#### Publish Profile
```bash
PATCH /api/tutor-profile/:userId/publish
Authorization: Bearer {token}

{
  "is_published": true
}
```

#### Save Draft
```bash
PATCH /api/tutor-profile/:userId/draft
Authorization: Bearer {token}

{
  "draft": {
    "step1": { "headline": "..." },
    "step2": { "bio_long": "..." },
    "step3": { "hourlyRate": 50 }
  }
}
```

#### Get Published Tutors
```bash
GET /api/tutor-profile/published/list?page=1&limit=10&category=1
```

## Utility Functions

### Profile Management

```tsx
import {
  calculateProfileCompleteness,
  saveDraftToLocalStorage,
  loadDraftFromLocalStorage,
  calculatePlatformFee,
  calculateTutorEarnings,
  formatTimeRange,
} from "@/lib/utils/tutor-profile";

// Calculate completeness
const completeness = calculateProfileCompleteness(profileData);
console.log(`${completeness.percentage}% complete`);
console.log("Missing fields:", completeness.missingFields);

// Draft management
saveDraftToLocalStorage(draftData);
const draft = loadDraftFromLocalStorage();

// Pricing
const fee = calculatePlatformFee(50); // Returns 7.50
const earnings = calculateTutorEarnings(50); // Returns 42.50

// Formatting
console.log(formatTimeRange("09:00", "17:00")); // "9:00 AM - 5:00 PM"
```

## Validation Schemas (Zod)

All schemas are defined in `@/lib/schemas/tutor-profile-schema.ts`:

- `Step1Schema`: Headline, avatar, video URL
- `Step2Schema`: Bio, experience, languages, education
- `Step3Schema`: Pricing, availability, payout
- `TutorProfileSchema`: Complete profile validation

## Types

Comprehensive TypeScript types are available in `@/types/tutor-profile.ts`:

```tsx
import type {
  Step1FormData,
  Step2FormData,
  Step3FormData,
  TutorProfileInput,
  LanguageEntry,
  EducationEntry,
} from "@/types/tutor-profile";
```

## Platform Fee Structure

- **Rates up to $50/hr**: 15% fee
- **Rates above $50/hr**: 12% fee

Example:
- $50/hr → Fee: $7.50 → Tutor earns: $42.50
- $100/hr → Fee: $12.00 → Tutor earns: $88.00

## Best Practices

### 1. Image Optimization
- Use professional, well-lit photos
- Square format (1:1 aspect ratio)
- Minimum 200x200px, recommended 400x400px
- JPEG, PNG, or WebP format

### 2. Headline Tips
- Be specific about expertise
- Include experience level
- Mention key specializations
- Keep under 150 characters

### 3. Video Requirements
- 30 seconds maximum
- YouTube or Vimeo only
- Clear audio and video quality
- Show enthusiasm and professionalism

### 4. Bio Content
- Describe teaching approach
- Highlight achievements
- Mention student success stories
- Be authentic and personable

## Security Considerations

1. **Authentication**: All profile operations require user authentication
2. **Authorization**: Users can only edit their own profiles
3. **Input Validation**: All inputs validated with Zod schemas
4. **File Upload**: Size limits and format validation
5. **SQL Injection**: Protected by Prisma ORM
6. **XSS Protection**: React's built-in sanitization

## Performance Optimization

- **Lazy Loading**: Components load on demand
- **Image Optimization**: Responsive images with proper sizing
- **Draft Caching**: LocalStorage for instant draft restoration
- **Query Optimization**: Efficient database queries with proper indexing
- **Memoization**: React components memoized to prevent unnecessary re-renders

## Testing

### Unit Tests
```tsx
import { calculateProfileCompleteness } from "@/lib/utils/tutor-profile";

describe("calculateProfileCompleteness", () => {
  it("should calculate correct percentage", () => {
    const result = calculateProfileCompleteness({
      headline: "Test",
      bio_long: "Test bio",
    });
    expect(result.percentage).toBe(25);
  });
});
```

### Integration Tests
See `TutorProfileForm.integration.test.tsx` for full integration test examples.

## Troubleshooting

### Draft Not Saving
- Check browser's localStorage quota
- Verify local storage is not disabled
- Check console for errors

### Video URL Not Recognized
- Ensure URL is from YouTube or Vimeo
- Use full URL format
- Copy directly from browser address bar

### Images Not Uploading
- Check file size (max 5MB)
- Verify image format (JPG, PNG, WebP)
- Check browser console for errors

## Future Enhancements

1. **Video Upload**: Direct video upload instead of URL
2. **Rich Text Editor**: Advanced bio formatting
3. **Verification System**: ID verification workflow
4. **Badge Awards**: Automatic badge system based on performance
5. **Analytics Dashboard**: Tutor performance metrics
6. **Mobile App**: Native mobile experience
7. **AI Suggestions**: AI-powered profile optimization

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review code examples in documentation
3. Check component prop types in TypeScript files
4. Contact development team

---

**Last Updated**: May 2, 2026
**Version**: 1.0.0
