import React, { useState } from 'react';
import { ConversationList } from './ConversationList';
import { ChatView } from './ChatView';
import { CustomerPanel } from './CustomerPanel';

export const InboxView: React.FC = () => {
  // Mobile responsive view mode: 'list' | 'chat' | 'info'
  const [mobileTab, setMobileTab] = useState<'list' | 'chat' | 'info'>('list');

  return (
    <div className="h-[calc(100vh-7.5rem)] bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      {/* 3-Column Desktop Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Conversation List (Visible on desktop or when mobileTab is 'list') */}
        <div
          className={`w-full md:w-80 lg:w-80 xl:w-96 shrink-0 h-full ${
            mobileTab === 'list' ? 'block' : 'hidden md:block'
          }`}
        >
          <ConversationList onSelectMobile={() => setMobileTab('chat')} />
        </div>

        {/* Center: Live Chat View (Visible on desktop or when mobileTab is 'chat') */}
        <div
          className={`flex-1 flex flex-col h-full ${
            mobileTab === 'chat' ? 'flex' : 'hidden md:flex'
          }`}
        >
          <ChatView
            onBackMobile={() => setMobileTab('list')}
            onOpenCustomerInfoMobile={() => setMobileTab('info')}
          />
        </div>

        {/* Right: Customer CRM Panel (Visible on desktop large screen or when mobileTab is 'info') */}
        <div
          className={`w-full lg:w-80 xl:w-84 shrink-0 h-full ${
            mobileTab === 'info' ? 'block' : 'hidden xl:block'
          }`}
        >
          <CustomerPanel onCloseMobile={() => setMobileTab('chat')} />
        </div>
      </div>
    </div>
  );
};
