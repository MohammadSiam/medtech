import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash, Activity, Search, ShieldAlert, BadgeInfo } from "lucide-react";
import { Test } from "../types";

export default function TestConfig() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Create/Edit form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Pathology");
  const [specimenType, setSpecimenType] = useState("Serum");
  const [price, setPrice] = useState("500");
  const [turnaroundTime, setTurnaroundTime] = useState("4 Hours");
  const [normalRange, setNormalRange] = useState("");
  
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchTests = async () => {
    try {
      const res = await fetch("/api/tests");
      const list = await res.json();
      setTests(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !normalRange) {
      alert("Name, Price, and Normal Range values are mandatory for correct clinical audits.");
      return;
    }

    const payload = {
      name,
      category,
      specimenType,
      price: parseFloat(price) || 0,
      turnaroundTime,
      normalRange
    };

    try {
      if (editingId) {
        await fetch(`/api/tests/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch("/api/tests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
      resetForm();
      fetchTests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (test: Test) => {
    setEditingId(test.id);
    setName(test.name);
    setCategory(test.category);
    setSpecimenType(test.specimenType);
    setPrice(test.price.toString());
    setTurnaroundTime(test.turnaroundTime);
    setNormalRange(test.normalRange);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this test profile?")) return;
    try {
      await fetch(`/api/tests/${id}`, { method: "DELETE" });
      fetchTests();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setCategory("Pathology");
    setSpecimenType("Serum");
    setPrice("500");
    setTurnaroundTime("4 Hours");
    setNormalRange("");
  };

  const filteredTests = tests.filter(test => 
    test.name.toLowerCase().includes(search.toLowerCase()) ||
    test.category.toLowerCase().includes(search.toLowerCase()) ||
    test.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Test Creation Profile Panel */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-4 h-fit">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <Activity className="h-5 w-5 text-indigo-500" />
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">
            {editingId ? "Edit Test Standard" : "Onboard Diagnostic Test"}
          </h3>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold text-slate-600">
          <div>
            <label className="block mb-1">Standard Test Name *</label>
            <input 
              type="text" 
              placeholder="e.g. Dengue NS1 Antigen (Rapid)" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 focus:outline-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Testing Department *</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 focus:outline-indigo-500"
              >
                <option>Pathology</option>
                <option>Biochemistry</option>
                <option>Radiology</option>
                <option>USG</option>
                <option>ECG</option>
                <option>Serology</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Specimen (Vial) Type *</label>
              <select 
                value={specimenType}
                onChange={e => setSpecimenType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 focus:outline-indigo-500"
              >
                <option>Serum</option>
                <option>EDTA Blood</option>
                <option>Plasma</option>
                <option>Spot Urine</option>
                <option>None (Imaging)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Price (BDT / ৳) *</label>
              <input 
                type="number" 
                placeholder="৳ Price" 
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 focus:outline-indigo-500 text-right font-mono"
              />
            </div>
            <div>
              <label className="block mb-1">Turnaround Time (TAT) *</label>
              <select 
                value={turnaroundTime}
                onChange={e => setTurnaroundTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 focus:outline-indigo-500"
              >
                <option>1 Hour</option>
                <option>2 Hours</option>
                <option>4 Hours</option>
                <option>12 Hours</option>
                <option>24 Hours</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1">Normal Reference Range *</label>
            <textarea 
              rows={3}
              placeholder="e.g. Male: 13.5-17.5 g/dL, Female: 12.0-15.5 g/dL" 
              value={normalRange}
              onChange={e => setNormalRange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-500"
            ></textarea>
            <span className="text-[9px] text-slate-400 mt-1 block leading-tight">
              Values registered here represent standard reference keys for automated lab alert triggers.
            </span>
          </div>

          <div className="flex gap-2 pt-1">
            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg shadow-xs transition"
            >
              {editingId ? "Save Standards" : "Upload Diagnostic Standard"}
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

      {/* Tests Catalog Index List */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-8 flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Diagnostic Lab Test catalog
            </h3>
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Search by test, category, code..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 p-1.5 text-xs text-slate-700 focus:outline-none"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 font-medium font-mono text-xs">Loading master price list...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] sm:text-xs text-left text-slate-600">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <th className="py-2.5 px-2 sm:px-3">Code</th>
                    <th className="py-2.5 px-2 sm:px-3">Test Standard Name</th>
                    <th className="py-2.5 px-2 sm:px-3">Field</th>
                    <th className="py-2.5 px-2 sm:px-3 hidden sm:table-cell">Specimen Spec</th>
                    <th className="py-2.5 px-2 sm:px-3 text-right">Price</th>
                    <th className="py-2.5 px-2 sm:px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredTests.map(test => (
                    <tr key={test.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-2.5 px-2 sm:px-3 font-mono font-bold text-indigo-600">{test.code}</td>
                      <td className="py-2.5 px-2 sm:px-3">
                        <div className="font-bold text-slate-800 text-[11px] sm:text-xs">{test.name}</div>
                        <div className="text-[9px] sm:text-[10px] text-slate-400 italic">Range: {test.normalRange.substring(0, 30)}...</div>
                      </td>
                      <td className="py-2.5 px-2 sm:px-3">
                        <span className="font-semibold text-slate-700">{test.category}</span>
                      </td>
                      <td className="py-2.5 px-2 sm:px-3 font-mono text-slate-500 hidden sm:table-cell">{test.specimenType}</td>
                      <td className="py-2.5 px-2 sm:px-3 text-right font-bold font-mono text-slate-800">৳{test.price.toLocaleString()}</td>
                      <td className="py-2.5 px-2 sm:px-3 text-right space-x-0.5 sm:space-x-1 whitespace-nowrap">
                        <button 
                          onClick={() => handleEdit(test)}
                          className="p-1 text-slate-500 hover:text-indigo-600 bg-slate-50 rounded"
                        >
                          <Edit className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(test.id)}
                          className="p-1 text-slate-400 hover:text-red-600 bg-slate-50 rounded"
                        >
                          <Trash className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredTests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400 text-xs italic">
                        No matches found in standard test index.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 pt-3 mt-4 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
          <BadgeInfo className="h-4 w-4 text-slate-400" />
          <span>Vat is calculated standardly at 5.0% on top of all price listings upon invoice checkout.</span>
        </div>
      </div>
    </div>
  );
}
