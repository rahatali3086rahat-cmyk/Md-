import { apiClient, ApiResponse } from './apiClient';
import { initialBusinesses } from '../../data/mockBusinesses';
import { initialCustomers } from '../../data/mockCustomers';
import { initialConversations } from '../../data/mockConversations';
import { initialLeads } from '../../data/mockLeads';
import { initialBookings } from '../../data/mockBookings';
import { initialBusinessInvoices } from '../../data/mockInvoices';
import { initialClientPayments } from '../../data/mockClientPayments';
import { initialAutomations } from '../../data/mockAutomations';
import { analytics7Days } from '../../data/mockAnalytics';

export const clientApi = {
  getBusinesses: async () => {
    return apiClient.get('/api/businesses', initialBusinesses);
  },

  getCustomers: async (businessId?: string) => {
    const list = businessId
      ? initialCustomers.filter((c) => !c.businessId || c.businessId === businessId)
      : initialCustomers;
    return apiClient.get('/api/customers', list);
  },

  getConversations: async (businessId?: string) => {
    const list = businessId
      ? initialConversations.filter((c) => !c.businessId || c.businessId === businessId)
      : initialConversations;
    return apiClient.get('/api/conversations', list);
  },

  getLeads: async (businessId?: string) => {
    const list = businessId
      ? initialLeads.filter((l) => !l.businessId || l.businessId === businessId)
      : initialLeads;
    return apiClient.get('/api/leads', list);
  },

  getBookings: async (businessId?: string) => {
    const list = businessId
      ? initialBookings.filter((b) => !b.businessId || b.businessId === businessId)
      : initialBookings;
    return apiClient.get('/api/bookings', list);
  },

  getInvoices: async (businessId?: string) => {
    const list = businessId
      ? initialBusinessInvoices.filter((i) => !i.businessId || i.businessId === businessId)
      : initialBusinessInvoices;
    return apiClient.get('/api/invoices', list);
  },

  getPayments: async (businessId?: string) => {
    const list = businessId
      ? initialClientPayments.filter((p) => !p.businessId || p.businessId === businessId)
      : initialClientPayments;
    return apiClient.get('/api/payments', list);
  },

  getAutomations: async (businessId?: string) => {
    const list = businessId
      ? initialAutomations.filter((a) => !a.businessId || a.businessId === businessId)
      : initialAutomations;
    return apiClient.get('/api/automations', list);
  },

  getAnalytics: async (timeRange: string = '7days') => {
    return apiClient.get(`/api/analytics?range=${timeRange}`, analytics7Days);
  },
};
