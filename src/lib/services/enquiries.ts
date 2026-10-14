import { CustomerEnquiry, EnquiryType, EnquiryStatus } from '@/types';

const localEnquiries: CustomerEnquiry[] = [
  {
    id: 'enq-001',
    fullName: 'Klaus Schmidt',
    email: 'klaus.schmidt@spedition-nord.de',
    phone: '+49 40 1234 5678',
    enquiryType: 'part_compatibility',
    productName: 'ZF TraXon 12TX2210 TD 12-Speed Automated Gearbox',
    truckMake: 'DAF',
    truckModel: 'XF 106 Euro 6 (2018)',
    truckYear: 2018,
    vin: 'XLRTE47MS0G123456',
    partNameOrOem: 'ZF 12TX2210 / 1985400',
    message: 'Can you confirm if this TraXon gearbox includes the clutch actuator wiring loom for a 2018 DAF XF 480?',
    status: 'open',
    createdAt: '2026-03-12T14:30:00Z',
    updatedAt: '2026-03-12T14:30:00Z',
  },
];

export async function submitEnquiry(input: {
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
}): Promise<{ success: boolean; enquiryId?: string; error?: string }> {
  if (!input.fullName || !input.email || !input.message) {
    return { success: false, error: 'Full name, email address, and message are required.' };
  }

  // Validate VIN length if provided (standard European VIN is 17 chars)
  if (input.vin && input.vin.trim().length > 0) {
    const cleanVin = input.vin.trim().toUpperCase();
    if (cleanVin.length !== 17) {
      return { success: false, error: 'Standard European commercial truck VIN must be 17 characters.' };
    }
  }

  const newEnquiry: CustomerEnquiry = {
    id: `enq-${Date.now()}`,
    fullName: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim(),
    enquiryType: input.enquiryType,
    productId: input.productId,
    productName: input.productName,
    truckMake: input.truckMake,
    truckModel: input.truckModel,
    truckYear: input.truckYear,
    vin: input.vin ? input.vin.trim().toUpperCase() : undefined,
    partNameOrOem: input.partNameOrOem,
    message: input.message.trim(),
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  localEnquiries.unshift(newEnquiry);
  return { success: true, enquiryId: newEnquiry.id };
}

export async function getEnquiries(statusFilter?: EnquiryStatus): Promise<CustomerEnquiry[]> {
  if (statusFilter) {
    return localEnquiries.filter((e) => e.status === statusFilter);
  }
  return [...localEnquiries];
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus,
  adminResponse?: string
): Promise<CustomerEnquiry | null> {
  const enquiry = localEnquiries.find((e) => e.id === id);
  if (!enquiry) return null;

  enquiry.status = status;
  if (adminResponse) {
    enquiry.adminResponse = adminResponse;
  }
  enquiry.updatedAt = new Date().toISOString();
  return enquiry;
}
