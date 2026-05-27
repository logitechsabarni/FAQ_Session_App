import type { Category } from '../types/database';

export const CATEGORIES: Category[] = [
  { value: 'general', label: 'General', icon: 'MessageCircle' },
  { value: 'technical', label: 'Technical', icon: 'Code' },
  { value: 'billing', label: 'Billing', icon: 'CreditCard' },
  { value: 'product', label: 'Product', icon: 'Package' },
  { value: 'support', label: 'Support', icon: 'HelpCircle' },
  { value: 'feature', label: 'Feature Request', icon: 'Lightbulb' },
  { value: 'bug', label: 'Bug Report', icon: 'Bug' },
  { value: 'internship', label: 'Internship Basics', icon: 'Briefcase' },
  { value: 'documentation', label: 'NOC & Documentation', icon: 'FileText' },
  { value: 'team', label: 'Team Formation', icon: 'Users' },
  { value: 'lms', label: 'LMS & Courses', icon: 'GraduationCap' },
  { value: 'certificates', label: 'Certificates', icon: 'Award' },
  { value: 'attendance', label: 'Attendance', icon: 'Calendar' },
  { value: 'interviews', label: 'Interviews', icon: 'MessageSquare' },
  { value: 'github', label: 'GitHub Setup', icon: 'Github' },
  { value: 'opensource', label: 'Open Source', icon: 'GitBranch' },
  { value: 'ai-coursework', label: 'AI Coursework', icon: 'Brain' },
  { value: 'sessions', label: 'Zoom Sessions', icon: 'Video' },
  { value: 'mentorship', label: 'Mentorship', icon: 'HeartHandshake' },
  { value: 'workflow', label: 'Daily Workflow', icon: 'Clock' },
  { value: 'submission', label: 'Project Submission', icon: 'Upload' },
  { value: 'evaluation', label: 'Evaluations', icon: 'CheckSquare' },
  { value: 'account', label: 'Account Access', icon: 'Key' },
  { value: 'ai-learning', label: 'AI Learning', icon: 'Sparkles' },
  { value: 'collaboration', label: 'Collaboration', icon: 'Users' },
  { value: 'troubleshooting', label: 'Troubleshooting', icon: 'Wrench' },
  { value: 'other', label: 'Other', icon: 'MoreHorizontal' },
];

export const CATEGORY_COLORS: Record<string, string> = {
  general: 'from-blue-500 to-cyan-500',
  technical: 'from-orange-500 to-red-500',
  billing: 'from-green-500 to-emerald-500',
  product: 'from-purple-500 to-pink-500',
  support: 'from-yellow-500 to-orange-500',
  feature: 'from-cyan-500 to-blue-500',
  bug: 'from-red-500 to-rose-500',
  internship: 'from-indigo-500 to-blue-500',
  documentation: 'from-slate-500 to-gray-500',
  team: 'from-teal-500 to-cyan-500',
  lms: 'from-violet-500 to-purple-500',
  certificates: 'from-amber-500 to-yellow-500',
  attendance: 'from-rose-500 to-pink-500',
  interviews: 'from-fuchsia-500 to-pink-500',
  github: 'from-slate-600 to-slate-500',
  opensource: 'from-emerald-500 to-teal-500',
  'ai-coursework': 'from-blue-600 to-violet-500',
  sessions: 'from-cyan-600 to-blue-600',
  mentorship: 'from-pink-500 to-rose-500',
  workflow: 'from-orange-500 to-amber-500',
  submission: 'from-green-600 to-emerald-600',
  evaluation: 'from-indigo-600 to-blue-600',
  account: 'from-red-600 to-orange-600',
  'ai-learning': 'from-violet-600 to-indigo-600',
  collaboration: 'from-teal-600 to-green-600',
  troubleshooting: 'from-yellow-600 to-amber-600',
  other: 'from-gray-500 to-slate-500',
};

export const getCategoryLabel = (value: string): string => {
  return CATEGORIES.find(c => c.value === value)?.label || value;
};

export const getCategoryColor = (category: string): string => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.other;
};

// Yaksha Mini suggested prompts
export const SUGGESTED_PROMPTS = [
  { icon: 'FileText', text: 'How do I upload my NOC?' },
  { icon: 'Users', text: 'When will mentors be assigned?' },
  { icon: 'Github', text: 'Can I use a different GitHub email?' },
  { icon: 'Video', text: 'What happens if I miss a Zoom session?' },
  { icon: 'Users', text: 'How do team allocations work?' },
  { icon: 'Upload', text: 'Where can I submit my project?' },
  { icon: 'GraduationCap', text: 'How do I track my progress?' },
  { icon: 'Award', text: 'When will I receive my certificate?' },
  { icon: 'Calendar', text: 'What is the attendance policy?' },
  { icon: 'Briefcase', text: 'What is the internship duration?' },
  { icon: 'GitBranch', text: 'How do I contribute to open source?' },
  { icon: 'Brain', text: 'What AI courses are available?' },
];

// Voice assistant commands
export const VOICE_COMMANDS = [
  'search for faq',
  'show my questions',
  'open help desk',
  'find category',
  'latest updates',
];

// File upload constraints
export const FILE_UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'],
};
