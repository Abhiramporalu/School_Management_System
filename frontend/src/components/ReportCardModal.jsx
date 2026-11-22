import React from 'react';
import { X, Printer, Award, CheckCircle, FileText } from 'lucide-react';

export default function ReportCardModal({ data, onClose }) {
  if (!data) return null;

  const { student, exam, subjects, summary } = data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Top Actions */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm">Official Academic Transcript & Report Card</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 print:p-4 text-slate-800 bg-white">
          {/* Header */}
          <div className="border-b-2 border-blue-900 pb-5 mb-6 text-center relative">
            <div className="flex items-center justify-center gap-4 mb-2">
              <img
                src="/logo.jpg"
                alt="KRPS Logo"
                className="w-16 h-16 rounded-full object-contain bg-white border-2 border-amber-400 p-1 shadow-sm"
              />
              <div>
                <h1 className="text-2xl font-black text-blue-950 uppercase tracking-tight">
                  {student.school_name || 'KRPS'}
                </h1>
                <p className="text-xs font-semibold text-slate-600">
                  Affiliated to CBSE, New Delhi • Affiliation No: {student.affiliation_no || 'CBSE/AFF/2026/89412'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {student.school_address || '42 Silicon Valley Boulevard, Whitefield, Bengaluru - 560066'} • Phone: {student.school_phone || '+91 80 4567 8900'}
                </p>
              </div>
            </div>

            <div className="inline-block bg-blue-900 text-amber-300 font-bold px-6 py-1 rounded-full text-xs uppercase tracking-widest mt-1">
              {exam ? exam.title : 'Official Scholastic Performance Report'}
            </div>
          </div>

          {/* Student Profile Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs mb-6">
            <div>
              <span className="text-slate-500 block">Student Name:</span>
              <strong className="text-slate-900 text-sm">{student.first_name} {student.last_name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Admission Number:</span>
              <strong className="text-blue-700 font-mono text-sm">{student.admission_no}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Class & Section:</span>
              <strong className="text-slate-900 text-sm">{student.class_name} - {student.section_name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Roll Number:</span>
              <strong className="text-slate-900 text-sm">#{student.roll_no || 1}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Academic Session:</span>
              <span className="font-semibold">2026-2027</span>
            </div>
            <div>
              <span className="text-slate-500 block">Date of Birth:</span>
              <span className="font-semibold">{student.dob ? new Date(student.dob).toLocaleDateString() : '14 May 2011'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Attendance:</span>
              <span className="font-semibold text-emerald-700">{summary.attendancePct}%</span>
            </div>
            <div>
              <span className="text-slate-500 block">Result Status:</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                <CheckCircle className="w-3.5 h-3.5" /> {summary.resultStatus}
              </span>
            </div>
          </div>

          {/* Subjects & Marks Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-xs border border-slate-300 rounded-lg overflow-hidden">
              <thead className="bg-blue-900 text-white font-semibold uppercase text-[11px]">
                <tr>
                  <th className="p-3 border-r border-blue-800">Subject Code</th>
                  <th className="p-3 border-r border-blue-800">Subject Name</th>
                  <th className="p-3 border-r border-blue-800 text-center">Max Marks</th>
                  <th className="p-3 border-r border-blue-800 text-center">Pass Marks</th>
                  <th className="p-3 border-r border-blue-800 text-center">Marks Scored</th>
                  <th className="p-3 border-r border-blue-800 text-center">Grade</th>
                  <th className="p-3">Faculty Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {subjects && subjects.map((sub, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                    <td className="p-3 font-mono font-medium border-r border-slate-200 text-slate-600">{sub.subject_code}</td>
                    <td className="p-3 font-semibold border-r border-slate-200 text-slate-800">{sub.subject_name}</td>
                    <td className="p-3 text-center border-r border-slate-200 text-slate-600">{sub.maxMarks}</td>
                    <td className="p-3 text-center border-r border-slate-200 text-slate-500">{sub.passMarks}</td>
                    <td className="p-3 text-center font-bold border-r border-slate-200 text-blue-900 text-sm">
                      {typeof sub.obtained === 'number' ? sub.obtained.toFixed(1) : sub.obtained}
                    </td>
                    <td className="p-3 text-center font-bold border-r border-slate-200">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        sub.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-800 font-extrabold' :
                        sub.grade.startsWith('B') ? 'bg-blue-100 text-blue-800 font-bold' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.grade}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 italic">{sub.teacher_subject_remarks || 'Consistent proficiency'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold text-xs border-t-2 border-slate-400">
                <tr>
                  <td colSpan={2} className="p-3 text-right uppercase tracking-wider text-slate-700">Grand Total:</td>
                  <td className="p-3 text-center text-slate-800">{summary.maxTotal}</td>
                  <td className="p-3 text-center text-slate-600">-</td>
                  <td className="p-3 text-center text-blue-950 font-black text-sm">{summary.totalObtained.toFixed(1)}</td>
                  <td className="p-3 text-center text-emerald-800 text-sm font-black">{summary.grade}</td>
                  <td className="p-3 text-emerald-700 font-bold">Overall: {summary.percentage}% (Rank: #{summary.rank})</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Remarks and Signatures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <span className="font-semibold text-slate-700 block mb-1">Class Teacher Remarks:</span>
              <p className="text-slate-600 italic">"{summary.teacherRemarks}"</p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <span className="font-semibold text-slate-700 block mb-1">Principal Observation:</span>
              <p className="text-slate-600 italic">"{summary.principalRemarks}"</p>
            </div>
          </div>

          {/* Official Signatures Row */}
          <div className="flex justify-between items-end pt-8 border-t border-slate-200 text-xs">
            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1 mx-auto"></div>
              <span className="font-medium text-slate-600">Class Teacher</span>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-blue-900/30 flex items-center justify-center text-[9px] text-blue-900 font-semibold uppercase mx-auto mb-1">
                Official School Seal
              </div>
              <span className="text-[10px] text-slate-400">Date: {summary.issueDate}</span>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1 mx-auto"></div>
              <span className="font-medium text-slate-600">Principal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
