import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import {
  Mail,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Calendar,
  Phone,
  User,
  Inbox,
  RefreshCw,
} from 'lucide-react';

export default function MessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminMessages();
      setMessages(data);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to fetch messages.' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (msg) => {
    try {
      const updated = await api.markMessageRead(msg.id, !msg.isRead);
      setMessages(messages.map((m) => (m.id === msg.id ? { ...m, isRead: updated.isRead } : m)));
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, isRead: updated.isRead });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to update read status.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      await api.deleteMessage(id);
      setMessages(messages.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      setStatus({ type: 'success', message: 'Message deleted.' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to delete message.' });
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-1">
            <Inbox className="w-3.5 h-3.5" />
            <span>Inbound Inquiries</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Client Contact Inquiries
          </h1>
          <p className="text-xs text-slate-400">
            Messages transmitted directly from the public portfolio contact form into PostgreSQL.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {status && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm ${
            status.type === 'success'
              ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center font-mono text-cyan-400 text-sm">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-3xl border border-white/5 p-8 max-w-md mx-auto">
          <Mail className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No client messages received yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* List Col */}
          <div className="lg:col-span-6 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (!msg.isRead) handleToggleRead(msg);
                }}
                className={`glass-card p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedMessage?.id === msg.id
                    ? 'border-cyan-500/50 bg-[#0c142b]'
                    : !msg.isRead
                    ? 'border-cyan-500/30 bg-[#081024]'
                    : 'border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{msg.name}</span>
                    {!msg.isRead && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        Unread
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 mb-1">{msg.subject}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 font-light">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Details Col */}
          <div className="lg:col-span-6 sticky top-24">
            {selectedMessage ? (
              <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-display font-bold text-white">
                      {selectedMessage.subject}
                    </h3>
                    <span className="text-xs font-mono text-slate-400">
                      Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRead(selectedMessage)}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                    >
                      {selectedMessage.isRead ? 'Mark Unread' : 'Mark Read'}
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-2 rounded-xl text-rose-300 bg-rose-500/10 hover:bg-rose-500/20"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 space-y-1">
                    <span className="font-mono text-slate-400 uppercase text-[10px]">Client Name</span>
                    <p className="text-white font-semibold text-sm">{selectedMessage.name}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 space-y-1">
                    <span className="font-mono text-slate-400 uppercase text-[10px]">Email Address</span>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-cyan-400 hover:underline block truncate font-mono text-xs"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                  {selectedMessage.phone && (
                    <div className="p-3 rounded-xl bg-white/5 space-y-1">
                      <span className="font-mono text-slate-400 uppercase text-[10px]">Phone Number</span>
                      <p className="text-white font-mono text-xs">{selectedMessage.phone}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-slate-400 uppercase text-xs block">Message Content</span>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-200 text-sm whitespace-pre-wrap leading-relaxed font-light">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                      selectedMessage.subject
                    )}`}
                    className="btn-neon-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply via Email Client</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 rounded-3xl border border-white/5 text-center text-slate-500 font-mono text-xs">
                Select an inquiry from the list to inspect full details and reply.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
