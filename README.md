# KRPS ERP & Student Portal

> **A Comprehensive Enterprise Resource Planning (ERP) Platform & Student Portal**  
> Built with **React.js, Node.js + Express.js, and PostgreSQL Database** conforming directly to the **Software Requirements Specification (SRS Version 1.0)**.

---

## 🌟 Executive Overview & Key Features

This platform centralizes all academic and administrative operations across a school ecosystem with granular Role-Based Access Control (RBAC), end-to-end data integrity, and compliance with institutional standards.

### 1. 🏛️ Public School Website
- **Home, About & Leadership**: History, Dr. Arthur Pendleton (Principal) welcome message, CBSE affiliation credentials (`CBSE/AFF/2026/89412`).
- **Academic Programs**: Curriculum for Pre-Primary to Grade 12 (Board prep, STEM, Humanities).
- **Campus Facilities**: State-of-the-art Robotics & AI Lab, Olympic swimming complex, Science labs.
- **Online Admissions 2027**: Interactive application form generating unique reference numbers (`ADM-2027-xxxx`) with reviewer workflows.
- **Events & Circulars**: Interactive calendar, Sports Day, Science Expo, emergency circulars.
- **Campus Photo Gallery & Contact Desk**: Google Maps location, address, interactive enquiry submission.

### 2. 🔐 Role-Based Portals & Access Control
- **Super Admin / School Admin**:
  - Live Institutional Dashboard (enrolled students, today's attendance %, fee collection vs balance, faculty count).
  - Admissions Queue (review, approve, reject, or enroll applicants).
  - Students Registry (directory, class/section filters, digital ID card generation, add new student).
  - Academic Structure & Classes (Grade 6 to 12, sections, room allocations, student capacities).
  - Timetable Management with **automatic room & teacher conflict detection**.
  - Attendance Oversight & Leave approval desk.
  - Fee Management & Invoicing.
  - Examinations & Report Card generation.
  - Front Desk & Visitor Pass generator with check-in/out logging.
  - User Accounts & Security Audit Logs.
  - One-click CSV Reports Export (Students Registry, Fee Invoices & Payments).
- **Teacher Portal (Mrs. Sarah Jenkins - Mathematics PGT)**:
  - Class Attendance Marker (1-click bulk Present/Absent/Late/Excused recording for assigned class).
  - Homework & Assignment Dispatcher (create coursework, set due dates & max marks).
  - Submissions Reviewer (grade student answers with numerical marks & feedback).
  - Examination Marks Entry (enter and publish summative exam marks).
  - Direct Parent Communication & Advisories.
- **Student Portal (Aarav Sharma - Class 10-A, Roll #1)**:
  - Dashboard with summary cards (attendance percentage with threshold warnings, term score, active homework).
  - **Official Digital Student ID Card** (photo, barcode, admission number, blood group, emergency contact).
  - Class Timetable (weekly period schedule with teacher & room info).
  - Attendance Calendar & History with online student leave application.
  - Homework Submissions & Teacher Feedback tracking.
  - **Online Timed Quizzes**: Interactive objective test with countdown timer and instant evaluation score.
  - **Official Branded Report Card**: Term exam scores, max marks, percentage, grade, rank, principal & teacher remarks with school watermark.
  - **Fee Payments Desk**: View invoices, pay online via simulated UPI/Card gateway checkout, and download verified receipts.
  - Library Books (borrowed books, due dates, fines).
  - Assigned Transport Route, Pickup Stop, Driver name & phone.
- **Parent / Guardian Portal (Mr. Rajesh Sharma)**:
  - **Multi-Child Switcher**: Seamlessly toggle between linked children (**Aarav Sharma - Class 10-A** and **Ananya Sharma - Class 8-B**) without logging out!
  - Child Academic Performance & Attendance summary.
  - Online Fee Payment for active child & instant receipt generation.
  - Submit leave application for child.
  - Bus route & driver contact details.
- **Accountant Portal (Mr. Vikram Malhotra)**:
  - Financial metrics (total billed, collected, outstanding balance, concessions).
  - Student Invoicing desk & fee collection.
  - Printable verified receipts.
- **Librarian Portal (Ms. Priya Nair)**:
  - Master book catalogue with shelf locations & copy tracking.
  - Issue & Return book desk with automatic overdue fine calculation.
- **Transport Manager Portal (Mr. Rakesh Verma)**:
  - Vehicle fleet status, driver details, license, and insurance tracking.
  - Routes, stops, pickup/drop schedules.
  - Student transport route assignment.
- **Campus AI School Assistant**:
  - Grounded AI chatbot answering institutional queries on CBSE guidelines, fee deadlines, attendance thresholds, and drafting official notices.

---

## 🚀 Quick Demo Login Credentials

The application includes a **1-Click Demo Bar** at the top of the interface allowing instant switching between roles:

| Role | Username | Password | Persona & Responsibility |
|---|---|---|---|
| **Super Admin** | `admin` | `admin123` | Dr. Arthur Pendleton (Institutional ERP Head) |
| **Teacher** | `teacher` | `teacher123` | Mrs. Sarah Jenkins (Class 10-A Class Teacher & Math PGT) |
| **Student** | `student` | `student123` | Aarav Sharma (Class 10-A, Roll #1) |
| **Parent** | `parent` | `parent123` | Rajesh Sharma (Linked to both Aarav & Ananya Sharma) |
| **Accountant** | `accountant` | `accountant123` | Vikram Malhotra (Finance & Fees Desk) |
| **Librarian** | `librarian` | `librarian123` | Priya Nair (Library Catalogue & Book Circulation) |
| **Transport Manager** | `transport` | `transport123` | Rakesh Verma (Bus Fleet & Logistics) |

---

## 🗄️ Database Architecture (PostgreSQL)

The database strictly implements **Section 23 of the SRS** with 30+ relational entities, foreign keys, constraints, and audit logging:

1. **Identity & Access**: `users`, `sessions`, `login_attempts`
2. **School Setup**: `schools`, `branches`, `academic_years`, `terms`, `holidays`
3. **Academics**: `classes`, `sections`, `subjects`, `class_subjects`, `rooms`, `timetables`
4. **Teachers & Staff**: `teachers`, `staff`, `departments`, `teacher_assignments`
5. **Students & Guardians**: `students`, `guardians`, `student_guardians`, `student_documents`, `enrollments`
6. **Attendance & Leaves**: `attendance_sessions`, `attendance`, `leave_requests`, `attendance_corrections`
7. **Examinations & Results**: `exams`, `exam_schedules`, `marks`, `grading_scales`, `report_cards`
8. **Learning & Assignments**: `assignments`, `submissions`, `quizzes`, `quiz_attempts`, `learning_resources`
9. **Finance & Fees**: `fee_heads`, `fee_structures`, `invoices`, `payments`, `receipts`, `refunds`
10. **Operations**: `books`, `book_issues`, `vehicles`, `routes`, `stops`, `student_transport`, `hostel_rooms`, `visitors`
11. **Communication & Audits**: `announcements`, `messages`, `admission_applications`, `enquiries`, `audit_logs`

### Dual PostgreSQL Engine Support
- **External PostgreSQL**: Set `DATABASE_URL=postgres://user:password@localhost:5432/school_erp` in `.env` to connect directly to any PostgreSQL server.
- **Embedded PostgreSQL (PGlite)**: If no external server is running, the app automatically initializes an embedded, high-performance PostgreSQL 18.6 WASM engine persisted in `./server/data/postgres_db`, ensuring **zero configuration and 100% immediate out-of-the-box readiness** on any machine!

---

## 🛠️ Project Structure

```
SMS_Project/
├── client/                     # React.js Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── RoleDemoBar.jsx         # 1-Click Role Switcher bar
│   │   │   ├── AiAssistantModal.jsx    # School AI Bot Modal
│   │   │   ├── ReportCardModal.jsx     # Printable Official Report Card
│   │   │   ├── IdCardModal.jsx         # Printable Digital Student ID Card
│   │   │   └── ReceiptModal.jsx        # Printable Verified Fee Receipt
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Authentication & Active Child Context
│   │   ├── pages/
│   │   │   ├── PublicWebsite.jsx       # Public School Webpages & Admissions
│   │   │   ├── LoginModal.jsx          # Institutional Sign-In Modal
│   │   │   ├── admin/AdminPortal.jsx   # Admin ERP Shell & Tabs
│   │   │   ├── teacher/TeacherPortal.jsx # Attendance, Homework, Marks Entry
│   │   │   ├── student/StudentPortal.jsx # Student Dashboard, Quizzes, Fees
│   │   │   ├── parent/ParentPortal.jsx   # Multi-Child Switcher & Monitor
│   │   │   ├── accountant/AccountantPortal.jsx # Financial Desk
│   │   │   ├── librarian/LibrarianPortal.jsx   # Book Circulation
│   │   │   └── transport/TransportPortal.jsx   # Bus Logistics
│   │   ├── services/api.js     # Centralized Fetch Client
│   │   ├── App.jsx             # Root Application Router
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Node.js + Express Backend
│   ├── db/
│   │   ├── index.js            # Dual PostgreSQL Connection Manager
│   │   ├── schema.sql          # Complete 30+ Tables PostgreSQL DDL
│   │   └── seed.js             # Realistic Institutional Seed Data
│   ├── middleware/
│   │   └── auth.js             # JWT Verification & RBAC Guard
│   ├── routes/
│   │   ├── auth.js             # Authentication & Child Switching
│   │   ├── public.js           # Public Info, Admissions & Enquiries
│   │   ├── students.js         # Student Profiles & ID Cards
│   │   ├── academics.js        # Classes, Subjects & Timetables
│   │   ├── attendance.js       # Daily Attendance & Leave Approvals
│   │   ├── assignments.js      # Homework, Submissions & Online Quizzes
│   │   ├── exams.js            # Exams, Marks Sheet & Report Cards
│   │   ├── fees.js             # Invoices, Gateway Checkout & Receipts
│   │   ├── library.js          # Books Catalogue & Fines
│   │   ├── transport.js        # Vehicle Routes & Student Allocations
│   │   ├── communication.js    # Circulars & Messaging
│   │   ├── admin.js            # Dashboard KPIs, Users & CSV Exports
│   │   └── ai.js               # Policy Chatbot & Notice Drafter
│   ├── test/
│   │   └── e2e.test.js         # End-to-End Test Suite
│   └── index.js                # Express Server Entrypoint
└── package.json
```

---

## 🏃 Getting Started

### 1. Install Dependencies
Dependencies are already installed. If needed:
```bash
npm install
cd client && npm install && cd ..
```

### 2. Run the Application
You can run the full application with a single command:
```bash
# Starts the Express backend on port 5000 (which also serves the client build)
npm start
```
Or run backend and frontend separately in development mode:
```bash
# Terminal 1: Start Backend API (Port 5000)
npm run server

# Terminal 2: Start React Frontend (Port 5173 with hot reload)
npm run client
```

### 3. Open in Browser
- **Public School Website & Portals**: [http://localhost:5000](http://localhost:5000) (or `http://localhost:5173` in dev mode)
- Use the **1-Click Demo Roles** bar at the top to explore:
  - **Admin ERP**
  - **Teacher**
  - **Student**
  - **Parent (Multi-Child)**
  - **Accountant**
  - **Librarian**
  - **Transport**
  - **Public Website**

### 4. Run Automated Test Suite
```bash
node server/test/e2e.test.js
```
All 10 integration test cases (AUTH, STU, ATT, EXM, FEE, AI, Admissions) validate successfully.
