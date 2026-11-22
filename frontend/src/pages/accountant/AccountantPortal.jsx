import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Calculator, DollarSign, Receipt, Plus, Printer, CheckCircle2, Download } from 'lucide-react';

export default function AccountantPortal({ onOpenReceipt }) {
  const [summary, setSummary] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [newInv, setNewInv] = useState({
    studentId: '1',
    title: 'Term 2 Academic & Lab Fee',
    totalAmount: '45000',
    concessionAmount: '0',
    dueDate: '2026-12-10'
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [sum, invs] = await Promise.all([api.getFeeSummary(), api.getInvoices()]);
      setSummary(sum);
      setInvoices(invs || []);
    } catch (err) {
      console.error(err);
    }
  }

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      await api.createInvoice(newInv);
      alert('Invoice created successfully!');
      setShowInvoiceModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to create invoice');
    }
  };

  return (
    <div className="flex-1 p-6 bg-slate-100 min-h-[calc(100vh-80px)] font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
              Finance & Accounts
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">Fee Management & Financial Summary</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => api.exportReport('fees')}
              className="bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Student Invoice</span>
            </button>
          </div>
        </div>

        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Total Billed</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                ₹{parseFloat(summary.metrics.total_billed).toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-sm">
              <span className="text-[11px] font-bold text-emerald-700 uppercase">Collections Received</span>
              <h3 className="text-2xl font-black text-emerald-900 mt-1">
                ₹{parseFloat(summary.metrics.total_collected).toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-sm">
              <span className="text-[11px] font-bold text-amber-700 uppercase">Outstanding Dues</span>
              <h3 className="text-2xl font-black text-amber-900 mt-1">
                ₹{parseFloat(summary.metrics.total_pending).toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 shadow-sm">
              <span className="text-[11px] font-bold text-purple-700 uppercase">Concessions / Waivers</span>
              <h3 className="text-2xl font-black text-purple-900 mt-1">
                ₹{parseFloat(summary.metrics.total_concessions).toLocaleString('en-IN')}
              </h3>
            </div>
          </div>
        )}

        {/* Invoices list */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">All Student Invoices & Payment Status</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Student</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Paid</th>
                  <th className="p-3">Balance</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="p-3 font-mono font-bold text-blue-700">{inv.invoice_no}</td>
                    <td className="p-3 font-bold text-slate-900">{inv.first_name} {inv.last_name}</td>
                    <td className="p-3 text-slate-600">{inv.class_name}-{inv.section_name}</td>
                    <td className="p-3 font-mono">₹{parseFloat(inv.total_amount).toLocaleString('en-IN')}</td>
                    <td className="p-3 font-mono text-emerald-700 font-bold">₹{parseFloat(inv.paid_amount).toLocaleString('en-IN')}</td>
                    <td className="p-3 font-mono text-red-600 font-bold">₹{parseFloat(inv.balance_amount).toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {parseFloat(inv.paid_amount) > 0 && (
                        <button
                          onClick={async () => {
                            const rcp = await api.getReceipt('RCP-2026-10492');
                            onOpenReceipt(rcp);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[10px] font-bold inline-flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Receipt</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: New Invoice */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-base text-slate-900 mb-3">Generate Student Fee Invoice</h3>
            <form onSubmit={handleCreateInvoice} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Student ID *</label>
                <input
                  type="number"
                  required
                  value={newInv.studentId}
                  onChange={(e) => setNewInv({ ...newInv, studentId: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-slate-50"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Fee Description *</label>
                <input
                  type="text"
                  required
                  value={newInv.title}
                  onChange={(e) => setNewInv({ ...newInv, title: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-slate-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Total Fee (INR) *</label>
                  <input
                    type="number"
                    required
                    value={newInv.totalAmount}
                    onChange={(e) => setNewInv({ ...newInv, totalAmount: e.target.value })}
                    className="w-full p-2 border rounded-xl bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Concession (INR)</label>
                  <input
                    type="number"
                    value={newInv.concessionAmount}
                    onChange={(e) => setNewInv({ ...newInv, concessionAmount: e.target.value })}
                    className="w-full p-2 border rounded-xl bg-slate-50"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Due Date *</label>
                <input
                  type="date"
                  required
                  value={newInv.dueDate}
                  onChange={(e) => setNewInv({ ...newInv, dueDate: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-slate-50"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
