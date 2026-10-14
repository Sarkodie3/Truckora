// ==============================================================================
// TRUCKORA DOMAIN TYPE DEFINITIONS
// Truck Parts. Trusted Supply.
// ==============================================================================

export type PartCondition = 'new' | 'used' | 'refurbished';

export type ProductStatus = 'draft' | 'published' | 'archived';

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'ready_for_dispatch'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'unpaid'
  | 'authorized'
  | 'paid'
  | 'failed'
  | 'refunded';

export type ShipmentStatus =
  | 'label_created'
  | 'dispatched'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed';

export type EnquiryType =
  | 'part_compatibility'
  | 'vin_request'
  | 'quote'
  | 'general';

export type EnquiryStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface TruckManufacturer {
  id: string;
  name: string;
  slug: string;
  country: string;
  logoUrl?: string;
  isPopular: boolean;
  displayOrder: number;
}

export interface TruckModel {
  id: string;
  manufacturerId: string;
  manufacturerName?: string;
  name: string;
  slug: string;
  series?: string;
  yearFrom?: number;
  yearTo?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId?: string;
  iconName?: string;
  imageUrl?: string;
  displayOrder: number;
  productCount?: number;
}

export interface Supplier {
  id: string;
  name: string;
  code?: string;
  contactEmail?: string;
  phone?: string;
  country: string;
  isVerified: boolean;
  isPublic: boolean;
  rating: number;
}

export interface ProductVehicleCompatibility {
  id?: string;
  modelId: string;
  manufacturerName: string;
  modelName: string;
  series?: string;
  engineCode?: string;
  yearFrom?: number;
  yearTo?: number;
  notes?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  oemNumber: string;
  alternativeOemNumbers: string[];
  categoryId: string;
  categoryName?: string;
  supplierId?: string;
  supplierName?: string;
  condition: PartCondition;
  refurbishmentStatus?: string;
  priceCents: number; // e.g. 145000 = 1450.00 EUR
  currency: string;
  vatRatePercent: number; // e.g. 21.00
  stockQuantity: number;
  isAvailable: boolean;
  weightKg?: number;
  dimensionsCm?: string;
  shortDescription?: string;
  description: string;
  technicalSpecifications: Record<string, string>;
  warrantyMonths: number;
  shippingClass: string;
  isFeatured: boolean;
  status: ProductStatus;
  images: ProductImage[];
  compatibility: ProductVehicleCompatibility[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id?: string;
  userId?: string;
  type: 'shipping' | 'billing' | 'both';
  companyName?: string;
  vatNumber?: string;
  fullName: string;
  phone: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  countryCode: string; // ISO 2, e.g. NL, DE, BE, FR
  isDefault?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  discountCents: number;
  totalCents: number;
  appliedCoupon?: Coupon;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed_cents';
  discountValue: number;
  minOrderCents: number;
  isActive: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  oemNumber?: string;
  condition: PartCondition;
  unitPriceCents: number;
  quantity: number;
  subtotalCents: number;
  taxCents: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: Address;
  billingAddress: Address;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  currency: string;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  discountCents: number;
  totalCents: number;
  couponCode?: string;
  customerNotes?: string;
  internalAdminNotes?: string;
  items: OrderItem[];
  shipments?: Shipment[];
  createdAt: string;
  updatedAt: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
  status: ShipmentStatus;
  shippedAt?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
}

export interface CustomerEnquiry {
  id: string;
  userId?: string;
  fullName: string;
  email: string;
  phone?: string;
  enquiryType: EnquiryType;
  productId?: string;
  productName?: string;
  truckMake?: string;
  truckModel?: string;
  truckYear?: number;
  vin?: string;
  partNameOrOem?: string;
  message: string;
  status: EnquiryStatus;
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  query?: string;
  oemNumber?: string;
  category?: string;
  brand?: string;
  model?: string;
  condition?: PartCondition;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'newest';
  page?: number;
  pageSize?: number;
}
