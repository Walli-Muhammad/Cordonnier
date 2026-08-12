// =============================================
// WALIM LTD - Inventory Management Architecture
// Supports WALIM Warehouse, Supplier Inventory & Marketplace Sync
// =============================================

export type InventorySource = 'WALIM_WAREHOUSE' | 'SUPPLIER_INVENTORY' | 'MARKETPLACE_STOCK';
export type InventoryState = 'available' | 'reserved' | 'incoming' | 'out_of_stock';

export interface InventoryRecord {
  productId: string;
  variantId?: string;
  sku: string;
  source: InventorySource;
  locationName: string;
  quantityAvailable: number;
  quantityReserved: number;
  quantityIncoming: number;
  state: InventoryState;
}

export class InventoryService {
  /**
   * Evaluates inventory state for a product line
   */
  static getInventoryState(available: number): InventoryState {
    if (available <= 0) return 'out_of_stock';
    return 'available';
  }

  /**
   * Validates whether requested quantity is in stock before order placement
   */
  static checkStockAvailability(requestedQty: number, availableStock: number): boolean {
    return availableStock >= requestedQty;
  }
}
