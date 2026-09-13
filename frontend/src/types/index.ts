export interface Client {
  id: number;
  clientId: string;
  name: string;
  address?: string;
  city?: string;
  email?: string;
  tin?: string;
  createdAt?: string;
  fileCount?: number;
}

export interface CargoFile {
  id: number;
  fileId: string;
  jobNumber: string;
  clientId: number;
  clientName: string;
  supplierName?: string;
  awbBl?: string;
  reference?: string;
  description?: string;
  vessel?: string;
  placeOfLoading?: string;
  fileDate: string;
  createdAt?: string;
}

export interface DocumentItem {
  id?: number;
  itemName: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface PaymentRecord {
  id: number;
  fileId: number;
  fileCode?: string;
  documentId: number;
  documentNumber: string;
  documentType: string;
  clientName?: string;
  amount: number;
  method?: string;
  paymentReference?: string;
  paymentDate: string;
  createdAt?: string;
}

export interface Document {
  id: number;
  documentNumber: string;
  fileId: number;
  fileCode: string;
  fileDate: string;
  clientId: number;
  clientName: string;
  clientAddress?: string;
  clientCity?: string;
  clientEmail?: string;
  clientTin?: string;
  supplierName?: string;
  documentType: 'invoice' | 'debit_note' | 'Invoice' | 'Debit_Note';
  transportType?: string;
  subtotal: number;
  vat: number;
  total: number;
  paidAmount: number;
  balance: number;
  status: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';
  paymentsCount?: number;
  paymentHistory?: PaymentRecord[];
  createdAt?: string;
  jobNumber?: string;
  awbBl?: string;
  reference?: string;
  description?: string;
  vessel?: string;
  placeOfLoading?: string;
  items?: DocumentItem[];
}

export interface DashboardStats {
  totalClients: number;
  totalFiles: number;
  totalInvoices: number;
  totalDebitNotes: number;
  totalUnpaidBalance: number;
  monthlyTrends: {
    month: string;
    invoices: number;
    debitNotes: number;
  }[];
  transportTypeBreakdown: Record<string, number>;
  recentActivities: {
    title: string;
    subtitle: string;
    type: 'client' | 'file' | 'document' | 'payment';
    timestamp: string;
  }[];
}

export interface ItemSummaryDetail {
  documentNumber: string;
  fileId: string;
  documentType: string;
  amount: number;
}

export interface ItemSummary {
  itemName: string;
  itemId: string;
  invoiceTotal: number;
  debitTotal: number;
  details: ItemSummaryDetail[];
}

export interface SummaryData {
  kpi: {
    invoiceCount: number;
    invoiceTotal: number;
    debitCount: number;
    debitTotal: number;
  };
  items: ItemSummary[];
}
