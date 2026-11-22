import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  CalendarCheck,
  BookOpen,
  FileCheck,
  GraduationCap,
  MessageSquare,
  Clock,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Send,
  Users
} from 'lucide-react';

export default function TeacherPortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('attendance');
  const [loading, setLoading] = useState(true);

  // Attendance state
  const [classId, setClassId] = useState('5'); // Grade 10
  const [sectionId, setSectionId] = useState('1'); // Section A
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceStudents, setAttendanceStudents] = useState([]);
  const [attendanceStatusMap, setAttendanceStatusMap] = useState({});
  const [savingAttendance, setSavingAttendance] = useState(false);

  // Assignments state
  const [assignments, setAssignments] = useState([]);
  const [showCreateAssignModal, setShowCreateAssignModal] = useState(false);
  const [newAssign, setNewAssign] = useState({
    title: '',
    description: '',
    subjectId: '1', // Mathematics
    classId: '5',
    sectionId: '1',
    dueDate: '2026-11-28',
    maxMarks: 25
  });

  // Selected assignment for grading
  const [selectedAssignDetail, setSelectedAssignDetail] = useState(null);
  const [gradingModal, setGradingModal] = useState(null); // submission object
  const [gradeMarks, setGradeMarks] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');

  // Marks entry state
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('1');
  const [marksSheet, setMarksSheet] = useState(null);
  const [marksEntries, setMarksEntries] = useState({});
  const [savingMarks, setSavingMarks] = useState(false);

  // Messages state
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [msgReceiverId, setMsgReceiverId] = useState('');
  const [msgContent, setMsgContent] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    setLoading(false);
    loadAttendanceData();
    loadAssignmentsData();
    loadExamsData();
    loadMessagesData();
  }

  // Load attendance
  async function loadAttendanceData() {
    try {
      const res = await api.getClassAttendance({ classId, sectionId, date: attendanceDate });
      setAttendanceStudents(res.students || []);
      const map = {};
      (res.students || []).forEach((st) => {
        map[st.id] = st.attendance_status || 'Present';
      });
      setAttendanceStatusMap(map);
    } catch (err) {
      console.error('Failed to load attendance:', err);
    }
  }

  // Load assignments
  async function loadAssignmentsData() {
    try {
      const list = await api.getAssignments({ classId: '5', sectionId: '1' });
      setAssignments(list || []);
    } catch (err) {
      console.error('Failed to load assignments:', err);
    }
  }

  // Load exams & marks sheet
  async function loadExamsData() {
    try {
      const exList = await api.getExams();
      setExams(exList || []);
      if (exList && exList.length > 0) {
        loadMarksSheet(exList[0].id);
      }
    } catch (err) {
      console.error('Failed to load exams:', err);
    }
  }

  async function loadMarksSheet(examId) {
    try {
      const res = await api.getMarksSheet(examId, { classId: '5', sectionId: '1', subjectId: '1' });
      setMarksSheet(res);
      const entries = {};
      if (res.students) {
        res.students.forEach((st) => {
          entries[st.student_id] = st.marks_obtained !== null ? st.marks_obtained : '';
        });
      }
      setMarksEntries(entries);
    } catch (err) {
      console.error('Failed to load marks sheet:', err);
    }
  }

  // Load messages
  async function loadMessagesData() {
    try {
      const [msgs, cts] = await Promise.all([api.getMessages(), api.getContacts()]);
      setMessages(msgs || []);
      setContacts(cts || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  }

  // Submit attendance
  const handleSaveAttendance = async () => {
    setSavingAttendance(true);
    try {
      const records = attendanceStudents.map((st) => ({
        studentId: st.id,
        status: attendanceStatusMap[st.id] || 'Present',
        remarks: ''
      }));

      const res = await api.saveClassAttendance({
        classId,
        sectionId,
        date: attendanceDate,
        records
      });

      alert(res.message);
      loadAttendanceData();
    } catch (err) {
      alert(err.message || 'Failed to save attendance');
    } finally {
      setSavingAttendance(false);
    }
  };

  // Quick mark all present
  const markAllPresent = () => {
    const map = {};
    attendanceStudents.forEach((st) => {
      map[st.id] = 'Present';
    });
    setAttendanceStatusMap(map);
  };

  // Create Assignment
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      await api.createAssignment(newAssign);
      alert('Assignment dispatched to Grade 10-A successfully!');
      setShowCreateAssignModal(false);
      loadAssignmentsData();
    } catch (err) {
      alert(err.message || 'Failed to create assignment');
    }
  };

  // View assignment submissions
  const handleViewSubmissions = async (assignId) => {
    try {
      const detail = await api.getAssignmentById(assignId);
      setSelectedAssignDetail(detail);
    } catch (err) {
      alert('Failed to load assignment submissions');
    }
  };

  // Grade submission
  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!gradingModal) return;
    try {
      await api.gradeSubmission(gradingModal.id, {
        marksObtained: parseFloat(gradeMarks),
        feedback: gradeFeedback,
        requestResubmission: false
      });
      alert('Submission evaluated and marks published!');
      setGradingModal(null);
      if (selectedAssignDetail) {
        handleViewSubmissions(selectedAssignDetail.id);
      }
    } catch (err) {
      alert(err.message || 'Failed to grade submission');
    }
  };

  // Save exam marks
  const handleSaveExamMarks = async () => {
    if (!marksSheet || !marksSheet.schedule) return;
    setSavingMarks(true);
    try {
      const entries = Object.keys(marksEntries).map((stId) => ({
        studentId: parseInt(stId),
        marksObtained: parseFloat(marksEntries[stId]) || 0,
        status: marksEntries[stId] !== '' ? 'Present' : 'Absent',
        remarks: 'Assessed by Class Teacher'
      }));

      await api.saveMarks({
        examScheduleId: marksSheet.schedule.id,
        entries
      });
      alert('Examination marks saved successfully!');
    } catch (err) {
      alert(err.message || 'Failed to save marks');
    } finally {
      setSavingMarks(false);
    }
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgReceiverId || !msgContent) return;
    try {
      await api.sendMessage({ receiverId: msgReceiverId, content: msgContent });
      alert('Message sent successfully!');
      setMsgContent('');
      loadMessagesData();
    } catch (err) {
      alert('Failed to send message');
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-100 min-h-[calc(100vh-80px)] font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-4 border-r border-slate-800 shrink-0 flex flex-col justify-between">
        <div>
          <div className="px-3 py-2 mb-4 border-b border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Faculty Portal</span>
            <h2 className="text-sm font-extrabold text-white mt-0.5">
              {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Faculty Member' : 'Faculty Member'}
            </h2>
            <p className="text-[11px] text-slate-400">
              {user?.teacher?.designation || user?.designation || 'Class Teacher & Subject Faculty'}
            </p>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            {[
              { id: 'attendance', label: 'Mark Attendance', icon: CalendarCheck },
              { id: 'assignments', label: 'Homework & Submissions', icon: BookOpen },
              { id: 'marks', label: 'Exam Marks Entry', icon: FileCheck },
              { id: 'messages', label: 'Parent Communication', icon: MessageSquare }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold shadow-md'
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

        <div className="pt-4 border-t border-slate-800 px-3 text-[11px] text-slate-400">
          <p className="font-semibold text-slate-200">
            Department: {user?.teacher?.department_name || user?.department_name || 'Academics'}
          </p>
          <p className="text-[10px] text-slate-500">
            Employee ID: {user?.teacher?.employee_id || user?.employeeId || user?.username || 'FACULTY'}
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {/* TAB 1: ATTENDANCE MARKER */}
        {activeTab === 'attendance' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Class Attendance Marker</h2>
                <p className="text-xs text-slate-500">Record daily attendance for assigned Class 10 - Section A</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => {
                    setAttendanceDate(e.target.value);
                  }}
                  className="p-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium"
                />
                <button
                  onClick={loadAttendanceData}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Fetch
                </button>
                <button
                  onClick={markAllPresent}
                  className="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold rounded-xl"
                >
                  Mark All Present
                </button>
                <button
                  onClick={handleSaveAttendance}
                  disabled={savingAttendance}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{savingAttendance ? 'Submitting...' : 'Save & Submit Attendance'}</span>
                </button>
              </div>
            </div>

            {/* Attendance Students List */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Roll #</th>
                    <th className="p-3">Adm No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Quick Mark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendanceStudents.map((st) => {
                    const currentStatus = attendanceStatusMap[st.id] || 'Present';
                    return (
                      <tr key={st.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-700">#{st.roll_no || 1}</td>
                        <td className="p-3 font-mono text-blue-700 font-bold">{st.admission_no}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={st.profile_photo || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80'}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover border"
                            />
                            <span className="font-bold text-slate-900">{st.first_name} {st.last_name}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            currentStatus === 'Present' ? 'bg-emerald-100 text-emerald-800' :
                            currentStatus === 'Absent' ? 'bg-red-100 text-red-800' :
                            currentStatus === 'Late' ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {currentStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          {['Present', 'Absent', 'Late', 'Excused'].map((stat) => (
                            <button
                              key={stat}
                              onClick={() => {
                                setAttendanceStatusMap({ ...attendanceStatusMap, [st.id]: stat });
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                                currentStatus === stat
                                  ? stat === 'Present' ? 'bg-emerald-600 text-white' :
                                    stat === 'Absent' ? 'bg-red-600 text-white' :
                                    stat === 'Late' ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {stat}
                            </button>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ASSIGNMENTS & HOMEWORK */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Homework & Assignments Dispatcher</h2>
                  <p className="text-xs text-slate-500">Create coursework and evaluate submitted student answers</p>
                </div>
                <button
                  onClick={() => setShowCreateAssignModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Assignment</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignments.map((asgn) => (
                  <div key={asgn.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                          {asgn.subject_name}
                        </span>
                        <span className="text-xs font-bold text-slate-500">Max Marks: {asgn.max_marks}</span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 mt-1">{asgn.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{asgn.description}</p>
                      <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-3">
                        <span>Issued: {new Date(asgn.issue_date).toLocaleDateString()}</span>
                        <span className="text-red-600 font-semibold">Due: {new Date(asgn.due_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">Submissions: {asgn.submission_count || 1}</span>
                      <button
                        onClick={() => handleViewSubmissions(asgn.id)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs"
                      >
                        Review Submissions →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submissions Review Section */}
            {selectedAssignDetail && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      Submissions for: {selectedAssignDetail.title}
                    </h3>
                    <p className="text-xs text-slate-500">Max Marks: {selectedAssignDetail.max_marks}</p>
                  </div>
                  <button onClick={() => setSelectedAssignDetail(null)} className="text-xs text-slate-400 hover:text-slate-700">✕ Close</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Student</th>
                        <th className="p-3">Adm No</th>
                        <th className="p-3">Submission Details</th>
                        <th className="p-3">Marks</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedAssignDetail.submissions && selectedAssignDetail.submissions.map((sub) => (
                        <tr key={sub.id}>
                          <td className="p-3 font-bold text-slate-900">{sub.first_name} {sub.last_name}</td>
                          <td className="p-3 font-mono text-blue-700">{sub.admission_no}</td>
                          <td className="p-3 text-slate-600 max-w-xs">{sub.submission_text || 'Scanned handwritten assignment PDF'}</td>
                          <td className="p-3 font-bold text-emerald-800 text-sm">
                            {sub.marks_obtained !== null ? `${sub.marks_obtained} / ${selectedAssignDetail.max_marks}` : 'Ungraded'}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              sub.status === 'Evaluated' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setGradingModal(sub);
                                setGradeMarks(sub.marks_obtained || '');
                                setGradeFeedback(sub.feedback || '');
                              }}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold"
                            >
                              Grade / Feedback
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EXAM MARKS ENTRY */}
        {activeTab === 'marks' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Examinations & Marks Entry</h2>
                <p className="text-xs text-slate-500">Record and moderate marks for Grade 10-A Mathematics</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedExamId}
                  onChange={(e) => {
                    setSelectedExamId(e.target.value);
                    loadMarksSheet(e.target.value);
                  }}
                  className="p-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-bold"
                >
                  {exams.map((ex) => (
                    <option key={ex.id} value={ex.id}>{ex.title}</option>
                  ))}
                </select>

                <button
                  onClick={handleSaveExamMarks}
                  disabled={savingMarks}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{savingMarks ? 'Saving...' : 'Save & Publish Marks'}</span>
                </button>
              </div>
            </div>

            {marksSheet && marksSheet.schedule && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex justify-between">
                <span>Subject: <strong>Mathematics (MATH101)</strong></span>
                <span>Max Marks: <strong>{marksSheet.schedule.max_marks}</strong></span>
                <span>Passing Marks: <strong>{marksSheet.schedule.pass_marks}</strong></span>
              </div>
            )}

            {/* Marks Sheet Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Roll #</th>
                    <th className="p-3">Adm No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Marks Obtained (Max 100)</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {marksSheet && marksSheet.students && marksSheet.students.map((st) => (
                    <tr key={st.student_id}>
                      <td className="p-3 font-mono font-bold">#{st.roll_no}</td>
                      <td className="p-3 font-mono text-blue-700 font-bold">{st.admission_no}</td>
                      <td className="p-3 font-bold text-slate-900">{st.first_name} {st.last_name}</td>
                      <td className="p-3">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="100"
                          value={marksEntries[st.student_id] !== undefined ? marksEntries[st.student_id] : ''}
                          onChange={(e) => {
                            setMarksEntries({
                              ...marksEntries,
                              [st.student_id]: e.target.value
                            });
                          }}
                          placeholder="e.g. 96.0"
                          className="w-28 p-2 border border-slate-200 rounded-xl bg-slate-50 font-bold text-blue-900"
                        />
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Present
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Parent & School Communication</h2>
              <p className="text-xs text-slate-500">Send direct advisories and progress notes to parents</p>
            </div>

            {/* Compose message */}
            <form onSubmit={handleSendMessage} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
              <h3 className="font-bold text-slate-800">Send New Message</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Select Recipient *</label>
                  <select
                    value={msgReceiverId}
                    onChange={(e) => setMsgReceiverId(e.target.value)}
                    required
                    className="w-full p-2 border rounded-xl bg-white"
                  >
                    <option value="">Choose Parent or Administrator...</option>
                    {contacts.map((c) => (
                      <option key={c.id} value={c.id}>{c.first_name} {c.last_name} ({c.role})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Message Content *</label>
                <textarea
                  rows={3}
                  required
                  value={msgContent}
                  onChange={(e) => setMsgContent(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full p-2 border rounded-xl bg-white"
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>

            {/* Message History */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900">Recent Messages</h3>
              {messages.map((m) => (
                <div key={m.id} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs text-xs">
                  <div className="flex justify-between items-center mb-1 text-[11px]">
                    <span className="font-bold text-slate-900">
                      {m.sender_name} → {m.receiver_name}
                    </span>
                    <span className="text-slate-400">{new Date(m.created_at).toLocaleString()}</span>
                  </div>
                  <strong className="block text-blue-900 mb-1">{m.subject}</strong>
                  <p className="text-slate-700 leading-relaxed">{m.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal: Create Assignment */}
      {showCreateAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-base text-slate-900 mb-3">Create Homework Assignment</h3>
            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={newAssign.title}
                  onChange={(e) => setNewAssign({ ...newAssign, title: e.target.value })}
                  placeholder="e.g. NCERT Quadratic Proofs"
                  className="w-full p-2 border rounded-xl bg-slate-50"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Instructions / Description *</label>
                <textarea
                  rows={3}
                  required
                  value={newAssign.description}
                  onChange={(e) => setNewAssign({ ...newAssign, description: e.target.value })}
                  placeholder="Detailed instructions for students..."
                  className="w-full p-2 border rounded-xl bg-slate-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={newAssign.dueDate}
                    onChange={(e) => setNewAssign({ ...newAssign, dueDate: e.target.value })}
                    className="w-full p-2 border rounded-xl bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Max Marks *</label>
                  <input
                    type="number"
                    required
                    value={newAssign.maxMarks}
                    onChange={(e) => setNewAssign({ ...newAssign, maxMarks: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded-xl bg-slate-50"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateAssignModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Dispatch Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Grade Submission */}
      {gradingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-base text-slate-900 mb-1">Grade Student Submission</h3>
            <p className="text-slate-500 mb-3">Student: {gradingModal.first_name} {gradingModal.last_name}</p>
            <form onSubmit={handleGradeSubmit} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">Marks Awarded (Max {selectedAssignDetail?.max_marks || 25}) *</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={gradeMarks}
                  onChange={(e) => setGradeMarks(e.target.value)}
                  className="w-full p-2 border rounded-xl bg-slate-50 font-bold text-blue-900"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Constructive Feedback / Remarks</label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="Feedback for the student..."
                  className="w-full p-2 border rounded-xl bg-slate-50"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setGradingModal(null)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Submit Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
