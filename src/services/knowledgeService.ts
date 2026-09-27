import { KnowledgeItem } from '../types';
import { initialKnowledge } from '../data/mockKnowledge';

const STORAGE_KEY = 'scaleup_knowledge';

function getStoredKnowledge(): KnowledgeItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return initialKnowledge;
}

function saveKnowledge(items: KnowledgeItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // fallback
  }
}

export const knowledgeService = {
  async getKnowledgeItems(businessId?: string): Promise<KnowledgeItem[]> {
    const list = getStoredKnowledge();
    if (businessId) {
      return list.filter((k) => k.businessId === businessId);
    }
    return list;
  },

  async createKnowledgeItem(data: Omit<KnowledgeItem, 'id' | 'updatedAt'>): Promise<KnowledgeItem> {
    const list = getStoredKnowledge();
    const newItem: KnowledgeItem = {
      ...data,
      id: `kb-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newItem, ...list];
    saveKnowledge(updated);
    return newItem;
  },

  async updateKnowledgeItem(id: string, updates: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    const list = getStoredKnowledge();
    const index = list.findIndex((k) => k.id === id);
    if (index === -1) throw new Error('Knowledge item not found');

    const updated = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    list[index] = updated;
    saveKnowledge(list);
    return updated;
  },

  async deleteKnowledgeItem(id: string): Promise<void> {
    const list = getStoredKnowledge();
    const updated = list.filter((k) => k.id !== id);
    saveKnowledge(updated);
  },
};
