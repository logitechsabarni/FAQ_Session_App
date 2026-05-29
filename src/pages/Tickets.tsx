import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Ticket,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  Filter,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Ticket as TicketType, FAQ } from '../types/database';
import { FileUploader } from '../components/FileUploader';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

type TicketWithUser = TicketType & {
  profiles: { id: string; name: string; avatar: string } | null;
};

const PRIORITY_COLORS = {
  low: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  normal: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  urgent: 'bg-red-500/20 text-red-400 border-red-500/30',
  emergency: 'bg-red-600/30 text-red-300 border-red-600/50 animate-pulse',
};

const STATUS_ICONS = {
  open: Clock,
  in_progress: MessageCircle,
  resolved: CheckCircle,
  closed: XCircle,
};

export function Tickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<TicketWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'normal' as const,
  });

  useEffect(() => {
    fetchTickets();
  }, [user, filterStatus]);

  const fetchTickets = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('tickets')
        .select('*, profiles:user_id(id, name, avatar)')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase.from('tickets').insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
      });

      if (error) throw error;

      toast.success('Ticket created successfully!');
      setShowNewTicket(false);
      setFormData({ title: '', description: '', category: 'general', priority: 'normal' });
      fetchTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket');
    }
  };

  const getEmergencyTickets = () => tickets.filter(t => t.priority === 'emergency');

  if (!user) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-400">Please sign in to view your tickets.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Emergency Banner */}
        {getEmergencyTickets().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
              <div>
                <h3 className="text-red-400 font-semibold">Emergency Mode Active</h3>
                <p className="text-red-300/80 text-sm">
                  {getEmergencyTickets().length} emergency ticket(s) require immediate attention
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Ticket className="w-8 h-8 text-cyan-400" />
              Support Tickets
            </h1>
            <p className="text-slate-400 mt-1">Create and track support requests</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewTicket(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium"
          >
            <Plus className="w-5 h-5" />
            New Ticket
          </motion.button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <Filter className="w-5 h-5 text-slate-400" />
          <div className="flex gap-2">
            {['all', 'open', 'in_progress', 'resolved', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50'
                }`}
              >
                {status === 'all' ? 'All' : status.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12">
            <Ticket className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No tickets found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => {
              const StatusIcon = STATUS_ICONS[ticket.status];
              return (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs border ${PRIORITY_COLORS[ticket.priority]}`}>
                          {ticket.priority.toUpperCase()}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-400 text-sm">
                          <StatusIcon className="w-4 h-4" />
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{ticket.title}</h3>
                      <p className="text-slate-400 text-sm line-clamp-2">{ticket.description}</p>
                      <p className="text-slate-500 text-xs mt-2">
                        Created {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* New Ticket Modal */}
        {showNewTicket && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg bg-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700/50">
                <h2 className="text-xl font-semibold text-white">Create Support Ticket</h2>
              </div>
              <form onSubmit={handleSubmitTicket} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:border-cyan-500/50 focus:outline-none"
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:border-cyan-500/50 focus:outline-none min-h-[120px]"
                    placeholder="Detailed description of the issue..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:border-cyan-500/50 focus:outline-none"
                    >
                      <option value="general">General</option>
                      <option value="technical">Technical</option>
                      <option value="billing">Billing</option>
                      <option value="account">Account</option>
                      <option value="feature">Feature Request</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:border-cyan-500/50 focus:outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewTicket(false)}
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium"
                  >
                    Create Ticket
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
