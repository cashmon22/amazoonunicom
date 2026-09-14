export type PaymentRequestStatus = "Pending Review" | "Approved" | "Rejected" | "Completed";

export type PaymentRequest = {
  id: string;
  userId: string;
  fullLegalName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  deviceId: string;
  deviceName: string;
  deviceModel: string;
  deviceAmount: number | null;
  currency: string;
  vendor: string;
  status: PaymentRequestStatus;
  createdAt: string;
};

export type CreatePaymentRequestInput = {
  deviceId: string;
  fullLegalName: string;
  phone: string;
  deliveryAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  additionalNotes?: string;
  confirmation: boolean;
};
