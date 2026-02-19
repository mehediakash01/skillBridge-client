

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






  // tutor types

export type TutorCategory = {
  id: number
  categoryName: string
}

export type TutorSubject = {
  category: TutorCategory
}

export type TutorAvailability = {
  id: string
  dayOfWeek: 
    | "sat"
    | "sun"
    | "mon"
    | "tue"
    | "wed"
    | "thu"
    | "fri"
  startTime: string
  endTime: string
}

export type TutorUserInfo = {
  id: string
  name: string
  email: string
  image?: string | null
}

export type TutorListItem = {
  id: string
  bio: string
  hourlyRate: number
  averageRate: number
  experience: number

  Student: TutorUserInfo

  tutorSubjects: TutorSubject[]
}

export type TutorProfileDetails = {
  id: string
  bio: string
  hourlyRate: number
  averageRate: number
  experience: number

  Student: TutorUserInfo

  tutorSubjects: TutorSubject[]
  availabilities: TutorAvailability[]
}

export type TutorFilterParams = {
  search?: string
  categoryId?: number
  minPrice?: number
  maxPrice?: number
  minRating?: number
  page?: number
  limit?: number
}
