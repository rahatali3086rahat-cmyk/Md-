import { ServiceItem } from '../types/omnichannel';
import { initialServices } from '../data/mockServices';

class ServicesService {
  private services: ServiceItem[] = [...initialServices];

  async getServices(businessId?: string): Promise<ServiceItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.services]), 50);
    });
  }

  async createService(data: Omit<ServiceItem, 'id'>): Promise<ServiceItem> {
    const newService: ServiceItem = {
      ...data,
      id: `srv-${Date.now()}`,
    };
    this.services.unshift(newService);
    return newService;
  }

  async updateService(id: string, updates: Partial<ServiceItem>): Promise<ServiceItem> {
    const index = this.services.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Service not found');

    this.services[index] = { ...this.services[index], ...updates };
    return this.services[index];
  }

  async deleteService(id: string): Promise<void> {
    this.services = this.services.filter((s) => s.id !== id);
  }
}

export const servicesService = new ServicesService();
