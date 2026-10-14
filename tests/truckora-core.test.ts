import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { normalizeOem, formatCentsToEur, calculateTaxCents, calculateShippingCents, generateOrderNumber } from '../src/lib/utils';
import { getProducts, getProductBySlug, getProductById, getCategories, getTruckManufacturers } from '../src/lib/services/products';
import { createOrder, getOrderById, updateOrderStatus } from '../src/lib/services/orders';
import { submitEnquiry, getEnquiries, updateEnquiryStatus } from '../src/lib/services/enquiries';

describe('TRUCKORA Platform Test Suite', () => {

  describe('1. OEM Number Normalization & Search Matching', () => {
    it('should normalize OEM numbers safely by removing whitespace, hyphens, and preserving letters/digits', () => {
      assert.equal(normalizeOem(' 185-3604 '), '1853604');
      assert.equal(normalizeOem('A 000 420 45 00'), 'A0004204500');
      assert.equal(normalizeOem('896523-DB'), '896523DB');
    });

    it('should find products by exact OEM number query', async () => {
      const res = await getProducts({ oemNumber: '1853604' });
      assert.ok(res.products.length > 0, 'Expected at least 1 product matching OEM 1853604');
      assert.equal(res.products[0].oemNumber, '1853604');
      assert.ok(res.products[0].name.includes('Turbocharger'));
    });

    it('should find products by alternative OEM number', async () => {
      // 1944459 is an alternative OEM for DAF Turbo 1853604
      const res = await getProducts({ oemNumber: '1944459' });
      assert.ok(res.products.length > 0, 'Expected alternative OEM match');
      assert.equal(res.products[0].id, 'd0000000-0000-0000-0000-000000000001');
    });
  });

  describe('2. Multi-Facet Catalogue Filtering & Pagination', () => {
    it('should filter catalogue by truck manufacturer brand', async () => {
      const volvoParts = await getProducts({ brand: 'volvo' });
      assert.ok(volvoParts.products.length > 0);
      for (const p of volvoParts.products) {
        const matchesVolvo = p.compatibility.some(c => c.manufacturerName.toLowerCase().includes('volvo'));
        assert.ok(matchesVolvo, `Product ${p.name} should be compatible with Volvo Trucks`);
      }
    });

    it('should filter catalogue by category slug', async () => {
      const brakes = await getProducts({ category: 'brakes' });
      assert.ok(brakes.products.length > 0);
      for (const p of brakes.products) {
        assert.equal(p.categoryId, 'c0000000-0000-0000-0000-000000000003');
      }
    });

    it('should filter catalogue by condition (new vs used vs refurbished)', async () => {
      const newParts = await getProducts({ condition: 'new' });
      assert.ok(newParts.products.every(p => p.condition === 'new'));

      const usedParts = await getProducts({ condition: 'used' });
      assert.ok(usedParts.products.every(p => p.condition === 'used'));

      const refurbParts = await getProducts({ condition: 'refurbished' });
      assert.ok(refurbParts.products.every(p => p.condition === 'refurbished'));
    });

    it('should handle pagination math correctly', async () => {
      const p1 = await getProducts({ pageSize: 4, page: 1 });
      assert.equal(p1.products.length, 4);
      assert.equal(p1.page, 1);
      assert.ok(p1.totalPages >= 3);

      const p2 = await getProducts({ pageSize: 4, page: 2 });
      assert.equal(p2.products.length, 4);
      assert.notEqual(p1.products[0].id, p2.products[0].id, 'Page 2 items must differ from Page 1');
    });
  });

  describe('3. Decimal-Safe Monetary Arithmetic & VAT Handling', () => {
    it('should format minor unit cents to EUR without floating point errors', () => {
      assert.equal(formatCentsToEur(145000), '€\u00A01.450,00');
      assert.equal(formatCentsToEur(42500), '€\u00A0425,00');
      assert.equal(formatCentsToEur(0), '€\u00A00,00');
    });

    it('should calculate 21% standard VAT accurately', () => {
      // 10000 cents (100.00 EUR) * 21% = 2100 cents (21.00 EUR)
      assert.equal(calculateTaxCents(10000, 21.0), 2100);
      // 145000 cents (1,450.00 EUR) * 21% = 30450 cents (304.50 EUR)
      assert.equal(calculateTaxCents(145000, 21.0), 30450);
    });

    it('should calculate heavy freight transport for pallet vs standard parcel', () => {
      const parcelItem = [{
        product: { id: 'p1', weightKg: 8.5, shippingClass: 'standard_freight' } as any,
        quantity: 1,
      }];
      const palletItem = [{
        product: { id: 'p2', weightKg: 68.0, shippingClass: 'heavy_pallet' } as any,
        quantity: 1,
      }];

      const parcelShippingNL = calculateShippingCents(parcelItem, 'NL');
      const palletShippingNL = calculateShippingCents(palletItem, 'NL');

      assert.equal(parcelShippingNL, 1500, 'NL parcel shipping should be 15.00 EUR');
      assert.equal(palletShippingNL, 6500, 'NL pallet shipping should be 65.00 EUR');
      assert.ok(palletShippingNL > parcelShippingNL);
    });
  });

  describe('4. Order Processing, Server Validation & Stock Safety', () => {
    it('should generate properly formatted order references', () => {
      const orderNum = generateOrderNumber();
      assert.match(orderNum, /^TRK-\d{4}-\d{4}$/);
    });

    it('should reject order if requested quantity exceeds available stock', async () => {
      const res = await createOrder({
        customerEmail: 'test@fleet.eu',
        shippingAddress: {
          fullName: 'Test Workshop',
          streetAddress: 'Main St 1',
          postalCode: '1000',
          city: 'Amsterdam',
          countryCode: 'NL',
          phone: '+31 20 000 0000',
          type: 'shipping',
        },
        billingAddress: {
          fullName: 'Test Workshop',
          streetAddress: 'Main St 1',
          postalCode: '1000',
          city: 'Amsterdam',
          countryCode: 'NL',
          phone: '+31 20 000 0000',
          type: 'billing',
        },
        items: [{
          productId: 'd0000000-0000-0000-0000-000000000004', // Scania Retarder, has 2 in stock
          quantity: 999, // Unreasonable quantity
        }],
      });

      assert.equal(res.success, false);
      assert.ok(res.error?.includes('Insufficient stock'));
    });

    it('should place order and snapshot product prices and inventory', async () => {
      const targetProd = await getProductById('d0000000-0000-0000-0000-000000000003');
      assert.ok(targetProd);
      const initialStock = targetProd.stockQuantity;

      const res = await createOrder({
        customerEmail: 'purchasing@trans-rhine.de',
        customerPhone: '+49 221 0000',
        shippingAddress: {
          fullName: 'Hans Becker',
          companyName: 'Trans-Rhine Spedition GmbH',
          vatNumber: 'DE812345678', // German VAT for reverse charge
          streetAddress: 'Industriestraße 88',
          postalCode: '50667',
          city: 'Köln',
          countryCode: 'DE',
          phone: '+49 221 0000',
          type: 'shipping',
        },
        billingAddress: {
          fullName: 'Hans Becker',
          streetAddress: 'Industriestraße 88',
          postalCode: '50667',
          city: 'Köln',
          countryCode: 'DE',
          phone: '+49 221 0000',
          type: 'billing',
        },
        items: [{
          productId: targetProd.id,
          quantity: 1,
        }],
      });

      assert.equal(res.success, true);
      assert.ok(res.order);
      assert.equal(res.order.taxCents, 0, 'Intra-EU reverse charge must zero-rate VAT');
      assert.equal(res.order.paymentStatus, 'paid');

      // Verify stock was decremented
      const updatedProd = await getProductById(targetProd.id);
      assert.equal(updatedProd?.stockQuantity, initialStock - 1);
    });

    it('should transition order statuses correctly', async () => {
      const order = await getOrderById('ord-seed-001');
      assert.ok(order);
      const updated = await updateOrderStatus(order.id, 'delivered', 'Handed over to fleet depot ramp');
      assert.equal(updated?.status, 'delivered');
      assert.equal(updated?.internalAdminNotes, 'Handed over to fleet depot ramp');
    });
  });

  describe('5. Customer VIN & Fitment Inquiries', () => {
    it('should reject invalid chassis VIN with incorrect character count', async () => {
      const res = await submitEnquiry({
        fullName: 'Test Mechanic',
        email: 'mechanic@fleet.eu',
        enquiryType: 'vin_request',
        vin: 'SHORT-VIN', // Not 17 chars
        message: 'Does this fit?',
      });
      assert.equal(res.success, false);
      assert.ok(res.error?.includes('17 characters'));
    });

    it('should accept valid 17-character European truck VIN and record enquiry', async () => {
      const validVin = 'XLRTE47MS0G987654';
      const res = await submitEnquiry({
        fullName: 'Test Mechanic',
        email: 'mechanic@fleet.eu',
        enquiryType: 'part_compatibility',
        truckMake: 'Volvo Trucks',
        truckModel: 'FH4 500',
        truckYear: 2019,
        vin: validVin,
        message: 'Need verification for compressor cylinder head gasket.',
      });

      assert.equal(res.success, true);
      assert.ok(res.enquiryId);

      const enquiries = await getEnquiries();
      const created = enquiries.find(e => e.id === res.enquiryId);
      assert.ok(created);
      assert.equal(created.vin, validVin);
      assert.equal(created.status, 'open');

      // Admin resolves enquiry
      const resolved = await updateEnquiryStatus(created.id, 'resolved', 'Direct fitment confirmed by Volvo EPC.');
      assert.equal(resolved?.status, 'resolved');
      assert.equal(resolved?.adminResponse, 'Direct fitment confirmed by Volvo EPC.');
    });
  });

});
