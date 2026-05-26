import { motion } from 'framer-motion';
import {
  MessageCircle,
  Code,
  CreditCard,
  Package,
  HelpCircle,
  Lightbulb,
  Bug,
  MoreHorizontal,
} from 'lucide-react';
import type { Category } from '../types/database';

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
  categories?: Category[];
}

const ICON_MAP: Record<string, React.ElementType> = {
  MessageCircle,
  Code,
  CreditCard,
  Package,
  HelpCircle,
  Lightbulb,
  Bug,
  MoreHorizontal,
};

export function CategoryFilter({ selected, onChange, categories }: CategoryFilterProps) {
  const defaultCategories: Category[] = [
    { value: 'all', label: 'All', icon: 'MessageCircle' },
    { value: 'general', label: 'General', icon: 'MessageCircle' },
    { value: 'technical', label: 'Technical', icon: 'Code' },
    { value: 'billing', label: 'Billing', icon: 'CreditCard' },
    { value: 'product', label: 'Product', icon: 'Package' },
    { value: 'support', label: 'Support', icon: 'HelpCircle' },
    { value: 'feature', label: 'Feature', icon: 'Lightbulb' },
    { value: 'bug', label: 'Bug', icon: 'Bug' },
    { value: 'other', label: 'Other', icon: 'MoreHorizontal' },
  ];

  const displayCategories = categories || defaultCategories;

  return (
    <div className="flex flex-wrap gap-2">
      {displayCategories.map((category) => {
        const Icon = ICON_MAP[category.icon] || MessageCircle;
        const isSelected = selected === category.value;

        return (
          <motion.button
            key={category.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(category.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isSelected
                ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:border-slate-600 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{category.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
