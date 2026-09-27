import { AIAgentConfig, Product, KnowledgeItem } from '../types';
import { initialAISettings } from '../data/mockAISettings';

const STORAGE_KEY = 'scaleup_ai_settings';

function getStoredAISettings(): AIAgentConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return initialAISettings;
}

function saveAISettings(settings: AIAgentConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // fallback
  }
}

export const aiService = {
  async getAISettings(businessId?: string): Promise<AIAgentConfig> {
    const settings = getStoredAISettings();
    if (businessId && settings.businessId !== businessId) {
      return { ...settings, businessId };
    }
    return settings;
  },

  async updateAISettings(businessId: string, updates: Partial<AIAgentConfig>): Promise<AIAgentConfig> {
    const current = getStoredAISettings();
    const updated = { ...current, ...updates, businessId };
    saveAISettings(updated);
    return updated;
  },

  /**
   * Mock AI response generation for playground and simulated WhatsApp replies.
   * Tailored with business knowledge, inventory guardrails, and role constraints.
   */
  async testAIPrompt(
    userMessage: string,
    config: AIAgentConfig,
    products: Product[] = [],
    knowledge: KnowledgeItem[] = []
  ): Promise<string> {
    // Artificial small delay for realism
    await new Promise((r) => setTimeout(r, 600));

    const lower = userMessage.toLowerCase().trim();

    // Specific match from user prompt specification
    if (lower.includes('beige l sofa') || lower.includes('beige l-shaped sofa') || lower.includes('l sofa')) {
      const sofa = products.find((p) => p.name.toLowerCase().includes('sofa'));
      const priceText = sofa ? ` The price is ${sofa.currency} ${sofa.price.toLocaleString()}.` : '';
      return `Yes, we currently have a beige Modern L Sofa available in stock.${priceText} Would you like to know the dimensions, see color swatches, or schedule a showroom viewing?`;
    }

    if (lower.includes('delivery') || lower.includes('shipping') || lower.includes('time')) {
      const delItem = knowledge.find((k) => k.category === 'Delivery');
      if (delItem) {
        return `We deliver within 24 to 48 hours across Doha and all major cities in Qatar. White-glove assembly and room placement are complimentary!`;
      }
      return `Standard delivery in Doha is within 24–48 hours with free professional installation.`;
    }

    if (lower.includes('bedroom') || lower.includes('bed')) {
      return `Our Luxury Bedroom Set includes a king-size upholstered bed frame, dual integrated LED nightstands, and 6-drawer dresser for QAR 5,200. Would you like me to reserve a set or share our dimensions sheet?`;
    }

    if (lower.includes('dining') || lower.includes('table')) {
      return `The Modern Dining Table features a sintered stone heat-resistant top and seats up to 8 guests comfortably for QAR 2,800. We also offer matching velvet dining chairs!`;
    }

    if (lower.includes('human') || lower.includes('agent') || lower.includes('speak with someone') || lower.includes('call me')) {
      return `I understand you would like to speak directly with our sales team. I am transferring this conversation to an agent right now. A representative will be with you in just a moment!`;
    }

    if (lower.includes('location') || lower.includes('showroom') || lower.includes('where')) {
      return `Our flagship showroom is located on Salwa Road, Doha. We are open Saturday–Thursday from 9:00 AM to 10:00 PM, and Friday from 4:00 PM to 10:30 PM. We look forward to welcoming you!`;
    }

    if (lower.includes('discount') || lower.includes('offer') || lower.includes('price')) {
      return `We currently offer complimentary white-glove delivery and a 2-year manufacturer warranty on all furniture collections. Are you looking for living room, bedroom, or dining pieces?`;
    }

    return `Hello! Thank you for reaching out to ${config.agentName}. I can share our catalog, check real-time stock at our Doha showroom, or help you place an order. Which collection are you interested in today?`;
  },
};
