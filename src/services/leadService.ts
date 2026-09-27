import { Lead, LeadStatus } from '../types';
import { initialLeads } from '../data/mockLeads';

const STORAGE_KEY = 'scaleup_leads';

function getStoredLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return initialLeads;
}

function saveLeads(leads: Lead[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch {
    // fallback
  }
}

export const leadService = {
  async getLeads(businessId?: string): Promise<Lead[]> {
    const list = getStoredLeads();
    if (businessId) {
      return list.filter((l) => l.businessId === businessId);
    }
    return list;
  },

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const list = getStoredLeads();
    const index = list.findIndex((l) => l.id === id);
    if (index === -1) throw new Error('Lead not found');

    const updated = { ...list[index], ...updates };
    list[index] = updated;
    saveLeads(list);
    return updated;
  },

  async updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
    return this.updateLead(id, { status });
  },

  async createLead(data: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> {
    const list = getStoredLeads();
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newLead: Lead = {
      ...data,
      id: `lead-${Date.now()}`,
      createdAt: dateStr,
    };
    const updated = [newLead, ...list];
    saveLeads(updated);
    return newLead;
  },

  async deleteLead(id: string): Promise<void> {
    const list = getStoredLeads();
    const updated = list.filter((l) => l.id !== id);
    saveLeads(updated);
  },
};
