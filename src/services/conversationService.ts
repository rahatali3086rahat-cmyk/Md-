import { Conversation, Message } from '../types';
import { initialConversations } from '../data/mockConversations';
import { initialMessages } from '../data/mockMessages';

const CONV_STORAGE_KEY = 'scaleup_conversations';
const MSG_STORAGE_KEY = 'scaleup_messages';

function getStoredConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(CONV_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return initialConversations;
}

function saveConversations(convs: Conversation[]) {
  try {
    localStorage.setItem(CONV_STORAGE_KEY, JSON.stringify(convs));
  } catch {
    // fallback
  }
}

function getStoredMessages(): Record<string, Message[]> {
  try {
    const raw = localStorage.getItem(MSG_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return initialMessages;
}

function saveMessages(msgs: Record<string, Message[]>) {
  try {
    localStorage.setItem(MSG_STORAGE_KEY, JSON.stringify(msgs));
  } catch {
    // fallback
  }
}

export const conversationService = {
  async getConversations(businessId?: string): Promise<Conversation[]> {
    const list = getStoredConversations();
    if (businessId) {
      return list.filter((c) => c.businessId === businessId);
    }
    return list;
  },

  async getConversation(conversationId: string): Promise<Conversation | undefined> {
    const list = getStoredConversations();
    return list.find((c) => c.id === conversationId);
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const map = getStoredMessages();
    return map[conversationId] || [];
  },

  async sendMessage(
    conversationId: string,
    text: string,
    sender: 'agent' | 'customer' | 'ai' = 'agent'
  ): Promise<{ message: Message; conversation: Conversation }> {
    const msgsMap = getStoredMessages();
    const convList = getStoredConversations();

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId,
      sender,
      text,
      timestamp: timeStr,
      status: 'delivered',
    };

    const currentList = msgsMap[conversationId] || [];
    msgsMap[conversationId] = [...currentList, newMsg];
    saveMessages(msgsMap);

    const convIndex = convList.findIndex((c) => c.id === conversationId);
    if (convIndex !== -1) {
      convList[convIndex] = {
        ...convList[convIndex],
        lastMessage: text,
        lastMessageTime: 'Just now',
        unreadCount: sender === 'customer' ? convList[convIndex].unreadCount + 1 : 0,
      };
      saveConversations(convList);
      return { message: newMsg, conversation: convList[convIndex] };
    }

    throw new Error('Conversation not found');
  },

  async takeOverConversation(conversationId: string): Promise<Conversation> {
    const convList = getStoredConversations();
    const index = convList.findIndex((c) => c.id === conversationId);
    if (index === -1) throw new Error('Conversation not found');

    const updated: Conversation = {
      ...convList[index],
      status: 'human',
      assignedAgent: 'Rahat (You)',
    };
    convList[index] = updated;
    saveConversations(convList);

    // Also inject system message
    const msgsMap = getStoredMessages();
    const currentMsgs = msgsMap[conversationId] || [];
    const sysMsg: Message = {
      id: `sys-${Date.now()}`,
      conversationId,
      sender: 'agent',
      text: '👤 Human agent Rahat has joined the chat and taken over.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
    };
    msgsMap[conversationId] = [...currentMsgs, sysMsg];
    saveMessages(msgsMap);

    return updated;
  },

  async toggleAI(conversationId: string, enabled: boolean): Promise<Conversation> {
    const convList = getStoredConversations();
    const index = convList.findIndex((c) => c.id === conversationId);
    if (index === -1) throw new Error('Conversation not found');

    const updated: Conversation = {
      ...convList[index],
      status: enabled ? 'ai' : 'human',
      assignedAgent: enabled ? 'Unassigned (AI Agent)' : 'Rahat (You)',
    };
    convList[index] = updated;
    saveConversations(convList);
    return updated;
  },

  async updateCustomerLead(conversationId: string, updates: Partial<Conversation>): Promise<Conversation> {
    const convList = getStoredConversations();
    const index = convList.findIndex((c) => c.id === conversationId);
    if (index === -1) throw new Error('Conversation not found');

    const updated = { ...convList[index], ...updates };
    convList[index] = updated;
    saveConversations(convList);
    return updated;
  },
};
