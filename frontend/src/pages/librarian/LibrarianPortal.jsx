import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { BookOpen, Plus, Search, CheckCircle2, RotateCcw } from 'lucide-react';

export default function LibrarianPortal() {
  const [books, setBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);

  // New book state
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Science',
    totalCopies: 5,
    shelfLocation: 'Shelf SCI-201'
  });

  // Issue state
  const [issueData, setIssueData] = useState({
    bookId: '',
    studentId: '1',
    loanDays: 14
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [bks, issues] = await Promise.all([api.getBooks(), api.getIssuedBooks()]);
      setBooks(bks || []);
      setIssuedBooks(issues || []);
    } catch (err) {
      console.error(err);
    }
  }

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await api.addBook(newBook);
      alert('Book added to library catalogue!');
      setShowAddModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to add book');
    }
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    try {
      const res = await api.issueBook(issueData);
      alert(res.message);
      setShowIssueModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to issue book');
    }
  };

  const handleReturnBook = async (issueId) => {
    try {
      const res = await api.returnBook({ issueId });
      alert(res.message);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to return book');
    }
  };

  const filteredBooks = books.filter((b) =>
    `${b.title} ${b.author} ${b.category}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 bg-slate-100 min-h-[calc(100vh-80px)] font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
              Library Management
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">Book Catalogue & Circulation Desk</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowIssueModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm"
            >
              Issue Book
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Book</span>
            </button>
          </div>
        </div>

        {/* Issued books active list */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Active Borrowed Books & Due Dates</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Book Title</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Issue Date</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {issuedBooks.map((ib) => (
                  <tr key={ib.id}>
                    <td className="p-3 font-bold text-slate-900">{ib.book_title}</td>
                    <td className="p-3 text-slate-700">{ib.first_name} {ib.last_name}</td>
                    <td className="p-3 text-slate-500">{new Date(ib.issue_date).toLocaleDateString()}</td>
                    <td className="p-3 font-semibold text-red-600">{new Date(ib.due_date).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ib.status === 'Issued' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {ib.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {ib.status === 'Issued' && (
                        <button
                          onClick={() => handleReturnBook(ib.id)}
                          className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 shadow-xs"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Return Book</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Catalogue Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900">Master Book Catalogue</h2>
            <input
              type="text"
              placeholder="Search by title, author, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border rounded-xl text-xs bg-slate-50 w-64"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBooks.map((b) => (
              <div key={b.id} className="p-4 border rounded-xl bg-slate-50 flex justify-between items-center text-xs">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{b.title}</h3>
                  <p className="text-slate-600">Author: {b.author} • Category: {b.category}</p>
                  <span className="text-[10px] text-slate-400 font-mono">ISBN: {b.isbn} • {b.shelf_location}</span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-black text-xs block">
                    {b.available_copies} / {b.total_copies}
                  </span>
                  <span className="text-[9px] text-slate-400">Available</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Add Book */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-base text-slate-900 mb-3">Add Book to Catalogue</h3>
            <form onSubmit={handleAddBook} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-slate-50"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Author Name *</label>
                <input
                  type="text"
                  required
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-slate-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={newBook.category}
                    onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                    className="w-full p-2 border rounded-xl bg-slate-50"
                  >
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Literature">Literature</option>
                    <option value="History">History</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Total Copies</label>
                  <input
                    type="number"
                    value={newBook.totalCopies}
                    onChange={(e) => setNewBook({ ...newBook, totalCopies: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded-xl bg-slate-50"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Issue Book */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-base text-slate-900 mb-3">Issue Book to Student</h3>
            <form onSubmit={handleIssueBook} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Select Book *</label>
                <select
                  required
                  value={issueData.bookId}
                  onChange={(e) => setIssueData({ ...issueData, bookId: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-slate-50"
                >
                  <option value="">Choose a book...</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>{b.title} ({b.available_copies} available)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Student ID (Aarav is ID 1) *</label>
                <input
                  type="number"
                  required
                  value={issueData.studentId}
                  onChange={(e) => setIssueData({ ...issueData, studentId: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-slate-50"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Issue Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
