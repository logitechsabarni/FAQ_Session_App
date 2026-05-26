import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="relative mx-auto mb-8"
        >
          <div className="text-[180px] font-bold text-slate-800 leading-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-20 h-20 text-cyan-500/50" />
          </div>
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on
          track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
            >
              <Home className="w-4 h-4" />
              Go Home
            </motion.button>
          </Link>

          <Link to="/faqs">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold hover:border-cyan-500/50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse FAQs
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
