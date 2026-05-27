import React, { useState, useEffect } from "react";
import { Sliders, Check, ShieldAlert, Award, FileSpreadsheet } from "lucide-react";
import { SystemSetting } from "../types";

export default function ReportHeaderFooter() {
  const [setting, setSetting] = useState<SystemSetting | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit states
  const [labName, setLabName] = useState("");
  const [address, setAddress] = useState("");
  const [hotline, setHotline] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [termsNote, setTermsNote] = useState("");
  const [footerNote, setFooterNote] = useState("");
  const [vatPercent, setVatPercent] = useState("5.0");
  const [serviceChargeLimit, setServiceChargeLimit] = useState("50");
  const [maxDiscountLimit, setMaxDiscountLimit] = useState("20");

  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSetting(data);

      setLabName(data.labName);
      setAddress(data.address);
      setHotline(data.hotline);
      setEmail(data.email);
      setWebsite(data.website);
      setOpeningHours(data.openingHours);
      setTermsNote(data.termsNote);
      setFooterNote(data.footerNote);
      setVatPercent(data.vatPercent.toString());
      setServiceChargeLimit(data.serviceChargeLimit.toString());
      setMaxDiscountLimit(data.maxDiscountLimit.toString());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          labName,
          address,
          hotline,
          email,
          website,
          openingHours,
          termsNote,
          footerNote,
          vatPercent: parseFloat(vatPercent) || 5.0,
          serviceChargeLimit: parseFloat(serviceChargeLimit) || 0,
          maxDiscountLimit: parseFloat(maxDiscountLimit) || 20,
          prefixInvoice: "LAB/2026/"
        })
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
        fetchSettings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !setting) {
    return <div className="text-center py-10 font-mono text-xs text-slate-400">Booting Settings modules...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-50">
        <Sliders className="h-5 w-5 text-indigo-500" />
        <div>
          <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-widest leading-none">Diagnostic Branding Configurations</h2>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">Branding properties are dynamically appended into printable report PDF layout vectors.</span>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6 text-xs font-semibold text-slate-600">
        {/* Lab Info */}
        <div className="space-y-4">
          <span className="text-[10px] text-indigo-650 tracking-wider uppercase block font-mono border-l-2 border-indigo-505 pl-1.5 leading-none">Branding & Meta Header Information</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Corporate Lab Entity Name *</label>
              <input 
                type="text" 
                value={labName}
                onChange={e => setLabName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 focus:outline-indigo-500"
              />
            </div>
            <div>
              <label className="block mb-1">Clinic Address *</label>
              <input 
                type="text" 
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-1">
              <label className="block mb-1">Hotline Call *</label>
              <input 
                type="text" 
                value={hotline}
                onChange={e => setHotline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 font-mono"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block mb-1">Email Register</label>
              <input 
                type="text" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block mb-1">Corporate URL</label>
              <input 
                type="text" 
                value={website}
                onChange={e => setWebsite(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800 font-mono"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block mb-1">Opening Shifts</label>
              <input 
                type="text" 
                value={openingHours}
                onChange={e => setOpeningHours(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-100 pt-5 space-y-4">
          <span className="text-[10px] text-indigo-650 tracking-wider uppercase block font-mono border-l-2 border-indigo-505 pl-1.5 leading-none">Terms Note & Footers Customizations</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Invoicing terms & validity note</label>
              <textarea 
                rows={2}
                value={termsNote}
                onChange={e => setTermsNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg focus:outline-none"
              ></textarea>
            </div>
            <div>
              <label className="block mb-1">Certification & accreditation sub-note</label>
              <textarea 
                rows={2}
                value={footerNote}
                onChange={e => setFooterNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg focus:outline-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Financial margins locking */}
        <div className="border-t border-slate-100 pt-5 space-y-4">
          <span className="text-[10px] text-indigo-650 tracking-wider uppercase block font-mono border-l-2 border-indigo-505 pl-1.5 leading-none">Financial Limits & Tax Rules</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">VAT Percentage rule (%)</label>
              <input 
                type="number" 
                value={vatPercent}
                onChange={e => setVatPercent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-800 font-mono text-right"
              />
            </div>
            <div>
              <label className="block mb-1">Admin service flat surcharge (৳)</label>
              <input 
                type="number" 
                value={serviceChargeLimit}
                onChange={e => setServiceChargeLimit(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-800 font-mono text-right"
              />
            </div>
            <div>
              <label className="block mb-1">Max discount ceiling allowable (%)</label>
              <input 
                type="number" 
                value={maxDiscountLimit}
                onChange={e => setMaxDiscountLimit(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-800 font-mono text-right"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="border-t border-slate-50 pt-4 flex justify-between items-center bg-slate-50 p-4 rounded-xl border">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldAlert className="h-4 w-4" />
            <span className="text-[10px]">Changes logged here apply clinic-wide across all terminal desks.</span>
          </div>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-emerald-600 font-bold text-[11px] animate-pulse flex items-center gap-0.5">
                <Check className="h-4 w-4" /> Saved Successfully!
              </span>
            )}
            <button 
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold p-2 px-6 rounded-lg uppercase tracking-wider"
            >
              Apply Clinic Profile Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
