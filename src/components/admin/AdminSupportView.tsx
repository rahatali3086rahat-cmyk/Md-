import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LifeBuoy,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  MessageSquare,
  Send,
} from 'lucide-react';

export const AdminSupportView: React.FC = () => {
  const { addToast } = useApp();

  const [search, setSearch] = useState('');

  const tickets = [
    {
      id: 'TCK-8821',
      business: 'Sofana Furniture Doha',
      subject: 'Requesting addition of 2 new showroom staff seats',
      priority: 'Medium',
      status: 'Open',
      created: '2 hours ago',
      lastReply: 'Support Agent assigned',
    },
    {
      id: 'TCK-8819',
      business: 'Oasis Luxury Perfumes',
      subject: 'Custom Arabic voice note transcription prompt tuning',
      priority: 'High',
      status: 'In Progress',
      created: '5 hours ago',
      lastReply: 'Fine-tuning Gemini bilingual temperature',
    },
    {
      id: 'TCK-8804',
      business: 'Apex Gulf Real Estate',
      subject: 'Payment card update and subscription reactivation',
      priority: 'Urgent',
      status: 'Pending Client',
      created: '1 day ago',
      lastReply: 'Direct Stripe portal link dispatched',
    },
    {
      id: 'TCK-8789',
      business: 'Al-Rayyan Medical Center',
      subject: 'Google Calendar booking slot collision check',
      priority: 'Low',
      status: 'Resolved',
      created: '3 days ago',
      lastReply: 'Confirmed two-way calendar sync resolved',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Tenant Support & Escalations
          </h1>
          <p className="text-xs text-slate-400">
            Handle business customer tickets, WhatsApp API quota increases, and prompt engineering escalations
          </p>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Client Business</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-850/40">
                  <td className="py-3 px-4 font-mono text-slate-400">{t.id}</td>
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{t.business}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-200">{t.subject}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.priority === 'Urgent'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : t.priority === 'High'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold text-[10px]">
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{t.created}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => addToast('info', 'Ticket Opened', `Viewing ticket details for ${t.id}`)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold cursor-pointer"
                    >
                      Reply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
