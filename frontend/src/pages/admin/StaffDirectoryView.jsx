import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  BookOpen,
  Calculator,
  Bus,
  Search,
  Plus,
  Phone,
  Mail,
  Award,
  Calendar,
  Building,
  Key,
  CreditCard,
  MapPin,
  CheckCircle2,
  Pencil,
  Trash2,
  AlertCircle
} from 'lucide-react';
import EditTeacherModal from './EditTeacherModal';
import EditStaffModal from './EditStaffModal';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import { api } from '../../services/api';

export default function StaffDirectoryView({
  directory,
  onOpenRegister,
  onRefresh
}) {
  const [activeTab, setActiveTab] = useState('teachers');
  const [search, setSearch] = useState('');

  // Modals state
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [deletingTeacher, setDeletingTeacher] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [deletingStaff, setDeletingStaff] = useState(null);
  const [deletingGuardian, setDeletingGuardian] = useState(null);
  const [deletingVehicle, setDeletingVehicle] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const teachers = directory?.teachers || [];
  const staff = directory?.staff || [];
  const guardians = directory?.guardians || [];
  const vehicles = directory?.vehicles || [];
  const routes = directory?.routes || [];

  // Filtered lists
  const filteredTeachers = teachers.filter((t) =>
    `${t.first_name} ${t.last_name} ${t.employee_id} ${t.designation} ${t.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredStaff = staff.filter((s) =>
    `${s.first_name} ${s.last_name} ${s.employee_id} ${s.role_name} ${s.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredGuardians = guardians.filter((g) =>
    `${g.first_name} ${g.last_name} ${g.phone} ${g.email} ${g.occupation}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredVehicles = vehicles.filter((v) =>
    `${v.registration_no} ${v.driver_name} ${v.driver_phone} ${v.vehicle_type}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: '', message: '' });
    }, 4000);
  };

  // Delete Handlers
  const handleConfirmDeleteTeacher = async () => {
    if (!deletingTeacher) return;
    setIsDeleting(true);
    try {
      const res = await api.deleteTeacher(deletingTeacher.id);
      showFeedback('success', res.message || 'Teacher removed successfully');
      setDeletingTeacher(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to delete teacher:', err);
      showFeedback('error', err.message || 'Failed to delete teacher');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmDeleteStaff = async () => {
    if (!deletingStaff) return;
    setIsDeleting(true);
    try {
      const res = await api.deleteStaff(deletingStaff.id);
      showFeedback('success', res.message || 'Staff member removed successfully');
      setDeletingStaff(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to delete staff:', err);
      showFeedback('error', err.message || 'Failed to delete staff member');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmDeleteGuardian = async () => {
    if (!deletingGuardian) return;
    setIsDeleting(true);
    try {
      const res = await api.deleteGuardian(deletingGuardian.id);
      showFeedback('success', res.message || 'Guardian removed successfully');
      setDeletingGuardian(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to delete guardian:', err);
      showFeedback('error', err.message || 'Failed to delete guardian');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmDeleteVehicle = async () => {
    if (!deletingVehicle) return;
    setIsDeleting(true);
    try {
      const res = await api.deleteVehicle(deletingVehicle.id);
      showFeedback('success', res.message || 'Vehicle removed successfully');
      setDeletingVehicle(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to delete vehicle:', err);
      showFeedback('error', err.message || 'Failed to delete vehicle');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback Notification */}
      {feedback.message && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
            feedback.type === 'error'
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback({ type: '', message: '' })} className="opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Staff & Institutional Stakeholders Directory</h2>
          <p className="text-xs text-slate-500">
            CRUD Directory Management: Register, View, Edit, and Delete institutional teachers and staff
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenRegister('teacher')}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>+ Teacher</span>
          </button>
          <button
            onClick={() => onOpenRegister('guardian')}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>+ Parent</span>
          </button>
          <button
            onClick={() => onOpenRegister('librarian')}
            className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>+ Librarian</span>
          </button>
          <button
            onClick={() => onOpenRegister('accountant')}
            className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>+ Accountant</span>
          </button>
          <button
            onClick={() => onOpenRegister('transport')}
            className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>+ Transport</span>
          </button>
        </div>
      </div>

      {/* Directory Sub-tabs & Search */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'teachers'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Faculty & Teachers ({teachers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'staff'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Librarians & Accountants ({staff.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('parents')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'parents'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Parents & Guardians ({guardians.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('transport')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'transport'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Transport Fleet & Drivers ({vehicles.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search directory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs w-60 focus:bg-white"
          />
        </div>
      </div>

      {/* 1. TEACHERS DIRECTORY TAB */}
      {activeTab === 'teachers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeachers.map((t) => (
            <div
              key={t.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow text-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{t.first_name} {t.last_name}</h3>
                    <span className="text-blue-700 font-semibold">{t.designation}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                    {t.employee_id}
                  </span>
                </div>

                <div className="space-y-1 text-slate-600 pt-2 border-t border-slate-100 text-[11px] mt-2">
                  <p className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Dept: <strong>{t.department_name || 'Academics'}</strong></span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>Qual: <strong>{t.qualification || 'M.Sc., B.Ed.'}</strong> ({t.experience_years || 3} yrs exp)</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{t.phone}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-blue-600 truncate">{t.email}</span>
                  </p>
                  {t.salary_amount && (
                    <p className="flex items-center gap-1.5 text-slate-500">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      <span>Salary: <strong>₹{parseFloat(t.salary_amount).toLocaleString('en-IN')}/mo</strong></span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Toolbar for Teacher: Edit, Delete, Status */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditingTeacher(t)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl font-bold flex items-center gap-1.5 transition-colors border border-slate-200/60"
                    title="Edit Teacher Record"
                  >
                    <Pencil className="w-3.5 h-3.5 text-blue-600" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeletingTeacher(t)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 rounded-xl font-bold flex items-center gap-1.5 transition-colors border border-slate-200/60"
                    title="Delete Teacher"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Delete</span>
                  </button>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                  t.status === 'active'
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-amber-700 bg-amber-50'
                }`}>
                  {t.status || 'Active'}
                </span>
              </div>
            </div>
          ))}

          {filteredTeachers.length === 0 && (
            <div className="col-span-full p-10 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs space-y-2">
              <GraduationCap className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-600">No teachers found in directory</p>
              <p className="text-[11px] text-slate-400">Click "+ Teacher" above to register faculty members into the institution.</p>
            </div>
          )}
        </div>
      )}

      {/* 2. STAFF DIRECTORY TAB (Librarians & Accountants) */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((s) => (
            <div
              key={s.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow text-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{s.first_name} {s.last_name}</h3>
                    <span className={`font-bold text-xs ${
                      s.role_name === 'Librarian' ? 'text-teal-700' : 'text-amber-700'
                    }`}>
                      {s.role_name}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-800">
                    {s.employee_id}
                  </span>
                </div>

                <div className="space-y-1 text-slate-600 pt-2 border-t border-slate-100 text-[11px] mt-2">
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{s.phone}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-blue-600 truncate">{s.email}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Dept: <strong>{s.department_name || 'Administration & Support'}</strong></span>
                  </p>
                  {s.salary_amount && (
                    <p className="flex items-center gap-1.5 text-slate-500">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      <span>Salary: <strong>₹{parseFloat(s.salary_amount).toLocaleString('en-IN')}/mo</strong></span>
                    </p>
                  )}
                </div>
              </div>

              {/* Actions for Staff */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditingStaff(s)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 rounded-xl font-bold flex items-center gap-1.5 transition-colors border border-slate-200/60"
                    title="Edit Staff Member"
                  >
                    <Pencil className="w-3.5 h-3.5 text-teal-600" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeletingStaff(s)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 rounded-xl font-bold flex items-center gap-1.5 transition-colors border border-slate-200/60"
                    title="Delete Staff Member"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Delete</span>
                  </button>
                </div>
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded capitalize">
                  {s.status || 'Active'}
                </span>
              </div>
            </div>
          ))}

          {filteredStaff.length === 0 && (
            <div className="col-span-full p-10 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs space-y-2">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-600">No support staff registered</p>
              <p className="text-[11px] text-slate-400">Use "+ Librarian" or "+ Accountant" buttons above to register staff.</p>
            </div>
          )}
        </div>
      )}

      {/* 3. PARENTS & GUARDIANS TAB */}
      {activeTab === 'parents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGuardians.map((g) => (
            <div
              key={g.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow text-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{g.first_name} {g.last_name}</h3>
                    <span className="text-purple-700 font-semibold">{g.relationship || 'Parent'}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                    {g.occupation || 'Professional'}
                  </span>
                </div>

                <div className="space-y-1 text-slate-600 pt-2 border-t border-slate-100 text-[11px] mt-2">
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{g.phone}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-blue-600 truncate">{g.email}</span>
                  </p>
                </div>

                {/* Linked Children */}
                <div className="pt-2 border-t border-slate-100 mt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Linked Wards / Students:</span>
                  {g.children && g.children.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {g.children.map((ch, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-900 px-2 py-0.5 rounded-lg border border-blue-200 font-semibold text-[10px] flex items-center gap-1">
                          <span>🎒</span>
                          <span>{ch.name} ({ch.admission_no})</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">No linked students</span>
                  )}
                </div>
              </div>

              {/* Action Toolbar for Guardian */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setDeletingGuardian(g)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 rounded-xl font-bold flex items-center gap-1.5 transition-colors border border-slate-200/60"
                  title="Delete Guardian Record"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  <span>Delete Guardian</span>
                </button>
                <span className="text-[10px] text-slate-400">Linked Account</span>
              </div>
            </div>
          ))}

          {filteredGuardians.length === 0 && (
            <div className="col-span-full p-10 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-600">No guardian records registered</p>
              <p className="text-[11px] text-slate-400">Click "+ Parent" above to register student guardians.</p>
            </div>
          )}
        </div>
      )}

      {/* 4. TRANSPORT FLEET & DRIVERS TAB */}
      {activeTab === 'transport' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVehicles.map((v) => (
              <div
                key={v.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow text-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-mono font-black text-sm text-blue-950">{v.registration_no}</h3>
                      <span className="text-slate-500">{v.vehicle_type} • {v.capacity} seats</span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[10px]">
                      {v.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600 mt-2">
                    <p>Driver: <strong className="text-slate-900">{v.driver_name}</strong></p>
                    <p>Contact: <span className="font-mono font-bold text-blue-800">{v.driver_phone}</span></p>
                    <p>Licence: <span className="font-mono text-[10px]">{v.license_no}</span></p>
                    <p>Helper: <span>{v.helper_name || 'None'}</span></p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 mt-2">
                    <span>GPS: <strong className="font-mono text-slate-600">{v.gps_device_id || 'GPS-ACTIVE'}</strong></span>
                    <span>Insurance: <strong className="text-slate-600">{v.insurance_expiry ? new Date(v.insurance_expiry).toLocaleDateString('en-GB') : '2027'}</strong></span>
                  </div>
                </div>

                {/* Actions for Vehicle */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setDeletingVehicle(v)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 rounded-xl font-bold flex items-center gap-1.5 transition-colors border border-slate-200/60"
                    title="Delete Vehicle"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Delete Vehicle</span>
                  </button>
                  <span className="text-[10px] font-bold text-slate-500 font-mono">
                    Routes: {v.routes_count || 0}
                  </span>
                </div>
              </div>
            ))}

            {filteredVehicles.length === 0 && (
              <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                No transport vehicles registered in directory.
              </div>
            )}
          </div>

          {/* Active Bus Routes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Campus Bus Routes ({routes.length})</h3>
                <p className="text-[11px] text-slate-500">Pick-up and drop routes linked to registered fleet</p>
              </div>
              <button
                onClick={() => onOpenRegister('transport')}
                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Create Route</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {routes.map((r) => (
                <div key={r.id} className="p-3.5 border rounded-xl bg-slate-50 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <strong className="text-slate-900 font-bold text-xs">{r.route_name}</strong>
                    <span className="font-mono text-[10px] text-blue-700 font-bold">{r.registration_no || 'Unassigned'}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    {r.start_point} ➔ {r.end_point}
                  </p>
                  {r.driver_name && (
                    <p className="text-[10px] text-slate-400">
                      Driver: {r.driver_name} ({r.driver_phone})
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {editingTeacher && (
        <EditTeacherModal
          isOpen={!!editingTeacher}
          teacher={editingTeacher}
          onClose={() => setEditingTeacher(null)}
          onUpdated={(updated) => {
            showFeedback('success', `Teacher ${updated.first_name} ${updated.last_name} updated successfully!`);
            if (onRefresh) onRefresh();
          }}
        />
      )}

      {/* Delete Teacher Confirmation Modal */}
      {deletingTeacher && (
        <DeleteConfirmModal
          isOpen={!!deletingTeacher}
          title="Delete Teacher Confirmation"
          entityName={`${deletingTeacher.first_name} ${deletingTeacher.last_name}`}
          entityType="Faculty Teacher"
          entityDetails={{
            id: deletingTeacher.employee_id,
            subtitle: `${deletingTeacher.designation} • ${deletingTeacher.department_name || 'Academics'}`,
            meta: `Email: ${deletingTeacher.email} | Phone: ${deletingTeacher.phone}`
          }}
          warningText="Deleting this teacher will permanently revoke their portal login access, clear their assigned timetable periods, and remove active subject teaching allocations. This action cannot be undone."
          confirmButtonText="Delete Teacher"
          isDeleting={isDeleting}
          onConfirm={handleConfirmDeleteTeacher}
          onClose={() => setDeletingTeacher(null)}
        />
      )}

      {/* Edit Staff Modal */}
      {editingStaff && (
        <EditStaffModal
          isOpen={!!editingStaff}
          staff={editingStaff}
          onClose={() => setEditingStaff(null)}
          onUpdated={(updated) => {
            showFeedback('success', `Staff member ${updated.first_name} ${updated.last_name} updated successfully!`);
            if (onRefresh) onRefresh();
          }}
        />
      )}

      {/* Delete Staff Confirmation Modal */}
      {deletingStaff && (
        <DeleteConfirmModal
          isOpen={!!deletingStaff}
          title="Delete Staff Member Confirmation"
          entityName={`${deletingStaff.first_name} ${deletingStaff.last_name}`}
          entityType="Support Staff"
          entityDetails={{
            id: deletingStaff.employee_id,
            subtitle: `${deletingStaff.role_name} • ${deletingStaff.department_name || 'Support'}`,
            meta: `Email: ${deletingStaff.email} | Phone: ${deletingStaff.phone}`
          }}
          warningText="Deleting this staff member will permanently delete their account and revoke login access."
          confirmButtonText="Delete Staff Member"
          isDeleting={isDeleting}
          onConfirm={handleConfirmDeleteStaff}
          onClose={() => setDeletingStaff(null)}
        />
      )}

      {/* Delete Guardian Confirmation Modal */}
      {deletingGuardian && (
        <DeleteConfirmModal
          isOpen={!!deletingGuardian}
          title="Delete Guardian Confirmation"
          entityName={`${deletingGuardian.first_name} ${deletingGuardian.last_name}`}
          entityType="Parent / Guardian"
          entityDetails={{
            id: `Parent ID #${deletingGuardian.id}`,
            subtitle: `Relationship: ${deletingGuardian.relationship || 'Parent'}`,
            meta: `Phone: ${deletingGuardian.phone}`
          }}
          warningText="Deleting this parent record will revoke parent portal access and unlink from students."
          confirmButtonText="Delete Guardian"
          isDeleting={isDeleting}
          onConfirm={handleConfirmDeleteGuardian}
          onClose={() => setDeletingGuardian(null)}
        />
      )}

      {/* Delete Vehicle Confirmation Modal */}
      {deletingVehicle && (
        <DeleteConfirmModal
          isOpen={!!deletingVehicle}
          title="Delete Transport Vehicle Confirmation"
          entityName={`${deletingVehicle.registration_no}`}
          entityType="Transport Vehicle"
          entityDetails={{
            id: deletingVehicle.registration_no,
            subtitle: `${deletingVehicle.vehicle_type} (Capacity: ${deletingVehicle.capacity})`,
            meta: `Driver: ${deletingVehicle.driver_name} (${deletingVehicle.driver_phone})`
          }}
          warningText="Deleting this vehicle will remove it from the fleet roster and unassign it from any linked bus routes."
          confirmButtonText="Delete Vehicle"
          isDeleting={isDeleting}
          onConfirm={handleConfirmDeleteVehicle}
          onClose={() => setDeletingVehicle(null)}
        />
      )}
    </div>
  );
}
