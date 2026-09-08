import axios from 'axios';
import { Client, CargoFile, Document, DashboardStats, SummaryData } from '../types';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await api.get<DashboardStats>('/dashboard/stats');
  return res.data;
};

export const getClients = async (search?: string): Promise<Client[]> => {
  const res = await api.get<Client[]>('/clients', { params: { search } });
  return res.data;
};

export const createClient = async (data: Partial<Client>): Promise<Client> => {
  const res = await api.post<Client>('/clients', data);
  return res.data;
};

export const getFiles = async (filters?: {
  dateFrom?: string;
  dateTo?: string;
  fileFrom?: string;
  fileTo?: string;
  customerName?: string;
}): Promise<CargoFile[]> => {
  const res = await api.get<CargoFile[]>('/files', { params: filters });
  return res.data;
};

export const createFile = async (data: Partial<CargoFile>): Promise<CargoFile> => {
  const res = await api.post<CargoFile>('/files', data);
  return res.data;
};

export const getDocuments = async (filters?: {
  dateFrom?: string;
  dateTo?: string;
  documentType?: string;
  clientName?: string;
  sort?: string;
}): Promise<Document[]> => {
  const res = await api.get<Document[]>('/documents', { params: filters });
  return res.data;
};

export const getDocumentById = async (id: number): Promise<Document> => {
  const res = await api.get<Document>(`/documents/${id}`);
  return res.data;
};

export const createDocument = async (data: {
  documentType: string;
  fileId: number;
  fileCode: string;
  clientId: number;
  fileDate?: string;
  transportType?: string;
  items: { itemName: string; qty: number; unitPrice: number }[];
}): Promise<Document> => {
  const res = await api.post<Document>('/documents', data);
  return res.data;
};

export const getPayments = async (): Promise<{ totalLeftToCollect: number; documents: Document[] }> => {
  const res = await api.get('/payments');
  return res.data;
};

export const markPayment = async (documentId: number, paidAmount: number): Promise<Document> => {
  const res = await api.post<Document>('/payments/mark-paid', { documentId, paidAmount });
  return res.data;
};

export const getSummary = async (filters?: {
  from?: string;
  to?: string;
  clientId?: number;
  type?: string;
  fileNo?: string;
}): Promise<SummaryData> => {
  const res = await api.get<SummaryData>('/summary', { params: filters });
  return res.data;
};

export default api;
