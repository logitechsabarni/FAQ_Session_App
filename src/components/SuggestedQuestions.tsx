import { motion } from 'framer-motion';
import { Sparkles, FileText, Users, Github, Video, Upload, GraduationCap, Award, Calendar, Briefcase, GitBranch, Brain } from 'lucide-react';

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  FileText,
  Users,
  Github,
  Video,
  Upload,
  GraduationCap,
  Award,
  Calendar,
  Briefcase,
  GitBranch,
  Brain,
  Sparkles,
};

const SUGGESTIONS = [
  { icon: 'FileText', text: 'How do I upload my NOC?' },
  { icon: 'Users', text: 'When will mentors be assigned?' },
  { icon: 'Github', text: 'How do I set up GitHub?' },
  { icon: 'Video', text: 'What if I miss a Zoom session?' },
  { icon: 'Users', text: 'How do team allocations work?' },
  { icon: 'Upload', text: 'Where do I submit my project?' },
  { icon: 'GraduationCap', text: 'How do I track my progress?' },
  { icon: 'Award', text: 'When will I get my certificate?' },
];

export function SuggestedQuestions({ onQuestionClick }: SuggestedQuestionsProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400 uppercase tracking-wide">Suggested Questions</p>
      <div className="grid grid-cols-2 gap-2">
        {SUGGESTIONS.map((suggestion, index) => {
          const Icon = ICON_MAP[suggestion.icon] || Sparkles;
          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onQuestionClick(suggestion.text)}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 text-left transition-all group"
            >
              <Icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors line-clamp-2">
                {suggestion.text}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
