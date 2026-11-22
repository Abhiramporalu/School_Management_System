import React from 'react';
import { X, Printer, Shield, Phone, MapPin, Calendar, Heart } from 'lucide-react';

export default function IdCardModal({ student, onClose }) {
  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header Actions */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-xs">Official Digital Student ID Card</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Card</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ID Card Front & Back Preview */}
        <div className="p-6 bg-slate-100 flex flex-col items-center gap-6">
          {/* Card Front */}
          <div className="w-80 h-[480px] bg-white rounded-2xl shadow-xl border border-slate-300 overflow-hidden flex flex-col justify-between relative">
            {/* Top Navy Curve */}
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white p-4 text-center relative">
              <div className="flex items-center justify-center gap-2 mb-1">
                <img
                  src="/logo.jpg"
                  alt="KRPS Logo"
                  className="w-8 h-8 rounded-full object-contain bg-white p-0.5 shadow border border-amber-400"
                />
                <div className="text-left leading-tight">
                  <h2 className="font-black text-xs uppercase tracking-tight">KRPS</h2>
                  <p className="text-[9px] text-amber-300 font-medium">Bengaluru • CBSE Affiliation #89412</p>
                </div>
              </div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-300 bg-white/10 rounded-full py-0.5 mt-1">
                Student Identity Card (2026-27)
              </div>
            </div>

            {/* Photo & Badge */}
            <div className="flex flex-col items-center px-4 -mt-2">
              <div className="relative">
                <img
                  src={student.profile_photo || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'}
                  alt="Student"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
                <span className="absolute bottom-1 right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white" title="Active"></span>
              </div>
              <h3 className="font-bold text-base text-slate-900 mt-2">{student.first_name} {student.last_name}</h3>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 mt-0.5">
                {student.class_name || 'Class 10'} - {student.section_name || 'A'} (Roll #{student.roll_no || 1})
              </span>
            </div>

            {/* Details Table */}
            <div className="px-5 text-[11px] space-y-1.5 text-slate-700">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Admission No:</span>
                <strong className="font-mono text-slate-900">{student.admission_no}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Date of Birth:</span>
                <span className="font-semibold">{student.dob ? new Date(student.dob).toLocaleDateString() : '14/05/2011'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Blood Group:</span>
                <strong className="text-red-600 font-bold">{student.blood_group || 'O+'}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Emergency Contact:</span>
                <span className="font-semibold">{student.emergency_contact || '+91 98450 11004'}</span>
              </div>
            </div>

            {/* Barcode & Footer */}
            <div className="bg-slate-50 border-t border-slate-200 p-3 text-center">
              {/* Simulated barcode */}
              <div className="h-7 w-48 bg-slate-800 mx-auto rounded flex items-center justify-around px-2 text-white font-mono text-[9px] tracking-widest">
                || | |||| | ||| || ||| | |||
              </div>
              <p className="text-[9px] text-slate-400 mt-1 font-mono tracking-wider">{student.admission_no}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
