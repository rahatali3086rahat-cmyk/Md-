import { Customer, CustomerTimelineEvent, CustomerLifecycleStage } from '../types/omnichannel';
import { initialCustomers, initialTimelineEvents } from '../data/mockCustomers';

class CustomerService {
  private customers: Customer[] = [...initialCustomers];
  private timelineEvents: CustomerTimelineEvent[] = [...initialTimelineEvents];

  async getCustomers(businessId?: string): Promise<Customer[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.customers]), 50);
    });
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const cust = this.customers.find((c) => c.id === id);
    return cust ? { ...cust } : null;
  }

  async getCustomerTimeline(customerId: string): Promise<CustomerTimelineEvent[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const events = this.timelineEvents
          .filter((e) => e.customerId === customerId)
          .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        resolve(events);
      }, 50);
    });
  }

  async addTimelineEvent(event: Omit<CustomerTimelineEvent, 'id'>): Promise<CustomerTimelineEvent> {
    const newEvent: CustomerTimelineEvent = {
      ...event,
      id: `evt-${Date.now()}`,
    };
    this.timelineEvents.unshift(newEvent);
    return newEvent;
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    const index = this.customers.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Customer not found');

    this.customers[index] = { ...this.customers[index], ...updates };
    return this.customers[index];
  }

  async updateCustomerLifecycleStage(id: string, stage: CustomerLifecycleStage): Promise<Customer> {
    return this.updateCustomer(id, { lifecycleStage: stage });
  }
}

export const customerService = new CustomerService();
