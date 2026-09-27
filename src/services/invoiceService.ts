import { BusinessInvoice, BusinessInvoiceStatus, ChannelType } from '../types/omnichannel';
import { initialBusinessInvoices } from '../data/mockInvoices';

class InvoiceService {
  private invoices: BusinessInvoice[] = [...initialBusinessInvoices];

  async getInvoices(businessId?: string): Promise<BusinessInvoice[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.invoices]), 50);
    });
  }

  async createInvoice(data: Omit<BusinessInvoice, 'id' | 'createdDate'>): Promise<BusinessInvoice> {
    const totalVal = data.total ?? data.totalAmount ?? 0;
    const newInvoice: BusinessInvoice = {
      ...data,
      total: totalVal,
      totalAmount: totalVal,
      id: `inv-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      paymentUrl: `https://pay.whatsai.global/inv/${Date.now().toString().slice(-4)}`,
    };
    this.invoices.unshift(newInvoice);
    return newInvoice;
  }

  async sendInvoiceViaChannel(id: string, channel: ChannelType): Promise<BusinessInvoice> {
    const index = this.invoices.findIndex((inv) => inv.id === id);
    if (index === -1) throw new Error('Invoice not found');

    this.invoices[index] = {
      ...this.invoices[index],
      status: 'sent',
      deliveryChannel: channel,
    };
    return this.invoices[index];
  }

  async markInvoicePaid(id: string): Promise<BusinessInvoice> {
    const index = this.invoices.findIndex((inv) => inv.id === id);
    if (index === -1) throw new Error('Invoice not found');

    this.invoices[index] = {
      ...this.invoices[index],
      status: 'paid',
      paidAt: new Date().toISOString().split('T')[0],
    };
    return this.invoices[index];
  }

  async updateInvoiceStatus(id: string, status: BusinessInvoiceStatus): Promise<BusinessInvoice> {
    const index = this.invoices.findIndex((inv) => inv.id === id);
    if (index === -1) throw new Error('Invoice not found');

    this.invoices[index] = {
      ...this.invoices[index],
      status,
      paidAt: status === 'paid' ? new Date().toISOString().split('T')[0] : this.invoices[index].paidAt,
    };
    return this.invoices[index];
  }

  async deleteInvoice(id: string): Promise<void> {
    this.invoices = this.invoices.filter((inv) => inv.id !== id);
  }
}

export const invoiceService = new InvoiceService();
