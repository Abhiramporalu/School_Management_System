import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  GraduationCap,
  Award,
  Users,
  BookOpen,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  Clock,
  Compass,
  HeartHandshake
} from 'lucide-react';

export default function PublicWebsite({ onOpenLogin, onOpenRegister }) {
  const [activeTab, setActiveTab] = useState('home');
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);

  // Admission application form state
  const [appForm, setAppForm] = useState({
    studentName: '',
    dob: '',
    gender: 'Male',
    gradeApplying: 'Grade 9',
    previousSchool: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: ''
  });
  const [appSuccess, setAppSuccess] = useState(null);
  const [appLoading, setAppLoading] = useState(false);

  // Enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [aData, eData, gData] = await Promise.all([
          api.getPublicAnnouncements(),
          api.getPublicEvents(),
          api.getPublicGallery()
        ]);
        setAnnouncements(aData || []);
        setEvents(eData || []);
        setGallery(gData || []);
      } catch (err) {
        console.error('Failed to load public website content:', err);
      }
    }
    loadData();
  }, []);

  const handleAdmissionSubmit = async (e) => {
    e.preventDefault();
    setAppLoading(true);
    try {
      const res = await api.submitAdmissionApplication(appForm);
      setAppSuccess(res);
      setAppForm({
        studentName: '',
        dob: '',
        gender: 'Male',
        gradeApplying: 'Grade 9',
        previousSchool: '',
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        address: ''
      });
    } catch (err) {
      alert(err.message || 'Failed to submit admission application');
    } finally {
      setAppLoading(false);
    }
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setEnquiryLoading(true);
    try {
      await api.submitEnquiry(enquiryForm);
      setEnquirySuccess(true);
      setEnquiryForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      alert(err.message || 'Failed to submit enquiry');
    } finally {
      setEnquiryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Banner */}
      <div className="bg-blue-950 text-blue-200 text-xs py-2 px-4 sm:px-8 flex flex-wrap justify-between items-center border-b border-blue-900">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <Phone className="w-3.5 h-3.5 text-amber-400" /> +91 (80) 4567-8900
          </span>
          <span className="hidden sm:flex items-center gap-1.5 font-medium">
            <Mail className="w-3.5 h-3.5 text-amber-400" /> admissions@krps.edu.in
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
            Admissions Open 2027-28
          </span>
          <button
            onClick={() => {
              setActiveTab('admissions');
              window.scrollTo({ top: 600, behavior: 'smooth' });
            }}
            className="text-white hover:text-amber-300 underline font-semibold text-[11px]"
          >
            Apply Online
          </button>
        </div>
      </div>

      {/* Main Header & Navbar */}
      <header className="bg-white/95 backdrop-blur-md sticky top-7 z-30 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <img
              src="/logo.jpg"
              alt="KRPS Logo"
              className="w-11 h-11 rounded-2xl object-contain bg-white border border-slate-200 p-0.5 shadow-md"
            />
            <div>
              <h1 className="font-extrabold text-lg sm:text-xl text-blue-950 tracking-tight leading-none">
                KRPS
              </h1>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                Excellence in Education • CBSE Affiliation #89412
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-600">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About & Leadership' },
              { id: 'academics', label: 'Academics' },
              { id: 'facilities', label: 'Facilities' },
              { id: 'admissions', label: 'Admissions' },
              { id: 'events', label: 'Events & News' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'contact', label: 'Contact' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 font-extrabold shadow-sm'
                    : 'hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Sign In & Register CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenRegister ? onOpenRegister('student') : (onOpenLogin && onOpenLogin('student'))}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all transform hover:-translate-y-0.5"
            >
              <span>Register</span>
            </button>
            <button
              onClick={() => onOpenLogin && onOpenLogin()}
              className="bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <span>Portal Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {activeTab === 'home' && (
        <main className="flex-1">
          <section className="relative bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white py-20 px-4 sm:px-8 overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/30 text-amber-300 font-semibold px-3 py-1 rounded-full text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ranked Top 5 CBSE International School in Bengaluru</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                  Empowering Young Minds for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">Global Tomorrow</span>
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                  KRPS provides holistic educational excellence from Kindergarten to Grade 12. Combining cutting-edge AI & STEM labs, competitive sports facilities, and strong moral leadership.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('admissions')}
                    className="bg-amber-400 hover:bg-amber-500 text-blue-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105"
                  >
                    Apply for Admission 2027
                  </button>
                  <button
                    onClick={() => setActiveTab('academics')}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-5 py-3 rounded-xl text-xs transition-colors"
                  >
                    Explore Curriculum
                  </button>
                  <button
                    onClick={onOpenLogin}
                    className="bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/30 font-bold px-5 py-3 rounded-xl text-xs transition-colors"
                  >
                    Launch ERP Portal
                  </button>
                </div>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-4 gap-4 pt-6 border-t border-slate-800 text-center">
                  <div>
                    <h3 className="text-2xl font-black text-amber-300">100%</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">CBSE Pass Rate</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-amber-300">18:1</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Student-Teacher</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-amber-300">25+</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Years Legacy</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-amber-300">15+</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Acre Campus</p>
                  </div>
                </div>
              </div>

              {/* Right Hero Image Card */}
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 relative">
                  <img
                    src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80"
                    alt="KRPS Campus"
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <p className="text-xs text-amber-300 font-bold">Campus Announcement</p>
                    <h4 className="text-sm font-semibold text-white">Annual Inter-School Science & Innovation Expo 2026</h4>
                    <span className="text-[10px] text-slate-400">Scheduled for December 5-6 • Registrations Open</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Pillars of Excellence */}
          <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Why Choose KRPS?</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                A Benchmark in Academic & Personal Excellence
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Award,
                  title: 'Rigorous Academic Rigor',
                  desc: 'Comprehensive CBSE curriculum supplemented with advanced problem solving, coding, and competitive exam foundations.'
                },
                {
                  icon: Compass,
                  title: 'Future-Ready STEM & AI Labs',
                  desc: 'Hands-on robotics, machine learning, physics, and biotechnology labs designed to foster scientific curiosity.'
                },
                {
                  icon: HeartHandshake,
                  title: 'Holistic Student Care',
                  desc: 'Individual mentoring, sports academies, music & arts conservatories, and transparent parent-teacher collaboration.'
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Latest Announcements */}
          <section className="bg-slate-100 py-12 px-4 sm:px-8 border-y border-slate-200">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Official Circulars & News</h2>
                  <p className="text-xs text-slate-500">Stay informed with the latest updates from the school administration</p>
                </div>
                <button onClick={() => setActiveTab('events')} className="text-xs font-bold text-blue-600 hover:underline">
                  View All Events →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {announcements.slice(0, 4).map((ann) => (
                  <div key={ann.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                          ann.priority === 'Urgent' ? 'bg-red-100 text-red-700' :
                          ann.priority === 'Important' ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {ann.priority}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(ann.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-800">{ann.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{ann.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* About & Leadership Tab */}
      {activeTab === 'about' && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-8 flex-1">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Leadership & Heritage</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Our Mission & Guiding Principles</h2>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-10">
            <div className="lg:col-span-1 text-center">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80"
                alt="Principal & Administrator Abhiram"
                className="w-48 h-48 rounded-2xl object-cover mx-auto shadow-md mb-3 border-4 border-slate-100"
              />
              <h3 className="font-bold text-base text-slate-900">Abhiram</h3>
              <p className="text-xs text-blue-600 font-semibold">Principal & Head of Institution</p>
              <p className="text-[11px] text-slate-400">M.Sc., M.Ed., Ph.D. in Educational Pedagogy</p>
            </div>
            <div className="lg:col-span-2 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <h4 className="text-lg font-bold text-blue-950">Welcome to KRPS</h4>
              <p>
                At KRPS, education goes far beyond examinations. We believe in nurturing critical thinkers, ethical leaders, and empathetic global citizens. Our academic framework is designed to bridge the gap between classroom theory and real-world application.
              </p>
              <p>
                With state-of-the-art laboratory infrastructure, sports pavilions, digital classrooms, and our centralised School ERP platform, we ensure parents, students, and teachers remain synchronised in supporting every child's individual aspirations.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-blue-600 italic text-slate-600 text-xs">
                "Our commitment is simple: Every child who enters our gates receives the guidance, resources, and encouragement to realise their highest human potential."
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Academics Tab */}
      {activeTab === 'academics' && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-8 flex-1">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Curriculum & Pedagogy</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Academic Programmes from Kindergarten to Grade 12</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-emerald-600 uppercase">Foundational Wing</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">Pre-Primary to Grade 5</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Activity-based learning, phonics mastery, foundational mathematics, environmental awareness, and expressive arts.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-700">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Experiential play-way methodology</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Language & phonetics immersion</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Creative expression and physical coordination</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-blue-600 uppercase">Middle Years</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">Grades 6 to 8</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Transition to structured subject specialisation in Pure Sciences, Mathematics, Social Studies, Coding & Robotics, and Languages.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-700">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Integrated Science laboratory practicals</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Python programming & computer science</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Third language proficiency (Hindi, Sanskrit, French)</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-purple-600 uppercase">Senior Secondary</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">Grades 9 to 12 (Board Prep)</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Rigorous preparation for CBSE Board examinations along with integrated foundational training for JEE, NEET, and CUET competitive entrances.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-700">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> Science Stream: Physics, Chem, Maths/Bio, CS</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> Regular unit tests and mock board simulations</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> Career counselling and college application guidance</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Facilities Tab */}
      {activeTab === 'facilities' && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-8 flex-1">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Campus Infrastructure</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">World-Class Facilities for Modern Learners</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((fac) => (
              <div key={fac.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <img src={fac.url} alt={fac.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <span className="text-[10px] font-bold text-blue-600 uppercase">{fac.category}</span>
                  <h4 className="font-bold text-sm text-slate-800 mt-1">{fac.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Admissions Tab (Interactive Application Form) */}
      {activeTab === 'admissions' && (
        <section className="py-12 max-w-5xl mx-auto px-4 sm:px-8 flex-1">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Join Our Academic Community</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Online Admission Application (2027-2028)</h2>
            <p className="text-xs text-slate-500 mt-2">
              Fill in the candidate and guardian details below to register your child. Applications are reviewed sequentially.
            </p>
          </div>

          {appSuccess ? (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-8 text-center max-w-xl mx-auto shadow-sm">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-emerald-950">Application Successfully Submitted!</h3>
              <p className="text-xs text-emerald-800 mt-2 leading-relaxed">
                Your admission application has been registered with reference ID:
              </p>
              <div className="my-4 bg-white border border-emerald-200 py-3 px-6 rounded-xl inline-block font-mono font-black text-xl text-emerald-700 tracking-wider shadow-inner">
                {appSuccess.applicationNo}
              </div>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Please note down this application number. You will receive an invitation email for document verification and interaction.
              </p>
              <button
                onClick={() => setAppSuccess(null)}
                className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-xl text-xs"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg">
              <form onSubmit={handleAdmissionSubmit} className="space-y-6 text-xs">
                {/* Student Details */}
                <div>
                  <h4 className="font-bold text-sm text-blue-950 border-b border-slate-100 pb-2 mb-4">
                    1. Student Candidate Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Student Full Name *</label>
                      <input
                        type="text"
                        required
                        value={appForm.studentName}
                        onChange={(e) => setAppForm({ ...appForm, studentName: e.target.value })}
                        placeholder="e.g. Reyansh Kulkarni"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
                      <input
                        type="date"
                        required
                        value={appForm.dob}
                        onChange={(e) => setAppForm({ ...appForm, dob: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                      <select
                        value={appForm.gender}
                        onChange={(e) => setAppForm({ ...appForm, gender: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Grade Applying For *</label>
                      <select
                        value={appForm.gradeApplying}
                        onChange={(e) => setAppForm({ ...appForm, gradeApplying: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option value="Kindergarten">Kindergarten / Nursery</option>
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 6">Grade 6</option>
                        <option value="Grade 7">Grade 7</option>
                        <option value="Grade 8">Grade 8</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11 - Science">Grade 11 - Science</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Previous School Attended</label>
                      <input
                        type="text"
                        value={appForm.previousSchool}
                        onChange={(e) => setAppForm({ ...appForm, previousSchool: e.target.value })}
                        placeholder="e.g. Bishop Cotton Boys School, Bangalore"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Parent / Guardian Details */}
                <div>
                  <h4 className="font-bold text-sm text-blue-950 border-b border-slate-100 pb-2 mb-4">
                    2. Parent / Guardian Contact Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Parent/Guardian Name *</label>
                      <input
                        type="text"
                        required
                        value={appForm.parentName}
                        onChange={(e) => setAppForm({ ...appForm, parentName: e.target.value })}
                        placeholder="e.g. Mahesh Kulkarni"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Contact Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={appForm.parentPhone}
                        onChange={(e) => setAppForm({ ...appForm, parentPhone: e.target.value })}
                        placeholder="+91 98451 22334"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={appForm.parentEmail}
                        onChange={(e) => setAppForm({ ...appForm, parentEmail: e.target.value })}
                        placeholder="parent@example.com"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
                      <input
                        type="text"
                        value={appForm.address}
                        onChange={(e) => setAppForm({ ...appForm, address: e.target.value })}
                        placeholder="Flat / House No, Street, Area, Bengaluru, Pin code"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={appLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50"
                  >
                    <span>{appLoading ? 'Submitting Application...' : 'Submit Official Admission Application'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-2">
                    Submission assigns a unique application code. Verification documents will be collected during the counselor interaction.
                  </p>
                </div>
              </form>
            </div>
          )}
        </section>
      )}

      {/* Events & News Tab */}
      {activeTab === 'events' && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-8 flex-1">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Campus Happenings</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Upcoming Events & School Calendar</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((evt) => (
              <div key={evt.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <img src={evt.image} alt={evt.title} className="w-full h-44 object-cover" />
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {evt.category}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" /> {evt.date}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 mb-2">{evt.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">{evt.description}</p>
                    <div className="text-[11px] text-slate-500 space-y-1">
                      <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-500" /> {evt.time}</p>
                      <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-red-500" /> {evt.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery Tab */}
      {activeTab === 'gallery' && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-8 flex-1">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Campus Tour</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Life at KRPS in Pictures</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {gallery.map((item) => (
              <div key={item.id} className="group relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-300 tracking-wider">{item.category}</span>
                    <h4 className="text-white text-sm font-semibold">{item.title}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <section className="py-12 max-w-5xl mx-auto px-4 sm:px-8 flex-1">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Get In Touch</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Campus Location & Enquiry Desk</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact details */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 text-xs">
              <h3 className="text-base font-bold text-blue-950">Campus Headquarters</h3>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-800 text-sm">KRPS</strong>
                  <p className="text-slate-600 leading-relaxed mt-0.5">
                    42 Silicon Valley Boulevard, Whitefield, Bengaluru, Karnataka 560066, India
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <strong className="block text-slate-800">Phone Help Desk:</strong>
                  <span className="text-slate-600">+91 (80) 4567-8900 / +91 (80) 4567-8901</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <strong className="block text-slate-800">Official Admissions:</strong>
                  <span className="text-slate-600">admissions@krps.edu.in</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 mb-1.5">Visiting Hours for Visitors & Parents</h4>
                <p className="text-slate-500">
                  Monday – Friday: 08:30 AM – 03:30 PM<br />
                  Saturday: 09:00 AM – 01:00 PM<br />
                  (Prior visitor pass registration at the reception desk required)
                </p>
              </div>
            </div>

            {/* Quick Enquiry Form */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-blue-950 mb-3">Send an Online Enquiry</h3>
              {enquirySuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h4 className="font-bold text-emerald-900">Enquiry Received!</h4>
                  <p className="text-emerald-700 mt-1">Our administrative counsellor will respond to your query shortly.</p>
                  <button
                    onClick={() => setEnquirySuccess(false)}
                    className="mt-4 px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      placeholder="e.g. Kavita Raman"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={enquiryForm.email}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                        placeholder="name@email.com"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                        placeholder="+91..."
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={enquiryForm.subject}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, subject: e.target.value })}
                      placeholder="e.g. CBSE Grade 11 Science admission"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Message *</label>
                    <textarea
                      required
                      rows={3}
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                      placeholder="How can we assist you?"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={enquiryLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm"
                  >
                    {enquiryLoading ? 'Sending...' : 'Send Enquiry Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs pt-12 pb-8 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img
                src="/logo.jpg"
                alt="KRPS Logo"
                className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 shadow-xs border border-slate-700"
              />
              <span className="font-bold text-white text-sm">KRPS</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Affiliated to CBSE, New Delhi. Dedicated to fostering high academic achievement, athletic excellence, and visionary character.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => setActiveTab('about')} className="hover:text-white">About & Leadership</button></li>
              <li><button onClick={() => setActiveTab('academics')} className="hover:text-white">Academics & Curriculum</button></li>
              <li><button onClick={() => setActiveTab('facilities')} className="hover:text-white">Campus Facilities</button></li>
              <li><button onClick={() => setActiveTab('admissions')} className="hover:text-white">Online Admissions 2027</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">User Portals & Login</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => onOpenLogin && onOpenLogin('student')} className="hover:text-white">Student Portal Sign In / Register</button></li>
              <li><button onClick={() => onOpenLogin && onOpenLogin('parent')} className="hover:text-white">Parent / Guardian Portal Sign In</button></li>
              <li><button onClick={() => onOpenLogin && onOpenLogin('teacher')} className="hover:text-white">Teacher Portal Sign In / Register</button></li>
              <li><button onClick={() => onOpenLogin && onOpenLogin('admin')} className="hover:text-white">Admin Management ERP</button></li>
              <li><button onClick={() => onOpenLogin && onOpenLogin('accountant')} className="hover:text-white">Accountant Finance Portal</button></li>
              <li><button onClick={() => onOpenLogin && onOpenLogin('librarian')} className="hover:text-white">Librarian Circulation Desk</button></li>
              <li><button onClick={() => onOpenLogin && onOpenLogin('transport_mgr')} className="hover:text-white">Transport Fleet Portal</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Campus Office</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              42 Silicon Valley Boulevard, Whitefield, Bengaluru, KA 560066<br />
              Email: info@krps.edu.in<br />
              Emergency Line: +91 98450 11001
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 border-t border-slate-800 text-center text-[10px] text-slate-500 flex flex-wrap justify-between items-center gap-2">
          <span>© 2026 KRPS. Complete School ERP & Student Portal. All rights reserved.</span>
          <span>Complies with CBSE Guidelines & Data Privacy Norms</span>
        </div>
      </footer>
    </div>
  );
}
