import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Send,
  Paperclip,
  Smile,
  Bot,
  User,
  CheckCheck,
  Info,
  ChevronLeft,
  MessageCircle,
  MessageSquareText,
  Instagram,
  Globe,
  Mail,
  CalendarCheck,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { ChannelType } from '../../types/omnichannel';

interface ChatViewProps {
  onBackMobile?: () => void;
  onOpenCustomerInfoMobile?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  onBackMobile,
  onOpenCustomerInfoMobile,
}) => {
  const {
    conversations,
    selectedConversationId,
    activeConversationMessages,
    sendChatMessage,
    takeOverConversation,
    toggleAIForConversation,
    setCurrentView,
    createBooking,
    createBusinessInvoice,
    addToast,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isQuickBookingOpen, setIsQuickBookingOpen] = useState(false);
  const [isQuickInvoiceOpen, setIsQuickInvoiceOpen] = useState(false);

  // Quick action form states
  const [bookingDate, setBookingDate] = useState('2026-09-18');
  const [bookingTime, setBookingTime] = useState('14:00');
  const [invoiceAmount, setInvoiceAmount] = useState('3200');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConv = conversations.find((c) => c.id === selectedConversationId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversationMessages]);

  if (!currentConv) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <Bot className="w-12 h-12 text-slate-300 mb-3" />
        <p className="text-sm font-semibold text-slate-600">Select a conversation</p>
        <p className="text-xs text-slate-400 mt-1">
          Pick an inquiry from the left panel to inspect omnichannel chat history
        </p>
      </div>
    );
  }

  const isAIActive = currentConv.status === 'ai';

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const textToSend = inputMessage;
    setInputMessage('');
    setIsSending(true);

    await sendChatMessage(textToSend);
    setIsSending(false);
  };

  const handleTakeOver = () => {
    takeOverConversation(currentConv.id);
  };

  const handleToggleAI = () => {
    toggleAIForConversation(currentConv.id, !isAIActive);
  };

  const getChannelInfo = (channel?: ChannelType) => {
    switch (channel) {
      case 'whatsapp':
        return { label: 'WhatsApp Business', icon: <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'facebook':
        return { label: 'Facebook Messenger', icon: <MessageSquareText className="w-3.5 h-3.5 text-[#1877F2]" />, color: 'text-blue-700 bg-blue-50 border-blue-200' };
      case 'instagram':
        return { label: 'Instagram Direct', icon: <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />, color: 'text-pink-700 bg-pink-50 border-pink-200' };
      case 'website':
        return { label: 'Website Live Chat', icon: <Globe className="w-3.5 h-3.5 text-teal-700" />, color: 'text-teal-700 bg-teal-50 border-teal-200' };
      case 'email':
        return { label: 'Email Thread', icon: <Mail className="w-3.5 h-3.5 text-indigo-700" />, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
      default:
        return { label: 'WhatsApp', icon: <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
  };

  const chInfo = getChannelInfo(currentConv.channel);

  const handleQuickBook = async (e: React.FormEvent) => {
    e.preventDefault();
    await createBooking({
      businessId: currentConv.businessId || 'biz-sofana',
      customerName: currentConv.customerName,
      customerPhone: currentConv.customerPhone,
      customerEmail: currentConv.customerEmail || '',
      channelOrigin: currentConv.channel || 'whatsapp',
      channel: currentConv.channel || 'whatsapp',
      serviceName: 'Design & Space Consultation',
      serviceId: 'srv-001',
      date: bookingDate,
      time: bookingTime,
      durationMinutes: 45,
      status: 'confirmed',
      assignedStaff: 'Sarah Jenkins',
      location: 'Virtual 3D Room Studio',
      notes: `Booked via omnichannel chat for ${currentConv.interestedProduct || 'general inquiry'}.`,
    });
    setIsQuickBookingOpen(false);
  };

  const handleQuickInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(invoiceAmount) || 2500;
    await createBusinessInvoice({
      businessId: currentConv.businessId || 'biz-sofana',
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerName: currentConv.customerName,
      customerEmail: currentConv.customerEmail || '',
      customerPhone: currentConv.customerPhone,
      deliveryChannel: currentConv.channel || 'whatsapp',
      items: [
        {
          id: `item-${Date.now()}`,
          description: currentConv.interestedProduct || 'Standard Consultation & Custom Order',
          quantity: 1,
          unitPrice: num,
          total: num,
          totalPrice: num,
        },
      ],
      subtotal: num,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 5,
      taxAmount: Math.round(num * 0.05),
      total: Math.round(num * 1.05),
      totalAmount: Math.round(num * 1.05),
      currency: 'QAR',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'sent',
      notes: 'Generated via omnichannel live chat. Payment link included.',
    });
    setIsQuickInvoiceOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#efeae2]/30 relative">
      {/* Background Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#059669 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />

      {/* Chat Header */}
      <div className="relative z-10 px-4 py-2.5 bg-white border-b border-slate-200/80 flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          {onBackMobile && (
            <button
              onClick={onBackMobile}
              className="lg:hidden p-1.5 -ml-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              aria-label="Back to conversations"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div className="relative shrink-0">
            {currentConv.customerAvatar ? (
              <img
                src={currentConv.customerAvatar}
                alt={currentConv.customerName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm">
                {currentConv.customerName.charAt(0)}
              </div>
            )}
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                isAIActive ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 truncate">
                {currentConv.customerName}
              </h3>
              <div className={`hidden sm:flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-semibold ${chInfo.color}`}>
                {chInfo.icon}
                <span>{chInfo.label}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
              <span>{currentConv.location}</span>
              <span>·</span>
              <span className="text-emerald-700 font-semibold truncate">
                {currentConv.interestedProduct}
              </span>
            </p>
          </div>
        </div>

        {/* Right Header Actions: Quick Book, Quick Invoice, AI Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Booking shortcut */}
          <button
            onClick={() => setIsQuickBookingOpen(true)}
            title="Book appointment for customer"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Book Slot</span>
          </button>

          {/* Quick Invoice shortcut */}
          <button
            onClick={() => setIsQuickInvoiceOpen(true)}
            title="Send invoice via this channel"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-600" />
            <span>Invoice</span>
          </button>

          {/* AI Toggle */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-medium text-slate-600 hidden sm:inline">AI:</span>
            <button
              onClick={handleToggleAI}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                isAIActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {isAIActive ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Take Over Button */}
          {isAIActive ? (
            <button
              onClick={handleTakeOver}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Take over</span>
            </button>
          ) : (
            <button
              onClick={handleToggleAI}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Resume AI</span>
            </button>
          )}

          {/* Customer CRM info toggle for mobile */}
          {onOpenCustomerInfoMobile && (
            <button
              onClick={onOpenCustomerInfoMobile}
              className="xl:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              aria-label="View customer profile"
            >
              <Info className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeConversationMessages.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            Start the conversation...
          </div>
        )}

        {activeConversationMessages.map((msg) => {
          const isCustomer = msg.sender === 'customer';
          const isAI = msg.sender === 'ai';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 shadow-xs relative text-xs sm:text-sm ${
                  isCustomer
                    ? 'bg-white text-slate-900 rounded-tl-xs border border-slate-200/80'
                    : isAI
                    ? 'bg-emerald-50 text-slate-900 rounded-tr-xs border border-emerald-200/80'
                    : 'bg-emerald-600 text-white rounded-tr-xs shadow-emerald-600/10'
                }`}
              >
                {/* Sender badge if AI / Human */}
                {!isCustomer && (
                  <div className="flex items-center gap-1 mb-1">
                    {isAI ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-200/50 px-1.5 py-0.2 rounded">
                        <Bot className="w-2.5 h-2.5" />
                        AI Agent
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-100 bg-emerald-700/50 px-1.5 py-0.2 rounded">
                        <User className="w-2.5 h-2.5" />
                        Human Agent (You)
                      </span>
                    )}
                  </div>
                )}

                {/* Message Text */}
                <p className="leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </p>

                {/* Meta details & Timestamp */}
                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                    isCustomer
                      ? 'text-slate-400'
                      : isAI
                      ? 'text-emerald-700'
                      : 'text-emerald-100'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isCustomer && (
                    <CheckCheck className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200/80 relative z-10">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="Attach file or catalog item"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="Insert emoji"
          >
            <Smile className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder={
              isAIActive
                ? `Replying via ${chInfo.label} (AI automated)...`
                : `Send reply directly to customer via ${chInfo.label}...`
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-2 text-xs sm:text-sm bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden transition-all"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-xs transition-all cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Quick Booking Modal */}
      {isQuickBookingOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Book Service Appointment</h3>
              </div>
              <button
                onClick={() => setIsQuickBookingOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleQuickBook} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Customer</label>
                <input
                  type="text"
                  disabled
                  value={currentConv.customerName}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Time</label>
                  <input
                    type="time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuickBookingOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Invoice Modal */}
      {isQuickInvoiceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Create & Send Invoice</h3>
              </div>
              <button
                onClick={() => setIsQuickInvoiceOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleQuickInvoice} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Customer</label>
                <input
                  type="text"
                  disabled
                  value={`${currentConv.customerName} (${chInfo.label})`}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Item / Description</label>
                <input
                  type="text"
                  disabled
                  value={currentConv.interestedProduct || 'Consultation & Catalog Item'}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Amount (QAR)</label>
                <input
                  type="number"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 font-bold"
                />
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px]">
                Payment link will be auto-generated and dispatched directly to {currentConv.customerName} via {chInfo.label}.
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuickInvoiceOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700"
                >
                  Send Invoice Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
