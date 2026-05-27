import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { 
  Users, Activity, DollarSign, Calendar, Layers, ShieldAlert, 
  Menu, X, Bell, LayoutDashboard, Stethoscope, ClipboardList, 
  Settings, ShoppingCart, UserCheck, BarChart3, Pill 
} from "lucide-react";

import DashboardOverview from "./components/DashboardOverview";
import ReceptionBilling from "./components/ReceptionBilling";
import AppointmentManagement from "./components/AppointmentManagement";
import LabManagement from "./components/LabManagement";
import DoctorConfig from "./components/DoctorConfig";
import TestConfig from "./components/TestConfig";
import ReagentConfig from "./components/ReagentConfig";
import AccountHR from "./components/AccountHR";
import ReportsCenter from "./components/ReportsCenter";
import ReportHeaderFooter from "./components/ReportHeaderFooter";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "billing", label: "Patient Billing", icon: ShoppingCart },
    { id: "appointments", label: "Appointment Serials", icon: Calendar },
    { id: "lab", label: "Lab Technician desk", icon: Activity },
    { id: "doctors", label: "Doctor Registry", icon: Stethoscope },
    { id: "tests", label: "Test Catalog", icon: ClipboardList },
    { id: "reagents", label: "Reagents stock", icon: Pill },
    { id: "accounts_hr", label: "Accounts & HR", icon: UserCheck },
    { id: "reports", label: "Reports Center", icon: BarChart3 },
    { id: "settings", label: "Branding Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-sky-100 selection:text-sky-900">
      {/* Top Banner and Navigation Bar */}
      <header className="bg-indigo-950 text-white p-4 sticky top-0 z-40 shadow-md border-b border-indigo-900/40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Mobile menu triggers */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            
            <div className="flex items-center gap-2">
              <span className="p-2 bg-sky-500 text-indigo-950 rounded-xl shadow-inner font-extrabold flex items-center justify-center leading-none">
                CP
              </span>
              <div>
                <h1 className="text-sm font-bold tracking-tight">CarePath diagnostics</h1>
                <span className="text-[10px] text-sky-350 font-mono block leading-tight">Master Clinic ERP Platform</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline-block text-[11px] font-mono text-indigo-200 bg-indigo-900/60 p-1 px-3 rounded-md">
              System Time: <span className="font-bold text-sky-305">2026-05-27 16:26 UTC</span>
            </span>
            <div className="relative p-1.5 bg-indigo-900/45 hover:bg-indigo-900 rounded-lg transition cursor-pointer">
              <Bell className="h-4 w-4 text-indigo-200" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Canvas layout with Sidebar and content container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex relative">
        {/* Left Sidebar Layout for large screens (lg) */}
        <aside className="hidden lg:block w-64 bg-slate-900 text-slate-300 p-5 shrink-0 border-r border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Diagnostic ERP Desk</span>
          <nav className="space-y-1">
            {menuItems.map(item => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    isActive 
                      ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/10 scale-[1.02]" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <IconComp className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-slate-950" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile menu overlay slide out */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Back backdrop click filter */}
              <div 
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-30"
              />
              {/* Mobile Drawer */}
              <div className="lg:hidden fixed top-0 bottom-0 left-0 w-64 bg-slate-950 text-slate-300 p-5 z-40 shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-400">CarePath Navigators</span>
                    <button onClick={() => setMobileMenuOpen(false)} className="p-1 hover:bg-slate-800 rounded">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <nav className="space-y-1">
                    {menuItems.map(item => {
                      const IconComp = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                            isActive 
                              ? "bg-sky-500 text-slate-950 font-bold" 
                              : "text-slate-400 hover:bg-slate-900"
                          }`}
                        >
                          <IconComp className="h-4 w-4 shrink-0" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="text-[10px] text-slate-600 font-mono border-t border-slate-900 pt-4">
                  CarePath Diagnostic Center © 2026. Certified ISO Medical ERP.
                </div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Core dynamic contents body wrapper */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-h-0 bg-slate-50">
          {/* Subview mounts mapping State tabs switches */}
          {activeTab === "dashboard" && <DashboardOverview />}
          {activeTab === "billing" && <ReceptionBilling />}
          {activeTab === "appointments" && <AppointmentManagement />}
          {activeTab === "lab" && <LabManagement />}
          {activeTab === "doctors" && <DoctorConfig />}
          {activeTab === "tests" && <TestConfig />}
          {activeTab === "reagents" && <ReagentConfig />}
          {activeTab === "accounts_hr" && <AccountHR />}
          {activeTab === "reports" && <ReportsCenter />}
          {activeTab === "settings" && <ReportHeaderFooter />}
        </main>
      </div>
    </div>
  );
}
