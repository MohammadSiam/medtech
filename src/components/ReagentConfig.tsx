import React, { useState, useEffect } from "react";
import { Plus, HelpCircle, Layers, ShoppingBag, TrendingDown, ClipboardList } from "lucide-react";
import { Reagent, Test } from "../types";

export default function ReagentConfig() {
  const [reagents, setReagents] = useState<Reagent[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  // Reagent Form
  const [name, setName] = useState("");
  const [supplier, setSupplier] = useState("");
  const [brandModel, setBrandModel] = useState("");
  const [machineName, setMachineName] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("2500");
  const [stockQty, setStockQty] = useState("100");
  const [lowStockAlert, setLowStockAlert] = useState("15");
  const [expiryDate, setExpiryDate] = useState("2026-12-01");
  const [lotNumber, setLotNumber] = useState("");

  // Reagent mapping fields
  const [selectedTestId, setSelectedTestId] = useState("");
  const [selectedReagentId, setSelectedReagentId] = useState("");
  const [qtyNeeded, setQtyNeeded] = useState("1.5");
  const [mappings, setMappings] = useState<any[]>([]);

  const fetchReagentsAndTests = async () => {
    try {
      const rRes = await fetch("/api/reagents");
      const rList = await rRes.json();
      setReagents(rList);

      const tRes = await fetch("/api/tests");
      const tList = await tRes.json();
      setTests(tList);
      if (tList.length > 0) setSelectedTestId(tList[0].id);
      if (rList.length > 0) setSelectedReagentId(rList[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReagentsAndTests();
  }, []);

  const handleAddReagent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !supplier || !expiryDate) {
      alert("Name, Supplier, and Expiry are required parameters");
      return;
    }

    const payload = {
      name,
      supplier,
      brandModel,
      machineName,
      purchasePrice: parseFloat(purchasePrice) || 0,
      stockQty: parseFloat(stockQty) || 0,
      lowStockAlert: parseFloat(lowStockAlert) || 0,
      expiryDate,
      lotNumber
    };

    try {
      const res = await fetch("/api/reagents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setName("");
        setSupplier("");
        setBrandModel("");
        setMachineName("");
        setPurchasePrice("2000");
        setStockQty("50");
        setExpiryDate("2026-12-01");
        setLotNumber("");
        fetchReagentsAndTests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTestId || !selectedReagentId) {
      alert("Select both test and reagent to link them");
      return;
    }

    const matchedTest = tests.find(t => t.id === selectedTestId);
    const matchedReagent = reagents.find(r => r.id === selectedReagentId);

    if (matchedTest && matchedReagent) {
      // Offline array cache demonstration since mappings table is helper
      setMappings(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          testName: matchedTest.name,
          reagentName: matchedReagent.name,
          qtyNeeded: parseFloat(qtyNeeded) || 1.0
        }
      ]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Add Consumable Stock */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-4 h-fit">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <ShoppingBag className="h-4 w-4 text-emerald-500" />
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">Record Reagent Stock</h3>
        </div>

        <form onSubmit={handleAddReagent} className="space-y-3.5 text-xs font-semibold text-slate-600">
          <div>
            <label className="block mb-1">Reagent Formula / Name *</label>
            <input 
              type="text" 
              placeholder="e.g. Creatinine Enzymatic Kit (Liquid)" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 focus:outline-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Supplier *</label>
              <input 
                type="text" 
                placeholder="e.g. Siemens Healthcare" 
                value={supplier}
                onChange={e => setSupplier(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800"
              />
            </div>
            <div>
              <label className="block mb-1">Brand & Model</label>
              <input 
                type="text" 
                placeholder="Dimension-EXL" 
                value={brandModel}
                onChange={e => setBrandModel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Compatible Machine</label>
              <input 
                type="text" 
                placeholder="ExL 200 Analyzer" 
                value={machineName}
                onChange={e => setMachineName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800"
              />
            </div>
            <div>
              <label className="block mb-1">Batch / Lot Code</label>
              <input 
                type="text" 
                placeholder="LOT-SM543" 
                value={lotNumber}
                onChange={e => setLotNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <label className="block mb-1">Unit Cost</label>
              <input 
                type="number" 
                value={purchasePrice}
                onChange={e => setPurchasePrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-lg text-slate-800 text-right font-mono"
              />
            </div>
            <div className="col-span-1">
              <label className="block mb-1">Qty Stocked</label>
              <input 
                type="number" 
                value={stockQty}
                onChange={e => setStockQty(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-lg text-slate-800 text-right font-mono"
              />
            </div>
            <div className="col-span-1">
              <label className="block mb-1">Low Cap</label>
              <input 
                type="number" 
                value={lowStockAlert}
                onChange={e => setLowStockAlert(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-lg text-slate-800 text-right font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Expiry Date *</label>
            <input 
              type="date" 
              value={expiryDate}
              onChange={e => setExpiryDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 font-mono"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition"
          >
            Log Inbound Stock
          </button>
        </form>
      </div>

      {/* Datagrid list */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-8 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Reagents & Biochemical Inventory</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <th className="py-2.5 px-3">Item Name</th>
                  <th className="py-2.5 px-3">Manufacturer</th>
                  <th className="py-2.5 px-3">Lot Code</th>
                  <th className="py-2.5 px-3 text-right font-mono">Present Stock</th>
                  <th className="py-2.5 px-3 text-center">Expiry Index</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {reagents.map(r => {
                  const isLow = r.stockQty <= r.lowStockAlert;
                  const expiryStr = new Date(r.expiryDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short' });
                  return (
                    <tr key={r.id} className="hover:bg-slate-55">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-800">{r.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{r.brandModel || "Universal Pack"}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{r.supplier}</td>
                      <td className="py-2.5 px-3 font-mono">{r.lotNumber || "N/A"}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-800 font-mono">
                        {r.stockQty} Unit/ml
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-500">{expiryStr}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isLow ? "bg-red-50 text-red-650" : "bg-emerald-50 text-emerald-700"
                        }`}>
                          {isLow ? "Low StockAlert" : "Stable Quantity"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analyzer Mappings Section */}
        <div className="border-t border-slate-100 pt-5">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Reagent-Test Analyzer Consumption Mappings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form onSubmit={handleCreateMapping} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/50 text-xs font-semibold text-slate-600">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Create Machine Rule</span>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Target Test</label>
                  <select 
                    value={selectedTestId}
                    onChange={e => setSelectedTestId(e.target.value)}
                    className="w-full bg-white border border-slate-200 p-1.5 rounded"
                  >
                    {tests.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Linked Reagent</label>
                  <select 
                    value={selectedReagentId}
                    onChange={e => setSelectedReagentId(e.target.value)}
                    className="w-full bg-white border border-slate-200 p-1.5 rounded"
                  >
                    {reagents.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1">Consumption volume per run (ml/unit) *</label>
                <input 
                  type="number" 
                  step="any"
                  value={qtyNeeded}
                  onChange={e => setQtyNeeded(e.target.value)}
                  className="w-full bg-white border border-slate-200 p-1.5 rounded text-slate-800 font-mono"
                />
              </div>

              <button 
                type="submit"
                className="bg-slate-700 hover:bg-slate-800 text-white font-bold p-2 px-3 rounded w-full text-xs"
              >
                Link Consumption Parameter
              </button>
            </form>

            <div className="border border-slate-100 rounded-xl p-4 bg-white space-y-3">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Deduction Rules Catalog</span>
              <div className="space-y-2 h-44 overflow-y-auto">
                <div className="p-2 border-l-2 border-emerald-500 bg-slate-50 rounded text-[11px]">
                  <div className="font-bold text-slate-700">Complete Blood Count (CBC)</div>
                  <div className="text-slate-500 mt-0.5">Loads 1.5 Unit Cellpack Diluent instantly upon register.</div>
                </div>
                <div className="p-2 border-l-2 border-emerald-500 bg-slate-50 rounded text-[11px]">
                  <div className="font-bold text-slate-700">Serum Creatinine</div>
                  <div className="text-slate-500 mt-0.5">Auto-deducts 2.0ml Creatinine Kit upon clinical run.</div>
                </div>
                {mappings.map(m => (
                  <div key={m.id} className="p-2 border-l-2 border-sky-500 bg-sky-50/50 rounded text-[11px]">
                    <div className="font-bold text-slate-700">{m.testName}</div>
                    <div className="text-slate-500 mt-0.5">Deducts {m.qtyNeeded} units of {m.reagentName}.</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
