import React from 'react';
import { Document } from '../../types';
import { Printer, X } from 'lucide-react';
import logoPng from '../../assets/logo.png';

interface PrintDocumentViewProps {
  document: Document;
  onClose: () => void;
}

export const PrintDocumentView: React.FC<PrintDocumentViewProps> = ({ document: doc, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const printableItems = (doc.items || []).filter((i) => i.lineTotal > 0);
  const isInvoice = doc.documentType.toLowerCase().includes('invoice');

  return (
    <div className="print-overlay-container fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex justify-center p-4 sm:p-8">
      <div className="flex flex-col items-center max-w-[210mm] w-full my-auto space-y-3">
        {/* Floating Top Control Bar (Hidden when printing - completely separate from A4 document) */}
        <div className="no-print w-full flex items-center justify-between glass-modal p-3.5 rounded-2xl shadow-2xl">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Document Preview: <strong className="text-brand-600 dark:text-brand-400 font-mono">{doc.documentNumber}</strong> ({isInvoice ? 'Tax Invoice' : 'Debit Note'})
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-brand-500/25 transition-all border border-white/20"
            >
              <Printer className="w-4 h-4" /> Print Document
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-900/10 dark:border-white/10 backdrop-blur-sm"
            >
              <X className="w-4 h-4" /> Close
            </button>
          </div>
        </div>

        {/* PRINTABLE A4 DOCUMENT CONTAINER */}
        <div className="print-document-container bg-white text-slate-900 w-full min-h-[297mm] p-8 shadow-2xl rounded-sm flex flex-col space-y-4 font-sans text-xs">
          {/* Header Block */}
          <div className="flex items-center justify-between border-b-2 border-black pb-4">
            <div className="flex items-center gap-4">
              <img src={logoPng} alt="Chimba Logo" className="h-16 object-contain" />
              <div>
                <h1 className="text-xl font-black tracking-wider text-black">CHIMBA LOGISTICS LTD</h1>
                <p className="text-[11px] text-slate-700 font-medium">CUSTOMS CLEARING & FORWARDING AGENTS</p>
                <p className="text-[10px] text-slate-600">P.O. BOX 77652, DAR ES SALAAM, TANZANIA • TIN: 140-456-160</p>
              </div>
            </div>
            <div className="border-2 border-black p-2 text-center min-w-[120px]">
              <div className="text-[10px] font-bold uppercase">JOB NO.</div>
              <div className="text-sm font-black mt-0.5">{doc.jobNumber || '-'}</div>
            </div>
          </div>

          {/* Document Title Banner */}
          <div className="flex justify-between items-end py-1">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase">DOCUMENT TYPE</span>
              <h2 className="text-lg font-black text-black uppercase tracking-tight">
                {isInvoice ? 'TAX INVOICE' : 'DEBIT NOTE'}
              </h2>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-black">{doc.documentNumber}</div>
              <div className="text-[11px] text-slate-600 font-medium">Date: {doc.fileDate}</div>
            </div>
          </div>

          {/* Client & Shipping Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 border border-black p-3 rounded-none">
            {/* Left Col: Client */}
            <div className="space-y-1">
              <span className="font-bold text-[10px] uppercase text-slate-500 block">M/S (CLIENT DETAILS)</span>
              <div className="font-black text-sm">{doc.clientName}</div>
              <div className="text-slate-700">{doc.clientAddress || '-'}</div>
              <div className="text-slate-700">{doc.clientCity || '-'}</div>
              <div className="font-semibold pt-1">TIN: {doc.clientTin || '-'}</div>
            </div>

            {/* Right Col: Cargo File details */}
            <div className="space-y-1 text-slate-800">
              <span className="font-bold text-[10px] uppercase text-slate-500 block">CARGO / SHIPPING INFO</span>
              <div><span className="font-semibold">Supplier:</span> {doc.supplierName || '-'}</div>
              <div><span className="font-semibold">AWB / BL:</span> {doc.awbBl || '-'}</div>
              <div><span className="font-semibold">Reference:</span> {doc.reference || '-'}</div>
              <div><span className="font-semibold">Vessel:</span> {doc.vessel || '-'}</div>
              <div><span className="font-semibold">Place of Loading:</span> {doc.placeOfLoading || '-'}</div>
            </div>
          </div>

          {doc.description && (
            <div className="border border-black p-2 bg-slate-50 text-[11px]">
              <span className="font-bold uppercase text-[10px] text-slate-500 block">DESCRIPTION OF GOODS</span>
              <p className="font-medium text-slate-800">{doc.description}</p>
            </div>
          )}

          {/* Itemized Table */}
          <div className="border border-black">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-black text-white font-bold border-b border-black">
                  <th className="p-2 w-12 text-center">#</th>
                  <th className="p-2">PARTICULARS / ITEM DESCRIPTION</th>
                  <th className="p-2 w-16 text-center">QTY</th>
                  <th className="p-2 w-28 text-right">UNIT PRICE (TSH)</th>
                  <th className="p-2 w-32 text-right">AMOUNT (TSH)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {printableItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2 text-center font-medium">{idx + 1}</td>
                    <td className="p-2 font-semibold text-slate-900">{item.itemName}</td>
                    <td className="p-2 text-center">{item.qty}</td>
                    <td className="p-2 text-right font-mono">
                      {item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-2 text-right font-mono font-bold">
                      {item.lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}

                {printableItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-400 italic">No printable items</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Block */}
          <div className="flex justify-end pt-1">
            <div className="w-64 border border-black p-2 space-y-1 bg-slate-50">
              <div className="flex justify-between font-bold text-sm">
                <span>TOTAL TSH:</span>
                <span>{doc.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Payment Terms & Bank Details - Positioned directly below table total */}
          <div className="pt-3 border-t-2 border-black space-y-1">
            <p className="font-bold text-[10px] uppercase text-black">PAYMENT TERMS & BANK DETAILS</p>
            <p className="text-[11px] font-bold text-black">Bank: AMANA BANK LTD - MBAGALA BRANCH</p>
            <p className="text-[11px] font-mono font-bold text-slate-900">Account: 007121821720001 | SWIFT: AMNNTZTZ</p>
            <p className="text-[11px] font-semibold text-slate-800">Make all cheques payable to: CHIMBA LOGISTICS LTD</p>
          </div>

          {/* Prepared By & Approved By Signatures */}
          <div className="pt-6 border-t border-slate-400 grid grid-cols-2 gap-8 text-xs">
            {/* Left: Prepared By Signature */}
            <div>
              <p className="font-bold text-[10px] uppercase text-slate-700">PREPARED BY / ISSUED BY</p>
              <div className="h-10"></div>
              <p className="border-t border-black inline-block px-8 pt-1 text-[11px] font-bold">PREPARED BY SIGNATURE</p>
            </div>

            {/* Right: Approved By Signature */}
            <div className="text-right">
              <p className="font-bold text-[10px] uppercase text-slate-700">APPROVED BY (FOR CHIMBA LOGISTICS LTD)</p>
              <div className="h-10"></div>
              <p className="border-t border-black inline-block px-8 pt-1 text-[11px] font-bold">APPROVED BY SIGNATURE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
