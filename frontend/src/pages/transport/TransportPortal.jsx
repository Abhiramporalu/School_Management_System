import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Bus, MapPin, Phone, Shield, Plus, CheckCircle2 } from 'lucide-react';

export default function TransportPortal() {
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState({
    studentId: '1',
    routeId: '1',
    stopId: '2'
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [rts, vh] = await Promise.all([api.getTransportRoutes(), api.getVehicles()]);
      setRoutes(rts || []);
      setVehicles(vh || []);
    } catch (err) {
      console.error(err);
    }
  }

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await api.assignTransport(assignForm);
      alert('Student transport assigned successfully!');
      setShowAssignModal(false);
    } catch (err) {
      alert(err.message || 'Failed to assign transport');
    }
  };

  return (
    <div className="flex-1 p-6 bg-slate-100 min-h-[calc(100vh-80px)] font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase text-orange-800 bg-orange-100 px-2.5 py-0.5 rounded-full">
              Transport Logistics
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">Bus Fleet, Routes & Stops Management</h1>
          </div>
          <button
            onClick={() => setShowAssignModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm"
          >
            Assign Student to Route
          </button>
        </div>

        {/* Vehicles list */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Fleet Vehicles & Driver Registry</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map((v) => (
              <div key={v.id} className="p-4 border rounded-xl bg-slate-50 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-sm text-blue-900">{v.registration_no}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {v.status}
                  </span>
                </div>
                <p className="text-slate-700">Type: <strong>{v.vehicle_type}</strong> (Capacity: {v.capacity} seats)</p>
                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-slate-600">
                  <p>Driver: <strong>{v.driver_name}</strong></p>
                  <p>Contact: <span className="font-mono">{v.driver_phone}</span></p>
                  <p>Helper: <span>{v.helper_name}</span></p>
                  <p>Licence: <span className="font-mono text-[10px]">{v.license_no}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Routes & Stops */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Active Campus Bus Routes & Schedule</h2>
          <div className="space-y-4">
            {routes.map((r) => (
              <div key={r.id} className="p-4 border rounded-xl bg-slate-50 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <strong className="text-sm font-bold text-slate-900">{r.route_name}</strong>
                  <span className="text-slate-500 font-mono">Bus: {r.registration_no}</span>
                </div>
                <p className="text-slate-600">Start: {r.start_point} ➔ Terminus: {r.end_point}</p>
                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Route Stops:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                    {r.stops && r.stops.map((st) => (
                      <div key={st.id} className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px]">
                        <strong className="block text-slate-800">#{st.stop_order} {st.stop_name}</strong>
                        <span className="text-slate-500">Pick: {st.pickup_time} • Drop: {st.drop_time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Assign */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-base text-slate-900 mb-3">Assign Student to Transport Route</h3>
            <form onSubmit={handleAssign} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Student ID (Aarav is 1) *</label>
                <input
                  type="number"
                  required
                  value={assignForm.studentId}
                  onChange={(e) => setAssignForm({ ...assignForm, studentId: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-slate-50"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Select Route *</label>
                <select
                  value={assignForm.routeId}
                  onChange={(e) => setAssignForm({ ...assignForm, routeId: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-slate-50"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>{r.route_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Select Pickup Stop *</label>
                <select
                  value={assignForm.stopId}
                  onChange={(e) => setAssignForm({ ...assignForm, stopId: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-slate-50"
                >
                  <option value="1">Kadugodi Metro Depot</option>
                  <option value="2">Prestige Ozone Main Gate</option>
                  <option value="3">ITPL Gate 3</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
