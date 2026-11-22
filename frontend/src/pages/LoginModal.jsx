import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Users,
  BookOpen,
  Calculator,
  Bus,
  Phone,
  Mail,
  UserPlus,
  LogIn
} from 'lucide-react';

export default function LoginModal({
  isOpen,
  onClose,
  onLoggedIn,
  initialMode = 'login',
  initialRole = 'student'
}) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState(initialRole);
  
  // Login Form State
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');

  // Register Form State
  const [regData, setRegData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    classId: '5',
    gender: 'Male',
    departmentId: '1',
    designation: 'Senior Teacher',
    relationship: 'Father',
    studentAdmissionNo: '',
    employeeId: ''
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || 'login');
      setSelectedRole(initialRole || 'student');
      setError('');
      setSuccessMsg('');
    }
  }, [isOpen, initialMode, initialRole]);

  if (!isOpen) return null;

  // Handle Manual Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      onClose();
      if (onLoggedIn) onLoggedIn();
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Manual Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (regData.password !== regData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (regData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register({
        role: selectedRole,
        firstName: regData.firstName,
        lastName: regData.lastName,
        username: regData.username,
        email: regData.email,
        password: regData.password,
        phone: regData.phone,
        classId: regData.classId,
        gender: regData.gender,
        departmentId: regData.departmentId,
        designation: regData.designation,
        relationship: regData.relationship,
        studentAdmissionNo: regData.studentAdmissionNo,
        employeeId: regData.employeeId
      });

      setSuccessMsg('Account registered successfully! Opening portal...');
      setTimeout(() => {
        onClose();
        if (onLoggedIn) onLoggedIn();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectDemoRole = (roleKey) => {
    const creds = {
      admin: { u: 'admin', p: 'admin123' },
      teacher: { u: 'teacher', p: 'teacher123' },
      student: { u: 'student', p: 'student123' },
      parent: { u: 'parent', p: 'parent123' },
      accountant: { u: 'accountant', p: 'accountant123' },
      librarian: { u: 'librarian', p: 'librarian123' },
      transport: { u: 'transport', p: 'transport123' }
    };
    if (creds[roleKey]) {
      setUsername(creds[roleKey].u);
      setPassword(creds[roleKey].p);
    }
  };

  const roleConfigs = [
    { key: 'student', label: 'Student', icon: GraduationCap, color: 'border-blue-500 text-blue-700 bg-blue-50' },
    { key: 'teacher', label: 'Teacher', icon: GraduationCap, color: 'border-emerald-500 text-emerald-700 bg-emerald-50' },
    { key: 'parent', label: 'Parent', icon: Users, color: 'border-purple-500 text-purple-700 bg-purple-50' },
    { key: 'accountant', label: 'Accountant', icon: Calculator, color: 'border-amber-500 text-amber-700 bg-amber-50' },
    { key: 'librarian', label: 'Librarian', icon: BookOpen, color: 'border-teal-500 text-teal-700 bg-teal-50' },
    { key: 'transport_mgr', label: 'Transport', icon: Bus, color: 'border-orange-500 text-orange-700 bg-orange-50' },
    { key: 'admin', label: 'Admin', icon: ShieldCheck, color: 'border-indigo-500 text-indigo-700 bg-indigo-50' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-150 my-6 max-h-[92vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white p-6 text-center relative shrink-0">
          <img
            src="/logo.jpg"
            alt="KRPS Logo"
            className="w-14 h-14 rounded-2xl object-contain bg-white p-1 mx-auto mb-2.5 shadow-lg border border-white/20"
          />
          <h2 className="text-lg sm:text-xl font-black tracking-tight">KRPS Institutional Portal Gateway</h2>
          <p className="text-xs text-blue-200 mt-0.5">Individual Manual Registration & Secure Login</p>

          {/* Mode Switcher Tabs */}
          <div className="mt-4 flex rounded-xl bg-slate-800/80 p-1 border border-slate-700 max-w-xs mx-auto text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                mode === 'login'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                mode === 'register'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Account</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {/* 1. MANUAL LOGIN MODE */}
          {mode === 'login' && (
            <div className="space-y-4">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Username or Email Address *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. admin, teacher, or your personal email"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick pre-fill for demo convenience */}
              <div className="pt-3 border-t border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  1-Click Test Credentials
                </span>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {[
                    { k: 'admin', l: 'Admin' },
                    { k: 'teacher', l: 'Teacher' },
                    { k: 'student', l: 'Student' },
                    { k: 'parent', l: 'Parent' },
                    { k: 'accountant', l: 'Accountant' },
                    { k: 'librarian', l: 'Librarian' },
                    { k: 'transport', l: 'Transport' }
                  ].map((r) => (
                    <button
                      key={r.k}
                      type="button"
                      onClick={() => selectDemoRole(r.k)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 rounded-lg text-[10px] font-semibold transition-colors"
                    >
                      {r.l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(''); }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold underline"
                >
                  Need a new account? Register manually here →
                </button>
              </div>
            </div>
          )}

          {/* 2. MANUAL REGISTRATION MODE */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Select Your Portal Role *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {roleConfigs.map((r) => {
                    const Icon = r.icon;
                    const isSelected = selectedRole === r.key;
                    return (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => setSelectedRole(r.key)}
                        className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                          isSelected
                            ? `${r.color} font-bold ring-2 ring-blue-500 shadow-xs`
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[11px]">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={regData.firstName}
                    onChange={(e) => setRegData({ ...regData, firstName: e.target.value })}
                    placeholder="e.g. Diya"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={regData.lastName}
                    onChange={(e) => setRegData({ ...regData, lastName: e.target.value })}
                    placeholder="e.g. Sharma"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* Account Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Username *</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      required
                      value={regData.username}
                      onChange={(e) => setRegData({ ...regData, username: e.target.value })}
                      placeholder="e.g. diyasharma"
                      className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="email"
                      required
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      placeholder="diya@example.com"
                      className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="tel"
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    placeholder="+91 98450 12345"
                    className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* Role-Specific Fields */}
              {selectedRole === 'student' && (
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Enrol into Class</label>
                    <select
                      value={regData.classId}
                      onChange={(e) => setRegData({ ...regData, classId: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-medium"
                    >
                      <option value="1">Grade 6 - Middle School</option>
                      <option value="2">Grade 7 - Middle School</option>
                      <option value="3">Grade 8 - Secondary</option>
                      <option value="4">Grade 9 - Secondary</option>
                      <option value="5">Grade 10 - Secondary (Board)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                    <select
                      value={regData.gender}
                      onChange={(e) => setRegData({ ...regData, gender: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-medium"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedRole === 'teacher' && (
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Academic Department</label>
                    <select
                      value={regData.departmentId}
                      onChange={(e) => setRegData({ ...regData, departmentId: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-medium"
                    >
                      <option value="1">Mathematics</option>
                      <option value="2">Science & Physics</option>
                      <option value="3">English & Languages</option>
                      <option value="4">Social Studies</option>
                      <option value="5">Computer Science & AI</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                    <input
                      type="text"
                      value={regData.designation}
                      onChange={(e) => setRegData({ ...regData, designation: e.target.value })}
                      placeholder="e.g. Senior PGT Teacher"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-medium"
                    />
                  </div>
                </div>
              )}

              {selectedRole === 'parent' && (
                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Relationship</label>
                    <select
                      value={regData.relationship}
                      onChange={(e) => setRegData({ ...regData, relationship: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-medium"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Legal Guardian">Legal Guardian</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Ward Admission No (Optional)</label>
                    <input
                      type="text"
                      value={regData.studentAdmissionNo}
                      onChange={(e) => setRegData({ ...regData, studentAdmissionNo: e.target.value })}
                      placeholder="e.g. KRPS-2024-001"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-medium"
                    />
                  </div>
                </div>
              )}

              {['librarian', 'accountant', 'transport_mgr'].includes(selectedRole) && (
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200">
                  <label className="block font-semibold text-slate-700 mb-1">Staff Employee ID (Optional)</label>
                  <input
                    type="text"
                    value={regData.employeeId}
                    onChange={(e) => setRegData({ ...regData, employeeId: e.target.value })}
                    placeholder="Auto-generated if left blank"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-medium"
                  />
                </div>
              )}

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="password"
                      required
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      placeholder="Min 6 characters"
                      className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="password"
                      required
                      value={regData.confirmPassword}
                      onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                      placeholder="Re-enter password"
                      className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Registering Account...' : 'Create Account & Launch Portal'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold underline"
                >
                  Already registered? Sign in with existing credentials →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
