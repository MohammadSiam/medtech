import React, { useState, useEffect } from "react";
import { Calendar, UserPlus, Clock, Heart, Filter, UserCheck, AlertCircle } from "lucide-react";
import { Appointment, Doctor } from "../types";

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter doctor selection
  const [doctorFilter, setDoctorFilter] = useState("All");

  // Booking Form State
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [preferredDate, setPreferredDate] = useState("2026-05-28");
  const [preferredTime, setPreferredTime] = useState("10:00 AM");
  const [priority, setPriority] = useState("Normal");
  const [type, setType] = useState("Offline");
  const [notes, setNotes] = useState("");

  const fetchAppointmentsAndDoctors = async () => {
    try {
      const aRes = await fetch("/api/appointments");
      const aList = await aRes.json();
      setAppointments(Array.isArray(aList) ? aList : []);

      const dRes = await fetch("/api/doctors");
      const dList = await dRes.json();
      const activeDocs = Array.isArray(dList) ? dList.filter((d: any) => d.status === "Active") : [];
      setDoctors(activeDocs);
      if (activeDocs.length > 0) setSelectedDoctorId(activeDocs[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentsAndDoctors();
  }, []);

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone || !selectedDoctorId) {
      alert("Patient Name, Contact, and Doctor are mandatory fields.");
      return;
    }

    const payload = {
      patientId: null, // Walk-in profile creator on server side
      patientName,
      patientPhone,
      doctorId: selectedDoctorId,
      date: preferredDate,
      preferredTime,
      priority,
      type,
      notes
    };

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setPatientName("");
        setPatientPhone("");
        setNotes("");
        fetchAppointmentsAndDoctors();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateAppointmentStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/appointments/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      fetchAppointmentsAndDoctors();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAppointments = appointments.filter(app => 
    doctorFilter === "All" || app.doctorId === doctorFilter
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Clinician Slot Booking form */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-4 h-fit text-xs font-semibold text-slate-600">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <Calendar className="h-4 w-4 text-sky-500" />
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">Schedule Serials</h3>
        </div>

        <form onSubmit={handleBookAppointment} className="space-y-4">
          <div>
            <label className="block mb-1">Patient Full Name *</label>
            <input 
              type="text" 
              placeholder="e.g. Arif Rahman" 
              value={patientName}
              onChange={e => setPatientName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 focus:outline-sky-500"
            />
          </div>

          <div>
            <label className="block mb-1">Mobile Contact No *</label>
            <input 
              type="text" 
              placeholder="01711-XXXXXX" 
              value={patientPhone}
              onChange={e => setPatientPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 font-mono"
            />
          </div>

          <div>
            <label className="block mb-1">Consulting Physician *</label>
            <select 
              value={selectedDoctorId}
              onChange={e => setSelectedDoctorId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 font-bold"
            >
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Filing Date *</label>
              <input 
                type="date" 
                value={preferredDate}
                onChange={e => setPreferredDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block mb-1">Select Time slot *</label>
              <input 
                type="text" 
                placeholder="e.g. 11:30 AM" 
                value={preferredTime}
                onChange={e => setPreferredTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div>
              <label className="block text-[10px] uppercase text-slate-400 mb-1">Priority Mode</label>
              <select 
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="w-full bg-white border border-slate-200 p-1.5 rounded"
              >
                <option>Normal</option>
                <option>Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-slate-400 mb-1">Admission Type</label>
              <select 
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full bg-white border border-slate-200 p-1.5 rounded font-bold"
              >
                <option>Offline</option>
                <option>Online</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1">Reason / Symptoms (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g. Diabetic routine check, post viral fever" 
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 focus:outline-none"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded-lg shadow-xs leading-5 transition text-xs tracking-wider"
          >
            Filing Appointment Serial
          </button>
        </form>
      </div>

      {/* Appointment schedule book */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-8 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Doctor Schedule Ledger</h3>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-slate-400 text-xs font-semibold whitespace-nowrap">Filter doctor:</span>
            <select 
              value={doctorFilter}
              onChange={e => setDoctorFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded p-1.5 text-xs text-slate-650 focus:outline-none"
            >
              <option value="All">All Active Serials</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 font-mono text-xs">Filing slots...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <th className="py-2.5 px-3">Serial ID</th>
                  <th className="py-2.5 px-3">Admission Patient</th>
                  <th className="py-2.5 px-3">Scheduled Clinician</th>
                  <th className="py-2.5 px-3 text-center">Filing Date</th>
                  <th className="py-2.5 px-3 text-center">Slot</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredAppointments.map(app => {
                  const appointmentDateStr = new Date(app.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  const isUrgent = app.priority === "Urgent";
                  return (
                    <tr key={app.id} className="hover:bg-slate-55">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-805">{app.appNo}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-800">{app.patient?.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                          <span>{app.patient?.phone}</span>
                          {isUrgent && (
                            <span className="text-red-500 font-bold bg-red-50 rounded px-1 text-[9px] uppercase tracking-wider flex items-center gap-0.5">
                              <AlertCircle className="h-2.5 w-2.5" /> Urgent
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 font-semibold">{app.doctor?.name}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700">{appointmentDateStr}</td>
                      <td className="py-2.5 px-3 text-center font-mono">{app.preferredTime}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === "Completed" ? "bg-emerald-50 text-emerald-700" :
                          app.status === "Checked-In" ? "bg-indigo-50 text-indigo-700" :
                          app.status === "Cancelled" ? "bg-red-50 text-red-700" :
                          "bg-amber-50 text-amber-700"
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-1">
                        {app.status === "Pending" && (
                          <>
                            <button 
                              onClick={() => updateAppointmentStatus(app.id, "Checked-In")}
                              className="text-[10px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-650 px-2 py-0.5 rounded transition"
                            >
                              Check-In
                            </button>
                            <button 
                              onClick={() => updateAppointmentStatus(app.id, "Completed")}
                              className="text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded transition"
                            >
                              Settle
                            </button>
                          </>
                        )}
                        {app.status === "Checked-In" && (
                          <button 
                            onClick={() => updateAppointmentStatus(app.id, "Completed")}
                            className="text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded transition"
                          >
                            Mark Completed
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
