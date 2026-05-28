import React, { useState, useEffect } from "react";
import { 
  Plus, Search, Printer, DollarSign, Percent, User, FileText, 
  Trash, BookmarkCheck, PhoneCall, RefreshCw, Layers, CheckCircle, CreditCard 
} from "lucide-react";
import { BillingInvoice, Doctor, Test, Patient } from "../types";

export default function ReceptionBilling() {
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  // Billing Flow Sub-tabs: "new", "invoice_index", "dues", "refund"
  const [subTab, setSubTab] = useState("new");

  // --- New Invoice Form State ---
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientAge, setPatientAge] = useState("32");
  const [patientGender, setPatientGender] = useState("Male");
  const [referredById, setReferredById] = useState("");

  const [selectedTests, setSelectedTests] = useState<Test[]>([]);
  const [discountType, setDiscountType] = useState("None"); // None, Percentage, Fixed
  const [discountValue, setDiscountValue] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amountPaid, setAmountPaid] = useState("0");

  const [checkoutResult, setCheckoutResult] = useState<BillingInvoice | null>(null);

  // --- Due payment state ---
  const [dueCollectAmount, setDueCollectAmount] = useState("0");
  const [selectedDueInvoice, setSelectedDueInvoice] = useState<BillingInvoice | null>(null);

  // --- Refund state ---
  const [refundInvoiceNo, setRefundInvoiceNo] = useState("");
  const [refundAmount, setRefundAmount] = useState("500");
  const [refundReason, setRefundReason] = useState("Patient sample compromised");
  const [refundMode, setRefundMode] = useState("Cash");

  const fetchData = async () => {
    setLoading(true);
    try {
      const iRes = await fetch("/api/billing");
      const iList = await iRes.json();
      setInvoices(Array.isArray(iList) ? iList : []);

      const dRes = await fetch("/api/doctors");
      const dList = await dRes.json();
      const dArr = Array.isArray(dList) ? dList : [];
      setDoctors(dArr.filter((d: any) => d.status === "Active"));
      if (dArr.length > 0) setReferredById(dArr[0].id);

      const tRes = await fetch("/api/tests");
      const tList = await tRes.json();
      const tArr = Array.isArray(tList) ? tList : [];
      setTests(tArr.filter((t: any) => t.status === "Active"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTestToInvoice = (testId: string) => {
    const asset = tests.find(t => t.id === testId);
    if (asset && !selectedTests.some(t => t.id === testId)) {
      setSelectedTests([...selectedTests, asset]);
    }
  };

  const handleRemoveTestFromInvoice = (testId: string) => {
    setSelectedTests(selectedTests.filter(t => t.id !== testId));
  };

  // Live total calculations
  const grossTotal = selectedTests.reduce((sum, t) => sum + t.price, 0);
  let computedDiscount = 0;
  if (discountType === "Percentage") {
    computedDiscount = (grossTotal * (parseFloat(discountValue) || 0)) / 100;
  } else if (discountType === "Fixed") {
    computedDiscount = parseFloat(discountValue) || 0;
  }
  const netBeforeTax = grossTotal - computedDiscount;
  const vatAmount = (netBeforeTax * 5) / 100; // 5% VAT
  const serviceCharge = 50.0; // Flat BDT 50 service fee
  const payableAmount = netBeforeTax + vatAmount + serviceCharge;

  const handleCheckoutInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTests.length === 0) {
      alert("Please add at least one medical diagnostic test first.");
      return;
    }
    if (!patientName || !patientPhone) {
      alert("Patient Name & Phone Number are mandatory identifiers.");
      return;
    }

    const payload = {
      patientId: patientId || null,
      patientName,
      patientPhone,
      patientAge,
      patientGender,
      doctorReferId: referredById,
      testIds: selectedTests.map(t => t.id),
      discountType,
      discountValue,
      paymentMethod,
      amountToPay: amountPaid
    };

    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setCheckoutResult(data.invoice);
        // Clear States
        setPatientId("");
        setPatientName("");
        setPatientPhone("");
        setSelectedTests([]);
        setDiscountType("None");
        setDiscountValue("0");
        setAmountPaid("0");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCollectDue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDueInvoice) return;
    try {
      await fetch(`/api/billing/${selectedDueInvoice.id}/due-payment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountPaid: dueCollectAmount })
      });
      setSelectedDueInvoice(null);
      setDueCollectAmount("0");
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReportDelivery = async (id: string) => {
    try {
      await fetch(`/api/billing/${id}/deliver`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveredBy: "Saima Rahman" })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const submitRefundEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const inv = invoices.find(i => i.invoiceNo === refundInvoiceNo);
    if (!inv) {
      alert("Entered invoice number is invalid or does not exist in local databases.");
      return;
    }
    try {
      const res = await fetch("/api/refunds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: inv.id,
          amount: refundAmount,
          reason: refundReason,
          refundMode
        })
      });
      if (res.ok) {
        alert("Refund approved successfully. Accounting ledgers recalculated.");
        setRefundInvoiceNo("");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const printBillSlip = (inv: BillingInvoice) => {
    const win = window.open("", "_blank");
    if (!win) return;
    const itemsMarkup = inv.items?.map(it => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 8px 10px;">${it.test?.name} (Code: ${it.test?.code})</td>
        <td style="padding: 8px 10px; text-align: right;">৳${it.price}</td>
      </tr>
    `).join("") || "";

    win.document.write(`
      <html>
        <head>
          <title>${inv.invoiceNo} Receipt</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, sans-serif; margin: 40px; color: #334155; }
            .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 25px; }
            .meta { display: flex; justify-content: space-between; margin-bottom: 25px; font-size: 13px; line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px; }
            .total { text-align: right; font-size: 14px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin: 0; color: #0284c7;">CarePath Clinical Diagnostics</h2>
            <div style="font-size: 12px; margin-top: 5px;">12/A Green Road, Dhanmondi, Dhaka | Hotline: +880 1711-223344</div>
          </div>
          <div class="meta">
            <div>
              <strong>Patient Name:</strong> ${inv.patient?.name}<br/>
              <strong>Contact:</strong> ${inv.patient?.phone}<br/>
              <strong>Age/Gender:</strong> ${inv.patient?.age} Yrs / ${inv.patient?.gender}
            </div>
            <div style="text-align: right;">
              <strong>Invoice No:</strong> ${inv.invoiceNo}<br/>
              <strong>Date:</strong> ${new Date(inv.createdAt).toLocaleString()}<br/>
              <strong>Referral:</strong> ${inv.referredBy?.name || "Self referred"}
            </div>
          </div>
          <table>
            <thead>
              <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                <th style="padding: 10px; text-align: left;">Diagnostic Description</th>
                <th style="padding: 10px; text-align: right;">Standard Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsMarkup}
            </tbody>
          </table>
          <div class="total">
            Gross Bill: ৳${inv.totalAmount}<br/>
            Discount: ৳${inv.discountAmount}<br/>
            VAT (5%): ৳${inv.vatAmount}<br/>
            Service Charge: ৳${inv.serviceCharge}<br/>
            <span style="font-size: 18px; color: #10b981;">Total Payable: ৳${inv.netAmount}</span><br/><br/>
            <span style="color:#0284c7;">Amount Paid: ৳${inv.totalPaid}</span> | <span style="color:red;">Outstanding Due: ৳${inv.totalDue}</span>
          </div>
          <div style="margin-top: 50px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px;">
            Thank you for trusting CarePath. Report validity is 30 days from publication.
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-6">
      {/* Navigation Sub-bar */}
      <div className="flex border-b border-slate-100 bg-white p-2 rounded-xl border border-slate-50 shadow-xs gap-1">
        <button 
          onClick={() => { setSubTab("new"); setCheckoutResult(null); }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            subTab === "new" ? "bg-sky-50 text-sky-700" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Plus className="h-4 w-4" /> New Billing Checkdesk
        </button>
        <button 
          onClick={() => setSubTab("invoice_index")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            subTab === "invoice_index" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className="h-4 w-4" /> All Billing Invoices
        </button>
        <button 
          onClick={() => { setSubTab("dues"); setSelectedDueInvoice(null); }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            subTab === "dues" ? "bg-amber-50 text-amber-700" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <DollarSign className="h-4 w-4" /> Outstanding Unpaid Dues
        </button>
        <button 
          onClick={() => setSubTab("refund")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            subTab === "refund" ? "bg-rose-50 text-rose-700" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <RefreshCw className="h-4 w-4" /> Cash Refunds desk
        </button>
      </div>

      {loading ? (
        <div className="text-center py-24 text-slate-400 font-mono text-xs">Parsing transaction vaults...</div>
      ) : (
        <>
          {/* Sub TAB: NEW INVOICE */}
          {subTab === "new" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Entry */}
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-8 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Patient Admissions Registration</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-600">
                    <div>
                      <label className="block mb-1">Patient Full Name *</label>
                      <input 
                        type="text" 
                        placeholder="Admit full name" 
                        value={patientName}
                        onChange={e => setPatientName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 focus:outline-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Contact Phone Call *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 01700-112233" 
                        value={patientPhone}
                        onChange={e => setPatientPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block mb-1">Age (Yrs)</label>
                        <input 
                          type="number" 
                          value={patientAge}
                          onChange={e => setPatientAge(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Gender</label>
                        <select 
                          value={patientGender}
                          onChange={e => setPatientGender(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800"
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Selector and Referral Row */}
                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Select Diagnostic Catalog</label>
                      <select 
                        defaultValue=""
                        onChange={e => handleAddTestToInvoice(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs font-semibold text-slate-700 focus:outline-sky-500"
                      >
                        <option value="" disabled>--- Choose test standard to add ---</option>
                        {tests.map(t => (
                          <option key={t.id} value={t.id}>{t.name} (৳{t.price})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Referred Clinician Code</label>
                      <select 
                        value={referredById}
                        onChange={e => setReferredById(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs font-semibold text-slate-700"
                      >
                        <option value="">No Referral (Self Admissions)</option>
                        {doctors.map(d => (
                          <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Added Tests items list */}
                  <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block mb-2">Billed diagnostics grid</span>
                    {selectedTests.map(t => (
                      <div key={t.id} className="flex justify-between items-center bg-white p-2.5 rounded border border-slate-200/40 text-xs">
                        <div>
                          <span className="font-bold text-slate-700">{t.name}</span>
                          <span className="ml-2 font-mono text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">
                            {t.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-700">৳{t.price}</span>
                          <button 
                            type="button"
                            onClick={() => handleRemoveTestFromInvoice(t.id)}
                            className="text-red-500 hover:bg-red-50 p-1 rounded"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {selectedTests.length === 0 && (
                      <div className="text-center py-6 text-slate-400 italic text-xs">
                        Admit standard tests above to construct patients diagnostic checkout.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Invoicing Ledger Panel */}
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-4 h-fit text-xs font-semibold text-slate-600 space-y-4">
                <div className="pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <BookmarkCheck className="h-5 w-5 text-emerald-500" /> Accounting Checkout
                  </h3>
                </div>

                <div className="space-y-2.5 text-slate-500">
                  <div className="flex justify-between">
                    <span>Clinical Gross Subtotal</span>
                    <span className="font-mono text-slate-800 font-bold">৳{grossTotal.toLocaleString()}</span>
                  </div>

                  {/* Discount Section */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/50 space-y-2">
                    <div className="flex gap-2">
                      <select 
                        value={discountType}
                        onChange={e => { setDiscountType(e.target.value); setDiscountValue("0"); }}
                        className="bg-white border border-slate-200 p-1 rounded font-bold"
                      >
                        <option>None</option>
                        <option>Percentage</option>
                        <option>Fixed</option>
                      </select>
                      <input 
                        type="number" 
                        value={discountValue}
                        onChange={e => setDiscountValue(e.target.value)}
                        disabled={discountType === "None"}
                        className="w-full bg-white border border-slate-200 p-1 px-2 rounded font-mono text-right text-slate-800 font-bold"
                        placeholder="Value"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                     <span>Discount Cuts</span>
                     <span className="font-mono text-rose-600 font-bold">-৳{computedDiscount.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>VAT Tax standard (5%)</span>
                    <span className="font-mono text-slate-850 font-bold">৳{vatAmount.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Service Administration Fee</span>
                    <span className="font-mono text-slate-850 font-bold">৳{serviceCharge.toLocaleString()}</span>
                  </div>

                  <hr className="border-slate-100" />

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-800 font-extrabold">Final Payable Amount</span>
                    <span className="font-mono text-emerald-600 font-extrabold text-base">
                      ৳{payableAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Settle Panel */}
                <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/50 space-y-3 pt-3.5">
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 mb-1">Select Payment Channels</label>
                    <select 
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value)}
                      className="w-full bg-white border border-slate-200 p-2 rounded text-xs font-bold text-slate-850"
                    >
                      <option>Cash</option>
                      <option>Card</option>
                      <option>Mobile Banking</option>
                      <option>Mixed</option>
                      <option>Due</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] uppercase text-slate-500 mb-1">
                      <span>Operator Received (৳)</span>
                      <button 
                        type="button" 
                        onClick={() => setAmountPaid(payableAmount.toString())}
                        className="text-emerald-600 font-bold lowercase hover:underline"
                      >
                        (Pay Full)
                      </button>
                    </div>
                    <input 
                      type="number"
                      value={amountPaid}
                      onChange={e => setAmountPaid(e.target.value)}
                      className="w-full bg-white border border-slate-200 p-2 rounded text-xs font-bold text-slate-800 font-mono text-right"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleCheckoutInvoice}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg shadow-xs text-xs tracking-wider transition uppercase"
                >
                  Generate Invoice Billing Code
                </button>

                {/* Checkout slip printer print out */}
                {checkoutResult && (
                  <div className="bg-sky-50 border border-sky-100 rounded-lg p-3 text-center space-y-2.5 animate-pulse">
                    <div className="text-[11px] text-sky-850 font-semibold">
                      Invoice <strong>{checkoutResult.invoiceNo}</strong> filed successfully!
                    </div>
                    <button 
                      onClick={() => printBillSlip(checkoutResult)}
                      className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold p-1.5 px-3 rounded text-[11px] transition"
                    >
                      <Printer className="h-3.5 w-3.5" /> Print Patient slip Receipt
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sub TAB: ALL INVOICES INDEX */}
          {subTab === "invoice_index" && (
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Patient Bills index</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-600">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                      <th className="py-2.5 px-3">Invoice No</th>
                      <th className="py-2.5 px-3">Patient Admissions Details</th>
                      <th className="py-2.5 px-3">Referred Doctor</th>
                      <th className="py-2.5 px-3 text-right">Net billing</th>
                      <th className="py-2.5 px-3 text-right">Paid</th>
                      <th className="py-2.5 px-3 text-right text-rose-500">Unresolved Due</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-center">Receipts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{inv.invoiceNo}</td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-800">{inv.patient?.name}</div>
                          <div className="text-[10px] text-slate-400 font-bold font-mono">
                            {inv.patient?.phone} | {inv.patient?.age} yrs, {inv.patient?.gender}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-550 italic font-semibold">
                          {inv.referredBy?.name || "Self referred walk-in"}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold">৳{inv.netAmount}</td>
                        <td className="py-2.5 px-3 text-right text-emerald-600 font-bold font-mono">৳{inv.totalPaid}</td>
                        <td className="py-2.5 px-3 text-right text-rose-500 font-bold font-mono">৳{inv.totalDue}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-700" :
                            inv.paymentStatus === "Partially Paid" ? "bg-amber-50 text-amber-700" :
                            "bg-red-50 text-red-700"
                          }`}>
                            {inv.paymentStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button 
                            onClick={() => printBillSlip(inv)}
                            className="p-1 px-2 text-sky-600 hover:bg-sky-50 rounded transition"
                          >
                            <Printer className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {invoices.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center py-6 text-slate-400">No invoices filed yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub TAB: OUTSTANDING DUES */}
          {subTab === "dues" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Table */}
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-8">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Dues Settle desk</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-600">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                        <th className="py-2.5 px-3">Invoice No</th>
                        <th className="py-2.5 px-3">Patient</th>
                        <th className="py-2.5 px-3 text-right">Debit Billed</th>
                        <th className="py-2.5 px-3 text-right font-semibold text-emerald-600">Already Paid</th>
                        <th className="py-2.5 px-3 text-right text-rose-500">Unresolved Debt</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {invoices.filter(i => i.totalDue > 0).map(inv => (
                        <tr key={inv.id} className="hover:bg-slate-55">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-850">{inv.invoiceNo}</td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-700">{inv.patient?.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{inv.patient?.phone}</div>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold">৳{inv.netAmount}</td>
                          <td className="py-2.5 px-3 text-right text-emerald-600 font-bold font-mono">৳{inv.totalPaid}</td>
                          <td className="py-2.5 px-3 text-right text-rose-500 font-bold font-mono">৳{inv.totalDue}</td>
                          <td className="py-2.5 px-3 text-right">
                            <button 
                              onClick={() => {
                                setSelectedDueInvoice(inv);
                                setDueCollectAmount(inv.totalDue.toString());
                              }}
                              className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold p-1 px-2.5 rounded shadow-xs"
                            >
                              Settle payment
                            </button>
                          </td>
                        </tr>
                      ))}
                      {invoices.filter(i => i.totalDue > 0).length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-emerald-600 font-bold italic">
                            Hooray! No outstanding consumer debts exist in active databases.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Settle due block */}
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-4 h-fit">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 pb-2 border-b">Record Collection</h3>

                {selectedDueInvoice ? (
                  <form onSubmit={handleCollectDue} className="space-y-4 text-xs font-semibold text-slate-600">
                    <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-100 text-amber-900 leading-relaxed text-[11px]">
                      Settle payment for Patient <strong>{selectedDueInvoice.patient?.name}</strong>. Invoice: {selectedDueInvoice.invoiceNo}. Total remains: ৳{selectedDueInvoice.totalDue}.
                    </div>

                    <div>
                      <label className="block mb-1">Receipt Cash Collected (৳) *</label>
                      <input 
                        type="number"
                        value={dueCollectAmount}
                        onChange={e => setDueCollectAmount(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-800 font-mono text-right"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 w-full rounded-lg transition"
                    >
                      Post Received Cash
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-10 text-slate-400 italic">
                    Select an invoice from the left desk to settle outstanding patient balances.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sub TAB: CASH REFUNDS */}
          {subTab === "refund" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-8">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Refund Ledger History</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-600">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                        <th className="py-2.5 px-3">Ref Invoice</th>
                        <th className="py-2.5 px-3">Patient Profile</th>
                        <th className="py-2.5 px-3">Approval Reasons</th>
                        <th className="py-2.5 px-3 text-right">Refund Value Paid</th>
                        <th className="py-2.5 px-3 text-center">Method</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {invoices.filter(i => i.refundStatus === "Approved").map(inv => (
                        <tr key={inv.id}>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{inv.invoiceNo}</td>
                          <td className="py-2.5 px-3 font-bold">{inv.patient?.name}</td>
                          <td className="py-2.5 px-3 text-slate-500">Voluntary service cancellation</td>
                          <td className="py-2.5 px-3 text-right text-rose-600 font-bold font-mono">৳{inv.netAmount}</td>
                          <td className="py-2.5 px-3 text-center text-slate-600 font-mono">{inv.paymentMethod}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-705 rounded-full text-[10px] font-bold">
                              Refund Approved
                            </span>
                          </td>
                        </tr>
                      ))}
                      {invoices.filter(i => i.refundStatus === "Approved").length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-6 text-slate-400">No refunds recorded on file yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Refund Form submission */}
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-4 h-fit">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 pb-2 border-b">File Refund request</h3>

                <form onSubmit={submitRefundEntry} className="space-y-4 text-xs font-semibold text-slate-600">
                  <div>
                    <label className="block mb-1">Tax Invoice number *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. LAB/2026/0001" 
                      value={refundInvoiceNo}
                      onChange={e => setRefundInvoiceNo(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1">Refund Amount *</label>
                      <input 
                        type="number" 
                        value={refundAmount}
                        onChange={e => setRefundAmount(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-mono text-right"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Refund Mode *</label>
                      <select 
                        value={refundMode}
                        onChange={e => setRefundMode(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                      >
                        <option>Cash</option>
                        <option>Card</option>
                        <option>bKash Mobile</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1">Reason for Settle *</label>
                    <textarea 
                      rows={2}
                      value={refundReason}
                      onChange={e => setRefundReason(e.target.value)}
                      placeholder="Enter specific audit justification"
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg focus:outline-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded-lg transition"
                  >
                    Approve Cash Reimbursement
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
