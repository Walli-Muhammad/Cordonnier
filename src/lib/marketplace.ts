// =============================================
// WALIM LTD - Marketplace Integration Architecture
// Interface abstraction for multi-channel sales (eBay, Amazon, Etsy, Shopify)
// =============================================

export type MarketplacePlatform = 'eBay' | 'Amazon' | 'Etsy' | 'Shopify';

export interface MarketplaceSyncProductInput {
  productId: string;
  title: string;
  sku: string;
  description: string;
  price: number;
  currency: string;
  stockCount: number;
  images: string[];
}

export interface MarketplaceSyncResult {
  success: boolean;
  platform: MarketplacePlatform;
  externalId?: string;
  externalUrl?: string;
  message: string;
  syncedAt: string;
}

export interface MarketplaceProvider {
  platform: MarketplacePlatform;
  isConfigured: boolean;
  syncProduct(input: MarketplaceSyncProductInput): Promise<MarketplaceSyncResult>;
  syncInventory(sku: string, newStock: number): Promise<boolean>;
  syncOrders(): Promise<any[]>;
}

// Stub implementation for future eBay API connection
export class EbayMarketplaceAdapter implements MarketplaceProvider {
  platform: MarketplacePlatform = 'eBay';
  isConfigured = false;

  async syncProduct(input: MarketplaceSyncProductInput): Promise<MarketplaceSyncResult> {
    return {
      success: false,
      platform: 'eBay',
      message: 'eBay integration pending API credentials configuration in environment variables.',
      syncedAt: new Date().toISOString(),
    };
  }

  async syncInventory(sku: string, newStock: number): Promise<boolean> {
    return false;
  }

  async syncOrders(): Promise<any[]> {
    return [];
  }
}

// Stub implementation for future Amazon API connection
export class AmazonMarketplaceAdapter implements MarketplaceProvider {
  platform: MarketplacePlatform = 'Amazon';
  isConfigured = false;

  async syncProduct(input: MarketplaceSyncProductInput): Promise<MarketplaceSyncResult> {
    return {
      success: false,
      platform: 'Amazon',
      message: 'Amazon SP-API integration pending credentials configuration.',
      syncedAt: new Date().toISOString(),
    };
  }

  async syncInventory(sku: string, newStock: number): Promise<boolean> {
    return false;
  }

  async syncOrders(): Promise<any[]> {
    return [];
  }
}
