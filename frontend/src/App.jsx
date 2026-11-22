import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import RoleDemoBar from './components/RoleDemoBar';
import PublicWebsite from './pages/PublicWebsite';
import AdminPortal from './pages/admin/AdminPortal';
import TeacherPortal from './pages/teacher/TeacherPortal';
import StudentPortal from './pages/student/StudentPortal';
import ParentPortal from './pages/parent/ParentPortal';
import AccountantPortal from './pages/accountant/AccountantPortal';
import LibrarianPortal from './pages/librarian/LibrarianPortal';
import TransportPortal from './pages/transport/TransportPortal';

import LoginModal from './pages/LoginModal';
import IdCardModal from './components/IdCardModal';
import ReportCardModal from './components/ReportCardModal';
import ReceiptModal from './components/ReceiptModal';
import AiAssistantModal from './components/AiAssistantModal';

import {
  Globe,
  Bot,
  LogOut,
  Bell,
  Sparkles,
  Shield,
  ShieldCheck,
  GraduationCap,
  UserCheck,
  Users,
  Calculator,
  BookOpen,
  Bus,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const { user, logout, isAuthenticated, quickDemoLogin } = useAuth();
  const [currentView, setCurrentView] = useState('public'); // Default to 'public' so school website displays immediately

  // Modals state
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [authModalRole, setAuthModalRole] = useState('student');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedIdCardStudent, setSelectedIdCardStudent] = useState(null);
  const [selectedReportCardData, setSelectedReportCardData] = useState(null);
  const [selectedReceiptData, setSelectedReceiptData] = useState(null);

  const openLoginModal = (role = 'student') => {
    setAuthModalMode('login');
    setAuthModalRole(role);
    setLoginModalOpen(true);
  };

  const openRegisterModal = (role = 'student') => {
    setAuthModalMode('register');
    setAuthModalRole(role);
    setLoginModalOpen(true);
  };

  // Determine which portal to render based on user role
  const renderPortal = () => {
    if (!isAuthenticated || !user) {
      const demoRoles = [
        { key: 'admin', label: 'Admin (Abhiram)', desc: 'Full institutional controls, admissions & registrations', icon: ShieldCheck, color: 'border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/50' },
        { key: 'teacher', label: 'Teacher Portal', desc: 'Attendance, gradebook, timetable & assignments', icon: GraduationCap, color: 'border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50/50' },
        { key: 'student', label: 'Student Portal', desc: 'ID card, timetable, exams, fees & report cards', icon: UserCheck, color: 'border-blue-200 hover:border-blue-500 hover:bg-blue-50/50' },
        { key: 'parent', label: 'Parent Portal', desc: 'Multi-ward tracking, real-time bus GPS & online fee pay', icon: Users, color: 'border-purple-200 hover:border-purple-500 hover:bg-purple-50/50' },
        { key: 'accountant', label: 'Accountant Portal', desc: 'Fee invoicing, fee receipts, reconciliation & balance sheets', icon: Calculator, color: 'border-amber-200 hover:border-amber-500 hover:bg-amber-50/50' },
        { key: 'librarian', label: 'Librarian Portal', desc: 'Book catalogue, barcode checkout, reservations & fines', icon: BookOpen, color: 'border-teal-200 hover:border-teal-500 hover:bg-teal-50/50' },
        { key: 'transport', label: 'Transport Portal', desc: 'Fleet tracking, route stops, driver rosters & live GPS', icon: Bus, color: 'border-orange-200 hover:border-orange-500 hover:bg-orange-50/50' }
      ];

      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50 min-h-[600px]">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Institutional ERP Portal Gateway</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mt-1 mb-6 leading-relaxed">
            Select an operational role below for instant demo access, or sign in with your official KRPS institutional credentials.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-w-4xl w-full mb-6 text-left">
            {demoRoles.map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.key}
                  onClick={() => quickDemoLogin(r.key)}
                  className={`p-3.5 rounded-xl border bg-white shadow-xs transition-all flex items-start gap-3 group text-left ${r.color}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 text-slate-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                      <span>{r.label}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">{r.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => openLoginModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-transform hover:scale-105"
            >
              Manual Sign In with Credentials
            </button>
            <button
              onClick={() => openRegisterModal()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-transform hover:scale-105"
            >
              Manual Self-Registration
            </button>
            <button
              onClick={() => setCurrentView('public')}
              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors"
            >
              Back to Public Website
            </button>
          </div>
        </div>
      );
    }

    switch (user.role) {
      case 'super_admin':
      case 'admin':
      case 'principal':
        return (
          <AdminPortal
            onOpenIdCard={(s) => setSelectedIdCardStudent(s)}
            onOpenReportCard={(r) => setSelectedReportCardData(r)}
            onOpenReceipt={(rcp) => setSelectedReceiptData(rcp)}
          />
        );
      case 'teacher':
        return <TeacherPortal />;
      case 'student':
        return (
          <StudentPortal
            onOpenIdCard={(s) => setSelectedIdCardStudent(s)}
            onOpenReportCard={(r) => setSelectedReportCardData(r)}
            onOpenReceipt={(rcp) => setSelectedReceiptData(rcp)}
          />
        );
      case 'parent':
        return (
          <ParentPortal
            onOpenIdCard={(s) => setSelectedIdCardStudent(s)}
            onOpenReportCard={(r) => setSelectedReportCardData(r)}
            onOpenReceipt={(rcp) => setSelectedReceiptData(rcp)}
          />
        );
      case 'accountant':
        return (
          <AccountantPortal
            onOpenReceipt={(rcp) => setSelectedReceiptData(rcp)}
          />
        );
      case 'librarian':
        return <LibrarianPortal />;
      case 'transport_mgr':
        return <TransportPortal />;
      default:
        return (
          <AdminPortal
            onOpenIdCard={(s) => setSelectedIdCardStudent(s)}
            onOpenReportCard={(r) => setSelectedReportCardData(r)}
            onOpenReceipt={(rcp) => setSelectedReceiptData(rcp)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* 1-Click Role Switcher Demo Bar (Sticky at Top) */}
      <RoleDemoBar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenLogin={openLoginModal}
        onOpenRegister={openRegisterModal}
      />

      {/* When in Public View, render the public school website */}
      {currentView === 'public' ? (
        <PublicWebsite
          onOpenLogin={openLoginModal}
          onOpenRegister={openRegisterModal}
        />
      ) : (
        /* When in Portal View, render the top portal navbar + respective role portal */
        <div className="flex-1 flex flex-col">
          {/* Portal Header */}
          <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between no-print z-20 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('public')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                title="Return to Public Website"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Website</span>
              </button>

              <div className="h-4 w-px bg-slate-200"></div>

              <div className="flex items-center gap-2">
                <img
                  src="/logo.jpg"
                  alt="KRPS Logo"
                  className="w-8 h-8 rounded-lg object-contain bg-white border border-slate-200 p-0.5 shadow-xs"
                />
                <div>
                  <h1 className="font-extrabold text-xs sm:text-sm text-blue-950 leading-tight">
                    KRPS
                  </h1>
                  <span className="text-[10px] text-slate-400 block font-medium">Enterprise ERP & Portals</span>
                </div>
              </div>
            </div>

            {/* Right user profile & actions */}
            <div className="flex items-center gap-3">
              {/* AI Assistant trigger */}
              <button
                onClick={() => setAiModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105"
              >
                <Bot className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Assistant</span>
              </button>

              {user ? (
                <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80'}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <div className="hidden sm:block text-left text-xs leading-tight">
                    <strong className="block text-slate-900">{user.firstName} {user.lastName}</strong>
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{user.role}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors ml-1"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openLoginModal()}
                    className="bg-blue-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-sm hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openRegisterModal()}
                    className="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-sm hover:bg-emerald-700 transition-colors"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Render Active Role Portal */}
          {renderPortal()}
        </div>
      )}

      {/* Floating AI Assistant Dock Button (Always accessible in bottom right) */}
      <button
        onClick={() => setAiModalOpen(true)}
        className="fixed bottom-5 right-5 z-40 bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-3.5 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 border-2 border-white/50 no-print"
        title="Open AI School Assistant"
      >
        <Bot className="w-6 h-6 text-amber-300" />
        <span className="text-xs font-bold pr-1 hidden sm:inline">AI Assistant</span>
      </button>

      {/* Global Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoggedIn={() => setCurrentView('portal')}
        initialMode={authModalMode}
        initialRole={authModalRole}
      />

      <AiAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />

      <IdCardModal
        student={selectedIdCardStudent}
        onClose={() => setSelectedIdCardStudent(null)}
      />

      <ReportCardModal
        data={selectedReportCardData}
        onClose={() => setSelectedReportCardData(null)}
      />

      <ReceiptModal
        receipt={selectedReceiptData}
        onClose={() => setSelectedReceiptData(null)}
      />
    </div>
  );
}
