import React from 'react';
import { Document } from '../../types';
import { Printer, Download, X } from 'lucide-react';
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
      {/* Printable Wrapper */}
      <div className="print-document-container bg-white text-slate-900 w-full max-w-[210mm] min-h-[297mm] p-8 shadow-2xl rounded-sm flex flex-col justify-between my-auto relative">
        {/* Floating Action Controls (Hidden when printing) */}
        <div className="no-print absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg transition-all"
          >
            <Printer className="w-4 h-4" /> Print Document
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PRINT CONTENT START */}
        <div className="space-y-4 font-sans text-xs">
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
          <div className="flex justify-end pt-2">
            <div className="w-64 border border-black p-3 space-y-1 bg-slate-50">
              <div className="flex justify-between font-bold text-sm border-t border-black pt-1">
                <span>TOTAL TSH:</span>
                <span>{doc.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer & Signature Block */}
        <div className="pt-8 border-t-2 border-black mt-auto text-xs space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="font-bold text-[10px] uppercase text-slate-500">PAYMENT TERMS & BANK DETAILS</p>
              <p className="text-[11px] text-slate-700 mt-1">Payment is due upon receipt of invoice/debit note.</p>
              <p className="text-[11px] font-semibold text-slate-900">Make all cheques payable to: CHIMBA LOGISTICS LTD</p>
            </div>
            <div className="text-right space-y-8">
              <div>
                <p className="font-bold text-[10px] uppercase text-slate-500">FOR CHIMBA LOGISTICS LTD</p>
                <div className="h-10"></div>
                <p className="border-t border-slate-400 inline-block px-8 pt-1 text-[11px] font-bold">AUTHORIZED SIGNATURE</p>
              </div>
            </div>
          </div>
        </div>
        {/* PRINT CONTENT END */}
      </div>
    </div>
  );
};
