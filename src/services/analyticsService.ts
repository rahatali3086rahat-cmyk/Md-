import {
  analyticsToday,
  analytics7Days,
  analytics30Days,
  popularProductsData,
  peakMessagingHours,
  VolumeDataPoint,
  LeadTrendPoint,
  ProductPopularity,
  PeakHourData,
} from '../data/mockAnalytics';

export type TimeRange = 'today' | '7days' | '30days' | '90days';

export interface AnalyticsPayload {
  volume: VolumeDataPoint[];
  leads: LeadTrendPoint[];
  popularProducts: ProductPopularity[];
  peakHours: PeakHourData[];
  stats: {
    totalConversations: number;
    totalConversationsChange: string;
    aiHandled: number;
    aiHandledPct: string;
    newLeads: number;
    newLeadsChange: string;
    qualifiedLeads: number;
    qualifiedLeadsChange: string;
    humanHandoffs: number;
    responseTimeSec: number;
    aiResolutionRatePct: string;
    customerSatisfactionPct: number;
  };
}

export const analyticsService = {
  async getAnalytics(range: TimeRange = '7days'): Promise<AnalyticsPayload> {
    let volume = analytics7Days.volume;
    let leads = analytics7Days.leads;

    if (range === 'today') {
      volume = analyticsToday.volume;
      leads = analyticsToday.leads;
    } else if (range === '30days' || range === '90days') {
      volume = analytics30Days.volume;
      leads = analytics30Days.leads;
    }

    return {
      volume,
      leads,
      popularProducts: popularProductsData,
      peakHours: peakMessagingHours,
      stats: {
        totalConversations: 1248,
        totalConversationsChange: '+18.4%',
        aiHandled: 982,
        aiHandledPct: '78.7%',
        newLeads: 164,
        newLeadsChange: '+12.8%',
        qualifiedLeads: 89,
        qualifiedLeadsChange: '+9.2%',
        humanHandoffs: 47,
        responseTimeSec: 8.4,
        aiResolutionRatePct: '78.7%',
        customerSatisfactionPct: 94,
      },
    };
  },
};
