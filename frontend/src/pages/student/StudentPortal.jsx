import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  FileCheck,
  DollarSign,
  Clock,
  Bus,
  Library,
  Award,
  Shield,
  Printer,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  Timer,
  ChevronRight
} from 'lucide-react';

export default function StudentPortal({ onOpenIdCard, onOpenReportCard, onOpenReceipt }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Student profile data
  const studentId = user?.student?.id || 1;
  const [profile, setProfile] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [transport, setTransport] = useState(null);
  const [libraryIssues, setLibraryIssues] = useState([]);
  const [exams, setExams] = useState([]);

  // Leave form
  const [leaveStart, setLeaveStart] = useState('');
  const [leaveEnd, setLeaveEnd] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  // Active quiz state
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [quizTimer, setQuizTimer] = useState(600); // 10 mins

  // Online Fee Payment Modal
  const [payingInvoice, setPayingInvoice] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMode, setPayMode] = useState('UPI / Razorpay');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    loadAllStudentData();
  }, [studentId]);

  // Quiz countdown timer
  useEffect(() => {
    let interval = null;
    if (activeQuiz && !quizResult && quizTimer > 0) {
      interval = setInterval(() => {
        setQuizTimer((t) => t - 1);
      }, 1000);
    } else if (quizTimer === 0 && activeQuiz && !quizResult) {
      handleQuizSubmit();
    }
    return () => clearInterval(interval);
  }, [activeQuiz, quizResult, quizTimer]);

  async function loadAllStudentData() {
    setLoading(true);
    try {
      const [prof, att, tt, asgn, qz, inv, trans, lib, exm] = await Promise.all([
        api.getStudentById(studentId),
        api.getStudentAttendance(studentId),
        api.getTimetable({ classId: '5', sectionId: '1' }),
        api.getAssignments({ classId: '5', sectionId: '1' }),
        api.getQuizzes({ classId: '5' }),
        api.getInvoices({ studentId }),
        api.getStudentTransport(studentId),
        api.getIssuedBooks({ studentId }),
        api.getExams()
      ]);

      setProfile(prof);
      setAttendanceData(att);
      setTimetable(tt || []);
      setAssignments(asgn || []);
      setQuizzes(qz || []);
      setInvoices(inv || []);
      setTransport(trans);
      setLibraryIssues(lib || []);
      setExams(exm || []);
    } catch (err) {
      console.error('Failed to load student data:', err);
    } finally {
      setLoading(false);
    }
  }

  // Handle Leave Request
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!leaveStart || !leaveEnd || !leaveReason) return;
    try {
      await api.applyLeave({
        studentId,
        startDate: leaveStart,
        endDate: leaveEnd,
        reason: leaveReason
      });
      alert('Leave application submitted successfully for teacher review!');
      setLeaveStart('');
      setLeaveEnd('');
      setLeaveReason('');
      loadAllStudentData();
    } catch (err) {
      alert(err.message || 'Failed to submit leave');
    }
  };

  // Start Quiz
  const handleStartQuiz = async (quizId) => {
    try {
      const q = await api.getQuizById(quizId);
      setActiveQuiz(q);
      setQuizAnswers({});
      setQuizResult(null);
      setQuizTimer((q.duration_minutes || 10) * 60);
    } catch (err) {
      alert('Failed to load quiz');
    }
  };

  // Submit Quiz
  const handleQuizSubmit = async () => {
    if (!activeQuiz) return;
    try {
      const res = await api.attemptQuiz(activeQuiz.id, {
        answers: quizAnswers,
        studentId
      });
      setQuizResult(res);
    } catch (err) {
      alert(err.message || 'Failed to submit quiz');
    }
  };

  // Pay Fee Online
  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!payingInvoice || !payAmount) return;
    setIsProcessingPayment(true);
    try {
      const res = await api.payFee({
        invoiceId: payingInvoice.id,
        amount: parseFloat(payAmount),
        paymentMode: payMode,
        notes: 'Paid via Student Online Portal'
      });
      alert(res.message);
      setPayingInvoice(null);
      loadAllStudentData();
      // Fetch and open receipt
      const rcp = await api.getReceipt(res.receiptNo);
      onOpenReceipt(rcp);
    } catch (err) {
      alert(err.message || 'Payment failed');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance & Leaves', icon: CalendarCheck },
    { id: 'timetable', label: 'Class Timetable', icon: Clock },
    { id: 'assignments', label: 'Homework & Submissions', icon: BookOpen },
    { id: 'quizzes', label: 'Online Quizzes', icon: Award },
    { id: 'exams', label: 'Exams & Report Card', icon: FileCheck },
    { id: 'fees', label: 'Fees & Invoices', icon: DollarSign },
    { id: 'library', label: 'Library Books', icon: Library },
    { id: 'transport', label: 'Transport / Bus', icon: Bus }
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-500 text-sm">
        <Clock className="w-5 h-5 animate-spin text-blue-600 mr-2" />
        <span>Loading Student Portal...</span>
      </div>
    );
  }

  const stu = profile || user?.student || { first_name: 'Aarav', last_name: 'Sharma', admission_no: 'SX-2024-001', class_name: 'Grade 10', section_name: 'A' };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-100 min-h-[calc(100vh-80px)] font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-4 border-r border-slate-800 shrink-0 flex flex-col justify-between">
        <div>
          {/* Student Profile Card in Sidebar */}
          <div className="p-3 mb-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 text-center">
            <img
              src={stu.profile_photo || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'}
              alt="Student"
              className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-amber-400 shadow"
            />
            <h3 className="font-bold text-white text-sm">{stu.first_name} {stu.last_name}</h3>
            <span className="text-[10px] text-blue-300 font-mono font-bold block">{stu.admission_no}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{stu.class_name || 'Class 10'} - {stu.section_name || 'A'} (Roll #{stu.roll_no || 1})</span>

            <button
              onClick={() => onOpenIdCard(stu)}
              className="mt-2.5 w-full bg-blue-600/30 hover:bg-blue-600 hover:text-white text-blue-300 border border-blue-400/30 py-1 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <Printer className="w-3 h-3" />
              <span>Digital ID Card</span>
            </button>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setActiveQuiz(null);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md'
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
          Academic Year: 2026-2027 (CBSE)
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-md flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">Welcome Back, Scholar</span>
                <h2 className="text-2xl font-black mt-0.5">{stu.first_name} {stu.last_name}</h2>
                <p className="text-xs text-blue-200 mt-1">
                  KRPS • Class {stu.class_name || '10'} - Section {stu.section_name || 'A'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onOpenIdCard(stu)}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>View ID Card</span>
                </button>
                <button
                  onClick={async () => {
                    const rc = await api.getReportCard(studentId, 1);
                    onOpenReportCard(rc);
                  }}
                  className="bg-amber-400 hover:bg-amber-500 text-blue-950 px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Term 1 Report Card</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Attendance</span>
                <h3 className="text-2xl font-black text-emerald-700 mt-1">
                  {attendanceData?.stats?.percentage || '96.5'}%
                </h3>
                <span className="text-[10px] text-emerald-600 font-semibold">Exceeds 75% CBSE requirement</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Term 1 Score</span>
                <h3 className="text-2xl font-black text-blue-900 mt-1">93.3%</h3>
                <span className="text-[10px] text-blue-600 font-bold">Grade A1 • Rank #1 in Class</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Active Homework</span>
                <h3 className="text-2xl font-black text-purple-900 mt-1">{assignments.length} Tasks</h3>
                <span className="text-[10px] text-purple-600 font-semibold">1 due next week</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Library Books</span>
                <h3 className="text-2xl font-black text-teal-900 mt-1">{libraryIssues.length} Borrowed</h3>
                <span className="text-[10px] text-teal-600 font-semibold">Due on 28 Nov</span>
              </div>
            </div>

            {/* Timetable Snippet & Pending Assignments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Schedule */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-sm text-slate-900">Today's Class Schedule (Monday)</h3>
                  <button onClick={() => setActiveTab('timetable')} className="text-xs text-blue-600 font-bold hover:underline">
                    Full Weekly Schedule →
                  </button>
                </div>
                <div className="space-y-2">
                  {timetable.slice(0, 5).map((tt) => (
                    <div key={tt.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-[10px]">
                          P{tt.period_number}
                        </span>
                        <div>
                          <strong className="block text-slate-800">{tt.subject_name}</strong>
                          <span className="text-[10px] text-slate-500">{tt.teacher_name || 'Faculty'} • {tt.room_number || 'Room 101'}</span>
                        </div>
                      </div>
                      <span className="text-slate-600 font-mono text-[11px]">{tt.start_time.slice(0, 5)} - {tt.end_time.slice(0, 5)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Homework & Quizzes */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-sm text-slate-900">Active Coursework & Quizzes</h3>
                  <button onClick={() => setActiveTab('quizzes')} className="text-xs text-blue-600 font-bold hover:underline">
                    Take Online Quiz →
                  </button>
                </div>
                <div className="space-y-3">
                  {assignments.map((asgn) => (
                    <div key={asgn.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex justify-between items-center">
                        <strong className="text-slate-900">{asgn.title}</strong>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {asgn.subject_name}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1 line-clamp-1">{asgn.description}</p>
                      <div className="flex justify-between items-center mt-2 text-[10px]">
                        <span className="text-red-600 font-semibold">Due: {new Date(asgn.due_date).toLocaleDateString()}</span>
                        <span className="text-blue-700 font-bold">Max Marks: {asgn.max_marks}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE & LEAVES */}
        {activeTab === 'attendance' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">My Attendance & Absence Record</h2>
                <p className="text-xs text-slate-500">Track daily status, monthly percentages, and submit official leaves</p>
              </div>
            </div>

            {/* Attendance Percentage Alert */}
            {attendanceData?.stats && (
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                attendanceData.stats.thresholdWarning
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h3 className="font-bold text-sm">Cumulative Attendance: {attendanceData.stats.percentage}%</h3>
                    <p className="text-xs">
                      {attendanceData.stats.presentDays} Present • {attendanceData.stats.absentDays} Absent • {attendanceData.stats.lateDays} Late • {attendanceData.stats.excusedDays} Excused
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white shadow-xs">
                  {attendanceData.stats.thresholdWarning ? 'Warning: Below 75%' : 'Eligible for Exams'}
                </span>
              </div>
            )}

            {/* Leave Request Form */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
              <h3 className="font-bold text-sm text-slate-900 mb-3">Apply for Student Leave</h3>
              <form onSubmit={handleApplyLeave} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">From Date *</label>
                    <input
                      type="date"
                      required
                      value={leaveStart}
                      onChange={(e) => setLeaveStart(e.target.value)}
                      className="w-full p-2 border rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">To Date *</label>
                    <input
                      type="date"
                      required
                      value={leaveEnd}
                      onChange={(e) => setLeaveEnd(e.target.value)}
                      className="w-full p-2 border rounded-xl bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Reason for Absence *</label>
                  <textarea
                    rows={2}
                    required
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    placeholder="e.g. Attending family function out of town / Medical leave"
                    className="w-full p-2 border rounded-xl bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Leave Application</span>
                </button>
              </form>
            </div>

            {/* Recent Attendance Log */}
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-3">Recent Recorded Attendance Log</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Session</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendanceData?.records?.map((r) => (
                      <tr key={r.id}>
                        <td className="p-3 font-semibold text-slate-800">{new Date(r.date).toLocaleDateString()}</td>
                        <td className="p-3 text-slate-500">Daily Session</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.status === 'Present' ? 'bg-emerald-100 text-emerald-800' :
                            r.status === 'Late' ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 italic">{r.remarks || 'Recorded'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TIMETABLE */}
        {activeTab === 'timetable' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Weekly Class Timetable</h2>
              <p className="text-xs text-slate-500">Class 10 - Section A • Room 101</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-blue-900 text-white font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Day</th>
                    <th className="p-3">Period</th>
                    <th className="p-3">Timing</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Teacher</th>
                    <th className="p-3">Room</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {timetable.map((tt) => (
                    <tr key={tt.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-blue-950">{tt.day_of_week}</td>
                      <td className="p-3 font-mono font-bold">Period {tt.period_number}</td>
                      <td className="p-3 text-slate-500 font-mono text-[11px]">{tt.start_time.slice(0, 5)} - {tt.end_time.slice(0, 5)}</td>
                      <td className="p-3 font-bold text-slate-900">{tt.subject_name} ({tt.subject_code})</td>
                      <td className="p-3 text-slate-600">{tt.teacher_name || 'Faculty'}</td>
                      <td className="p-3 text-slate-500">{tt.room_number || 'Room 101'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ONLINE QUIZZES */}
        {activeTab === 'quizzes' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {!activeQuiz ? (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Online Practice Quizzes & Objective Tests</h2>
                  <p className="text-xs text-slate-500">Take timed interactive quizzes with immediate score evaluations</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quizzes.map((q) => (
                    <div key={q.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded uppercase">
                            {q.subject_name}
                          </span>
                          <span className="text-xs font-bold text-slate-500">{q.duration_minutes} Mins</span>
                        </div>
                        <h3 className="font-bold text-base text-slate-900 mt-2">{q.title}</h3>
                        <p className="text-xs text-slate-600 mt-1">{q.description}</p>
                        <span className="text-xs font-bold text-slate-700 mt-2 block">Total Marks: {q.total_marks}</span>
                      </div>
                      <button
                        onClick={() => handleStartQuiz(q.id)}
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Timer className="w-4 h-4" />
                        <span>Start Timed Quiz Now</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* ACTIVE QUIZ RUNNER */
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h3 className="font-black text-lg text-slate-900">{activeQuiz.title}</h3>
                    <p className="text-xs text-slate-500">Total Marks: {activeQuiz.total_marks}</p>
                  </div>
                  {!quizResult && (
                    <div className="bg-amber-100 border border-amber-300 text-amber-900 px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-2">
                      <Timer className="w-4 h-4 text-amber-600 animate-pulse" />
                      <span>Time Remaining: {Math.floor(quizTimer / 60)}:{(quizTimer % 60).toString().padStart(2, '0')}</span>
                    </div>
                  )}
                </div>

                {quizResult ? (
                  /* QUIZ RESULT REPORT */
                  <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 text-center space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h4 className="text-xl font-black text-emerald-950">Quiz Successfully Submitted!</h4>
                    <p className="text-sm font-bold text-emerald-800">
                      Your Score: <span className="text-2xl font-black">{quizResult.score}</span> / {quizResult.totalMarks} ({quizResult.percentage}%)
                    </p>

                    <div className="text-left bg-white p-4 rounded-2xl border border-emerald-200 space-y-4 text-xs">
                      <h5 className="font-bold text-slate-800">Answer Key & Breakdown:</h5>
                      {quizResult.evaluationResults && quizResult.evaluationResults.map((er, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                          <p className="font-bold text-slate-900 mb-1.5">{idx + 1}. {er.question}</p>
                          <p className={`font-semibold ${er.isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                            Your Answer: {er.options[er.userChoice] || 'Not answered'} {er.isCorrect ? '✓ (Correct)' : '✗ (Incorrect)'}
                          </p>
                          {!er.isCorrect && (
                            <p className="text-emerald-800 font-semibold mt-0.5">
                              Correct Answer: {er.options[er.correctChoice]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setActiveQuiz(null)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2 rounded-xl text-xs"
                    >
                      Return to Quizzes
                    </button>
                  </div>
                ) : (
                  /* QUESTIONS LIST */
                  <div className="space-y-6 text-xs">
                    {activeQuiz.questions && activeQuiz.questions.map((q, qIdx) => (
                      <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <h4 className="font-bold text-sm text-slate-900 mb-3">
                          {qIdx + 1}. {q.question} ({q.points || 2} Points)
                        </h4>
                        <div className="space-y-2">
                          {q.options && q.options.map((opt, optIdx) => (
                            <label
                              key={optIdx}
                              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                quizAnswers[q.id] === optIdx
                                  ? 'bg-blue-100 border-blue-500 font-bold text-blue-950 shadow-xs'
                                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`q_${q.id}`}
                                checked={quizAnswers[q.id] === optIdx}
                                onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                                className="accent-blue-600"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => setActiveQuiz(null)}
                        className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleQuizSubmit}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md text-xs uppercase tracking-wider"
                      >
                        Submit Test & Evaluate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: EXAMS & REPORT CARD */}
        {activeTab === 'exams' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Academic Examinations & Official Report Cards</h2>
                <p className="text-xs text-slate-500">Inspect published results with school watermark</p>
              </div>
            </div>

            <div className="space-y-4">
              {exams.map((ex) => (
                <div key={ex.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded uppercase">
                      {ex.exam_type}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-1">{ex.title}</h3>
                    <p className="text-xs text-slate-500">{ex.description}</p>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Timeline: {new Date(ex.start_date).toLocaleDateString()} – {new Date(ex.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={async () => {
                      const rc = await api.getReportCard(studentId, ex.id);
                      onOpenReportCard(rc);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>Download Official Report Card</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: FEES & PAYMENTS */}
        {activeTab === 'fees' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Fee Invoices & Online Payments</h2>
                <p className="text-xs text-slate-500">Pay academic fees securely via UPI, Cards, or NetBanking</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Invoice #</th>
                    <th className="p-3">Title / Particulars</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Paid Amount</th>
                    <th className="p-3">Balance Due</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="p-3 font-mono font-bold text-blue-700">{inv.invoice_no}</td>
                      <td className="p-3 font-bold text-slate-900">{inv.title}</td>
                      <td className="p-3 font-mono">₹{parseFloat(inv.total_amount).toLocaleString('en-IN')}</td>
                      <td className="p-3 font-mono font-semibold text-emerald-700">₹{parseFloat(inv.paid_amount).toLocaleString('en-IN')}</td>
                      <td className="p-3 font-mono font-bold text-red-600">₹{parseFloat(inv.balance_amount).toLocaleString('en-IN')}</td>
                      <td className="p-3 text-slate-500">{new Date(inv.due_date).toLocaleDateString()}</td>
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
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs"
                          >
                            Pay Online Now
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

        {/* TAB 7: LIBRARY BOOKS */}
        {activeTab === 'library' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">My Borrowed Library Books</h2>
            <div className="space-y-3">
              {libraryIssues.map((b) => (
                <div key={b.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center text-xs">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{b.book_title}</h3>
                    <p className="text-slate-500">Author: {b.book_author} • Shelf: {b.shelf_location}</p>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Issued: {new Date(b.issue_date).toLocaleDateString()} • Return Due: {new Date(b.due_date).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    b.status === 'Issued' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: TRANSPORT */}
        {activeTab === 'transport' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Assigned School Transport & Bus Details</h2>
            {transport ? (
              <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <strong className="text-base font-bold text-blue-950">{transport.route_name}</strong>
                  <span className="font-mono font-bold bg-blue-900 text-white px-2.5 py-1 rounded-lg">
                    {transport.registration_no}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <span className="text-slate-500 block">Assigned Pickup Stop:</span>
                    <strong className="text-slate-900 text-sm">{transport.stop_name}</strong>
                    <span className="text-[11px] text-slate-500">Pickup: {transport.pickup_time} • Drop: {transport.drop_time}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Driver Contact:</span>
                    <strong className="text-slate-900 text-sm">{transport.driver_name}</strong>
                    <span className="text-[11px] text-blue-700 font-mono block">{transport.driver_phone}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No transport subscription recorded for current academic term.</p>
            )}
          </div>
        )}
      </main>

      {/* Modal: Simulated Instant Gateway Payment */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-base text-slate-900 mb-1">Instant Online Fee Payment</h3>
            <p className="text-slate-500 mb-4">Invoice: {payingInvoice.invoice_no} ({payingInvoice.title})</p>

            <form onSubmit={handleProcessPayment} className="space-y-4">
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

              <div>
                <label className="block font-semibold mb-1">Select Payment Gateway Mode *</label>
                <div className="grid grid-cols-2 gap-2">
                  {['UPI / Razorpay', 'Credit Card', 'Net Banking'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPayMode(m)}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs ${
                        payMode === m ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800">
                🔒 Simulated instant payment webhook integration with server-side signature verification.
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
                  disabled={isProcessingPayment}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {isProcessingPayment ? 'Processing...' : `Pay ₹${parseFloat(payAmount || 0).toLocaleString('en-IN')}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
