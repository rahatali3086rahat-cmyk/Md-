/**
 * Centralized Branding Configuration
 * 
 * Supports easy rebranding between "ScaleUp Gulf AI" and "WhatsAI" or any white-label customer brand.
 */

export interface BrandingConfig {
  name: string;
  shortName: string;
  tagline: string;
  logoLetter: string;
  accentColor: string;
  supportEmail: string;
  metaPartnerBadge: string;
}

export const BRAND_CONFIG: BrandingConfig = {
  name: "ScaleUp Gulf AI",
  shortName: "ScaleUp Gulf",
  tagline: "AI-Powered Business Automation & Omnichannel Growth Platform",
  logoLetter: "S",
  accentColor: "emerald",
  supportEmail: "support@scaleupgulf.ai",
  metaPartnerBadge: "Enterprise Omnichannel Business Automation",
};
