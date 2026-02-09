

export interface User {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  isBanned?: boolean;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  categoryName: string;
}

export interface TutorProfile {
  id: string;
  bio: string;
  hourlyRate: number | string;    
  averageRate: number | string;
  experience: number;
  studentId: string;               
 
  user?: {
    name: string;
    image?: string | null;
  };
}

export interface TutorCardData {
  id: string;                     
  name: string;
  avatarUrl?: string | null;
  bio: string;
  hourlyRate: number | string;
  averageRating: number | string;
  subjects: string[];              
  reviewCount?: number;           }