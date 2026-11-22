# School Management System (KRPS ERP) - Frontend

A modern, responsive, and role-based School Enterprise Resource Planning (ERP) & Student Portal frontend application built with **React 18**, **Vite**, **Tailwind CSS**, and **Lucide Icons**.

---

## 🚀 Key Modules & Portals

* **Public School Website**:
  * Homepage with leadership messaging, academic programs, campus infrastructure, photo gallery, circulars, and interactive 2027 online admissions form.
* **Super Admin / Administrative Portal**:
  * Live institutional KPI dashboard (attendance %, fee collection, active enrollment).
  * Admissions queue management.
  * Complete CRUD for Teachers (Create, View, Edit, Delete).
  * CRUD for Staff (Librarians, Accountants, Transport Fleet & Drivers).
  * Student directory with official branded Digital ID Cards.
  * Class structure, section allocation, conflict-free timetable management.
  * Comprehensive CSV data export (Students registry, Fee invoices).
* **Teacher Portal**:
  * Daily 1-click class attendance recording.
  * Homework & coursework dispatcher.
  * Student submissions evaluator with marks and feedback.
  * Term exam marks entry and publishing.
* **Student & Parent Portal**:
  * Live academic dashboard and attendance calendar.
  * Official Digital ID Card with QR/barcode format.
  * Interactive timed online quizzes.
  * Official branded examination report cards with watermarking.
  * Fee invoices overview and simulated online payment checkout.
* **Support Staff Portals**:
  * Accountant Portal (Fee billing, collection, receipts).
  * Librarian Portal (Book catalogue, issue/return logging, overdue tracking).
  * Transport Portal (Fleet tracking, bus routes, pickup stops).

---

## 🛠️ Tech Stack

* **Framework**: React 18 (SPA)
* **Build Tool**: Vite
* **Styling**: Tailwind CSS, PostCSS, Autoprefixer
* **Icons**: Lucide React
* **State & Networking**: React Context API, Fetch API Client

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The application will be live at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```
Production assets will be output to the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 📁 Project Structure

```
client/
├── public/              # Static assets & public images
├── src/
│   ├── assets/          # Component assets & styling
│   ├── components/      # Reusable UI components & modals
│   ├── context/         # AuthContext & global session providers
│   ├── pages/           # Portals (admin, teacher, student, parent, staff, public)
│   ├── services/        # Centralized REST API client
│   ├── App.jsx          # Root view router & portal switcher
│   ├── main.jsx         # Application entry point
│   └── index.css        # Tailwind styling & animations
├── index.html           # HTML shell
├── package.json         # Dependencies & scripts
├── tailwind.config.js   # Tailwind design tokens
└── vite.config.js       # Vite configuration
```
