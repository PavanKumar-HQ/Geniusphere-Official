

export enum SectorType {
  TECHNOLOGY = 'Technology',
  FINANCE = 'Finance',
  PROFESSIONAL = 'Professional Development'
}

export type ResourceType = 'video' | 'blog' | 'ebook';
export type TestimonialCategory = 'Student' | 'Parent' | 'Teacher' | 'School';
export type PlanStatus = 'Pending' | 'In Progress' | 'Completed';

export interface EducationalResource {
  id: string;
  title: string;
  type: ResourceType;
  category: SectorType;
  url: string;
  thumbnailUrl?: string; // For videos/blogs
  description: string;
  author?: string; // Channel name, Reddit user, or Book author
  date?: string;
  duration?: string; // For videos
  fileSize?: string; // For ebooks
  content?: string; // New field for in-app reading (Markdown/Text)
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface QuizConfig {
  passThreshold: number; // e.g. 70
  timeLimit?: number; // Time in minutes
  questions: Question[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string; // AI generated summary
  videoUrl: string; // YouTube URL
  duration: string;
  contentMarkdown?: string; // Detailed lesson notes
  isLocked?: boolean;
}

export interface Course {
  course_id: string;
  title: string;
  sector: SectorType;
  short_description: string;
  long_description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  tags: string[];
  status: 'active' | 'inactive';
  simulationId?: string; // New field to link to interactive lab

  // LMS Specific Fields
  modules?: CourseModule[];
  quiz?: QuizConfig;
  certificateTemplate?: {
    authorityName: string;
    signatureUrl?: string;
  };
}

export interface Service {
  service_id: string;
  title: string;
  category: 'Training' | 'Mentoring' | 'Certification' | 'Corporate' | 'Digital Literacy' | 'Consulting' | 'WORKSHOPS' | 'MENTORSHIP' | 'CERTIFICATION' | 'CONSULTING';
  description: string;
  deliverables: string[];
}

export interface Sector {
  id: string;
  name: SectorType;
  overview: string;
  iconName: string; // Mapping string to icon component
  gradient: string;
}

export interface VideoResource {
  id: string;
  title: string;
  category: SectorType;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  duration: string;
}

export interface Qualification {
  title: string;
  imageUrl: string;
  certificateUrl?: string;
}

export interface Trainer {
  id: string;
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  qualifications: Qualification[];
}

export interface GalleryItem {
  id: string;
  schoolName: string;
  description: string;
  marqueeImageUrl: string;
  detailImageUrls: string[];
  eventCategory?: string; // e.g., "Workshop", "Seminar", "Competition", etc.
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  iconName: string;
}

export interface VideoTestimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  category: TestimonialCategory; // Added category
  videoThumbnail: string;
  videoUrl: string;
  flagCode: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  enrolledCourse: string;
  progress: number;
  status: 'Active' | 'Inactive' | 'Completed';
  joinDate: string;
}

export interface CurriculumItem {
  id: string;
  topic: string;
  course: string;
  assignedTo: string;
  dueDate: string;
  status: PlanStatus;
}

export interface LocalMessage {
  id: string;
  text: string;
  sender: 'user' | 'system' | 'ai';
  timestamp: string;
}

export interface Ambassador {
  id: string;
  name: string;
  college: string;
  points: number;
  rank: number;
  avatarUrl: string;
}

export type LearningMood = 'calm' | 'focus' | 'video' | 'courses' | 'blog';