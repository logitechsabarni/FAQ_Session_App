import type { Category } from '../types/database';

export const CATEGORIES: Category[] = [
  { value: 'general', label: 'General', icon: 'MessageCircle' },
  { value: 'technical', label: 'Technical', icon: 'Code' },
  { value: 'billing', label: 'Billing', icon: 'CreditCard' },
  { value: 'product', label: 'Product', icon: 'Package' },
  { value: 'support', label: 'Support', icon: 'HelpCircle' },
  { value: 'feature', label: 'Feature Request', icon: 'Lightbulb' },
  { value: 'bug', label: 'Bug Report', icon: 'Bug' },
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
  other: 'from-gray-500 to-slate-500',
};

export const getCategoryLabel = (value: string): string => {
  return CATEGORIES.find(c => c.value === value)?.label || value;
};

export const getCategoryColor = (category: string): string => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.other;
};
