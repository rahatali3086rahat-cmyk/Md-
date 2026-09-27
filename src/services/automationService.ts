import { AutomationRule, AutomationTemplate, FollowUpSequence } from '../types/omnichannel';
import { initialAutomations, automationTemplates, initialFollowUpSequences } from '../data/mockAutomations';

class AutomationService {
  private automations: AutomationRule[] = [...initialAutomations];
  private templates: AutomationTemplate[] = [...automationTemplates];
  private followUps: FollowUpSequence[] = [...initialFollowUpSequences];

  async getAutomations(businessId?: string): Promise<AutomationRule[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.automations]), 50);
    });
  }

  async getTemplates(): Promise<AutomationTemplate[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.templates]), 30);
    });
  }

  async getFollowUpSequences(businessId?: string): Promise<FollowUpSequence[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.followUps]), 50);
    });
  }

  async toggleAutomation(id: string): Promise<AutomationRule> {
    const index = this.automations.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Automation not found');

    this.automations[index] = {
      ...this.automations[index],
      isActive: !this.automations[index].isActive,
    };
    return this.automations[index];
  }

  async createAutomation(data: Omit<AutomationRule, 'id' | 'executionCount'>): Promise<AutomationRule> {
    const newAutomation: AutomationRule = {
      ...data,
      id: `rule-${Date.now()}`,
      executionCount: 0,
      lastTriggeredAt: 'Never',
    };
    this.automations.unshift(newAutomation);
    return newAutomation;
  }

  async useTemplate(templateId: string, businessId: string): Promise<AutomationRule> {
    const template = this.templates.find((t) => t.id === templateId);
    if (!template) throw new Error('Template not found');

    const newRule: AutomationRule = {
      id: `rule-${Date.now()}`,
      businessId,
      name: template.title,
      description: template.description,
      isActive: true,
      category: template.category,
      triggerChannel: template.channels[0] || 'all',
      triggerEvent: template.triggerDesc,
      blocks: [...template.blocks],
      executionCount: 0,
      lastTriggeredAt: 'Just deployed',
    };
    this.automations.unshift(newRule);
    return newRule;
  }

  async deleteAutomation(id: string): Promise<void> {
    this.automations = this.automations.filter((a) => a.id !== id);
  }
}

export const automationService = new AutomationService();
