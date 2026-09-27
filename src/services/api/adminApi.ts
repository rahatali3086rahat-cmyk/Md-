import { apiClient, ApiResponse } from './apiClient';
import {
  SaaSClient,
  SaaSSubscription,
  SaaSPayment,
  AdminAuditLog,
  SystemHealthService,
  initialSaaSClients,
  initialSaaSSubscriptions,
  initialSaaSPayments,
  initialAdminAuditLogs,
  initialSaaSHealthServices,
} from '../../data/mockAdmin';

export interface AdminRevenueMetrics {
  totalRevenue: number;
  mrr: number;
  successfulPaymentsCount: number;
  failedPaymentsCount: number;
  refundsTotal: number;
  outstandingTotal: number;
  activeSubscriptionsCount: number;
  totalClientsCount: number;
  activeClientsCount: number;
  inactiveClientsCount: number;
  newClientsThisMonth: number;
  monthlyRevenueSeries: { month: string; revenue: number; clients: number }[];
  planDistribution: { plan: string; count: number; percentage: number; revenue: number }[];
}

export const adminApi = {
  getClients: async (): Promise<ApiResponse<SaaSClient[]>> => {
    return apiClient.get<SaaSClient[]>('/api/admin/clients', initialSaaSClients);
  },

  getClientById: async (id: string): Promise<ApiResponse<SaaSClient | null>> => {
    const fallback = initialSaaSClients.find((c) => c.id === id) || null;
    return apiClient.get<SaaSClient | null>(`/api/admin/clients/${id}`, fallback);
  },

  updateClientStatus: async (
    id: string,
    status: 'active' | 'suspended' | 'trial' | 'cancelled'
  ): Promise<ApiResponse<{ success: boolean; id: string; status: string }>> => {
    return apiClient.patch(
      `/api/admin/clients/${id}/status`,
      { status },
      { success: true, id, status }
    );
  },

  updateClientPlan: async (
    id: string,
    plan: 'Starter' | 'Professional' | 'Business' | 'Enterprise'
  ): Promise<ApiResponse<{ success: boolean; id: string; plan: string }>> => {
    return apiClient.patch(
      `/api/admin/clients/${id}/plan`,
      { plan },
      { success: true, id, plan }
    );
  },

  getSubscriptions: async (): Promise<ApiResponse<SaaSSubscription[]>> => {
    return apiClient.get<SaaSSubscription[]>('/api/admin/subscriptions', initialSaaSSubscriptions);
  },

  getPayments: async (): Promise<ApiResponse<SaaSPayment[]>> => {
    return apiClient.get<SaaSPayment[]>('/api/admin/payments', initialSaaSPayments);
  },

  getAuditLogs: async (): Promise<ApiResponse<AdminAuditLog[]>> => {
    return apiClient.get<AdminAuditLog[]>('/api/admin/logs', initialAdminAuditLogs);
  },

  getSystemHealth: async (): Promise<ApiResponse<SystemHealthService[]>> => {
    return apiClient.get<SystemHealthService[]>('/api/admin/system-health', initialSaaSHealthServices);
  },

  pingService: async (serviceId: string): Promise<ApiResponse<{ success: boolean; latencyMs: number; status: string }>> => {
    const latency = Math.floor(Math.random() * 40) + 15;
    return apiClient.post(
      `/api/admin/system-health/${serviceId}/ping`,
      {},
      { success: true, latencyMs: latency, status: 'operational' }
    );
  },

  getRevenueMetrics: async (): Promise<ApiResponse<AdminRevenueMetrics>> => {
    const fallback: AdminRevenueMetrics = {
      totalRevenue: 57900,
      mrr: 6550,
      successfulPaymentsCount: 142,
      failedPaymentsCount: 3,
      refundsTotal: 1250,
      outstandingTotal: 1950,
      activeSubscriptionsCount: 5,
      totalClientsCount: 6,
      activeClientsCount: 4,
      inactiveClientsCount: 2,
      newClientsThisMonth: 2,
      monthlyRevenueSeries: [
        { month: 'Apr', revenue: 4200, clients: 3 },
        { month: 'May', revenue: 4800, clients: 4 },
        { month: 'Jun', revenue: 5200, clients: 4 },
        { month: 'Jul', revenue: 5900, clients: 5 },
        { month: 'Aug', revenue: 6200, clients: 5 },
        { month: 'Sep', revenue: 6550, clients: 6 },
      ],
      planDistribution: [
        { plan: 'Starter', count: 1, percentage: 17, revenue: 250 },
        { plan: 'Professional', count: 2, percentage: 33, revenue: 1300 },
        { plan: 'Business', count: 2, percentage: 33, revenue: 2500 },
        { plan: 'Enterprise', count: 1, percentage: 17, revenue: 2500 },
      ],
    };

    return apiClient.get<AdminRevenueMetrics>('/api/admin/revenue', fallback);
  },
};
