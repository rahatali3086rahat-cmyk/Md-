import { ChannelAccount, ChannelType, WebsiteChatWidgetConfig } from '../types/omnichannel';
import { initialChannels, defaultWidgetConfig } from '../data/mockChannels';

class ChannelService {
  private channels: ChannelAccount[] = [...initialChannels];
  private widgetConfig: WebsiteChatWidgetConfig = { ...defaultWidgetConfig };

  async getChannels(businessId?: string): Promise<ChannelAccount[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.channels]);
      }, 50);
    });
  }

  async toggleChannelConnection(id: string): Promise<ChannelAccount> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.channels.findIndex((c) => c.id === id);
        if (index === -1) {
          reject(new Error('Channel not found'));
          return;
        }

        const current = this.channels[index];
        const newStatus = current.status === 'connected' ? 'disconnected' : 'connected';
        this.channels[index] = {
          ...current,
          status: newStatus,
          lastSyncAt: newStatus === 'connected' ? 'Just now' : current.lastSyncAt,
        };
        resolve(this.channels[index]);
      }, 100);
    });
  }

  async getWidgetConfig(): Promise<WebsiteChatWidgetConfig> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...this.widgetConfig });
      }, 50);
    });
  }

  async updateWidgetConfig(updates: Partial<WebsiteChatWidgetConfig>): Promise<WebsiteChatWidgetConfig> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.widgetConfig = { ...this.widgetConfig, ...updates };
        resolve({ ...this.widgetConfig });
      }, 80);
    });
  }
}

export const channelService = new ChannelService();
