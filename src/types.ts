export interface Patient {
  id: string;
  name: string;
  phone: string;
  age: number;
  gender: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  code: string;
  name: string;
  type: string; // Consultant, Referral, Lab Doctor
  specialization: string;
  bmdcNumber?: string;
  contact: string;
  status: string; // Active, Inactive
  commissionCategory: string; // Per Test, Per Patient, Per Package
  commissionValue: number;
  createdAt: string;
}

export interface Test {
  id: string;
  code: string;
  name: string;
  category: string;
  specimenType: string;
  price: number;
  turnaroundTime: string;
  normalRange: string;
  status: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  testId: string;
  price: number;
  test?: Test;
}

export interface BillingInvoice {
  id: string;
  invoiceNo: string;
  patientId: string;
  patient?: Patient;
  referredByDoctorId?: string;
  referredBy?: Doctor;
  discountType: string; // None, Percentage, Fixed
  discountValue: number;
  discountAmount: number;
  vatPercent: number;
  vatAmount: number;
  serviceCharge: number;
  totalDue: number;
  totalPaid: number;
  totalAmount: number;
  netAmount: number;
  paymentStatus: string; // Paid, Unpaid, Partially Paid
  paymentMethod: string; // Cash, Card, Mobile, Mixed
  referralPaid: boolean;
  referralCommPaid: number;
  reportStatus: string; // Pending, Processing, Ready, Delivered
  deliveredBy?: string;
  deliveredAt?: string;
  refundStatus: string; // None, Pending, Approved
  createdAt: string;
  items?: InvoiceItem[];
}

export interface Appointment {
  id: string;
  appNo: string;
  patientId: string;
  patient?: Patient;
  doctorId: string;
  doctor?: Doctor;
  date: string;
  preferredTime: string;
  status: string; // Pending, Checked-In, Completed, Cancelled
  priority: string; // Normal, Urgent
  type: string; // Online, Offline
  notes?: string;
  createdAt: string;
}

export interface Reagent {
  id: string;
  name: string;
  supplier: string;
  brandModel: string;
  machineName?: string;
  purchasePrice: number;
  stockQty: number;
  lowStockAlert: number;
  expiryDate: string;
  lotNumber?: string;
  wastagePercent: number;
  createdAt: string;
}

export interface ReagentMapping {
  id: string;
  testId: string;
  reagentId: string;
  qtyNeeded: number;
  test?: Test;
  reagent?: Reagent;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  voucherNo?: string;
  recordedBy: string;
  status: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  salary: number;
  shiftType: string;
  status: string;
  createdAt: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employee?: Employee;
  checkIn: string;
  checkOut?: string;
  status: string; // Present, Absent, Late
  date: string;
  createdAt: string;
}

export interface SalaryPayment {
  id: string;
  employeeId: string;
  employee?: Employee;
  month: string;
  baseSalary: number;
  bonus: number;
  deduction: number;
  advSettle: number;
  netPaid: number;
  type: string; // Routine, Advance
  createdAt: string;
}

export interface RefundRequest {
  id: string;
  invoiceId: string;
  amount: number;
  reason: string;
  status: string;
  refundMode: string;
  invoice?: BillingInvoice;
  createdAt: string;
}

export interface SystemSetting {
  id: string;
  labName: string;
  address: string;
  hotline: string;
  email: string;
  website: string;
  openingHours: string;
  logoUrl?: string;
  signatureDoc?: string;
  signatureLab?: string;
  termsNote: string;
  footerNote: string;
  barcodeEnabled: boolean;
  vatPercent: number;
  serviceChargeLimit: number;
  maxDiscountLimit: number;
  prefixInvoice: string;
}
