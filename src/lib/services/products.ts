import { Product, SearchFilters, Category, TruckManufacturer, TruckModel, PartCondition } from '@/types';
import { PRODUCTS, CATEGORIES, TRUCK_MANUFACTURERS, TRUCK_MODELS } from '@/lib/data/mock-data';
import { normalizeOem } from '@/lib/utils';

// Local mutable copy for development & demo persistence
let localProducts: Product[] = [...PRODUCTS];

export async function getProducts(filters: SearchFilters = {}): Promise<{
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  let filtered = [...localProducts].filter((p) => p.status === 'published');

  // 1. Text Query (Search across name, description, SKU, OEM)
  if (filters.query && filters.query.trim()) {
    const q = filters.query.toLowerCase().trim();
    const cleanQ = normalizeOem(q);

    filtered = filtered.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchSku = normalizeOem(p.sku).includes(cleanQ);
      const matchOem = normalizeOem(p.oemNumber).includes(cleanQ);
      const matchAltOem = p.alternativeOemNumbers.some((alt) => normalizeOem(alt).includes(cleanQ));
      const matchCompat = p.compatibility.some(
        (c) =>
          c.manufacturerName.toLowerCase().includes(q) ||
          c.modelName.toLowerCase().includes(q) ||
          (c.engineCode && c.engineCode.toLowerCase().includes(q))
      );

      return matchName || matchDesc || matchSku || matchOem || matchAltOem || matchCompat;
    });
  }

  // 2. Strict OEM Number Filter
  if (filters.oemNumber && filters.oemNumber.trim()) {
    const normalizedFilterOem = normalizeOem(filters.oemNumber);
    filtered = filtered.filter((p) => {
      const mainMatch = normalizeOem(p.oemNumber).includes(normalizedFilterOem);
      const altMatch = p.alternativeOemNumbers.some((alt) => normalizeOem(alt).includes(normalizedFilterOem));
      return mainMatch || altMatch;
    });
  }

  // 3. Category Filter (slug or ID)
  if (filters.category) {
    const cat = CATEGORIES.find((c) => c.slug === filters.category || c.id === filters.category);
    if (cat) {
      filtered = filtered.filter((p) => p.categoryId === cat.id);
    }
  }

  // 4. Truck Manufacturer / Brand Filter
  if (filters.brand) {
    const brand = TRUCK_MANUFACTURERS.find(
      (m) => m.slug.toLowerCase() === filters.brand?.toLowerCase() || m.name.toLowerCase() === filters.brand?.toLowerCase()
    );
    if (brand) {
      filtered = filtered.filter((p) =>
        p.compatibility.some((c) => c.manufacturerName.toLowerCase() === brand.name.toLowerCase())
      );
    }
  }

  // 5. Truck Model Filter
  if (filters.model) {
    filtered = filtered.filter((p) =>
      p.compatibility.some((c) => c.modelId === filters.model || c.modelName.toLowerCase().includes((filters.model || '').toLowerCase()))
    );
  }

  // 6. Condition Filter
  if (filters.condition) {
    filtered = filtered.filter((p) => p.condition === filters.condition);
  }

  // 7. Price Filters (in EUR)
  if (filters.minPrice !== undefined && filters.minPrice !== null) {
    const minCents = filters.minPrice * 100;
    filtered = filtered.filter((p) => p.priceCents >= minCents);
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
    const maxCents = filters.maxPrice * 100;
    filtered = filtered.filter((p) => p.priceCents <= maxCents);
  }

  // 8. Stock availability
  if (filters.inStockOnly) {
    filtered = filtered.filter((p) => p.stockQuantity > 0);
  }

  // 9. Sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.priceCents - b.priceCents);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.priceCents - a.priceCents);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'relevance':
      default:
        // Featured first, then newest
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }
  }

  const total = filtered.length;
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const pageSize = filters.pageSize && filters.pageSize > 0 ? filters.pageSize : 12;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  return {
    products: paginated,
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = localProducts.find((p) => p.slug === slug);
  return product || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = localProducts.find((p) => p.id === id);
  return product || null;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return localProducts.filter((p) => p.isFeatured && p.status === 'published').slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return localProducts
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId && p.status === 'published')
    .slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  return CATEGORIES.map((cat) => ({
    ...cat,
    productCount: localProducts.filter((p) => p.categoryId === cat.id && p.status === 'published').length,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return null;
  return {
    ...cat,
    productCount: localProducts.filter((p) => p.categoryId === cat.id && p.status === 'published').length,
  };
}

export async function getTruckManufacturers(): Promise<TruckManufacturer[]> {
  return TRUCK_MANUFACTURERS;
}

export async function getManufacturerBySlug(slug: string): Promise<TruckManufacturer | null> {
  return TRUCK_MANUFACTURERS.find((m) => m.slug === slug) || null;
}

export async function getTruckModels(manufacturerId?: string): Promise<TruckModel[]> {
  if (manufacturerId) {
    return TRUCK_MODELS.filter((m) => m.manufacturerId === manufacturerId);
  }
  return TRUCK_MODELS;
}

// Administrative mutations
export async function createProduct(input: Partial<Product>): Promise<Product> {
  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    sku: input.sku || `TRK-GEN-${Date.now().toString().slice(-6)}`,
    name: input.name || 'Untitled Truck Spare Part',
    slug: input.slug || `part-${Date.now()}`,
    oemNumber: input.oemNumber || '',
    alternativeOemNumbers: input.alternativeOemNumbers || [],
    categoryId: input.categoryId || CATEGORIES[0].id,
    categoryName: CATEGORIES.find((c) => c.id === input.categoryId)?.name || 'General',
    supplierId: input.supplierId,
    condition: (input.condition as PartCondition) || 'new',
    refurbishmentStatus: input.refurbishmentStatus,
    priceCents: input.priceCents || 0,
    currency: 'EUR',
    vatRatePercent: input.vatRatePercent || 21.0,
    stockQuantity: input.stockQuantity || 0,
    isAvailable: (input.stockQuantity || 0) > 0,
    weightKg: input.weightKg || 5,
    dimensionsCm: input.dimensionsCm,
    shortDescription: input.shortDescription,
    description: input.description || '',
    technicalSpecifications: input.technicalSpecifications || {},
    warrantyMonths: input.warrantyMonths || 12,
    shippingClass: input.shippingClass || 'standard_freight',
    isFeatured: Boolean(input.isFeatured),
    status: input.status || 'published',
    images: input.images && input.images.length > 0 ? input.images : [
      { id: `img-${Date.now()}`, url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80', isPrimary: true, sortOrder: 1 }
    ],
    compatibility: input.compatibility || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  localProducts.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const index = localProducts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const existing = localProducts[index];
  const updated: Product = {
    ...existing,
    ...updates,
    isAvailable: (updates.stockQuantity !== undefined ? updates.stockQuantity : existing.stockQuantity) > 0,
    updatedAt: new Date().toISOString(),
  };

  localProducts[index] = updated;
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const index = localProducts.findIndex((p) => p.id === id);
  if (index === -1) return false;
  localProducts.splice(index, 1);
  return true;
}
