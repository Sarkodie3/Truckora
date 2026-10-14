'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Plus,
  Search,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowLeft,
} from 'lucide-react';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from '@/lib/services/products';
import { Product, Category, PartCondition } from '@/types';
import { formatCentsToEur, formatDate } from '@/lib/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [oemNumber, setOemNumber] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [condition, setCondition] = useState<PartCondition>('new');
  const [refurbishmentStatus, setRefurbishmentStatus] = useState('');
  const [priceEur, setPriceEur] = useState('850.00');
  const [stockQuantity, setStockQuantity] = useState(5);
  const [weightKg, setWeightKg] = useState('18.5');
  const [description, setDescription] = useState('');
  const [warrantyMonths, setWarrantyMonths] = useState(12);

  const [formFeedback, setFormFeedback] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [cats, prodRes] = await Promise.all([
      getCategories(),
      getProducts({ pageSize: 100 }),
    ]);
    setCategories(cats);
    setProducts(prodRes.products);
    if (cats.length > 0 && !categoryId) {
      setCategoryId(cats[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setSku(`TRK-${Date.now().toString().slice(-6)}`);
    setOemNumber('');
    setCondition('new');
    setRefurbishmentStatus('');
    setPriceEur('500.00');
    setStockQuantity(5);
    setWeightKg('10.0');
    setDescription('');
    setWarrantyMonths(12);
    setFormFeedback(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setOemNumber(p.oemNumber);
    setCategoryId(p.categoryId);
    setCondition(p.condition);
    setRefurbishmentStatus(p.refurbishmentStatus || '');
    setPriceEur((p.priceCents / 100).toFixed(2));
    setStockQuantity(p.stockQuantity);
    setWeightKg(p.weightKg ? p.weightKg.toString() : '10.0');
    setDescription(p.description);
    setWarrantyMonths(p.warrantyMonths);
    setFormFeedback(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceCents = Math.round(parseFloat(priceEur || '0') * 100);

    if (editingProduct) {
      // Update
      const res = await updateProduct(editingProduct.id, {
        name,
        sku,
        oemNumber,
        categoryId,
        condition,
        refurbishmentStatus: condition === 'refurbished' ? refurbishmentStatus : undefined,
        priceCents,
        stockQuantity,
        weightKg: parseFloat(weightKg || '5'),
        description,
        warrantyMonths,
      });

      if (res) {
        setIsModalOpen(false);
        loadData();
      }
    } else {
      // Create
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

      const res = await createProduct({
        name,
        sku,
        slug,
        oemNumber,
        categoryId,
        condition,
        refurbishmentStatus: condition === 'refurbished' ? refurbishmentStatus : undefined,
        priceCents,
        stockQuantity,
        weightKg: parseFloat(weightKg || '5'),
        description,
        warrantyMonths,
        images: [
          {
            id: `img-${Date.now()}`,
            url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
            isPrimary: true,
            sortOrder: 1,
          },
        ],
      });

      if (res) {
        setIsModalOpen(false);
        loadData();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this commercial part from the warehouse database?')) {
      await deleteProduct(id);
      loadData();
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.oemNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header */}
      <div className="pb-6 mb-8 border-b border-truckora-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/admin" className="hover:text-brand-orange flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Admin Operations</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            Product Catalogue & Stock Master
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, and reclassify European truck parts, OEM cross-references, and pricing.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="bg-brand-orange hover:bg-brand-orange-hover text-white px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Truck Part</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-xl border border-truckora-border p-4 mb-6 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by SKU, OEM, or name..."
            className="w-full px-3 py-2 pl-9 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-brand-navy"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Showing {filteredProducts.length} of {products.length} catalogued items
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-truckora-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Part Title</th>
                <th className="py-3 px-4">SKU / OEM</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Price (Excl. VAT)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Warranty</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-brand-navy max-w-xs truncate">
                    <Link href={`/products/${p.slug}`} className="hover:text-brand-orange">
                      {p.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <div className="font-bold text-slate-800">{p.sku}</div>
                    <div className="text-[10px] text-slate-400">OEM: {p.oemNumber}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {p.condition}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-black text-slate-900">
                    {formatCentsToEur(p.priceCents)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        p.stockQuantity > 3
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {p.stockQuantity} in stock
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium">{p.warrantyMonths}m</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-brand-navy"
                        title="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-truckora-border max-w-2xl w-full p-6 space-y-4 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-brand-navy">
                {editingProduct ? 'Edit Commercial Truck Part' : 'Add New Truck Part to Inventory'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Holset HE400VG Variable Geometry Turbocharger"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded font-mono uppercase focus:border-brand-navy"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Primary OEM Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={oemNumber}
                    onChange={(e) => setOemNumber(e.target.value)}
                    placeholder="e.g. 1853604"
                    className="w-full px-3 py-2 border border-slate-300 rounded font-mono uppercase focus:border-brand-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded focus:border-brand-navy bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Condition *</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as PartCondition)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded focus:border-brand-navy bg-white"
                  >
                    <option value="new">Brand New</option>
                    <option value="used">Tested Used</option>
                    <option value="refurbished">Factory Refurbished</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Warranty (Months)</label>
                  <input
                    type="number"
                    value={warrantyMonths}
                    onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy"
                  />
                </div>
              </div>

              {condition === 'refurbished' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Refurbishment Details & Test Protocol
                  </label>
                  <input
                    type="text"
                    value={refurbishmentStatus}
                    onChange={(e) => setRefurbishmentStatus(e.target.value)}
                    placeholder="e.g. Dynamic high-speed balancing & new VGT actuator"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Unit Price EUR (Excl. VAT) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={priceEur}
                    onChange={(e) => setPriceEur(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:border-brand-navy"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Initial Stock Count *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Product Description & Workshop Notes *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Include technical details, connector pins, cooling medium, and fitment remarks..."
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-navy hover:bg-brand-navy-light text-white px-5 py-2 rounded font-bold transition-colors"
                >
                  {editingProduct ? 'Save Product Updates' : 'Publish Part to Catalogue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
