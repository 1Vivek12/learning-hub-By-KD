export type Language = 'en' | 'hinglish' | 'hi';
export type Theme = 'dark' | 'light';

export interface LocalizedString {
  en: string;
  hinglish: string;
  hi: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'instructor';
  avatar?: string;
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  durationMinutes: number;
  videoUrl: string; // Cloudflare / Vimeo / Mux or MP4 stream
  isFreePreview: boolean;
  order: number;
  resources?: { name: string; url: string; size?: string }[];
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface Module {
  id: string;
  title: LocalizedString;
  order: number;
  lessons: Lesson[];
}

export type CourseModule = Module;

export interface Course {
  id: string;
  slug: string;
  title: LocalizedString;
  shortDescription: LocalizedString;
  longDescription: LocalizedString;
  category: string;
  subcategory?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  language: string;
  durationHours: number;
  lessonsCount: number;
  price: number;
  originalPrice: number;
  discountPercent?: number;
  rating: number;
  reviewsCount: number;
  instructorId: string;
  thumbnail: string;
  heroBanner?: string;
  trailerUrl?: string;
  skills: string[];
  learningOutcomes: LocalizedString[];
  requirements: LocalizedString[];
  status: 'published' | 'draft' | 'archived';
  isFeatured?: boolean;
  isPopular?: boolean;
  modules: Module[];
  updatedAt: string;
}

export interface Instructor {
  id: string;
  name: string;
  title: LocalizedString;
  bio: LocalizedString;
  avatar: string;
  company: string;
  rating: number;
  studentsCount: number;
  coursesCount: number;
  socials?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface LiveClass {
  id: string;
  roomId: string;
  title: LocalizedString;
  description: LocalizedString;
  instructorId: string;
  courseId: string;
  scheduledStartTime: string; // ISO String
  durationMinutes: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  joinUrl: string;
  maxParticipants: number;
  currentParticipantsCount: number;
  recordingAvailable: boolean;
  recordingUrl?: string;
}

export interface LiveParticipant {
  id: string;
  name: string;
  avatar: string;
  isInstructor: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  isHandRaised: boolean;
  stream?: MediaStream;
}

export interface LiveChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  isInstructor: boolean;
  message: string;
  timestamp: string;
}

export interface Order {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  discount: number;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  paymentProvider: 'Razorpay' | 'Stripe' | 'UPI';
  transactionRef: string;
  date: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  content: LocalizedString;
  courseName: string;
  order: number;
}

export interface LearningPath {
  id: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
  courseIds: string[];
  estimatedWeeks: number;
  level: string;
}

export interface FAQItem {
  id: string;
  question: LocalizedString;
  answer: LocalizedString;
  category?: string;
}

export interface HomepageSectionConfig {
  id: string;
  type:
    | 'hero'
    | 'stats'
    | 'categories'
    | 'featured_courses'
    | 'learning_paths'
    | 'why_us'
    | 'live_classes'
    | 'testimonials'
    | 'instructors'
    | 'faq'
    | 'final_cta';
  title: LocalizedString;
  subtitle: LocalizedString;
  isVisible: boolean;
  order: number;
  primaryButtonText?: LocalizedString;
  primaryButtonUrl?: string;
  secondaryButtonText?: LocalizedString;
  secondaryButtonUrl?: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: LocalizedString;
  logoText: string;
  supportEmail: string;
  supportPhone: string;
  currencySymbol: string;
  currencyCode: string;
  liveClassProvider: string;
  paymentProvider: string;
  videoProvider: string;
  announcementBar: {
    enabled: boolean;
    text: LocalizedString;
    linkText: LocalizedString;
    linkUrl: string;
  };
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
}

export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  completionDate: string;
  grade?: string;
  qrVerificationUrl: string;
}
