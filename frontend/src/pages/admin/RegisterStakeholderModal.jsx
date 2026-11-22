import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  X,
  UserCheck,
  GraduationCap,
  Users,
  BookOpen,
  Calculator,
  Bus,
  CheckCircle,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Key,
  Plus
} from 'lucide-react';

export default function RegisterStakeholderModal({
  isOpen,
  onClose,
  initialTab = 'teacher',
  classes = [],
  students = [],
  vehicles = [],
  onSuccess
}) {
  const [activeRole, setActiveRole] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveRole(initialTab || 'teacher');
      setError('');
      setCreatedCredentials(null);
    }
  }, [isOpen, initialTab]);

  // 1. Teacher State
  const [teacher, setTeacher] = useState({
    firstName: '',
    lastName: '',
    gender: 'Female',
    dob: '1988-06-15',
    phone: '',
    email: '',
    employeeId: `EMP-TCH-${Math.floor(1000 + Math.random() * 9000)}`,
    designation: 'Senior PGT Teacher',
    departmentId: '1',
    qualification: 'M.Sc., B.Ed.',
    experienceYears: '5',
    joiningDate: new Date().toISOString().split('T')[0],
    address: 'Whitefield, Bengaluru',
    salaryAmount: '55000',
    password: 'teacher123'
  });

  // 2. Student State
  const [student, setStudent] = useState({
    firstName: '',
    lastName: '',
    admissionNo: `KRPS-2026-${Math.floor(100 + Math.random() * 900)}`,
    gender: 'Male',
    dob: '2012-05-15',
    bloodGroup: 'B+',
    classId: classes[0]?.id?.toString() || '5',
    sectionId: '1',
    rollNo: 16,
    address: 'Bengaluru, Karnataka',
    emergencyContact: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianRelationship: 'Father'
  });

  // 3. Parent / Guardian State
  const [guardian, setGuardian] = useState({
    firstName: '',
    lastName: '',
    relationship: 'Father',
    phone: '',
    email: '',
    occupation: 'Senior Professional / IT Lead',
    annualIncome: '15-20 LPA',
    address: 'Bengaluru, Karnataka',
    studentId: students[0]?.id?.toString() || '',
    studentAdmissionNo: '',
    isPrimary: true,
    canPickup: true,
    password: 'parent123'
  });

  // 4. Librarian State
  const [librarian, setLibrarian] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    employeeId: `EMP-LIB-${Math.floor(1000 + Math.random() * 9000)}`,
    qualification: 'Master of Library & Info Science (M.Lib.Sc.)',
    joiningDate: new Date().toISOString().split('T')[0],
    salaryAmount: '42000',
    password: 'librarian123'
  });

  // 5. Accountant State
  const [accountant, setAccountant] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    employeeId: `EMP-ACC-${Math.floor(1000 + Math.random() * 9000)}`,
    qualification: 'M.Com, Chartered Accountant (CA Inter)',
    designation: 'Senior Institutional Accountant',
    joiningDate: new Date().toISOString().split('T')[0],
    salaryAmount: '48000',
    password: 'accountant123'
  });

  // 6. Transport State (Vehicle or Route or Manager)
  const [transportType, setTransportType] = useState('vehicle'); // 'vehicle' | 'route' | 'manager'
  const [vehicle, setVehicle] = useState({
    registrationNo: `KA-03-MB-${Math.floor(1000 + Math.random() * 9000)}`,
    vehicleType: 'School Bus (40 Seater)',
    capacity: 40,
    driverName: '',
    driverPhone: '',
    licenseNo: `DL-04202100${Math.floor(1000 + Math.random() * 9000)}`,
    helperName: '',
    gpsDeviceId: `GPS-KRPS-BUS-${Math.floor(10 + Math.random() * 90)}`,
    insuranceExpiry: '2027-12-31'
  });

  const [route, setRoute] = useState({
    routeName: '',
    startPoint: 'Campus Main Gate',
    endPoint: '',
    vehicleId: vehicles[0]?.id?.toString() || ''
  });

  const [transportStaff, setTransportStaff] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    employeeId: `EMP-TRN-${Math.floor(1000 + Math.random() * 9000)}`,
    qualification: 'Diploma in Fleet & Logistics Management',
    joiningDate: new Date().toISOString().split('T')[0],
    salaryAmount: '40000',
    password: 'transport123'
  });

  if (!isOpen) return null;

  // Submit Handler for Teacher
  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.registerTeacher(teacher);
      setCreatedCredentials({
        title: 'Teacher Registered Successfully',
        role: 'teacher',
        name: `${teacher.firstName} ${teacher.lastName}`,
        id: teacher.employeeId,
        username: res.credentials?.username,
        email: res.credentials?.email,
        password: res.credentials?.temporaryPassword
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to register teacher');
    } finally {
      setLoading(false);
    }
  };

  // Submit Handler for Student
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.createStudent(student);
      setCreatedCredentials({
        title: 'Student Enrolled Successfully',
        role: 'student',
        name: `${student.firstName} ${student.lastName}`,
        id: student.admissionNo,
        username: res.credentials?.student?.username || student.admissionNo.toLowerCase().replace(/[^a-z0-9]/g, ''),
        email: `${student.admissionNo.toLowerCase().replace(/[^a-z0-9]/g, '')}@krps.edu`,
        password: 'password123',
        extra: res.credentials?.guardian ? `Parent login: ${res.credentials.guardian.username} (password: password123)` : null
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to enrol student');
    } finally {
      setLoading(false);
    }
  };

  // Submit Handler for Parent
  const handleGuardianSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.registerGuardian(guardian);
      setCreatedCredentials({
        title: 'Parent / Guardian Registered Successfully',
        role: 'parent',
        name: `${guardian.firstName} ${guardian.lastName}`,
        id: guardian.phone,
        username: res.credentials?.username,
        email: res.credentials?.email,
        password: res.credentials?.temporaryPassword
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to register parent');
    } finally {
      setLoading(false);
    }
  };

  // Submit Handler for Librarian
  const handleLibrarianSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.registerStaff({
        ...librarian,
        roleType: 'librarian',
        roleName: 'Librarian'
      });
      setCreatedCredentials({
        title: 'Librarian Registered Successfully',
        role: 'librarian',
        name: `${librarian.firstName} ${librarian.lastName}`,
        id: librarian.employeeId,
        username: res.credentials?.username,
        email: res.credentials?.email,
        password: res.credentials?.temporaryPassword
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to register librarian');
    } finally {
      setLoading(false);
    }
  };

  // Submit Handler for Accountant
  const handleAccountantSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.registerStaff({
        ...accountant,
        roleType: 'accountant',
        roleName: 'Accountant'
      });
      setCreatedCredentials({
        title: 'Accountant Registered Successfully',
        role: 'accountant',
        name: `${accountant.firstName} ${accountant.lastName}`,
        id: accountant.employeeId,
        username: res.credentials?.username,
        email: res.credentials?.email,
        password: res.credentials?.temporaryPassword
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to register accountant');
    } finally {
      setLoading(false);
    }
  };

  // Submit Handler for Transport
  const handleTransportSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (transportType === 'vehicle') {
        const res = await api.registerVehicle(vehicle);
        setCreatedCredentials({
          title: 'Transport Vehicle & Driver Registered',
          role: 'transport',
          name: `Driver: ${vehicle.driverName} (Helper: ${vehicle.helperName || 'None'})`,
          id: vehicle.registrationNo,
          username: `Vehicle: ${vehicle.registrationNo}`,
          email: `Phone: ${vehicle.driverPhone}`,
          password: `Licence: ${vehicle.licenseNo}`
        });
      } else if (transportType === 'route') {
        const res = await api.registerRoute(route);
        setCreatedCredentials({
          title: 'Campus Bus Route Created',
          role: 'transport',
          name: route.routeName,
          id: `Stops: ${route.startPoint} ➔ ${route.endPoint}`,
          username: `Route: ${route.routeName}`,
          email: `Start: ${route.startPoint}`,
          password: `End: ${route.endPoint}`
        });
      } else {
        const res = await api.registerStaff({
          ...transportStaff,
          roleType: 'transport_mgr',
          roleName: 'Transport Manager'
        });
        setCreatedCredentials({
          title: 'Transport Manager Registered Successfully',
          role: 'transport_mgr',
          name: `${transportStaff.firstName} ${transportStaff.lastName}`,
          id: transportStaff.employeeId,
          username: res.credentials?.username,
          email: res.credentials?.email,
          password: res.credentials?.temporaryPassword
        });
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to register transport details');
    } finally {
      setLoading(false);
    }
  };

  const copyCreds = () => {
    if (!createdCredentials) return;
    const text = `KRPS Portal Credentials:\nRole: ${createdCredentials.role}\nName: ${createdCredentials.name}\nUsername: ${createdCredentials.username}\nPassword: ${createdCredentials.password}\nLogin URL: http://localhost:5050`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setCreatedCredentials(null);
    setError('');
  };

  const roleMeta = {
    teacher: {
      title: 'Teacher Registration',
      subtitle: 'Register faculty member, assign academic department & provision institutional credentials',
      icon: GraduationCap,
      badgeColor: 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
    },
    student: {
      title: 'Student Enrolment & Registration',
      subtitle: 'Enrol candidate into class & section, assign roll number & provision student credentials',
      icon: UserCheck,
      badgeColor: 'bg-blue-500/20 border-blue-400/30 text-blue-300'
    },
    guardian: {
      title: 'Parent & Guardian Registration',
      subtitle: 'Register parent account & link to existing enrolled student wards',
      icon: Users,
      badgeColor: 'bg-purple-500/20 border-purple-400/30 text-purple-300'
    },
    librarian: {
      title: 'Librarian Staff Registration',
      subtitle: 'Register library administrative staff & generate circulation desk credentials',
      icon: BookOpen,
      badgeColor: 'bg-teal-500/20 border-teal-400/30 text-teal-300'
    },
    accountant: {
      title: 'Accountant & Finance Registration',
      subtitle: 'Register finance officer & generate billing and invoice portal credentials',
      icon: Calculator,
      badgeColor: 'bg-amber-500/20 border-amber-400/30 text-amber-300'
    },
    transport: {
      title: 'Transport Fleet & Driver Registration',
      subtitle: 'Register school bus, driver licence, helper & GPS route tracking details',
      icon: Bus,
      badgeColor: 'bg-orange-500/20 border-orange-400/30 text-orange-300'
    }
  };

  const currentMeta = roleMeta[activeRole] || roleMeta.teacher;
  const MetaIcon = currentMeta.icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header - Dedicated strictly to the selected role */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-5 px-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-inner ${currentMeta.badgeColor}`}>
              <MetaIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">{currentMeta.title}</h2>
              <p className="text-xs text-blue-200 font-medium">{currentMeta.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <span className="font-bold">Error:</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success Credentials Card */}
          {createdCredentials ? (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-black text-emerald-950">{createdCredentials.title}</h3>
                <p className="text-xs text-emerald-800 font-medium mt-0.5">
                  Institutional record created and verified in KRPS PostgreSQL database.
                </p>
              </div>

              {/* Printable / Copyable Credentials Slip */}
              <div className="bg-white rounded-2xl p-4 border border-emerald-200 max-w-md mx-auto text-left shadow-sm space-y-2">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Credentials Slip</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px] capitalize">
                    {createdCredentials.role}
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="flex justify-between"><strong className="text-slate-600">Full Name:</strong> <span className="font-bold text-slate-900">{createdCredentials.name}</span></p>
                  <p className="flex justify-between"><strong className="text-slate-600">ID / Reg No:</strong> <span className="font-mono font-bold text-blue-900">{createdCredentials.id}</span></p>
                  <p className="flex justify-between"><strong className="text-slate-600">Portal Username:</strong> <span className="font-mono font-bold text-emerald-800">{createdCredentials.username}</span></p>
                  <p className="flex justify-between"><strong className="text-slate-600">Password / Key:</strong> <span className="font-mono font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded">{createdCredentials.password}</span></p>
                  {createdCredentials.extra && (
                    <p className="pt-1 text-[11px] text-slate-500 border-t italic">{createdCredentials.extra}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={copyCreds}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Credentials Copied!' : 'Copy Credentials'}</span>
                </button>
                <button
                  onClick={resetForm}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Register Another
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: TEACHER REGISTRATION FORM */}
              {activeRole === 'teacher' && (
                <form onSubmit={handleTeacherSubmit} className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl flex items-center gap-2 text-blue-900 font-medium">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>Registers teacher profile, assigns department & issues login credentials.</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={teacher.firstName}
                        onChange={(e) => setTeacher({ ...teacher, firstName: e.target.value })}
                        placeholder="e.g. Radhika"
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={teacher.lastName}
                        onChange={(e) => setTeacher({ ...teacher, lastName: e.target.value })}
                        placeholder="e.g. Rao"
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Gender *</label>
                      <select
                        value={teacher.gender}
                        onChange={(e) => setTeacher({ ...teacher, gender: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Employee ID *</label>
                      <input
                        type="text"
                        required
                        value={teacher.employeeId}
                        onChange={(e) => setTeacher({ ...teacher, employeeId: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono font-bold text-blue-900"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        value={teacher.phone}
                        onChange={(e) => setTeacher({ ...teacher, phone: e.target.value })}
                        placeholder="+91 98450..."
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Email (Institutional) *</label>
                      <input
                        type="email"
                        required
                        value={teacher.email}
                        onChange={(e) => setTeacher({ ...teacher, email: e.target.value })}
                        placeholder="name@krps.edu"
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Designation</label>
                      <select
                        value={teacher.designation}
                        onChange={(e) => setTeacher({ ...teacher, designation: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      >
                        <option value="Senior PGT Teacher">Senior PGT Teacher (Grade 11-12)</option>
                        <option value="TGT Teacher">TGT Teacher (Grade 6-10)</option>
                        <option value="Primary Faculty">Primary Faculty (Grade 1-5)</option>
                        <option value="Head of Department">Head of Department (HOD)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Department</label>
                      <select
                        value={teacher.departmentId}
                        onChange={(e) => setTeacher({ ...teacher, departmentId: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      >
                        <option value="1">Science & Technology</option>
                        <option value="2">Mathematics</option>
                        <option value="3">Humanities & Languages</option>
                        <option value="4">Administration & Finance</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Qualification</label>
                      <input
                        type="text"
                        value={teacher.qualification}
                        onChange={(e) => setTeacher({ ...teacher, qualification: e.target.value })}
                        placeholder="e.g. M.Sc. Physics, B.Ed."
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Experience (Years)</label>
                      <input
                        type="number"
                        min="0"
                        value={teacher.experienceYears}
                        onChange={(e) => setTeacher({ ...teacher, experienceYears: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Basic Monthly Salary (₹)</label>
                      <input
                        type="number"
                        value={teacher.salaryAmount}
                        onChange={(e) => setTeacher({ ...teacher, salaryAmount: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Portal Initial Password</label>
                      <input
                        type="text"
                        value={teacher.password}
                        onChange={(e) => setTeacher({ ...teacher, password: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50"
                    >
                      {loading ? 'Registering Teacher...' : 'Confirm & Register Teacher'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: STUDENT ENROLMENT FORM */}
              {activeRole === 'student' && (
                <form onSubmit={handleStudentSubmit} className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl flex items-center gap-2 text-blue-900 font-medium">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>Enrols candidate into class/section, creates student portal user & links parent.</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={student.firstName}
                        onChange={(e) => setStudent({ ...student, firstName: e.target.value })}
                        placeholder="e.g. Diya"
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={student.lastName}
                        onChange={(e) => setStudent({ ...student, lastName: e.target.value })}
                        placeholder="e.g. Sen"
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Admission Number *</label>
                      <input
                        type="text"
                        required
                        value={student.admissionNo}
                        onChange={(e) => setStudent({ ...student, admissionNo: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono font-bold text-blue-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Gender</label>
                      <select
                        value={student.gender}
                        onChange={(e) => setStudent({ ...student, gender: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Date of Birth *</label>
                      <input
                        type="date"
                        required
                        value={student.dob}
                        onChange={(e) => setStudent({ ...student, dob: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Blood Group</label>
                      <select
                        value={student.bloodGroup}
                        onChange={(e) => setStudent({ ...student, bloodGroup: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Roll No *</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={student.rollNo}
                        onChange={(e) => setStudent({ ...student, rollNo: parseInt(e.target.value) || 1 })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Enrol into Class *</label>
                      <select
                        required
                        value={student.classId}
                        onChange={(e) => setStudent({ ...student, classId: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      >
                        {classes.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Section</label>
                      <select
                        value={student.sectionId}
                        onChange={(e) => setStudent({ ...student, sectionId: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      >
                        <option value="1">Section A</option>
                        <option value="2">Section B</option>
                      </select>
                    </div>
                  </div>

                  {/* Parent Details section */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <span className="font-bold text-slate-800 block text-xs">Parent / Legal Guardian Information</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="font-semibold block mb-1">Guardian Name</label>
                        <input
                          type="text"
                          value={student.guardianName}
                          onChange={(e) => setStudent({ ...student, guardianName: e.target.value })}
                          placeholder="e.g. Alok Sen"
                          className="w-full p-2.5 border rounded-xl bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">Relationship</label>
                        <select
                          value={student.guardianRelationship}
                          onChange={(e) => setStudent({ ...student, guardianRelationship: e.target.value })}
                          className="w-full p-2.5 border rounded-xl bg-white"
                        >
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Legal Guardian">Legal Guardian</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">Guardian Phone *</label>
                        <input
                          type="tel"
                          value={student.guardianPhone}
                          onChange={(e) => setStudent({ ...student, guardianPhone: e.target.value })}
                          placeholder="+91 98450..."
                          className="w-full p-2.5 border rounded-xl bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50"
                    >
                      {loading ? 'Enrolling Student...' : 'Enrol New Student Record'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: PARENT / GUARDIAN REGISTRATION */}
              {activeRole === 'guardian' && (
                <form onSubmit={handleGuardianSubmit} className="space-y-4">
                  <div className="bg-purple-50 border border-purple-200 p-3 rounded-2xl flex items-center gap-2 text-purple-900 font-medium">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Registers parent portal account and links to their enrolled child/children.</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={guardian.firstName}
                        onChange={(e) => setGuardian({ ...guardian, firstName: e.target.value })}
                        placeholder="e.g. Meenakshi"
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={guardian.lastName}
                        onChange={(e) => setGuardian({ ...guardian, lastName: e.target.value })}
                        placeholder="e.g. Iyer"
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Relationship *</label>
                      <select
                        value={guardian.relationship}
                        onChange={(e) => setGuardian({ ...guardian, relationship: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      >
                        <option value="Mother">Mother</option>
                        <option value="Father">Father</option>
                        <option value="Legal Guardian">Legal Guardian</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Phone Number (Login ID) *</label>
                      <input
                        type="tel"
                        required
                        value={guardian.phone}
                        onChange={(e) => setGuardian({ ...guardian, phone: e.target.value })}
                        placeholder="+91 98450..."
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={guardian.email}
                        onChange={(e) => setGuardian({ ...guardian, email: e.target.value })}
                        placeholder="name@email.com"
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Occupation</label>
                      <input
                        type="text"
                        value={guardian.occupation}
                        onChange={(e) => setGuardian({ ...guardian, occupation: e.target.value })}
                        placeholder="e.g. Software Architect"
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Link to Enrolled Student *</label>
                      <select
                        value={guardian.studentId}
                        onChange={(e) => setGuardian({ ...guardian, studentId: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-medium"
                      >
                        <option value="">-- Select Child to Link --</option>
                        {students.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.first_name} {s.last_name} ({s.admission_no} - {s.class_name || 'Class 10'})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Residential Address</label>
                    <input
                      type="text"
                      value={guardian.address}
                      onChange={(e) => setGuardian({ ...guardian, address: e.target.value })}
                      placeholder="e.g. Prestige Ozone, Whitefield, Bengaluru"
                      className="w-full p-2.5 border rounded-xl bg-slate-50"
                    />
                  </div>

                  <div className="pt-4 border-t flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50"
                    >
                      {loading ? 'Registering Parent...' : 'Register Parent & Issue Access'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 4: LIBRARIAN REGISTRATION */}
              {activeRole === 'librarian' && (
                <form onSubmit={handleLibrarianSubmit} className="space-y-4">
                  <div className="bg-teal-50 border border-teal-200 p-3 rounded-2xl flex items-center gap-2 text-teal-900 font-medium">
                    <BookOpen className="w-4 h-4 text-teal-600" />
                    <span>Registers staff profile, assigns library oversight & provisions librarian portal access.</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={librarian.firstName}
                        onChange={(e) => setLibrarian({ ...librarian, firstName: e.target.value })}
                        placeholder="e.g. Shalini"
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={librarian.lastName}
                        onChange={(e) => setLibrarian({ ...librarian, lastName: e.target.value })}
                        placeholder="e.g. Varma"
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Employee ID *</label>
                      <input
                        type="text"
                        required
                        value={librarian.employeeId}
                        onChange={(e) => setLibrarian({ ...librarian, employeeId: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono font-bold text-teal-900"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={librarian.phone}
                        onChange={(e) => setLibrarian({ ...librarian, phone: e.target.value })}
                        placeholder="+91 98450..."
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Institutional Email *</label>
                      <input
                        type="email"
                        required
                        value={librarian.email}
                        onChange={(e) => setLibrarian({ ...librarian, email: e.target.value })}
                        placeholder="librarian.name@krps.edu"
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Professional Qualification</label>
                      <input
                        type="text"
                        value={librarian.qualification}
                        onChange={(e) => setLibrarian({ ...librarian, qualification: e.target.value })}
                        placeholder="M.Lib.Sc."
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Portal Initial Password</label>
                      <input
                        type="text"
                        value={librarian.password}
                        onChange={(e) => setLibrarian({ ...librarian, password: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50"
                    >
                      {loading ? 'Registering Librarian...' : 'Register Librarian'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 5: ACCOUNTANT REGISTRATION */}
              {activeRole === 'accountant' && (
                <form onSubmit={handleAccountantSubmit} className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center gap-2 text-amber-900 font-medium">
                    <Calculator className="w-4 h-4 text-amber-600" />
                    <span>Registers finance staff, fee management authority & Accountant portal credentials.</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={accountant.firstName}
                        onChange={(e) => setAccountant({ ...accountant, firstName: e.target.value })}
                        placeholder="e.g. Sunil"
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={accountant.lastName}
                        onChange={(e) => setAccountant({ ...accountant, lastName: e.target.value })}
                        placeholder="e.g. Kulkarni"
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Employee ID *</label>
                      <input
                        type="text"
                        required
                        value={accountant.employeeId}
                        onChange={(e) => setAccountant({ ...accountant, employeeId: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono font-bold text-amber-900"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={accountant.phone}
                        onChange={(e) => setAccountant({ ...accountant, phone: e.target.value })}
                        placeholder="+91 98450..."
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={accountant.email}
                        onChange={(e) => setAccountant({ ...accountant, email: e.target.value })}
                        placeholder="accounts.name@krps.edu"
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Professional Qualification</label>
                      <input
                        type="text"
                        value={accountant.qualification}
                        onChange={(e) => setAccountant({ ...accountant, qualification: e.target.value })}
                        placeholder="M.Com, CA Inter, Tally ERP"
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Portal Initial Password</label>
                      <input
                        type="text"
                        value={accountant.password}
                        onChange={(e) => setAccountant({ ...accountant, password: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50"
                    >
                      {loading ? 'Registering Accountant...' : 'Register Accountant'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 6: TRANSPORT DETAILS REGISTRATION */}
              {activeRole === 'transport' && (
                <form onSubmit={handleTransportSubmit} className="space-y-4">
                  {/* Transport Subtype Toggle */}
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setTransportType('vehicle')}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-all ${
                        transportType === 'vehicle' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🚌 Register Bus & Driver
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransportType('route')}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-all ${
                        transportType === 'route' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🚏 Create Bus Route
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransportType('manager')}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-all ${
                        transportType === 'manager' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      👤 Transport Staff Manager
                    </button>
                  </div>

                  {transportType === 'vehicle' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-semibold block mb-1">Registration No *</label>
                          <input
                            type="text"
                            required
                            value={vehicle.registrationNo}
                            onChange={(e) => setVehicle({ ...vehicle, registrationNo: e.target.value })}
                            placeholder="KA-03-MB-4590"
                            className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono font-bold text-orange-950 uppercase"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1">Vehicle Type</label>
                          <select
                            value={vehicle.vehicleType}
                            onChange={(e) => setVehicle({ ...vehicle, vehicleType: e.target.value })}
                            className="w-full p-2.5 border rounded-xl bg-slate-50"
                          >
                            <option value="School Bus (40 Seater)">School Bus (40 Seater)</option>
                            <option value="Mini Bus (25 Seater)">Mini Bus (25 Seater)</option>
                            <option value="Campus Van (14 Seater)">Campus Van (14 Seater)</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-semibold block mb-1">Seating Capacity</label>
                          <input
                            type="number"
                            min="10"
                            max="60"
                            value={vehicle.capacity}
                            onChange={(e) => setVehicle({ ...vehicle, capacity: parseInt(e.target.value) || 40 })}
                            className="w-full p-2.5 border rounded-xl bg-slate-50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold block mb-1">Assigned Driver Name *</label>
                          <input
                            type="text"
                            required
                            value={vehicle.driverName}
                            onChange={(e) => setVehicle({ ...vehicle, driverName: e.target.value })}
                            placeholder="e.g. Gururaj Patil"
                            className="w-full p-2.5 border rounded-xl bg-slate-50"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1">Driver Contact Phone *</label>
                          <input
                            type="tel"
                            required
                            value={vehicle.driverPhone}
                            onChange={(e) => setVehicle({ ...vehicle, driverPhone: e.target.value })}
                            placeholder="+91 99887..."
                            className="w-full p-2.5 border rounded-xl bg-slate-50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-semibold block mb-1">Driver Driving Licence No</label>
                          <input
                            type="text"
                            value={vehicle.licenseNo}
                            onChange={(e) => setVehicle({ ...vehicle, licenseNo: e.target.value })}
                            placeholder="DL-0420..."
                            className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1">Helper / Attendant Name</label>
                          <input
                            type="text"
                            value={vehicle.helperName}
                            onChange={(e) => setVehicle({ ...vehicle, helperName: e.target.value })}
                            placeholder="e.g. Ramesh K."
                            className="w-full p-2.5 border rounded-xl bg-slate-50"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1">GPS Device Tracker ID</label>
                          <input
                            type="text"
                            value={vehicle.gpsDeviceId}
                            onChange={(e) => setVehicle({ ...vehicle, gpsDeviceId: e.target.value })}
                            placeholder="GPS-KRPS-BUS-05"
                            className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {transportType === 'route' && (
                    <div className="space-y-3">
                      <div>
                        <label className="font-semibold block mb-1">Route Name *</label>
                        <input
                          type="text"
                          required
                          value={route.routeName}
                          onChange={(e) => setRoute({ ...route, routeName: e.target.value })}
                          placeholder="e.g. Route 4 - Indiranagar to Campus"
                          className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold block mb-1">Starting Point *</label>
                          <input
                            type="text"
                            required
                            value={route.startPoint}
                            onChange={(e) => setRoute({ ...route, startPoint: e.target.value })}
                            placeholder="e.g. Indiranagar BDA Complex"
                            className="w-full p-2.5 border rounded-xl bg-slate-50"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1">Ending Point / Destination *</label>
                          <input
                            type="text"
                            required
                            value={route.endPoint}
                            onChange={(e) => setRoute({ ...route, endPoint: e.target.value })}
                            placeholder="e.g. KRPS Campus Gate 2"
                            className="w-full p-2.5 border rounded-xl bg-slate-50"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">Assign Fleet Vehicle</label>
                        <select
                          value={route.vehicleId}
                          onChange={(e) => setRoute({ ...route, vehicleId: e.target.value })}
                          className="w-full p-2.5 border rounded-xl bg-slate-50"
                        >
                          <option value="">-- Select Available Vehicle --</option>
                          {vehicles.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.registration_no} ({v.vehicle_type} - Driver: {v.driver_name})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {transportType === 'manager' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold block mb-1">First Name *</label>
                          <input
                            type="text"
                            required
                            value={transportStaff.firstName}
                            onChange={(e) => setTransportStaff({ ...transportStaff, firstName: e.target.value })}
                            placeholder="e.g. Rajesh"
                            className="w-full p-2.5 border rounded-xl bg-slate-50"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1">Last Name *</label>
                          <input
                            type="text"
                            required
                            value={transportStaff.lastName}
                            onChange={(e) => setTransportStaff({ ...transportStaff, lastName: e.target.value })}
                            placeholder="e.g. Nayak"
                            className="w-full p-2.5 border rounded-xl bg-slate-50"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-semibold block mb-1">Employee ID *</label>
                          <input
                            type="text"
                            required
                            value={transportStaff.employeeId}
                            onChange={(e) => setTransportStaff({ ...transportStaff, employeeId: e.target.value })}
                            className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono font-bold text-orange-950"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1">Phone *</label>
                          <input
                            type="tel"
                            required
                            value={transportStaff.phone}
                            onChange={(e) => setTransportStaff({ ...transportStaff, phone: e.target.value })}
                            placeholder="+91 98450..."
                            className="w-full p-2.5 border rounded-xl bg-slate-50"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1">Email *</label>
                          <input
                            type="email"
                            required
                            value={transportStaff.email}
                            onChange={(e) => setTransportStaff({ ...transportStaff, email: e.target.value })}
                            placeholder="transport@krps.edu"
                            className="w-full p-2.5 border rounded-xl bg-slate-50"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50"
                    >
                      {loading ? 'Saving Transport Record...' : 'Save & Register Transport Details'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
