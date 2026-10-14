import { Order, OrderItem, OrderStatus, Shipment, Address, Coupon } from '@/types';
import { generateOrderNumber } from '@/lib/utils';
import { getProductById, updateProduct } from '@/lib/services/products';

// In-memory persistent order registry for development / fallback
const localOrders: Order[] = [
  {
    id: 'ord-seed-001',
    orderNumber: 'TRK-2026-1042',
    customerEmail: 'workshop@scandic-fleet.se',
    customerPhone: '+46 31 555 7800',
    shippingAddress: {
      fullName: 'Magnus Lindqvist',
      companyName: 'Scandic Fleet Logistics AB',
      vatNumber: 'SE556123456701',
      streetAddress: 'Transportgatan 14',
      postalCode: '417 55',
      city: 'Gothenburg',
      countryCode: 'SE',
      phone: '+46 31 555 7800',
      type: 'shipping',
    },
    billingAddress: {
      fullName: 'Magnus Lindqvist',
      companyName: 'Scandic Fleet Logistics AB',
      vatNumber: 'SE556123456701',
      streetAddress: 'Transportgatan 14',
      postalCode: '417 55',
      city: 'Gothenburg',
      countryCode: 'SE',
      phone: '+46 31 555 7800',
      type: 'billing',
    },
    status: 'shipped',
    paymentStatus: 'paid',
    currency: 'EUR',
    subtotalCents: 235000,
    shippingCents: 15000,
    taxCents: 0, // Reverse charge EU intra-community B2B
    discountCents: 0,
    totalCents: 250000,
    customerNotes: 'Deliver to rear loading bay ramp 3',
    internalAdminNotes: 'Verified EU VAT number via VIES portal. Pallet dispatch via DHL Freight.',
    items: [
      {
        id: 'item-1',
        productId: 'd0000000-0000-0000-0000-000000000004',
        productName: 'Scania R4100 Freewheeling Retarder Assembly',
        sku: 'TRK-GBX-1934322',
        oemNumber: '1934322',
        condition: 'used',
        unitPriceCents: 235000,
        quantity: 1,
        subtotalCents: 235000,
        taxCents: 0,
        imageUrl: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    shipments: [
      {
        id: 'ship-1',
        orderId: 'ord-seed-001',
        carrier: 'DHL Freight Euroconnect',
        trackingNumber: 'DHL-EU-892304910',
        trackingUrl: 'https://www.dhl.com/track?tracking-id=DHL-EU-892304910',
        status: 'in_transit',
        shippedAt: '2026-03-10T14:00:00Z',
        estimatedDelivery: '2026-03-15T12:00:00Z',
        notes: 'Secured on standard Euro-pallet with strapping',
        createdAt: '2026-03-10T14:00:00Z',
      },
    ],
    createdAt: '2026-03-09T08:30:00Z',
    updatedAt: '2026-03-10T14:00:00Z',
  },
  {
    id: 'ord-seed-002',
    orderNumber: 'TRK-2026-1043',
    customerEmail: 'parts@trans-rhine.de',
    customerPhone: '+49 221 9898 120',
    shippingAddress: {
      fullName: 'Hans Becker',
      companyName: 'Trans-Rhine Spedition GmbH',
      vatNumber: 'DE812345678',
      streetAddress: 'Industriestraße 88',
      postalCode: '50667',
      city: 'Köln',
      countryCode: 'DE',
      phone: '+49 221 9898 120',
      type: 'shipping',
    },
    billingAddress: {
      fullName: 'Hans Becker',
      companyName: 'Trans-Rhine Spedition GmbH',
      vatNumber: 'DE812345678',
      streetAddress: 'Industriestraße 88',
      postalCode: '50667',
      city: 'Köln',
      countryCode: 'DE',
      phone: '+49 221 9898 120',
      type: 'billing',
    },
    status: 'paid',
    paymentStatus: 'paid',
    currency: 'EUR',
    subtotalCents: 145000,
    shippingCents: 1950,
    taxCents: 0,
    discountCents: 0,
    totalCents: 146950,
    items: [
      {
        id: 'item-2',
        productId: 'd0000000-0000-0000-0000-000000000001',
        productName: 'Holset HE400VG Variable Geometry Turbocharger',
        sku: 'TRK-ENG-1853604',
        oemNumber: '1853604',
        condition: 'refurbished',
        unitPriceCents: 145000,
        quantity: 1,
        subtotalCents: 145000,
        taxCents: 0,
        imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    createdAt: '2026-03-12T11:20:00Z',
    updatedAt: '2026-03-12T11:20:00Z',
  },
];

export async function getOrders(statusFilter?: OrderStatus): Promise<Order[]> {
  if (statusFilter) {
    return localOrders.filter((o) => o.status === statusFilter);
  }
  return [...localOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrderById(id: string): Promise<Order | null> {
  const order = localOrders.find((o) => o.id === id || o.orderNumber === id);
  return order || null;
}

export interface CreateOrderInput {
  userId?: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: Address;
  billingAddress: Address;
  items: {
    productId: string;
    quantity: number;
  }[];
  couponCode?: string;
  customerNotes?: string;
  paymentMethod?: string;
}

export async function createOrder(input: CreateOrderInput): Promise<{
  success: boolean;
  order?: Order;
  error?: string;
}> {
  if (!input.items || input.items.length === 0) {
    return { success: false, error: 'Order must contain at least one item.' };
  }

  // Server-side inventory revalidation & price lookup
  const orderItems: OrderItem[] = [];
  let subtotalCents = 0;

  for (const itemInput of input.items) {
    const product = await getProductById(itemInput.productId);
    if (!product) {
      return { success: false, error: `Product not found: ${itemInput.productId}` };
    }

    if (product.stockQuantity < itemInput.quantity) {
      return {
        success: false,
        error: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, requested: ${itemInput.quantity}`,
      };
    }

    const itemSubtotal = product.priceCents * itemInput.quantity;
    subtotalCents += itemSubtotal;

    orderItems.push({
      id: `ord-item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      oemNumber: product.oemNumber,
      condition: product.condition,
      unitPriceCents: product.priceCents,
      quantity: itemInput.quantity,
      subtotalCents: itemSubtotal,
      taxCents: Math.round((itemSubtotal * product.vatRatePercent) / 100),
      imageUrl: product.images[0]?.url,
    });
  }

  // Shipping calculation
  const isPallet = orderItems.some((i) => i.unitPriceCents > 100000);
  const shippingCents = isPallet ? 8500 : 1950; // €85.00 freight or €19.50 parcel

  // Coupon application
  let discountCents = 0;
  if (input.couponCode) {
    const code = input.couponCode.toUpperCase().trim();
    if (code === 'TRUCKORA10' && subtotalCents >= 50000) {
      discountCents = Math.round(subtotalCents * 0.1);
    } else if (code === 'FLEET50' && subtotalCents >= 100000) {
      discountCents = 5000;
    }
  }

  // Tax calculation
  // Check if valid EU company with VAT number (reverse charge intra-EU)
  const isReverseCharge = Boolean(
    input.shippingAddress.vatNumber &&
      input.shippingAddress.countryCode !== 'NL'
  );

  const taxCents = isReverseCharge ? 0 : Math.round((subtotalCents * 21.0) / 100);
  const totalCents = subtotalCents + shippingCents + taxCents - discountCents;

  // Deduct inventory
  for (const itemInput of input.items) {
    const product = await getProductById(itemInput.productId);
    if (product) {
      await updateProduct(product.id, {
        stockQuantity: Math.max(0, product.stockQuantity - itemInput.quantity),
      });
    }
  }

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: generateOrderNumber(),
    userId: input.userId,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    shippingAddress: input.shippingAddress,
    billingAddress: input.billingAddress,
    status: 'paid', // Test mode auto-clears to paid
    paymentStatus: 'paid',
    currency: 'EUR',
    subtotalCents,
    shippingCents,
    taxCents,
    discountCents,
    totalCents,
    couponCode: input.couponCode,
    customerNotes: input.customerNotes,
    items: orderItems,
    shipments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  localOrders.unshift(newOrder);
  return { success: true, order: newOrder };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, adminNotes?: string): Promise<Order | null> {
  const order = localOrders.find((o) => o.id === orderId);
  if (!order) return null;

  order.status = status;
  if (adminNotes) {
    order.internalAdminNotes = adminNotes;
  }
  order.updatedAt = new Date().toISOString();
  return order;
}

export async function addShipmentToOrder(
  orderId: string,
  shipmentData: { carrier: string; trackingNumber: string; trackingUrl?: string; notes?: string }
): Promise<Shipment | null> {
  const order = localOrders.find((o) => o.id === orderId);
  if (!order) return null;

  const newShipment: Shipment = {
    id: `ship-${Date.now()}`,
    orderId,
    carrier: shipmentData.carrier,
    trackingNumber: shipmentData.trackingNumber,
    trackingUrl: shipmentData.trackingUrl,
    status: 'dispatched',
    shippedAt: new Date().toISOString(),
    notes: shipmentData.notes,
    createdAt: new Date().toISOString(),
  };

  if (!order.shipments) {
    order.shipments = [];
  }
  order.shipments.push(newShipment);
  order.status = 'shipped';
  order.updatedAt = new Date().toISOString();

  return newShipment;
}

export async function getOrderMetrics() {
  const totalOrders = localOrders.length;
  const totalSalesCents = localOrders.reduce((sum, o) => sum + o.totalCents, 0);
  const pendingOrders = localOrders.filter(
    (o) => o.status === 'pending_payment' || o.status === 'processing' || o.status === 'paid'
  ).length;
  const readyForDispatch = localOrders.filter((o) => o.status === 'ready_for_dispatch').length;

  return {
    totalOrders,
    totalSalesCents,
    pendingOrders,
    readyForDispatch,
  };
}
