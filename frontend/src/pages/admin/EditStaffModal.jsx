import React, { useState, useEffect } from 'react';
import { X, Save, BookOpen, Building, Phone, Mail, DollarSign, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export default function EditStaffModal({
  isOpen,
  staff,
  onClose,
  onUpdated
}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    roleName: '',
    departmentId: 4,
    salaryAmount: 40000,
    status: 'active'
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (staff) {
      setFormData({
        firstName: staff.first_name || '',
        lastName: staff.last_name || '',
        phone: staff.phone || '',
        email: staff.email || '',
        roleName: staff.role_name || 'Staff Member',
        departmentId: staff.department_id || 4,
        salaryAmount: staff.salary_amount !== undefined ? staff.salary_amount : 40000,
        status: staff.status || 'active'
      });
      setError('');
    }
  }, [staff]);

  if (!isOpen || !staff) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await api.updateStaff(staff.id, formData);
      if (onUpdated) {
        onUpdated(res.staff || res);
      }
      onClose();
    } catch (err) {
      console.error('Update staff failed:', err);
      setError(err.message || 'Failed to update staff member');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 text-xs overflow-y-auto max-h-[92vh] space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">Staff Administration</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border">
                  {staff.employee_id}
                </span>
              </div>
              <h3 className="font-black text-base text-slate-900">
                Edit Staff: {staff.first_name} {staff.last_name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">First Name *</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Last Name *</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Role Title *</label>
              <input
                type="text"
                name="roleName"
                required
                value={formData.roleName}
                onChange={handleChange}
                className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Department</label>
              <div className="relative">
                <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs"
                >
                  <option value={1}>Science & Technology</option>
                  <option value={2}>Mathematics</option>
                  <option value={3}>Humanities & Languages</option>
                  <option value={4}>Administration & Finance</option>
                </select>
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs font-mono"
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs"
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Monthly Salary (INR)</label>
              <div className="relative">
                <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  name="salaryAmount"
                  min="0"
                  step="1000"
                  value={formData.salaryAmount}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs font-mono font-bold"
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs font-bold"
              >
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="resigned">Resigned</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-teal-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Staff Record</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
