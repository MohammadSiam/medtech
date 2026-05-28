import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash, Check, UserCheck, Shield, Award, ClipboardList } from "lucide-react";
import { Doctor } from "../types";

export default function DoctorConfig() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [type, setType] = useState("Consultant");
  const [specialization, setSpecialization] = useState("");
  const [bmdcNumber, setBmdcNumber] = useState("");
  const [contact, setContact] = useState("");
  const [commissionCategory, setCommissionCategory] = useState("Per Test");
  const [commissionValue, setCommissionValue] = useState("10");

  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/doctors");
      const list = await res.json();
      setDoctors(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !specialization || !contact) {
      alert("Please fill in name, specialization, and contact phone");
      return;
    }

    const payload = {
      name,
      type,
      specialization,
      bmdcNumber,
      contact,
      commissionCategory,
      commissionValue: parseFloat(commissionValue) || 0
    };

    try {
      if (editingId) {
        await fetch(`/api/doctors/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch("/api/doctors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
      resetForm();
      fetchDoctors();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (doc: Doctor) => {
    setEditingId(doc.id);
    setName(doc.name);
    setType(doc.type);
    setSpecialization(doc.specialization);
    setBmdcNumber(doc.bmdcNumber || "");
    setContact(doc.contact);
    setCommissionCategory(doc.commissionCategory);
    setCommissionValue(doc.commissionValue.toString());
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this doctor record?")) return;
    try {
      await fetch(`/api/doctors/${id}`, { method: "DELETE" });
      fetchDoctors();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setType("Consultant");
    setSpecialization("");
    setBmdcNumber("");
    setContact("");
    setCommissionCategory("Per Test");
    setCommissionValue("10");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Clinician Onboarding Form */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-4 h-fit">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-50">
          <Award className="h-5 w-5 text-sky-500" />
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">
            {editingId ? "Modify Practitioner" : "Register Doctor"}
          </h3>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold text-slate-600">
          <div>
            <label className="block mb-1">Full Name *</label>
            <input 
              type="text" 
              placeholder="e.g. Dr. Sabrina Khan" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 focus:outline-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Classification *</label>
              <select 
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 focus:outline-sky-500"
              >
                <option>Consultant</option>
                <option>Referral</option>
                <option>Lab Doctor</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">BMDC Reg No</label>
              <input 
                type="text" 
                placeholder="A-XXXXX" 
                value={bmdcNumber}
                onChange={e => setBmdcNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 focus:outline-sky-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Medical Specialization *</label>
            <input 
              type="text" 
              placeholder="e.g. Diabetologist & Biochemist" 
              value={specialization}
              onChange={e => setSpecialization(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 focus:outline-sky-500"
            />
          </div>

          <div>
            <label className="block mb-1">Primary Contact (Mobile) *</label>
            <input 
              type="text" 
              placeholder="e.g. 01711-XXXXXX" 
              value={contact}
              onChange={e => setContact(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 focus:outline-sky-500 font-mono"
            />
          </div>

          <div className="bg-sky-50/50 p-3 rounded-lg border border-sky-100/50 space-y-3">
            <span className="text-[10px] font-bold text-sky-700 tracking-wider uppercase block">Financial Referral Rules</span>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-slate-500 text-[10px]">Commission Split</label>
                <select 
                  value={commissionCategory}
                  onChange={e => setCommissionCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 px-2.5 py-1.5 rounded text-slate-800 focus:outline-none"
                >
                  <option>Per Test</option>
                  <option>Per Patient</option>
                  <option>No Commission</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-500 text-[10px]">Value (%) / (Fixed)</label>
                <input 
                  type="number" 
                  step="any"
                  value={commissionValue}
                  onChange={e => setCommissionValue(e.target.value)}
                  className="w-full bg-white border border-slate-200 px-2.5 py-1.5 rounded text-slate-800 focus:outline-none text-right font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button 
              type="submit" 
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded-lg shadow-xs transition"
            >
              {editingId ? "Apply Update" : "Register Clinician"}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={resetForm}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-lg transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Clinicians Datagrid */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-8">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">BMDC Affiliated Practitioner Registry</h3>

        {loading ? (
          <div className="text-center py-12 text-slate-400 font-medium font-mono text-xs">Locating records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[10px] sm:text-xs text-left text-slate-600 border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <th className="py-2.5 sm:py-3 px-2 sm:px-4">Code</th>
                  <th className="py-2.5 sm:py-3 px-2 sm:px-4">Practitioner Name</th>
                  <th className="py-2.5 sm:py-3 px-1 sm:px-4">Category</th>
                  <th className="py-2.5 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">BMDC Registration</th>
                  <th className="py-2.5 sm:py-3 px-1 sm:px-4 text-center">Referral Rates</th>
                  <th className="py-2.5 sm:py-3 px-2 sm:px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {doctors.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 sm:py-3 px-2 sm:px-4 font-mono font-bold text-sky-600">{doc.code}</td>
                    <td className="py-2.5 sm:py-3 px-2 sm:px-4">
                      <div className="font-bold text-slate-800 text-[11px] sm:text-xs">{doc.name}</div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 font-semibold">{doc.specialization}</div>
                    </td>
                    <td className="py-2.5 sm:py-3 px-1 sm:px-4">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold ${
                        doc.type === "Consultant" ? "bg-indigo-50 text-indigo-700" :
                        doc.type === "Lab Doctor" ? "bg-teal-50 text-teal-700" :
                        "bg-amber-50 text-amber-700"
                      }`}>
                        {doc.type}
                      </span>
                    </td>
                    <td className="py-2.5 sm:py-3 px-2 sm:px-4 font-mono text-slate-500 hidden sm:table-cell">{doc.bmdcNumber || "N/A"}</td>
                    <td className="py-2.5 sm:py-3 px-1 sm:px-4 text-center font-mono text-emerald-600 font-bold text-[10px] sm:text-xs">
                      {doc.commissionCategory === "No Commission" ? (
                        <span className="text-slate-400 font-sans font-normal text-[9px] sm:text-xs">None</span>
                      ) : (
                        doc.commissionCategory === "Per Test" ? `${doc.commissionValue}%` : `৳${doc.commissionValue}`
                      )}
                    </td>
                    <td className="py-2.5 sm:py-3 px-2 sm:px-4 text-right space-x-0.5 sm:space-x-1 whitespace-nowrap">
                      <button 
                        onClick={() => handleEdit(doc)}
                        className="p-1 text-slate-500 hover:text-sky-600 bg-slate-50 rounded"
                      >
                        <Edit className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        className="p-1 text-slate-400 hover:text-red-600 bg-slate-50 rounded"
                      >
                        <Trash className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {doctors.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400 text-xs italic">
                      No practitioners logged yet in CarePath Diagnostics Database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
