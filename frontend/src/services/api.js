// API SERVICE LAYER - Centralized fetch client for School ERP & Student Portal

const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('sms_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);

  // If 401 unauthorized, notify or clear stale token
  if (response.status === 401 && !endpoint.includes('/auth/login')) {
    localStorage.removeItem('sms_token');
    localStorage.removeItem('sms_user');
  }

  // Handle file downloads
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/csv')) {
    return response.blob();
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || 'API request failed');
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  register: (data) => request('/auth/register', { method: 'POST', body: data }),
  getProfile: () => request('/auth/me'),
  changePassword: (data) => request('/auth/change-password', { method: 'POST', body: data }),

  // Public
  getPublicInfo: () => request('/public/info'),
  getPublicAnnouncements: () => request('/public/announcements'),
  getPublicEvents: () => request('/public/events'),
  getPublicGallery: () => request('/public/gallery'),
  submitEnquiry: (data) => request('/public/enquiry', { method: 'POST', body: data }),
  submitAdmissionApplication: (data) => request('/public/apply', { method: 'POST', body: data }),

  // Students
  getStudents: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/students?${q}`);
  },
  getStudentById: (id) => request(`/students/${id}`),
  getStudentIdCard: (id) => request(`/students/${id}/id-card`),
  createStudent: (data) => request('/students', { method: 'POST', body: data }),
  updateStudent: (id, data) => request(`/students/${id}`, { method: 'PUT', body: data }),
  deleteStudent: (id) => request(`/students/${id}`, { method: 'DELETE' }),

  // Academics
  getClasses: () => request('/academics/classes'),
  getSubjects: () => request('/academics/subjects'),
  getTimetable: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/academics/timetables?${q}`);
  },
  saveTimetablePeriod: (data) => request('/academics/timetables', { method: 'POST', body: data }),
  getAcademicCalendar: () => request('/academics/academic-years'),

  // Attendance
  getClassAttendance: (params) => {
    const q = new URLSearchParams(params).toString();
    return request(`/attendance/session?${q}`);
  },
  saveClassAttendance: (data) => request('/attendance/save', { method: 'POST', body: data }),
  getStudentAttendance: (studentId) => request(`/attendance/student/${studentId}`),
  getLeaveRequests: () => request('/attendance/leave-requests'),
  applyLeave: (data) => request('/attendance/leave-request', { method: 'POST', body: data }),
  reviewLeave: (id, data) => request(`/attendance/leave-request/${id}`, { method: 'PUT', body: data }),

  // Assignments & Quizzes
  getAssignments: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/assignments?${q}`);
  },
  getAssignmentById: (id) => request(`/assignments/${id}`),
  createAssignment: (data) => request('/assignments', { method: 'POST', body: data }),
  submitAssignment: (id, data) => request(`/assignments/${id}/submit`, { method: 'POST', body: data }),
  gradeSubmission: (id, data) => request(`/assignments/submissions/${id}/grade`, { method: 'POST', body: data }),
  getLearningResources: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/assignments/learning/resources?${q}`);
  },
  getQuizzes: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/assignments/quizzes/list?${q}`);
  },
  getQuizById: (id) => request(`/assignments/quizzes/${id}`),
  attemptQuiz: (id, data) => request(`/assignments/quizzes/${id}/attempt`, { method: 'POST', body: data }),

  // Exams
  getExams: () => request('/exams'),
  getExamSchedules: (examId, classId) => request(`/exams/${examId}/schedules?classId=${classId || ''}`),
  getMarksSheet: (examId, params) => {
    const q = new URLSearchParams(params).toString();
    return request(`/exams/${examId}/marks-sheet?${q}`);
  },
  saveMarks: (data) => request('/exams/marks', { method: 'POST', body: data }),
  getReportCard: (studentId, examId) => request(`/exams/report-card/${studentId}/${examId}`),

  // Fees
  getFeeStructures: () => request('/fees/structures'),
  getInvoices: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/fees/invoices?${q}`);
  },
  getFeeSummary: () => request('/fees/summary'),
  payFee: (data) => request('/fees/pay', { method: 'POST', body: data }),
  getReceipt: (receiptNo) => request(`/fees/receipt/${receiptNo}`),
  createInvoice: (data) => request('/fees/invoices', { method: 'POST', body: data }),

  // Library
  getBooks: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/library/books?${q}`);
  },
  addBook: (data) => request('/library/books', { method: 'POST', body: data }),
  getIssuedBooks: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/library/issues?${q}`);
  },
  issueBook: (data) => request('/library/issue', { method: 'POST', body: data }),
  returnBook: (data) => request('/library/return', { method: 'POST', body: data }),

  // Transport
  getTransportRoutes: () => request('/transport/routes'),
  getVehicles: () => request('/transport/vehicles'),
  getStudentTransport: (studentId) => request(`/transport/student/${studentId}`),
  assignTransport: (data) => request('/transport/assign', { method: 'POST', body: data }),

  // Communication
  getAnnouncements: () => request('/communication/announcements'),
  publishAnnouncement: (data) => request('/communication/announcements', { method: 'POST', body: data }),
  getMessages: () => request('/communication/messages'),
  sendMessage: (data) => request('/communication/messages', { method: 'POST', body: data }),
  getContacts: () => request('/communication/contacts'),

  // Admin
  getAdminDashboard: () => request('/admin/dashboard'),
  getAdminUsers: () => request('/admin/users'),
  updateUserStatus: (id, status) => request(`/admin/users/${id}/status`, { method: 'PUT', body: { status } }),
  resetUserPassword: (id, newPassword) => request(`/admin/users/${id}/reset-password`, { method: 'POST', body: { newPassword } }),
  getAdmissions: () => request('/admin/admissions'),
  updateAdmissionStatus: (id, data) => request(`/admin/admissions/${id}`, { method: 'PUT', body: data }),
  getVisitors: () => request('/admin/visitors'),
  createVisitor: (data) => request('/admin/visitors', { method: 'POST', body: data }),
  checkoutVisitor: (id) => request(`/admin/visitors/${id}/checkout`, { method: 'PUT' }),
  getHostelData: () => request('/admin/hostel'),
  getAuditLogs: () => request('/admin/audit-logs'),
  exportReport: async (reportType) => {
    const blob = await request(`/admin/export/${reportType}`);
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${reportType}_report.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  // Stakeholder Registration & Directory
  getAdminDirectory: () => request('/admin/directory'),
  getTeacherById: (id) => request(`/admin/teachers/${id}`),
  registerTeacher: (data) => request('/admin/register/teacher', { method: 'POST', body: data }),
  updateTeacher: (id, data) => request(`/admin/teachers/${id}`, { method: 'PUT', body: data }),
  deleteTeacher: (id) => request(`/admin/teachers/${id}`, { method: 'DELETE' }),
  registerStaff: (data) => request('/admin/register/staff', { method: 'POST', body: data }),
  updateStaff: (id, data) => request(`/admin/staff/${id}`, { method: 'PUT', body: data }),
  deleteStaff: (id) => request(`/admin/staff/${id}`, { method: 'DELETE' }),
  registerGuardian: (data) => request('/admin/register/guardian', { method: 'POST', body: data }),
  deleteGuardian: (id) => request(`/admin/guardians/${id}`, { method: 'DELETE' }),
  registerVehicle: (data) => request('/admin/register/vehicle', { method: 'POST', body: data }),
  deleteVehicle: (id) => request(`/admin/vehicles/${id}`, { method: 'DELETE' }),
  registerRoute: (data) => request('/admin/register/route', { method: 'POST', body: data }),
  deleteRoute: (id) => request(`/admin/routes/${id}`, { method: 'DELETE' }),

  // AI Assistant
  aiChat: (message) => request('/ai/chat', { method: 'POST', body: { message } }),
  aiDraftNotice: (data) => request('/ai/draft-notice', { method: 'POST', body: data })
};
