import { MessageCircle, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                FAQ_Session
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              A modern AI-style FAQ discussion platform for community interaction and knowledge sharing.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                  Browse FAQs
                </Link>
              </li>
              <li>
                <Link to="/add-faq" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                  Ask Question
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faqs?category=technical" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                  Technical
                </Link>
              </li>
              <li>
                <Link to="/faqs?category=billing" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                  Billing
                </Link>
              </li>
              <li>
                <Link to="/faqs?category=product" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                  Product
                </Link>
              </li>
              <li>
                <Link to="/faqs?category=support" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold">Connect</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-500/50 transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-500/50 transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-500/50 transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700/50 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            &copy; {currentYear} FAQ_Session. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
