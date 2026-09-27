import { Campaign } from '../types/omnichannel';
import { initialCampaigns } from '../data/mockApprovals';

class CampaignService {
  private campaigns: Campaign[] = [...initialCampaigns];

  async getCampaigns(businessId?: string): Promise<Campaign[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.campaigns]), 40);
    });
  }

  async createCampaign(data: Omit<Campaign, 'id' | 'sentCount' | 'deliveredCount' | 'readCount' | 'repliedCount'>): Promise<Campaign> {
    const newCampaign: Campaign = {
      ...data,
      id: `cmp-${Date.now()}`,
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      repliedCount: 0,
    };
    this.campaigns.unshift(newCampaign);
    return newCampaign;
  }

  async toggleCampaignStatus(id: string): Promise<Campaign> {
    const index = this.campaigns.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Campaign not found');

    const current = this.campaigns[index];
    const newStatus = current.status === 'running' ? 'paused' : 'running';
    this.campaigns[index] = { ...current, status: newStatus };
    return this.campaigns[index];
  }
}

export const campaignService = new CampaignService();
