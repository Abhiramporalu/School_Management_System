import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  CalendarCheck,
  Award,
  DollarSign,
  Clock,
  Bus,
  MessageSquare,
  CheckCircle2,
  Printer,
  ChevronDown,
  Send,
  AlertCircle
} from 'lucide-react';

export default function ParentPortal({ onOpenIdCard, onOpenReportCard, onOpenReceipt }) {
  const { user, activeChild, switchActiveChild } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Active child data
  const currentChild = activeChild || (user?.children && user.children[0]) || { id: 1, first_name: 'Aarav', last_name: 'Sharma', admission_no: 'SX-2024-001' };

  const [childAttendance, setChildAttendance] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [transport, setTransport] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);

  // Leave form
  const [leaveStart, setLeaveStart] = useState('');
  const [leaveEnd, setLeaveEnd] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  // Payment modal state
  const [payingInvoice, setPayingInvoice] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadChildData();
  }, [currentChild.id]);

  async function loadChildData() {
    setLoading(true);
    try {
      const [att, inv, tt, trans, lvs] = await Promise.all([
        api.getStudentAttendance(currentChild.id),
        api.getInvoices({ studentId: currentChild.id }),
        api.getTimetable({ classId: currentChild.current_class_id || 5, sectionId: currentChild.current_section_id || 1 }),
        api.getStudentTransport(currentChild.id),
        api.getLeaveRequests()
      ]);

      setChildAttendance(att);
      setInvoices(inv || []);
      setTimetable(tt || []);
      setTransport(trans);
      setLeaveRequests(lvs || []);
    } catch (err) {
      console.error('Failed to load child data:', err);
    } finally {
      setLoading(false);
    }
  }

  // Handle Parent Leave Application for Child
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!leaveStart || !leaveEnd || !leaveReason) return;
    try {
      await api.applyLeave({
        studentId: currentChild.id,
        startDate: leaveStart,
        endDate: leaveEnd,
        reason: leaveReason
      });
      alert(`Leave application for ${currentChild.first_name} submitted successfully!`);
      setLeaveStart('');
      setLeaveEnd('');
      setLeaveReason('');
      loadChildData();
    } catch (err) {
      alert(err.message || 'Failed to submit leave');
    }
  };

  // Pay Fee Online
  const handlePayFee = async (e) => {
    e.preventDefault();
    if (!payingInvoice || !payAmount) return;
    setIsProcessing(true);
    try {
      const res = await api.payFee({
        invoiceId: payingInvoice.id,
        amount: parseFloat(payAmount),
        paymentMode: 'UPI / Razorpay',
        notes: `Paid by parent ${user?.firstName || 'Rajesh'} ${user?.lastName || 'Sharma'}`
      });
      alert(res.message);
      setPayingInvoice(null);
      loadChildData();
      const rcp = await api.getReceipt(res.receiptNo);
      onOpenReceipt(rcp);
    } catch (err) {
      alert(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const childrenList = user?.children || [
    { id: 1, first_name: 'Aarav', last_name: 'Sharma', admission_no: 'SX-2024-001', class_name: 'Grade 10', section_name: 'A' },
    { id: 2, first_name: 'Ananya', last_name: 'Sharma', admission_no: 'SX-2025-042', class_name: 'Grade 8', section_name: 'B' }
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-100 min-h-[calc(100vh-80px)] font-sans">
      {/* Sidebar with Multi-Child Switcher */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-4 border-r border-slate-800 shrink-0 flex flex-col justify-between">
        <div>
          {/* Guardian Info */}
          <div className="px-3 py-2 border-b border-slate-800 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Guardian Portal</span>
            <h2 className="text-sm font-extrabold text-white mt-0.5">
              {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Parent / Guardian' : 'Parent / Guardian'}
            </h2>
            <p className="text-[10px] text-slate-400">Linked to {childrenList.length} Students</p>
          </div>

          {/* SRS Section 6: Switch between linked children without logging out */}
          <div className="p-3 mb-4 rounded-2xl bg-purple-950/40 border border-purple-800/40">
            <label className="text-[10px] font-bold text-purple-300 uppercase block mb-1.5">
              Active Child Switcher:
            </label>
            <div className="space-y-1.5">
              {childrenList.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => switchActiveChild(ch)}
                  className={`w-full text-left p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    currentChild.id === ch.id
                      ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
                      : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={ch.profile_photo || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80'}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover border"
                    />
                    <div>
                      <span className="block leading-tight">{ch.first_name} {ch.last_name}</span>
                      <span className="text-[9px] font-mono text-purple-200">{ch.class_name || 'Class 10'}-{ch.section_name || 'A'}</span>
                    </div>
                  </div>
                  {currentChild.id === ch.id && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Child Performance', icon: Award },
              { id: 'attendance', label: 'Attendance & Leaves', icon: CalendarCheck },
              { id: 'fees', label: 'Fee Payments & Receipts', icon: DollarSign },
              { id: 'timetable', label: 'Daily Timetable', icon: Clock },
              { id: 'transport', label: 'Bus & Transport', icon: Bus }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white font-bold shadow-md'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 px-3 text-[10px] text-slate-500">
          KRPS Parent Advisory Council
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {/* Child Header banner */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <img
              src={currentChild.profile_photo || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'}
              alt=""
              className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500 shadow-sm"
            />
            <div>
              <span className="text-[10px] font-bold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Active Child Profile
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                {currentChild.first_name} {currentChild.last_name}
              </h2>
              <p className="text-xs text-slate-500">
                Admission #{currentChild.admission_no} • {currentChild.class_name || 'Grade 10'} - {currentChild.section_name || 'A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenIdCard(currentChild)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Digital ID Card</span>
            </button>
            <button
              onClick={async () => {
                const rc = await api.getReportCard(currentChild.id, 1);
                onOpenReportCard(rc);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Official Report Card</span>
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Attendance</span>
                <h3 className="text-2xl font-black text-emerald-700 mt-1">
                  {childAttendance?.stats?.percentage || '96.5'}%
                </h3>
                <span className="text-[10px] text-emerald-600 font-semibold">Consistently punctual</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Term 1 Performance</span>
                <h3 className="text-2xl font-black text-blue-900 mt-1">Grade A1 (93.3%)</h3>
                <span className="text-[10px] text-blue-600 font-bold">Class Rank #1</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Fee Status</span>
                <h3 className="text-2xl font-black text-purple-950 mt-1">Term 1 Settled</h3>
                <span className="text-[10px] text-slate-500">Term 2 due Dec 10</span>
              </div>
            </div>

            {/* Teacher Commendation Card */}
            <div className="p-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
              <span className="text-xs font-bold text-purple-800 uppercase tracking-wide">Class Teacher Note & Feedback</span>
              <p className="text-xs text-slate-700 italic mt-2 leading-relaxed">
                "{currentChild.first_name} has shown outstanding aptitude in Mathematics and Science. He actively helps peers in laboratory sessions and maintains exemplary discipline."
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE & LEAVES */}
        {activeTab === 'attendance' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Attendance Monitoring & Leave Applications</h2>

            {/* Leave form */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <h3 className="font-bold text-slate-800 mb-2">Apply Leave for {currentChild.first_name}</h3>
              <form onSubmit={handleApplyLeave} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    required
                    value={leaveStart}
                    onChange={(e) => setLeaveStart(e.target.value)}
                    className="p-2 border rounded-xl bg-white"
                  />
                  <input
                    type="date"
                    required
                    value={leaveEnd}
                    onChange={(e) => setLeaveEnd(e.target.value)}
                    className="p-2 border rounded-xl bg-white"
                  />
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Reason for absence..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full p-2 border rounded-xl bg-white"
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Leave Request</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: FEES & PAYMENTS */}
        {activeTab === 'fees' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">School Invoices & Online Payments</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Invoice #</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Paid</th>
                    <th className="p-3">Balance Due</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="p-3 font-mono font-bold text-blue-700">{inv.invoice_no}</td>
                      <td className="p-3 font-semibold text-slate-900">{inv.title}</td>
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
                        {parseFloat(inv.balance_amount) > 0 ? (
                          <button
                            onClick={() => {
                              setPayingInvoice(inv);
                              setPayAmount(inv.balance_amount);
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs"
                          >
                            Pay Online
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              const rcp = await api.getReceipt('RCP-2026-10492');
                              onOpenReceipt(rcp);
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold"
                          >
                            View Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: TIMETABLE */}
        {activeTab === 'timetable' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">{currentChild.first_name}'s Timetable Schedule</h2>
            <div className="space-y-2">
              {timetable.map((tt) => (
                <div key={tt.id} className="p-3 border rounded-xl bg-slate-50 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{tt.day_of_week} • Period {tt.period_number}: {tt.subject_name}</span>
                    <span className="text-[11px] text-slate-500 block">{tt.teacher_name} • {tt.room_number}</span>
                  </div>
                  <span className="font-mono text-slate-600 font-semibold">{tt.start_time.slice(0, 5)} - {tt.end_time.slice(0, 5)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: TRANSPORT */}
        {activeTab === 'transport' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Transport & Bus Assignment</h2>
            {transport ? (
              <div className="p-4 border rounded-xl bg-purple-50 space-y-2 text-xs">
                <strong className="text-sm font-bold text-purple-950">{transport.route_name}</strong>
                <p>Bus Number: <span className="font-mono font-bold">{transport.registration_no}</span></p>
                <p>Pickup Stop: <strong>{transport.stop_name}</strong> (Time: {transport.pickup_time})</p>
                <p>Driver: <strong>{transport.driver_name}</strong> ({transport.driver_phone})</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No transport subscription for this student.</p>
            )}
          </div>
        )}
      </main>

      {/* Pay Fee Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-base text-slate-900 mb-1">Fee Payment for {currentChild.first_name}</h3>
            <p className="text-slate-500 mb-4">{payingInvoice.title}</p>
            <form onSubmit={handlePayFee} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Amount to Pay (INR) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 font-black text-lg text-emerald-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : `Pay ₹${parseFloat(payAmount || 0).toLocaleString('en-IN')}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
