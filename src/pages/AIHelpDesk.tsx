import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bot,
  Mic,
  Upload,
  MessageSquare,
  FileQuestion,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Search,
} from 'lucide-react';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { FileUploader } from '../components/FileUploader';
import toast from 'react-hot-toast';

export function AIHelpDesk() {
  const [activeTab, setActiveTab] = useState<'chat' | 'voice' | 'upload'>('chat');
  const [voiceProcessing, setVoiceProcessing] = useState(false);

  const handleVoiceTranscript = (text: string) => {
    setVoiceProcessing(true);
    // Process voice command - would integrate with Yaksha Mini
    setTimeout(() => {
      toast.success(`Voice command received: "${text}"`);
      setVoiceProcessing(false);
    }, 1500);
  };

  const handleFileUpload = async (file: File) => {
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success(`File "${file.name}" uploaded successfully!`);
  };

  const features = [
    {
      icon: Bot,
      title: 'Yaksha Mini AI',
      description: 'Chat with our AI assistant for instant answers to your questions',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Mic,
      title: 'Voice Support',
      description: 'Speak your questions and get voice-guided assistance',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Upload,
      title: 'Document Upload',
      description: 'Upload documents for analysis and FAQ suggestions',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  const quickQuestions = [
    'How do I submit my NOC?',
    'When will I get my certificate?',
    'How do I set up GitHub?',
    'What is the attendance policy?',
    'How do I submit my final project?',
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium">AI-Powered Support</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI Help Desk
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Get instant answers through our AI assistant, voice support, or document analysis.
            Yaksha Mini is here to help you navigate your internship journey.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.button
                key={index}
                whileHover={{ y: -5 }}
                onClick={() => setActiveTab(index === 0 ? 'chat' : index === 1 ? 'voice' : 'upload')}
                className={`p-6 rounded-2xl border transition-all ${
                  (index === 0 && activeTab === 'chat') ||
                  (index === 1 && activeTab === 'voice') ||
                  (index === 2 && activeTab === 'upload')
                    ? 'bg-slate-800/80 border-cyan-500/30'
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Panel - Tab Content */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 min-h-[400px]">
              {activeTab === 'chat' && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20">
                    <Bot className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Yaksha Mini AI</h2>
                  <p className="text-slate-400 mb-6 max-w-md">
                    Click the chat button in the bottom-right corner to start a conversation with our AI assistant.
                  </p>
                  <p className="text-slate-500 text-sm flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    Yaksha Mini can answer questions about internships, NOC, courses, and more
                  </p>
                </div>
              )}

              {activeTab === 'voice' && (
                <div className="h-full flex flex-col items-center justify-center">
                  <h2 className="text-xl font-semibold text-white mb-6">Voice Assistant</h2>
                  <VoiceAssistant onTranscript={handleVoiceTranscript} isProcessing={voiceProcessing} />
                </div>
              )}

              {activeTab === 'upload' && (
                <div className="h-full flex flex-col">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-white mb-2">Document Upload</h2>
                    <p className="text-slate-400 text-sm">
                      Upload documents (PDF, DOC, Images) for FAQ suggestions
                    </p>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <FileUploader
                      onUpload={handleFileUpload}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      maxSize={5 * 1024 * 1024}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Questions */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-cyan-400" />
                Quick Questions
              </h3>
              <div className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ x: 5 }}
                    className="w-full p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/30 hover:border-cyan-500/30 text-left text-slate-300 hover:text-white text-sm transition-all flex items-center justify-between group"
                  >
                    <span>{question}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                Quick Links
              </h3>
              <div className="space-y-3">
                <Link
                  to="/faqs"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/30 hover:border-cyan-500/30 transition-all group"
                >
                  <Search className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                  <span className="text-slate-300 group-hover:text-white text-sm">Browse All FAQs</span>
                </Link>
                <Link
                  to="/faqs?category=internship"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/30 hover:border-cyan-500/30 transition-all group"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                  <span className="text-slate-300 group-hover:text-white text-sm">Internship Questions</span>
                </Link>
                <Link
                  to="/faqs?category=documentation"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/30 hover:border-cyan-500/30 transition-all group"
                >
                  <Upload className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                  <span className="text-slate-300 group-hover:text-white text-sm">NOC & Documents</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
