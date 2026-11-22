import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, GraduationCap, UserCheck, Users, Calculator, BookOpen, Bus, Globe } from 'lucide-react';

export default function RoleDemoBar({ currentView, setCurrentView, onOpenLogin, onOpenRegister }) {
  const { user, quickDemoLogin, logout } = useAuth();

  const roles = [
    { key: 'admin', label: 'Admin ERP', icon: ShieldCheck, color: 'bg-indigo-600 hover:bg-indigo-700 text-white' },
    { key: 'teacher', label: 'Teacher', icon: GraduationCap, color: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
    { key: 'student', label: 'Student', icon: UserCheck, color: 'bg-blue-600 hover:bg-blue-700 text-white' },
    { key: 'parent', label: 'Parent (2 Kids)', icon: Users, color: 'bg-purple-600 hover:bg-purple-700 text-white' },
    { key: 'accountant', label: 'Accountant', icon: Calculator, color: 'bg-amber-600 hover:bg-amber-700 text-white' },
    { key: 'librarian', label: 'Librarian', icon: BookOpen, color: 'bg-teal-600 hover:bg-teal-700 text-white' },
    { key: 'transport', label: 'Transport', icon: Bus, color: 'bg-orange-600 hover:bg-orange-700 text-white' }
  ];

  const handleRoleSelect = async (key) => {
    try {
      await quickDemoLogin(key);
      setCurrentView('portal');
    } catch (err) {
      const confirmRegister = confirm(`No account registered yet for ${key}. Would you like to register an account now?`);
      if (confirmRegister && onOpenRegister) {
        onOpenRegister(key === 'transport' ? 'transport_mgr' : key);
      }
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 shadow-inner no-print z-40 sticky top-0">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-semibold text-slate-300 tracking-wide uppercase text-[10px]">1-Click Demo Roles:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setCurrentView('public')}
          className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition-all ${
            currentView === 'public'
              ? 'bg-blue-500 text-white shadow-sm ring-1 ring-blue-300'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title="Visit Public School Website"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Public Website</span>
        </button>

        <span className="text-slate-600">|</span>

        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = user && user.role === (r.key === 'transport' ? 'transport_mgr' : r.key) && currentView === 'portal';
          return (
            <button
              key={r.key}
              onClick={() => handleRoleSelect(r.key)}
              className={`px-2 py-1 rounded-md font-medium flex items-center gap-1 transition-all ${
                isActive
                  ? `${r.color} shadow-sm ring-2 ring-white/50 scale-[1.03]`
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>

      {user ? (
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <span>Logged in as: <strong className="text-white capitalize">{user.role}</strong> ({user.firstName})</span>
          <button 
            onClick={logout}
            className="text-red-400 hover:text-red-300 underline font-semibold ml-1"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenRegister && onOpenRegister('admin')}
            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold text-[11px] shadow-sm flex items-center gap-1 transition-all"
            title="Register Super Administrator account"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Register Admin</span>
          </button>
          <button
            onClick={() => onOpenLogin && onOpenLogin()}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded font-bold text-[11px] transition-colors"
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );
}
