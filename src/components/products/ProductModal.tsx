import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Product } from '../../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Sofas');
  const [price, setPrice] = useState(3400);
  const [currency, setCurrency] = useState('QAR');
  const [description, setDescription] = useState('');
  const [inStock, setInStock] = useState(true);
  const [stockQuantity, setStockQuantity] = useState(12);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price);
      setCurrency(productToEdit.currency);
      setDescription(productToEdit.description);
      setInStock(productToEdit.inStock);
      setStockQuantity(productToEdit.stockQuantity || 10);
      setImageUrl(productToEdit.imageUrl || '');
    } else {
      setName('');
      setCategory('Sofas');
      setPrice(2500);
      setCurrency('QAR');
      setDescription('');
      setInStock(true);
      setStockQuantity(10);
      setImageUrl('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop');
    }
  }, [productToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (productToEdit) {
      updateProduct(productToEdit.id, {
        name,
        category,
        price: Number(price),
        currency,
        description,
        inStock,
        stockQuantity: Number(stockQuantity),
        imageUrl,
      });
    } else {
      addProduct({
        name,
        category,
        price: Number(price),
        currency,
        description,
        inStock,
        stockQuantity: Number(stockQuantity),
        imageUrl:
          imageUrl ||
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop',
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productToEdit ? 'Edit Product' : 'Add New Product'}
      subtitle="Catalog items the AI agent references during customer inquiries"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Product Title</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Modern Velvet Armchair"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="Sofas">Sofas & Lounges</option>
              <option value="Dining">Dining Sets</option>
              <option value="Bedroom">Bedroom Furniture</option>
              <option value="Office">Office & Chairs</option>
              <option value="Living">Living & Entertainment</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Price ({currency})</label>
            <input
              type="number"
              required
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Description & Specifications (AI Context)
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details such as dimensions, fabric, warranty, and lead times..."
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Stock Quantity</label>
            <input
              type="number"
              min={0}
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Availability</label>
            <div className="flex items-center gap-3 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="text-xs font-semibold text-slate-800">
                  {inStock ? 'In Stock (Available)' : 'Out of Stock'}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Image URL (Shared directly on WhatsApp)
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden font-mono"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
          >
            {productToEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
