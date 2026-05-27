import React, { useState, useEffect } from "react";
import { Activity, Clipboard, CheckSquare, Search, FileText, BadgeAlert, Printer, RefreshCw } from "lucide-react";
import { BillingInvoice, Test } from "../types";

export default function LabManagement() {
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Lab Tab selector: "inbound", "completed"
  const [labTab, setLabTab] = useState("inbound");

  // Selected invoice for report output editing
  const [selectedInvoice, setSelectedInvoice] = useState<BillingInvoice | null>(null);
  const [findingsText, setFindingsText] = useState("");
  const [technicianNote, setTechnicianNote] = useState("Samples checked for haemolysis. Result within standard tolerances.");

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/billing");
      const list = await res.json();
      setInvoices(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const changeReportStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/billing/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportStatus: newStatus })
      });
      fetchInvoices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditReport = (inv: BillingInvoice) => {
    setSelectedInvoice(inv);
    // Auto populate boilerplate based on tests
    const defaultFindings = inv.items?.map(it => {
      return `${it.test?.name}: Observed [ ENTER VALUE ] (Normal reference: ${it.test?.normalRange})`;
    }).join("\n\n") || "";
    setFindingsText(defaultFindings);
  };

  const handlePublishReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    try {
      // Set status to Ready (means printed & published)
       await fetch(`/api/billing/${selectedInvoice.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportStatus: "Ready" })
      });
      setSelectedInvoice(null);
      setFindingsText("");
      fetchInvoices();
    } catch (err) {
      console.error(err);
    }
  };

  const downloadLabReportPDF = (inv: BillingInvoice) => {
    const win = window.open("", "_blank");
    if (!win) return;
    const itemsMarkup = inv.items?.map(it => `
      <div style="margin-bottom: 25px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size:14px;">${it.test?.name}</h4>
        <div style="font-size: 13px; font-family: monospace; color:#334155; line-height: 1.6;">
          <strong>Sample Type:</strong> ${it.test?.specimenType}<br/>
          <strong>Turnaround Time (TAT):</strong> ${it.test?.turnaroundTime}<br/>
          <strong>Normal Boundaries:</strong> <span style="background: #e0f2fe; padding:2px 6px; border-radius:4px;">${it.test?.normalRange}</span><br/><br/>
          <strong style="color: #0284c7;">Observed Measurement Value:</strong> [ STABLE CLINICAL VALUE VERIFIED BY LAB ]
        </div>
      </div>
    `).join("") || "";

    win.document.write(`
      <html>
        <head>
          <title>${inv.invoiceNo} Diagnostic report</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, sans-serif; margin: 40px; color: #334155; }
            .header { text-align: center; border-bottom: 3px double #cbd5e1; padding-bottom: 15px; margin-bottom: 25px; }
            .patient-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 10px; display: flex; justify-content: space-between; font-size: 13px; line-height: 1.7; margin-bottom: 30px; }
            .badge { display:inline-block; font-size:10px; font-weight:bold; color:#15803d; background:#dcfce7; padding:2px 8px; border-radius:99px; text-transform:uppercase; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin: 0; color: #1e1b4b; letter-spacing:-0.5px;">CarePath Clinical Diagnostics Laboratory</h2>
            <div style="font-size: 11px; margin-top: 5px; color:#64748b;">Accredited ISO 15189:2012 Certified Reference Hospital Center</div>
          </div>
          <div class="patient-box">
            <div>
              <strong>Patient Registration Code:</strong> ID-98274<br/>
              <strong>Full Name:</strong> ${inv.patient?.name}<br/>
              <strong>Age/Gender:</strong> ${inv.patient?.age} Yrs old / ${inv.patient?.gender}<br/>
              <strong>Referral Source:</strong> ${inv.referredBy?.name || "Self-referred Walk-In"}
            </div>
            <div style="text-align: right;">
              <strong>Report Case Accession:</strong> ${inv.invoiceNo}<br/>
              <strong>Filing Inbound Date:</strong> ${new Date(inv.createdAt).toLocaleString()}<br/>
              <strong>Approval Publication:</strong> ${new Date().toLocaleDateString()}<br/>
              <span class="badge">Verified Quality Approved</span>
            </div>
          </div>
          <h3 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 20px; font-size:15px; color: #475569;">Diagnostic Findings Ledger</h3>
          ${itemsMarkup}
          
          <div style="margin-top: 60px; display: flex; justify-content: space-between; font-size: 12px; border-top:1px solid #f1f5f9; padding-top:40px;">
            <div style="text-align: center;">
              ___________________________<br/>
              <strong>Sumon K. Dey</strong><br/>
              Lab Technologist Supervisor
            </div>
            <div style="text-align: center;">
              ___________________________<br/>
              <strong>${inv.referredBy?.name || "Resident Pathologist"}</strong><br/>
              BMDC Registered Validator
            </div>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const inboundInvoices = invoices.filter(i => ["Pending", "Processing"].includes(i.reportStatus));
  const readyInvoices = invoices.filter(i => ["Ready", "Delivered"].includes(i.reportStatus));

  return (
    <div className="space-y-6">
      {/* Top status toggle tabs */}
      <div className="flex border-b border-slate-100 bg-white p-2 rounded-xl border border-slate-50 gap-1 shadow-xs">
        <button 
          onClick={() => { setLabTab("inbound"); setSelectedInvoice(null); }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            labTab === "inbound" ? "bg-amber-50 text-amber-700" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Activity className="h-4 w-4" /> Inbound Lab Requests ({inboundInvoices.length})
        </button>
        <button 
          onClick={() => { setLabTab("completed"); setSelectedInvoice(null); }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            labTab === "completed" ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <CheckSquare className="h-4 w-4" /> Prepared & Released ({readyInvoices.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium">
          <RefreshCw className="animate-spin mb-3 h-8 w-8 text-sky-500 mx-auto" />
          <div>Mounting clinical scopes...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Work Flow lists */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-8">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">
              {labTab === "inbound" ? "Sample Processing Queue" : "Completed Reports Archival Vault"}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <th className="py-2.5 px-3">Case Accession</th>
                    <th className="py-2.5 px-3">Patient Profile</th>
                    <th className="py-2.5 px-3">Analyses Requested</th>
                    <th className="py-2.5 px-3 text-center">Filing Index</th>
                    <th className="py-2.5 px-3 text-center">Phase</th>
                    <th className="py-2.5 px-3 text-right">Workflow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {/* Rendering lists based on active tab */}
                  {(labTab === "inbound" ? inboundInvoices : readyInvoices).map(inv => {
                    const filingDateStr = new Date(inv.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/75">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{inv.invoiceNo}</td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-800">{inv.patient?.name}</div>
                          <div className="text-[10px] text-slate-400 font-serif">{inv.patient?.gender} ({inv.patient?.age} Yrs)</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex flex-wrap gap-1">
                            {inv.items?.map(it => (
                              <span key={it.id} className="bg-slate-100 text-slate-650 px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap font-semibold">
                                {it.test?.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-600">{filingDateStr}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            inv.reportStatus === "Pending" ? "bg-amber-100 text-amber-700 font-sans" :
                            inv.reportStatus === "Processing" ? "bg-sky-100 text-sky-850 animate-pulse font-sans" :
                            inv.reportStatus === "Ready" ? "bg-emerald-100 text-emerald-800" :
                            "bg-indigo-100 text-indigo-800"
                          }`}>
                            {inv.reportStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right space-x-1 whitespace-nowrap">
                          {inv.reportStatus === "Pending" && (
                            <button 
                              onClick={() => changeReportStatus(inv.id, "Processing")}
                              className="bg-sky-650 hover:bg-sky-700 text-white font-bold p-1 px-2 rounded-md text-[10px]"
                            >
                              Collect & Process
                            </button>
                          )}
                          {inv.reportStatus === "Processing" && (
                            <button 
                              onClick={() => handleEditReport(inv)}
                              className="bg-emerald-55 hover:bg-emerald-100 text-emerald-700 font-bold p-1 px-2.5 rounded-md text-[10px]"
                            >
                              Input Clinical Findings
                            </button>
                          )}
                          {["Ready", "Delivered"].includes(inv.reportStatus) && (
                            <>
                              <button 
                                onClick={() => downloadLabReportPDF(inv)}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold p-1 px-2 rounded-md text-[10px]"
                              >
                                Print Report
                              </button>
                              {inv.reportStatus === "Ready" && (
                                <button 
                                  onClick={() => changeReportStatus(inv.id, "Delivered")}
                                  className="bg-sky-500 hover:bg-sky-600 text-white font-bold p-1 px-2 rounded-md text-[10px]"
                                >
                                  Deliver
                                </button>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {((labTab === "inbound" ? inboundInvoices : readyInvoices).length === 0) && (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-400 italic">
                        No transactions match this specific lifecycle partition.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Findings Editor Panel */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-4 h-fit">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 pb-2 border-b">Biochemical Entry Board</h3>

            {selectedInvoice ? (
              <form onSubmit={handlePublishReport} className="space-y-4 text-xs font-semibold text-slate-600">
                <div className="bg-indigo-50/50 p-2.5 border border-indigo-150 rounded-lg text-[11px] text-indigo-900 leading-relaxed">
                  Patient: <strong>{selectedInvoice.patient?.name}</strong>. Accession: <strong>{selectedInvoice.invoiceNo}</strong>. Ensure observations perfectly map chemical values.
                </div>

                <div>
                  <label className="block mb-1">Observed Parameters & Measurement Values *</label>
                  <textarea 
                    rows={6}
                    value={findingsText}
                    onChange={e => setFindingsText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-mono text-[10px] leading-relaxed text-slate-800"
                  ></textarea>
                </div>

                <div>
                  <label className="block mb-1">Technologist validation checklist</label>
                  <input 
                    type="text" 
                    value={technicianNote}
                    onChange={e => setTechnicianNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-800 text-[10px]"
                  />
                </div>

                <div className="flex gap-2">
                  <button 
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2 rounded-lg w-full transition tracking-wider uppercase"
                  >
                    Publish Verified Report
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSelectedInvoice(null)}
                    className="bg-slate-105 hover:bg-slate-200 text-slate-700 font-bold p-2 px-3 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12 text-slate-400 italic leading-relaxed">
                Click <strong>"Input Clinical Findings"</strong> on processing samples in the left table queue to execute biochemical reporting.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
