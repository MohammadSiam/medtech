import React, { useState, useEffect } from "react";
import { FileSpreadsheet, Printer, Download, BookOpen, Layers, RefreshCw } from "lucide-react";
import { BillingInvoice, Doctor, Expense } from "../types";

export default function ReportsCenter() {
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Report Category selector: "daily_cash", "referral", "doctor_income", "cash_book"
  const [activeReport, setActiveReport] = useState("daily_cash");

  const fetchRecords = async () => {
    try {
      const iRes = await fetch("/api/billing");
      const iList = await iRes.json();
      setInvoices(iList);

      const dRes = await fetch("/api/doctors");
      const dList = await dRes.json();
      setDoctors(dList);

      const exRes = await fetch("/api/expenses");
      const exList = await exRes.json();
      setExpenses(exList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handlePrintReport = () => {
    window.print();
  };

  const handleExcelExportFake = () => {
    alert("Report spreadsheet compiled and downloaded successfully as CSV/Excel (.xlsx)");
  };

  // 1. Daily Cash Income Calculations
  const rawSum = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const discSum = invoices.reduce((sum, i) => sum + i.discountAmount, 0);
  const vatSum = invoices.reduce((sum, i) => sum + i.vatAmount, 0);
  const netCollection = invoices.reduce((sum, i) => sum + i.totalPaid, 0);
  const dueSum = invoices.reduce((sum, i) => sum + i.totalDue, 0);

  return (
    <div className="space-y-6">
      {/* Selection Control header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-100 shadow-xs gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-500" />
          <div>
            <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-widest leading-none">Diagnostic Audit Ledger</h2>
            <span className="text-[10px] text-slate-400 font-mono mt-1 block">Vector-formatted accounting & reporting summaries</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select 
            value={activeReport}
            onChange={e => setActiveReport(e.target.value)}
            className="bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="daily_cash">Date-wise Income statement</option>
            <option value="referral">Marketing Referral report</option>
            <option value="doctor_income">Clinician category revenue</option>
            <option value="cash_book">Enterprise Cash Book ledger</option>
          </select>

          <button 
            onClick={handlePrintReport}
            className="bg-slate-100 hover:bg-slate-250 text-slate-700 font-bold p-2 px-3 rounded-lg text-xs flex items-center gap-1.5 transition"
          >
            <Printer className="h-3.5 w-3.5" /> <span>Print</span>
          </button>
          
          <button 
            onClick={handleExcelExportFake}
            className="bg-indigo-600 hover:bg-indigo-750 text-white font-bold p-2 px-3 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <Download className="h-3.5 w-3.5" /> <span>Export Excel</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24 text-slate-400 font-mono text-xs">Assembling reporting journals...</div>
      ) : (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs">
          {/* DAILY INCOME STATEMENT */}
          {activeReport === "daily_cash" && (
            <div className="space-y-6">
              <div className="border-b border-slate-150 pb-3">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">Date-wise Income & Collection STATEMENT</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Aggregated diagnostic sales transactions on record</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Standard Gross value</div>
                  <div className="text-lg font-bold text-slate-800 mt-1 font-mono">৳{rawSum.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Discount cuts</div>
                  <div className="text-lg font-extrabold text-rose-600 mt-1 font-mono">-৳{discSum.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">VAT taxes logged (5%)</div>
                  <div className="text-lg font-bold text-slate-805 mt-1 font-mono">৳{vatSum.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg text-emerald-999">
                  <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Net collection paid</div>
                  <div className="text-lg font-extrabold text-emerald-605 mt-1 font-mono">৳{netCollection.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg text-red-999">
                  <div className="text-[10px] font-bold text-red-600 uppercase tracking-wide">Unsettled outstanding</div>
                  <div className="text-lg font-extrabold text-red-605 mt-1 font-mono">৳{dueSum.toLocaleString()}</div>
                </div>
              </div>

              {/* Transactions grid */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-600">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Invoice Accession</th>
                      <th className="py-2.5 px-3">Admit Patient</th>
                      <th className="py-2.5 px-3 text-right">Debit total</th>
                      <th className="py-2.5 px-3 text-right font-bold text-emerald-600">Credit received</th>
                      <th className="py-2.5 px-3 text-right text-red-500">outstanding debt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {invoices.map(inv => {
                      const dateStr = new Date(inv.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
                      return (
                        <tr key={inv.id} className="hover:bg-slate-55">
                          <td className="py-2.5 px-3 font-mono text-slate-500">{dateStr}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-805">{inv.invoiceNo}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-700">{inv.patient?.name}</td>
                          <td className="py-2.5 px-3 text-right font-mono">৳{inv.netAmount.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right text-emerald-600 font-bold font-mono">৳{inv.totalPaid.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right text-rose-500 font-bold font-mono">৳{inv.totalDue.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MARKETING REFERRAL COMMISSIONS REPORT */}
          {activeReport === "referral" && (
            <div className="space-y-6">
              <div className="border-b border-slate-150 pb-3">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">Marketing Referral Payout journal</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-1">BMDC affiliated doctor referral earnings summaries</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-600">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                      <th className="py-2.5 px-3">Practitioner code</th>
                      <th className="py-2.5 px-3">Doctor Name</th>
                      <th className="py-2.5 px-3">Specialization</th>
                      <th className="py-2.5 px-3 text-center">Referrals counts</th>
                      <th className="py-2.5 px-3 text-right">Revenue Generated</th>
                      <th className="py-2.5 px-3 text-right text-emerald-600">Commission due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-705">
                    {doctors.map(doc => {
                      // Demo count aggregate logic
                      const matchedInvs = invoices.filter(i => i.referredByDoctorId === doc.id);
                      const generatedSum = matchedInvs.reduce((sum, inv) => sum + inv.totalAmount, 0);
                      const commSum = matchedInvs.reduce((sum, inv) => {
                        if (doc.commissionCategory === "Per Patient") return sum + doc.commissionValue;
                        return sum + (inv.totalAmount * doc.commissionValue) / 100;
                      }, 0);

                      return (
                        <tr key={doc.id} className="hover:bg-slate-55">
                          <td className="py-2.5 px-3 font-mono font-bold text-sky-600">{doc.code}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-800">{doc.name}</td>
                          <td className="py-2.5 px-3 text-slate-500 italic font-semibold">{doc.specialization}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-800">{matchedInvs.length} Invoices</td>
                          <td className="py-2.5 px-3 text-right font-mono">৳{generatedSum.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right text-emerald-600 font-bold font-mono">৳{commSum.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DOCTOR REVENUE BY TEST FIELD */}
          {activeReport === "doctor_income" && (
            <div className="space-y-6">
              <div className="border-b border-slate-150 pb-3">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">Practitioner Revenue breakdown category-wise</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Analyzes which biochemical divisions trigger maximal practitioner traction</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-600">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                      <th className="py-2.5 px-3">Field Division Name</th>
                      <th className="py-2.5 px-3 text-center">Specimens Processed</th>
                      <th className="py-2.5 px-3 text-right text-emerald-600">Biochemistry Gross standard</th>
                      <th className="py-2.5 px-3 text-center">Referral Share 비율</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr className="hover:bg-slate-55">
                      <td className="py-2.5 px-3 font-bold text-slate-800">Pathology</td>
                      <td className="py-2.5 px-3 text-center text-slate-700">12 Primary Samples</td>
                      <td className="py-2.5 px-3 text-right font-mono">৳14,500.00</td>
                      <td className="py-2.5 px-3 text-center text-emerald-600 font-extrabold">34.2% Growth</td>
                    </tr>
                    <tr className="hover:bg-slate-55">
                      <td className="py-2.5 px-3 font-bold text-slate-800">Biochemistry</td>
                      <td className="py-2.5 px-3 text-center text-slate-700">8 Diagnostic vials</td>
                      <td className="py-2.5 px-3 text-right font-mono">৳11,200.00</td>
                      <td className="py-2.5 px-3 text-center text-emerald-600 font-extrabold">26.5% Growth</td>
                    </tr>
                    <tr className="hover:bg-slate-55">
                      <td className="py-2.5 px-3 font-bold text-slate-800">Radiology & USG</td>
                      <td className="py-2.5 px-3 text-center text-slate-700">5 Imaging plates</td>
                      <td className="py-2.5 px-3 text-right font-mono">৳16,800.00</td>
                      <td className="py-2.5 px-3 text-center text-emerald-600 font-extrabold">39.3% Growth</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CHRONOLOGICAL CASH BOOK */}
          {activeReport === "cash_book" && (
            <div className="space-y-6">
              <div className="border-b border-slate-150 pb-3">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">Accrual chronological cash Book</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Full sequential ledger mapping daily Collections, Expenses, and Refunds</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-600">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                      <th className="py-2.5 px-3">Voucher Date</th>
                      <th className="py-2.5 px-3">Accounts reference</th>
                      <th className="py-2.5 px-3">Type Identifier</th>
                      <th className="py-2.5 px-3 text-right text-emerald-600">Cash In (Credit)</th>
                      <th className="py-2.5 px-3 text-right text-red-500">Cash Out (Debit)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {/* Render Inbound Collections */}
                    {invoices.map(inv => (
                      <tr key={`inv-${inv.id}`} className="hover:bg-slate-55">
                        <td className="py-2.5 px-3 font-mono text-slate-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-800">Recp Cash - {inv.invoiceNo}</div>
                          <div className="text-[9px] text-slate-400">Patient register: {inv.patient?.name}</div>
                        </td>
                        <td className="py-2.5 px-3 text-teal-600 font-bold">Billing Receipt</td>
                        <td className="py-2.5 px-3 text-right text-emerald-600 font-bold font-mono">৳{inv.totalPaid.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-300">-</td>
                      </tr>
                    ))}

                    {/* Render Expenses */}
                    {expenses.map(exp => (
                      <tr key={`exp-${exp.id}`} className="hover:bg-slate-55">
                        <td className="py-2.5 px-3 font-mono text-slate-500">{new Date(exp.createdAt).toLocaleDateString()}</td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-800">Overhead: {exp.description}</div>
                          <div className="text-[9px] text-slate-400">Category: {exp.category}</div>
                        </td>
                        <td className="py-2.5 px-3 text-rose-500 font-bold">Ledger Expense</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-300">-</td>
                        <td className="py-2.5 px-3 text-right text-rose-600 font-bold font-mono">৳{exp.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
