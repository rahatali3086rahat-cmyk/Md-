import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Radio,
  MessageCircle,
  MessageSquareText,
  Instagram,
  Globe,
  Mail,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  Code,
  Settings,
  Sparkles,
  Bot,
  Send,
  Smartphone,
} from 'lucide-react';
import { ChannelType } from '../../types/omnichannel';

export const ChannelsView: React.FC = () => {
  const { channels, toggleChannelConnection, widgetConfig, updateWidgetConfig, addToast } = useApp();

  const [selectedChannel, setSelectedChannel] = useState<ChannelType>('website');

  // Widget settings
  const [themeColor, setThemeColor] = useState(widgetConfig.themeColor || widgetConfig.widgetColor || '#059669');
  const [title, setTitle] = useState(widgetConfig.title || 'Chat with Sofana Living');
  const [subtitle, setSubtitle] = useState(widgetConfig.subtitle || 'AI-Powered Omnichannel Concierge');
  const [welcomeMessage, setWelcomeMessage] = useState(widgetConfig.welcomeMessage);
  const [position, setPosition] = useState(widgetConfig.position);

  // Widget preview interactive test message
  const [previewInput, setPreviewInput] = useState('');
  const [previewChat, setPreviewChat] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: welcomeMessage },
  ]);

  const handleSaveWidget = (e: React.FormEvent) => {
    e.preventDefault();
    updateWidgetConfig({
      widgetColor: themeColor,
      themeColor,
      title,
      subtitle,
      welcomeMessage,
      position,
    });
    setPreviewChat([{ sender: 'bot', text: welcomeMessage }]);
    addToast('success', 'Widget Updated', 'Live chat widget preferences saved successfully');
  };

  const copyEmbedCode = () => {
    const code = `<script\n  src="https://cdn.whatsai.app/widget.js"\n  data-business-id="biz-sofana"\n  data-theme="${themeColor}"\n  async>\n</script>`;
    navigator.clipboard?.writeText(code);
    addToast('success', 'Snippet Copied', 'Embed script copied to clipboard');
  };

  const handleSendPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewInput.trim()) return;
    const msg = previewInput;
    setPreviewInput('');
    setPreviewChat((prev) => [...prev, { sender: 'user', text: msg }]);

    setTimeout(() => {
      setPreviewChat((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Thank you for asking about "${msg}". I can provide dimensions, arrange fabric swatches, or book an appointment for you!`,
        },
      ]);
    }, 600);
  };

  const getChannelIcon = (type: ChannelType) => {
    switch (type) {
      case 'whatsapp':
        return <MessageCircle className="w-5 h-5 text-[#25D366]" />;
      case 'facebook':
        return <MessageSquareText className="w-5 h-5 text-[#1877F2]" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-[#E1306C]" />;
      case 'website':
        return <Globe className="w-5 h-5 text-teal-600" />;
      case 'email':
        return <Mail className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-teal-100 text-teal-700">
              <Radio className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Omnichannel Connectors & Live Chat Widget
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Manage your Meta Cloud API credentials, Instagram Direct integration, Facebook Page connection, email routing, and customize your embeddable website live chat widget.
          </p>
        </div>
      </div>

      {/* Channel Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((ch) => (
          <div
            key={ch.id}
            className={`p-5 rounded-2xl bg-white border transition-all shadow-xs flex flex-col justify-between ${
              ch.status === 'connected' ? 'border-slate-200/80' : 'border-slate-200 opacity-85'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                    {getChannelIcon(ch.channel || (ch as any).type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{ch.channelName || (ch as any).name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {ch.accountIdentifier}
                    </span>
                  </div>
                </div>

                <span
                  className={`w-3 h-3 rounded-full ${
                    ch.status === 'connected' ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-slate-300'
                  }`}
                  title={ch.status}
                />
              </div>

              {/* Status details */}
              <div className="space-y-1 text-xs text-slate-500 my-3">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span
                    className={`font-bold capitalize ${
                      ch.status === 'connected' ? 'text-emerald-700' : 'text-slate-500'
                    }`}
                  >
                    {ch.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Synced:</span>
                  <span className="font-mono text-slate-700">{ch.lastSyncAt || (ch as any).lastSync || 'Active'}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedChannel(ch.channel || (ch as any).type || 'website')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                Configure
              </button>

              <button
                onClick={() => toggleChannelConnection(ch.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-colors ${
                  ch.status === 'connected'
                    ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                {ch.status === 'connected' ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Website Live Chat Widget Customizer & Interactive Preview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Website Live Chat Widget Configurator
              </h3>
              <p className="text-xs text-slate-400">
                Customize appearance, welcome prompts, and grab the embed code snippet
              </p>
            </div>
          </div>
          <button
            onClick={copyEmbedCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Copy Widget Code</span>
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Config form on left */}
          <form onSubmit={handleSaveWidget} className="lg:col-span-7 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Widget Brand Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subtitle / AI Status</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Theme Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Screen Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Initial Greeting Message</label>
              <textarea
                rows={3}
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block font-sans">
                Embed Script Tag (Paste into your website before &lt;/body&gt;)
              </span>
              <code>
                &lt;script src="https://cdn.whatsai.app/widget.js" data-business-id="biz-sofana"
                data-theme="{themeColor}" async&gt;&lt;/script&gt;
              </code>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
            >
              Save Widget Settings
            </button>
          </form>

          {/* Live Interactive Preview Box on Right */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-100 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Interactive Live Preview
            </span>

            {/* Simulated Widget Window */}
            <div className="w-full max-w-sm rounded-2xl shadow-xl overflow-hidden bg-white border border-slate-200 flex flex-col h-[400px]">
              {/* Header */}
              <div
                className="p-3 text-white flex items-center justify-between"
                style={{ backgroundColor: themeColor }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">{title}</h4>
                    <p className="text-[10px] text-white/80">{subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Chat history */}
              <div className="flex-1 p-3 space-y-2.5 overflow-y-auto text-xs bg-slate-50/50">
                {previewChat.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-2.5 rounded-xl ${
                        msg.sender === 'user'
                          ? 'bg-emerald-600 text-white rounded-tr-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-2xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSendPreview} className="p-2 bg-white border-t border-slate-200 flex gap-1.5">
                <input
                  type="text"
                  placeholder="Type a test message..."
                  value={previewInput}
                  onChange={(e) => setPreviewInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="p-2 text-white rounded-lg"
                  style={{ backgroundColor: themeColor }}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
