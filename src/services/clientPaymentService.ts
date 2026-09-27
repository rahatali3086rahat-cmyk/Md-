import { ClientPayment } from '../types/omnichannel';
import { initialClientPayments } from '../data/mockClientPayments';

class ClientPaymentService {
  private payments: ClientPayment[] = [...initialClientPayments];

  async getPayments(businessId?: string): Promise<ClientPayment[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.payments]), 50);
    });
  }

  async recordPayment(data: Omit<ClientPayment, 'id' | 'date'>): Promise<ClientPayment> {
    const newPayment: ClientPayment = {
      ...data,
      id: `pay-${Date.now()}`,
      date: 'Just now',
    };
    this.payments.unshift(newPayment);
    return newPayment;
  }
}

export const clientPaymentService = new ClientPaymentService();
