import React from 'react';
import { X, Printer, CheckCircle, Receipt, Building, Calendar, CreditCard } from 'lucide-react';

export default function ReceiptModal({ receipt, onClose }) {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Top bar */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-xs">Official Fee Payment Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-8 text-slate-800 bg-white border-4 border-slate-100 rounded-b-2xl m-2">
          {/* School Header */}
          <div className="text-center border-b-2 border-slate-200 pb-4 mb-5">
            <img
              src="/logo.jpg"
              alt="KRPS Logo"
              className="w-14 h-14 rounded-full object-contain bg-white border-2 border-slate-300 p-1 mx-auto mb-1 shadow-xs"
            />
            <h1 className="text-xl font-black text-blue-950 uppercase tracking-tight">
              {receipt.school_name || 'KRPS'}
            </h1>
            <p className="text-[11px] text-slate-500">
              {receipt.school_address || 'Whitefield, Bengaluru - 560066'} • Phone: {receipt.school_phone || '+91 80 4567 8900'}
            </p>
            <div className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold px-4 py-0.5 rounded-full text-[11px] uppercase tracking-wider mt-2">
              Official Electronic Fee Receipt
            </div>
          </div>

          {/* Receipt & Student Meta */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs mb-5">
            <div>
              <p className="text-slate-500">Receipt No:</p>
              <strong className="font-mono text-emerald-800 text-sm">{receipt.receipt_no}</strong>
            </div>
            <div>
              <p className="text-slate-500">Transaction Date:</p>
              <strong className="text-slate-800">
                {receipt.receipt_date ? new Date(receipt.receipt_date).toLocaleString() : new Date().toLocaleString()}
              </strong>
            </div>
            <div>
              <p className="text-slate-500">Student Name:</p>
              <strong className="text-slate-900 text-sm">{receipt.first_name} {receipt.last_name}</strong>
              <p className="text-slate-500 text-[10px]">Adm No: {receipt.admission_no} • Class: {receipt.class_name}-{receipt.section_name}</p>
            </div>
            <div>
              <p className="text-slate-500">Payment Mode / Gateway:</p>
              <strong className="text-slate-800 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                {receipt.payment_mode || 'UPI / Razorpay'}
              </strong>
              <p className="text-slate-400 text-[10px] font-mono">{receipt.transaction_ref || 'TXN_VERIFIED'}</p>
            </div>
          </div>

          {/* Fee Breakdown Table */}
          <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden mb-6">
            <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-2.5 text-left border-r border-slate-200">Particulars</th>
                <th className="p-2.5 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 text-slate-800 font-medium">{receipt.invoice_title || 'Academic Term Fee'}</td>
                <td className="p-3 text-right font-mono font-semibold text-slate-800">
                  ₹{parseFloat(receipt.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-emerald-50 border-t-2 border-emerald-300 font-bold text-xs">
              <tr>
                <td className="p-3 text-emerald-900 uppercase">Total Amount Received:</td>
                <td className="p-3 text-right font-mono text-emerald-900 text-base font-black">
                  ₹{parseFloat(receipt.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Verification Badge & Sign */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <strong className="block text-[11px] leading-tight">Payment Verified & Settled</strong>
                <span className="text-[10px] text-emerald-600">Computer-generated signed receipt</span>
              </div>
            </div>

            <div className="text-center">
              <div className="w-28 border-b border-slate-400 mb-1 mx-auto"></div>
              <span className="text-[11px] text-slate-500 font-medium">Accounts Department</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
