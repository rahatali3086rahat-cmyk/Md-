import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { MessageSquare, ArrowRight, Bot, User, Clock } from 'lucide-react';

export const RecentConversationsTable: React.FC = () => {
  const { conversations, selectConversationAndOpenInbox, setCurrentView } = useApp();

  // Take top 5 recent conversations
  const recentList = (conversations || []).slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Recent WhatsApp Conversations</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Live customer interactions requiring AI or human oversight
          </p>
        </div>
        <button
          onClick={() => setCurrentView('inbox')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <span>Open Full Inbox</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-5">Customer</th>
              <th className="py-3 px-5">Last Message</th>
              <th className="py-3 px-5">Inquired Product</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {recentList.map((conv) => (
              <tr
                key={conv.id}
                onClick={() => selectConversationAndOpenInbox(conv.id)}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
              >
                {/* Customer */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {conv.customerAvatar ? (
                        <img
                          src={conv.customerAvatar}
                          alt={conv.customerName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                          {conv.customerName.charAt(0)}
                        </div>
                      )}
                      {conv.status === 'ai' ? (
                        <span
                          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"
                          title="AI Active"
                        />
                      ) : (
                        <span
                          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber-500 ring-2 ring-white"
                          title="Human Handled"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {conv.customerName}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {conv.customerPhone}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Last Message */}
                <td className="py-3.5 px-5 max-w-[260px]">
                  <p className="text-slate-700 truncate font-medium">
                    "{conv.lastMessage}"
                  </p>
                </td>

                {/* Product */}
                <td className="py-3.5 px-5">
                  <span className="font-medium text-slate-800 bg-slate-100/80 px-2 py-0.5 rounded-md border border-slate-200/50">
                    {conv.interestedProduct}
                  </span>
                </td>

                {/* Status */}
                <td className="py-3.5 px-5">
                  {conv.status === 'ai' ? (
                    <Badge variant="emerald" dot>
                      <Bot className="w-3 h-3 mr-1" />
                      AI Active
                    </Badge>
                  ) : (
                    <Badge variant="amber" dot>
                      <User className="w-3 h-3 mr-1" />
                      Human
                    </Badge>
                  )}
                </td>

                {/* Time */}
                <td className="py-3.5 px-5 text-right font-medium text-slate-400">
                  <div className="flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{conv.lastMessageTime}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
