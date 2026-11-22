import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import RegisterStakeholderModal from './RegisterStakeholderModal';
import StaffDirectoryView from './StaffDirectoryView';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  FileSpreadsheet,
  DollarSign,
  Calculator,
  Bus,
  BookOpen,
  Building,
  UserCheck,
  ShieldAlert,
  Download,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Trash2
} from 'lucide-react';

export default function AdminPortal({ onOpenIdCard, onOpenReportCard, onOpenReceipt }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Data states
  const [dashboard, setDashboard] = useState(null);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [feeSummary, setFeeSummary] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [books, setBooks] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [exams, setExams] = useState([]);
  const [directory, setDirectory] = useState({ teachers: [], staff: [], guardians: [], vehicles: [], routes: [] });

  // Filters & modals
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddVisitorModal, setShowAddVisitorModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerInitialTab, setRegisterInitialTab] = useState('teacher');

  // New Student Form
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    admissionNo: `KRPS-2026-${Math.floor(100 + Math.random() * 900)}`,
    gender: 'Male',
    dob: '2012-05-15',
    bloodGroup: 'B+',
    classId: '5',
    sectionId: '1',
    rollNo: 15,
    address: 'Whitefield, Bengaluru',
    emergencyContact: '+91 98450 11999',
    guardianName: 'Sunil Rao',
    guardianPhone: '+91 98450 11999',
    guardianEmail: 'sunil.rao@gmail.com',
    guardianRelationship: 'Father'
  });

  // New Visitor Form
  const [newVisitor, setNewVisitor] = useState({
    visitorName: '',
    phone: '',
    idProof: 'Aadhaar Verified',
    purpose: 'Campus enquiry',
    personToMeet: 'Principal',
    hostType: 'Principal'
  });

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    try {
      const [dash, stu, cls, adm, inv, sum, lv, vis, logs, usrs, bks, rts, exm, dir] = await Promise.all([
        api.getAdminDashboard(),
        api.getStudents(),
        api.getClasses(),
        api.getAdmissions(),
        api.getInvoices(),
        api.getFeeSummary(),
        api.getLeaveRequests(),
        api.getVisitors(),
        api.getAuditLogs(),
        api.getAdminUsers(),
        api.getBooks(),
        api.getTransportRoutes(),
        api.getExams(),
        api.getAdminDirectory()
      ]);

      setDashboard(dash);
      setStudents(stu || []);
      setClasses(cls || []);
      setAdmissions(adm || []);
      setInvoices(inv || []);
      setFeeSummary(sum || null);
      setLeaves(lv || []);
      setVisitors(vis || []);
      setAuditLogs(logs || []);
      setUsersList(usrs || []);
      setBooks(bks || []);
      setRoutes(rts || []);
      setExams(exm || []);
      setDirectory(dir || { teachers: [], staff: [], guardians: [], vehicles: [], routes: [] });
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  }

  // Handle New Student Creation
  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createStudent(newStudent);
      alert(res.message);
      setShowAddStudentModal(false);
      // Reload students & dashboard
      const [stu, dash] = await Promise.all([api.getStudents(), api.getAdminDashboard()]);
      setStudents(stu);
      setDashboard(dash);
    } catch (err) {
      alert(err.message || 'Failed to create student');
    }
  };

  // Student Delete States & Handler
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [isDeletingStudent, setIsDeletingStudent] = useState(false);

  const confirmDeleteStudent = async () => {
    if (!deletingStudent) return;
    setIsDeletingStudent(true);
    try {
      await api.deleteStudent(deletingStudent.id);
      setDeletingStudent(null);
      await loadAllData();
    } catch (err) {
      alert(err.message || 'Failed to delete student');
    } finally {
      setIsDeletingStudent(false);
    }
  };

  // Handle Admission Decision
  const handleAdmissionDecision = async (id, status) => {
    try {
      await api.updateAdmissionStatus(id, { status, reviewerNotes: `Status changed to ${status} by Abhiram (Admin).` });
      const adm = await api.getAdmissions();
      setAdmissions(adm);
    } catch (err) {
      alert('Error updating admission');
    }
  };

  // Handle Leave Approval
  const handleReviewLeave = async (id, status) => {
    try {
      await api.reviewLeave(id, { status, reviewerNotes: `Approved by Administration.` });
      const lv = await api.getLeaveRequests();
      setLeaves(lv);
    } catch (err) {
      alert('Error updating leave');
    }
  };

  // Handle New Visitor Pass
  const handleCreateVisitor = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createVisitor(newVisitor);
      alert(res.message);
      setShowAddVisitorModal(false);
      setNewVisitor({ visitorName: '', phone: '', idProof: 'Aadhaar Verified', purpose: '', personToMeet: '', hostType: 'Teacher' });
      const vis = await api.getVisitors();
      setVisitors(vis);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCheckoutVisitor = async (id) => {
    try {
      await api.checkoutVisitor(id);
      const vis = await api.getVisitors();
      setVisitors(vis);
    } catch (err) {
      alert('Error checking out visitor');
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchClass = selectedClass ? s.current_class_id === parseInt(selectedClass) : true;
    const matchSearch = studentSearch
      ? `${s.first_name} ${s.last_name} ${s.admission_no}`.toLowerCase().includes(studentSearch.toLowerCase())
      : true;
    return matchClass && matchSearch;
  });

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admissions', label: 'Admissions Queue', icon: UserCheck, badge: dashboard?.metrics?.pending_admissions },
    { id: 'students', label: 'Students Directory', icon: GraduationCap },
    { id: 'staff', label: 'Staff & Stakeholders', icon: Users },
    { id: 'academics', label: 'Classes & Structure', icon: Building },
    { id: 'attendance', label: 'Attendance & Leaves', icon: CalendarCheck, badge: dashboard?.metrics?.pending_leaves },
    { id: 'finance', label: 'Fee Management', icon: DollarSign },
    { id: 'exams', label: 'Examinations', icon: FileSpreadsheet },
    { id: 'library', label: 'Library Catalogue', icon: BookOpen },
    { id: 'transport', label: 'Transport Fleet', icon: Bus },
    { id: 'visitors', label: 'Visitor Desk', icon: Users, badge: dashboard?.metrics?.active_visitors },
    { id: 'security', label: 'Users & Audit Logs', icon: ShieldAlert },
    { id: 'reports', label: 'Export Reports', icon: Download }
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-500 text-sm">
        <Clock className="w-5 h-5 animate-spin text-blue-600 mr-2" />
        <span>Loading KRPS ERP Environment...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-100 min-h-[calc(100vh-80px)] font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-4 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="px-3 py-2 mb-4 border-b border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Institutional ERP</span>
            <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-0.5">
              <span>Admin Management</span>
            </h2>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white text-blue-700' : 'bg-blue-500/30 text-blue-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 px-3 text-[11px] text-slate-400">
          <p className="font-semibold text-slate-200">
            {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Administrator' : 'Administrator'}
          </p>
          <p className="text-[10px] text-slate-500">
            {user?.role === 'super_admin' ? 'Super Administrator' : 'Administrator'}
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && dashboard && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Institutional Dashboard</h2>
                <p className="text-xs text-slate-500">Real-time school performance & operational metrics</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setRegisterInitialTab('teacher');
                    setShowRegisterModal(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Register Teacher</span>
                </button>
                <button
                  onClick={() => {
                    setRegisterInitialTab('student');
                    setShowRegisterModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enrol New Student</span>
                </button>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total Enrolled</span>
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">{dashboard?.metrics?.total_students || 0}</h3>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> Across {dashboard?.metrics?.total_classes || 0} Academic Classes
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Today Attendance</span>
                  <CalendarCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-black text-emerald-700">{dashboard?.todayAttendancePct || 0}%</h3>
                <span className="text-[10px] text-slate-500 mt-1 block">CBSE Benchmark Target: 75%</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Fees Collected</span>
                  <DollarSign className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-black text-indigo-950">
                  ₹{(parseFloat(dashboard?.finances?.total_collected || 0) / 1000).toFixed(0)}k
                </h3>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Outstanding: ₹{(parseFloat(dashboard?.finances?.total_outstanding || 0) / 1000).toFixed(0)}k
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Faculty & Staff</span>
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-2xl font-black text-purple-950">
                  {parseInt(dashboard?.metrics?.total_teachers || 0) + parseInt(dashboard?.metrics?.total_staff || 0)}
                </h3>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {dashboard?.metrics?.total_teachers || 0} Teachers • {dashboard?.metrics?.total_staff || 0} Support Staff
                </span>
              </div>
            </div>

            {/* Stakeholder Registration Hub */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-5 rounded-3xl text-white shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">Administrative Desk</span>
                  <h3 className="text-base font-extrabold text-white">Institutional Registration & Stakeholder Provisioning</h3>
                  <p className="text-xs text-blue-200">Register new teachers, students, parents, librarians, accountants, and transport fleet</p>
                </div>
                <button
                  onClick={() => setActiveTab('staff')}
                  className="text-xs font-bold text-amber-300 hover:text-white underline"
                >
                  View Full Staff & Stakeholders Directory →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { key: 'teacher', label: 'Register Teacher', desc: 'Faculty & Dept', icon: GraduationCap, color: 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-400/30 text-emerald-300' },
                  { key: 'student', label: 'Enrol Student', desc: 'Admission & Class', icon: UserCheck, color: 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-400/30 text-blue-300' },
                  { key: 'guardian', label: 'Register Parent', desc: 'Guardians & Wards', icon: Users, color: 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-400/30 text-purple-300' },
                  { key: 'librarian', label: 'Register Librarian', desc: 'Book Circulation', icon: BookOpen, color: 'bg-teal-500/20 hover:bg-teal-500/30 border-teal-400/30 text-teal-300' },
                  { key: 'accountant', label: 'Register Accountant', desc: 'Finance & Invoices', icon: Calculator, color: 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-400/30 text-amber-300' },
                  { key: 'transport', label: 'Register Transport', desc: 'Fleet, Driver & Route', icon: Bus, color: 'bg-orange-500/20 hover:bg-orange-500/30 border-orange-400/30 text-orange-300' }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        setRegisterInitialTab(item.key);
                        setShowRegisterModal(true);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all hover:scale-[1.03] flex flex-col justify-between ${item.color}`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center mb-2">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="block text-white text-xs font-bold leading-tight">{item.label}</strong>
                        <span className="text-[10px] opacity-75">{item.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions & Pending Queues */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Admissions Review */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm text-slate-900">Recent Online Admissions</h3>
                  <button onClick={() => setActiveTab('admissions')} className="text-xs text-blue-600 font-bold hover:underline">
                    View Queue ({admissions.length}) →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5">Application No</th>
                        <th className="p-2.5">Candidate</th>
                        <th className="p-2.5">Grade</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {admissions.slice(0, 4).map((a) => (
                        <tr key={a.id}>
                          <td className="p-2.5 font-mono text-blue-700 font-bold">{a.application_no}</td>
                          <td className="p-2.5 font-semibold text-slate-800">{a.student_name}</td>
                          <td className="p-2.5 text-slate-600">{a.grade_applying}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              a.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                              a.status === 'Under Review' ? 'bg-amber-100 text-amber-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {a.status}
                            </span>
                          </td>
                          <td className="p-2.5 text-right space-x-1">
                            <button
                              onClick={() => handleAdmissionDecision(a.id, 'Approved')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold"
                            >
                              Approve
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Audit trail */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-sm text-slate-900 mb-3">Live Security Audit Trail</h3>
                <div className="space-y-3 custom-scrollbar max-h-72 overflow-y-auto text-xs">
                  {auditLogs.slice(0, 6).map((log) => (
                    <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <strong className="text-blue-700 uppercase font-mono">{log.action}</strong>
                        <span>{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-700 font-medium line-clamp-1">{log.details}</p>
                      <span className="text-[10px] text-slate-400">By: {log.user_name} ({log.role})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADMISSIONS */}
        {activeTab === 'admissions' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Online Admissions Management</h2>
                <p className="text-xs text-slate-500">Review applications submitted from public school website</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Application #</th>
                    <th className="p-3">Candidate</th>
                    <th className="p-3">DOB & Gender</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Previous School</th>
                    <th className="p-3">Parent Info</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {admissions.map((adm) => (
                    <tr key={adm.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-blue-700">{adm.application_no}</td>
                      <td className="p-3 font-bold text-slate-900">{adm.student_name}</td>
                      <td className="p-3 text-slate-600">{new Date(adm.dob).toLocaleDateString()} ({adm.gender})</td>
                      <td className="p-3 font-semibold text-slate-800">{adm.grade_applying}</td>
                      <td className="p-3 text-slate-500">{adm.previous_school || 'N/A'}</td>
                      <td className="p-3 text-slate-700">
                        <strong>{adm.parent_name}</strong><br />
                        <span className="text-[10px] text-slate-400">{adm.parent_phone}</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          adm.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                          adm.status === 'Under Review' ? 'bg-amber-100 text-amber-800' :
                          adm.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {adm.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleAdmissionDecision(adm.id, 'Approved')}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAdmissionDecision(adm.id, 'Under Review')}
                          className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => handleAdmissionDecision(adm.id, 'Rejected')}
                          className="px-2 py-1 bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-600 rounded text-[10px] font-bold"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: STUDENTS DIRECTORY */}
        {activeTab === 'students' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Students Directory</h2>
                <p className="text-xs text-slate-500">Manage student records, profiles, and official digital ID cards</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Student</span>
                </button>
              </div>
            </div>

            {/* Filter toolbar */}
            <div className="flex flex-wrap gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by student name or admission no..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl"
                />
              </div>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium"
              >
                <option value="">All Academic Classes</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Adm No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Class & Sec</th>
                    <th className="p-3">Roll #</th>
                    <th className="p-3">Guardian</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Official ID Card</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-blue-700">{s.admission_no}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={s.profile_photo || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80'}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover border"
                          />
                          <span className="font-bold text-slate-900">{s.first_name} {s.last_name}</span>
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-slate-800">{s.class_name} - {s.section_name}</td>
                      <td className="p-3 font-mono">#{s.roll_no || 1}</td>
                      <td className="p-3 text-slate-700">{s.primary_guardian_name || 'Rajesh Sharma'}</td>
                      <td className="p-3 text-slate-500 font-mono text-[11px]">{s.emergency_contact || s.primary_guardian_phone}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1.5">
                        <button
                          onClick={() => onOpenIdCard(s)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg text-[10px] font-bold transition-colors inline-flex items-center gap-1 shadow-xs"
                        >
                          <Printer className="w-3 h-3" />
                          <span>View ID Card</span>
                        </button>
                        <button
                          onClick={() => setDeletingStudent(s)}
                          className="px-2 py-1 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-700 rounded-lg text-[10px] font-bold transition-colors inline-flex items-center gap-1 border border-slate-200/60"
                          title="Delete Student Record"
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: STAFF & STAKEHOLDERS DIRECTORY */}
        {activeTab === 'staff' && (
          <StaffDirectoryView
            directory={directory}
            onOpenRegister={(role) => {
              setRegisterInitialTab(role);
              setShowRegisterModal(true);
            }}
            onRefresh={loadAllData}
          />
        )}

        {/* TAB 4: ACADEMICS & TIMETABLES */}
        {activeTab === 'academics' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Academic Structure & Classes</h2>
              <p className="text-xs text-slate-500">Configure classes, sections, and room allocations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((cls) => (
                <div key={cls.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-black text-sm text-slate-900">{cls.name}</h3>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      Order: {cls.numeric_order}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">Enrolled: {cls.student_count || 0} students</p>
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Sections:</span>
                    {cls.sections && cls.sections.map((sec) => (
                      <div key={sec.id} className="bg-white p-2 rounded-lg border border-slate-200 flex justify-between items-center text-[11px]">
                        <strong>Section {sec.name}</strong>
                        <span className="text-slate-500">{sec.room_number || 'Room 101'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ATTENDANCE & LEAVES */}
        {activeTab === 'attendance' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Attendance Oversight & Leave Requests</h2>
              <p className="text-xs text-slate-500">Review student and staff leave applications</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Class</th>
                    <th className="p-3">From Date</th>
                    <th className="p-3">To Date</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaves.map((lv) => (
                    <tr key={lv.id}>
                      <td className="p-3 font-bold text-slate-900">{lv.first_name} {lv.last_name}</td>
                      <td className="p-3 text-slate-600">{lv.class_name}-{lv.section_name}</td>
                      <td className="p-3 font-semibold">{new Date(lv.start_date).toLocaleDateString()}</td>
                      <td className="p-3 font-semibold">{new Date(lv.end_date).toLocaleDateString()}</td>
                      <td className="p-3 text-slate-700 italic max-w-xs">{lv.reason}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          lv.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                          lv.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {lv.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        {lv.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleReviewLeave(lv.id, 'Approved')}
                              className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReviewLeave(lv.id, 'Rejected')}
                              className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: FEE MANAGEMENT */}
        {activeTab === 'finance' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Fee Structures & Outstanding Invoices</h2>
                <p className="text-xs text-slate-500">Track collections, dues, concessions, and generated receipts</p>
              </div>
            </div>

            {feeSummary && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Total Invoiced</span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">₹{parseFloat(feeSummary.metrics.total_billed).toLocaleString('en-IN')}</h3>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase">Total Collected</span>
                  <h3 className="text-xl font-black text-emerald-900 mt-1">₹{parseFloat(feeSummary.metrics.total_collected).toLocaleString('en-IN')}</h3>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-700 uppercase">Outstanding Dues</span>
                  <h3 className="text-xl font-black text-amber-900 mt-1">₹{parseFloat(feeSummary.metrics.total_pending).toLocaleString('en-IN')}</h3>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Invoice #</th>
                    <th className="p-3">Student</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Paid Amount</th>
                    <th className="p-3">Balance</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="p-3 font-mono font-bold text-blue-700">{inv.invoice_no}</td>
                      <td className="p-3 font-bold text-slate-900">{inv.first_name} {inv.last_name}</td>
                      <td className="p-3 text-slate-600">{inv.title}</td>
                      <td className="p-3 font-mono font-semibold">₹{parseFloat(inv.total_amount).toLocaleString('en-IN')}</td>
                      <td className="p-3 font-mono font-semibold text-emerald-700">₹{parseFloat(inv.paid_amount).toLocaleString('en-IN')}</td>
                      <td className="p-3 font-mono font-semibold text-red-600">₹{parseFloat(inv.balance_amount).toLocaleString('en-IN')}</td>
                      <td className="p-3 text-slate-500">{new Date(inv.due_date).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: EXAMINATIONS & REPORT CARDS */}
        {activeTab === 'exams' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Examinations & Official Report Cards</h2>
              <p className="text-xs text-slate-500">View examination sessions and inspect student branded report cards</p>
            </div>

            <div className="space-y-4">
              {exams.map((ex) => (
                <div key={ex.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded uppercase">
                      {ex.exam_type}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-1">{ex.title}</h3>
                    <p className="text-xs text-slate-500">{ex.description}</p>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Timeline: {new Date(ex.start_date).toLocaleDateString()} – {new Date(ex.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={async () => {
                        const card = await api.getReportCard(1, ex.id);
                        onOpenReportCard(card);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Preview Official Report Card (Aarav)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: VISITOR MANAGEMENT */}
        {activeTab === 'visitors' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Front Office & Visitor Desk</h2>
                <p className="text-xs text-slate-500">Register campus visitors, issue passes, and record checkouts</p>
              </div>
              <button
                onClick={() => setShowAddVisitorModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Issue Visitor Pass</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Pass #</th>
                    <th className="p-3">Visitor Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Person To Meet</th>
                    <th className="p-3">Check In</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visitors.map((v) => (
                    <tr key={v.id}>
                      <td className="p-3 font-mono font-bold text-blue-700">{v.pass_no}</td>
                      <td className="p-3 font-bold text-slate-900">{v.visitor_name}</td>
                      <td className="p-3 font-mono text-slate-600">{v.phone}</td>
                      <td className="p-3 text-slate-700">{v.purpose}</td>
                      <td className="p-3 font-semibold text-slate-800">{v.person_to_meet} ({v.host_type})</td>
                      <td className="p-3 text-slate-500">{new Date(v.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          v.status === 'Checked In' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {v.status === 'Checked In' && (
                          <button
                            onClick={() => handleCheckoutVisitor(v.id)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[10px] font-bold"
                          >
                            Check Out
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

        {/* TAB 9: USERS & AUDIT LOGS */}
        {activeTab === 'security' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">User Accounts & Security Audits</h2>
              <p className="text-xs text-slate-500">Review RBAC credentials and audit logs</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Last Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.map((u) => (
                    <tr key={u.id}>
                      <td className="p-3 font-bold text-slate-900">{u.first_name} {u.last_name} ({u.username})</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 font-mono text-[11px]">{u.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 text-[11px]">
                        {u.last_login ? new Date(u.last_login).toLocaleString() : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 10: REPORTS EXPORT */}
        {activeTab === 'reports' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Institutional Reports & Data Exports</h2>
              <p className="text-xs text-slate-500">Download formatted CSV reports conforming to compliance guidelines</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Comprehensive Students Registry</h3>
                  <p className="text-xs text-slate-500">Complete student roster with admission numbers and classes</p>
                </div>
                <button
                  onClick={() => api.exportReport('students')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CSV</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Fee Invoices & Payments Summary</h3>
                  <p className="text-xs text-slate-500">Billing statements, amounts paid, and outstanding balances</p>
                </div>
                <button
                  onClick={() => api.exportReport('fees')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fallbacks for other tabs */}
        {activeTab === 'library' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Library Catalogue Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {books.map((b) => (
                <div key={b.id} className="p-3 border rounded-xl bg-slate-50 flex justify-between items-center text-xs">
                  <div>
                    <strong className="block text-slate-900">{b.title}</strong>
                    <span className="text-slate-500">{b.author} • {b.category}</span>
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                    {b.available_copies} / {b.total_copies} Available
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'transport' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Transport Fleet & Routes</h2>
                <p className="text-xs text-slate-500">School buses, drivers, licence registry, and route management</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setRegisterInitialTab('transport');
                    setShowRegisterModal(true);
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Register Bus / Driver</span>
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {routes.map((r) => (
                <div key={r.id} className="p-4 border rounded-xl bg-slate-50 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <strong className="text-slate-900 text-sm">{r.route_name}</strong>
                    <span className="font-mono text-blue-700 font-bold">{r.registration_no}</span>
                  </div>
                  <p className="text-slate-600">Driver: {r.driver_name} ({r.driver_phone})</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {r.stops && r.stops.map((st) => (
                      <span key={st.id} className="bg-white px-2.5 py-1 rounded border text-[11px] text-slate-700">
                        🚏 {st.stop_name} ({st.pickup_time})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal: Enrol New Student */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 text-xs overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Enrol New Student Record</h3>
              <button onClick={() => setShowAddStudentModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.firstName}
                    onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
                    className="w-full p-2 border rounded-xl bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.lastName}
                    onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
                    className="w-full p-2 border rounded-xl bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Admission Number *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.admissionNo}
                    onChange={(e) => setNewStudent({ ...newStudent, admissionNo: e.target.value })}
                    className="w-full p-2 border rounded-xl bg-slate-50 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={newStudent.dob}
                    onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })}
                    className="w-full p-2 border rounded-xl bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Class</label>
                  <select
                    value={newStudent.classId}
                    onChange={(e) => setNewStudent({ ...newStudent, classId: e.target.value })}
                    className="w-full p-2 border rounded-xl bg-slate-50"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Section</label>
                  <select
                    value={newStudent.sectionId}
                    onChange={(e) => setNewStudent({ ...newStudent, sectionId: e.target.value })}
                    className="w-full p-2 border rounded-xl bg-slate-50"
                  >
                    <option value="1">A</option>
                    <option value="2">B</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="font-semibold block mb-1">Primary Guardian Name & Phone</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Guardian Name"
                      value={newStudent.guardianName}
                      onChange={(e) => setNewStudent({ ...newStudent, guardianName: e.target.value })}
                      className="p-2 border rounded-xl bg-slate-50"
                    />
                    <input
                      type="text"
                      placeholder="Guardian Phone"
                      value={newStudent.guardianPhone}
                      onChange={(e) => setNewStudent({ ...newStudent, guardianPhone: e.target.value })}
                      className="p-2 border rounded-xl bg-slate-50"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Create & Enrol Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Issue Visitor Pass */}
      {showAddVisitorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-base text-slate-900 mb-3">Issue Campus Visitor Pass</h3>
            <form onSubmit={handleCreateVisitor} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">Visitor Full Name *</label>
                <input
                  type="text"
                  required
                  value={newVisitor.visitorName}
                  onChange={(e) => setNewVisitor({ ...newVisitor, visitorName: e.target.value })}
                  placeholder="e.g. Sujata Banerjee"
                  className="w-full p-2 border rounded-xl bg-slate-50"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={newVisitor.phone}
                  onChange={(e) => setNewVisitor({ ...newVisitor, phone: e.target.value })}
                  placeholder="+91..."
                  className="w-full p-2 border rounded-xl bg-slate-50"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Purpose of Visit *</label>
                <input
                  type="text"
                  required
                  value={newVisitor.purpose}
                  onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })}
                  placeholder="e.g. Parent-Teacher meeting"
                  className="w-full p-2 border rounded-xl bg-slate-50"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Person To Meet *</label>
                <input
                  type="text"
                  required
                  value={newVisitor.personToMeet}
                  onChange={(e) => setNewVisitor({ ...newVisitor, personToMeet: e.target.value })}
                  placeholder="e.g. Mrs. Sarah Jenkins"
                  className="w-full p-2 border rounded-xl bg-slate-50"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddVisitorModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Issue Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unified Institutional Registration Modal */}
      <RegisterStakeholderModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        initialTab={registerInitialTab}
        classes={classes}
        students={students}
        vehicles={directory?.vehicles || []}
        onSuccess={loadAllData}
      />

      {/* Student Deletion Confirmation Modal */}
      {deletingStudent && (
        <DeleteConfirmModal
          isOpen={!!deletingStudent}
          title="Delete Student Record"
          entityName={`${deletingStudent.first_name} ${deletingStudent.last_name}`}
          entityType="Student Candidate"
          entityDetails={{
            id: deletingStudent.admission_no,
            subtitle: `${deletingStudent.class_name || 'Enrolled Class'} - Section ${deletingStudent.section_name || 'A'}`,
            meta: `Roll No: #${deletingStudent.roll_no || 1}`
          }}
          warningText="Deleting this student will permanently remove their academic records, enrollment, attendance logs, exam marks, and login credentials."
          confirmButtonText="Delete Student"
          isDeleting={isDeletingStudent}
          onConfirm={confirmDeleteStudent}
          onClose={() => setDeletingStudent(null)}
        />
      )}
    </div>
  );
}
