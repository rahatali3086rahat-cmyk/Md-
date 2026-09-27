import { Product } from '../types';
import { initialProducts } from '../data/mockProducts';

const STORAGE_KEY = 'scaleup_products';

function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return initialProducts;
}

function saveProducts(products: Product[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    // fallback
  }
}

export const productService = {
  async getProducts(businessId?: string): Promise<Product[]> {
    const list = getStoredProducts();
    if (businessId) {
      return list.filter((p) => p.businessId === businessId);
    }
    return list;
  },

  async getProduct(id: string): Promise<Product | undefined> {
    const list = getStoredProducts();
    return list.find((p) => p.id === id);
  },

  async createProduct(data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const list = getStoredProducts();
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newProduct, ...list];
    saveProducts(updated);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const list = getStoredProducts();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');

    const updated = { ...list[index], ...updates };
    list[index] = updated;
    saveProducts(list);
    return updated;
  },

  async deleteProduct(id: string): Promise<void> {
    const list = getStoredProducts();
    const updated = list.filter((p) => p.id !== id);
    saveProducts(updated);
  },
};
