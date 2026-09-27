import { Business } from '../types';
import { initialBusinesses } from '../data/mockBusinesses';

const STORAGE_KEY = 'scaleup_businesses';

function getStoredBusinesses(): Business[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return initialBusinesses;
}

function saveBusinesses(businesses: Business[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(businesses));
  } catch {
    // fallback
  }
}

export const businessService = {
  async getBusinesses(): Promise<Business[]> {
    return getStoredBusinesses();
  },

  async getBusiness(businessId: string): Promise<Business | undefined> {
    const list = getStoredBusinesses();
    return list.find((b) => b.id === businessId) || list[0];
  },

  async updateBusiness(businessId: string, updates: Partial<Business>): Promise<Business> {
    const list = getStoredBusinesses();
    const index = list.findIndex((b) => b.id === businessId);
    if (index === -1) {
      throw new Error(`Business ${businessId} not found`);
    }
    const updated = { ...list[index], ...updates };
    list[index] = updated;
    saveBusinesses(list);
    return updated;
  },

  async getWhatsAppStatus(businessId: string): Promise<{ status: 'connected' | 'disconnected' | 'connecting'; phone: string }> {
    const business = await this.getBusiness(businessId);
    return {
      status: business?.whatsappStatus || 'connected',
      phone: business?.whatsappPhone || '+974 5512 8844',
    };
  },

  async setWhatsAppStatus(businessId: string, status: 'connected' | 'disconnected' | 'connecting'): Promise<Business> {
    return this.updateBusiness(businessId, { whatsappStatus: status });
  },
};
