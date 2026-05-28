import React, { useState, useEffect } from "react";
import { 
  DollarSign, Users, ClipboardList, Wallet, Plus, CreditCard, 
  UserPlus, CheckCircle, Clock, Trash, Receipt, TrendingUp 
} from "lucide-react";
import { Employee, Expense, Attendance } from "../types";

export default function AccountHR() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  // hr sub-tabs: "expenses", "employees", "attendance", "payroll"
  const [secTab, setSecTab] = useState("expenses");

  // --- Expense Form ---
  const [expCategory, setExpCategory] = useState("Utility");
  const [expDescription, setExpDescription] = useState("");
  const [expAmount, setExpAmount] = useState("1500");

  // --- Employee Form ---
  const [empName, setEmpName] = useState("");
  const [empRole, setEmpRole] = useState("Receptionist");
  const [empPhone, setEmpPhone] = useState("");
  const [empSalary, setEmpSalary] = useState("25000");
  const [empShift, setEmpShift] = useState("Morning");

  // --- Attendance Clock States ---
  const [clockEmployeeId, setClockEmployeeId] = useState("");
  const [clockStatus, setClockStatus] = useState("Present");

  // --- Payroll Payout States ---
  const [payEmployeeId, setPayEmployeeId] = useState("");
  const [payMonth, setPayMonth] = useState("May 2026");
  const [payBonus, setPayBonus] = useState("0");
  const [payDeduction, setPayDeduction] = useState("0");

  const fetchData = async () => {
    setLoading(true);
    try {
      const emRes = await fetch("/api/hr/employees");
      const emList = await emRes.json();
      const emArr = Array.isArray(emList) ? emList : [];
      setEmployees(emArr);
      if (emArr.length > 0) {
        setClockEmployeeId(emArr[0].id);
        setPayEmployeeId(emArr[0].id);
      }

      const exRes = await fetch("/api/expenses");
      const exList = await exRes.json();
      setExpenses(Array.isArray(exList) ? exList : []);

      const atRes = await fetch("/api/hr/attendance");
      const atList = await atRes.json();
      setAttendance(Array.isArray(atList) ? atList : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePostExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expDescription || !expAmount) {
      alert("Please provide specific detail and amount for accounting auditing.");
      return;
    }
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: expCategory,
          description: expDescription,
          amount: expAmount,
          recordedBy: "Manager Rafiq"
        })
      });
      if (res.ok) {
        setExpDescription("");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleHireEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empPhone) {
      alert("Please enter full name and mobile phone contact.");
      return;
    }
    try {
      const res = await fetch("/api/hr/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: empName,
          role: empRole,
          phone: empPhone,
          salary: empSalary,
          shiftType: empShift
        })
      });
      if (res.ok) {
        setEmpName("");
        setEmpPhone("");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClockAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clockEmployeeId) {
      alert("Select active staff to log biometric checks.");
      return;
    }
    const todayStr = new Date().toISOString().split("T")[0];
    try {
      await fetch("/api/hr/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: clockEmployeeId,
          status: clockStatus,
          date: todayStr
        })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoutinePayrollSettle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payEmployeeId) return;
    const targetEmp = employees.find(emp => emp.id === payEmployeeId);
    if (!targetEmp) return;

    const base = targetEmp.salary;
    const bPrice = parseFloat(payBonus) || 0;
    const dPrice = parseFloat(payDeduction) || 0;
    const netTotal = base + bPrice - dPrice;

    try {
      const res = await fetch("/api/hr/salaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: payEmployeeId,
          month: payMonth,
          baseSalary: base,
          bonus: bPrice,
          deduction: dPrice,
          netPaid: netTotal
        })
      });
      if (res.ok) {
        alert("Routine payroll coupon dispatched successfully!");
        setPayBonus("0");
        setPayDeduction("0");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const summedExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Sub menu selector */}
      <div className="flex border-b border-slate-100 bg-white p-2 rounded-xl border border-slate-50 gap-1 shadow-xs">
        <button 
          onClick={() => setSecTab("expenses")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            secTab === "expenses" ? "bg-rose-50 text-rose-700" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Receipt className="h-4 w-4" /> Expenses Tracker
        </button>
        <button 
          onClick={() => setSecTab("employees")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            secTab === "employees" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="h-4 w-4" /> Staff directory
        </button>
        <button 
          onClick={() => setSecTab("attendance")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            secTab === "attendance" ? "bg-teal-50 text-teal-700" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Clock className="h-4 w-4" /> Biometric Clocks
        </button>
        <button 
          onClick={() => setSecTab("payroll")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            secTab === "payroll" ? "bg-amber-50 text-amber-700" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Wallet className="h-4 w-4" /> Routine Payroll
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 font-mono text-xs">Accessing financial structures...</div>
      ) : (
        <>
          {/* SEC TAB: EXPENSES */}
          {secTab === "expenses" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Enterprise general ledgers</h3>
                  <span className="text-xs font-bold font-mono text-slate-500 bg-slate-100 p-1 px-3 rounded-lg">
                    Aggregate Expenses: ৳{summedExpenses.toLocaleString()}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-600">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Overhead Head</th>
                        <th className="py-2.5 px-3">justification Description</th>
                        <th className="py-2.5 px-3 text-right">Debit Cost</th>
                        <th className="py-2.5 px-3 text-center">Filer Operator</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {expenses.map(e => {
                        const dateStr = new Date(e.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
                        return (
                          <tr key={e.id} className="hover:bg-slate-55">
                            <td className="py-2.5 px-3 font-mono text-slate-500">{dateStr}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-bold`}>
                                {e.category}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-800 font-semibold">{e.description}</td>
                            <td className="py-2.5 px-3 text-right font-bold text-slate-800 font-mono">৳{e.amount.toLocaleString()}</td>
                            <td className="py-2.5 px-3 text-center text-slate-400 font-mono italic">{e.recordedBy}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Form Entry */}
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-4 h-fit text-xs font-semibold text-slate-600">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 pb-2 border-b">Record Ledger Costs</h3>

                <form onSubmit={handlePostExpense} className="space-y-4">
                  <div>
                    <label className="block mb-1">Cost Area Category *</label>
                    <select 
                      value={expCategory}
                      onChange={e => setExpCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-800"
                    >
                      <option>Utility</option>
                      <option>Rent</option>
                      <option>Consumables</option>
                      <option>Payroll</option>
                      <option>Marketing</option>
                      <option>Others</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1">Debit cost Description *</label>
                    <textarea 
                      rows={2}
                      placeholder="e.g. Electric bill May 2026, Roche Reagents batch kit delivery" 
                      value={expDescription}
                      onChange={e => setExpDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg focus:outline-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block mb-1">Voucher Amount (৳ / BDT) *</label>
                    <input 
                      type="number" 
                      value={expAmount}
                      onChange={e => setExpAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-mono text-right text-slate-800"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded-lg transition"
                  >
                    Post Debit Ledger
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* SEC TAB: STAFF PROFILE */}
          {secTab === "employees" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-8">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Enterprise Personnel directory</h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-600">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                        <th className="py-2.5 px-3">Personnel Name</th>
                        <th className="py-2.5 px-3">Operating Role</th>
                        <th className="py-2.5 px-3">Contact Call</th>
                        <th className="py-2.5 px-3 text-right">Standard Salary</th>
                        <th className="py-2.5 px-3 text-center">Assigned Shift</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {employees.map(emp => (
                        <tr key={emp.id} className="hover:bg-slate-55">
                          <td className="py-2.5 px-3 font-bold text-slate-800">{emp.name}</td>
                          <td className="py-2.5 px-3 text-indigo-650 font-bold">{emp.role}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500">{emp.phone}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold">৳{emp.salary.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 text-[10px] font-bold uppercase">
                              {emp.shiftType}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold">
                              {emp.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Hire Onboard personnel */}
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-4 h-fit text-xs font-semibold text-slate-600">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 pb-2 border-b">Onboard Operator</h3>

                <form onSubmit={handleHireEmployee} className="space-y-4">
                  <div>
                    <label className="block mb-1">Personnel Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Rafiqul Islam" 
                      value={empName}
                      onChange={e => setEmpName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1">Operating Role *</label>
                      <select 
                        value={empRole}
                        onChange={e => setEmpRole(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                      >
                        <option>Receptionist</option>
                        <option>Lab Technician</option>
                        <option>Accountant</option>
                        <option>Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1">Assigned Shift *</label>
                      <select 
                        value={empShift}
                        onChange={e => setEmpShift(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                      >
                        <option>Morning</option>
                        <option>Evening</option>
                        <option>Night</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1">Contact Phone *</label>
                      <input 
                        type="text" 
                        placeholder="01711-XXXXXX" 
                        value={empPhone}
                        onChange={e => setEmpPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Base Salary (৳) *</label>
                      <input 
                        type="number" 
                        value={empSalary}
                        onChange={e => setEmpSalary(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-mono text-right"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition"
                  >
                    Onboard Personnel
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* SEC TAB: BIOMETRIC ATTENDANCE */}
          {secTab === "attendance" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-8">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 font-sans">Biometric Clock records list</h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-600">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Personnel Name</th>
                        <th className="py-2.5 px-3">Clock-In Timestamp</th>
                        <th className="py-2.5 px-3">Clock-Out Timestamp</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {attendance.map(a => {
                        const inTime = new Date(a.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const outTime = a.checkOut ? new Date(a.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "On Duty";
                        return (
                          <tr key={a.id} className="hover:bg-slate-55">
                            <td className="py-2.5 px-3 font-mono text-slate-550">{a.date}</td>
                            <td className="py-2.5 px-3 font-bold text-slate-800">{a.employee?.name}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-700 font-semibold">{inTime}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-500">{outTime}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                a.status === "Present" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                              }`}>
                                {a.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Simulation biometric clock log */}
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-4 h-fit text-xs font-semibold text-slate-600">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 pb-2 border-b">Biometric Clock simulator</h3>

                <form onSubmit={handleClockAttendance} className="space-y-4">
                  <div>
                    <label className="block mb-1">Choose active staff to clock *</label>
                    <select 
                      value={clockEmployeeId}
                      onChange={e => setClockEmployeeId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-bold"
                    >
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1">Duty Status *</label>
                    <select 
                      value={clockStatus}
                      onChange={e => setClockStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-bold"
                    >
                      <option>Present</option>
                      <option>Late</option>
                      <option>Absent</option>
                    </select>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-lg transition"
                  >
                    Simulate Duty biometric Check
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* SEC TAB: ROUTINE PAYROLL PAYOUTS */}
          {secTab === "payroll" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-8">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Personnel Payroll ledger sheets</h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-600">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                        <th className="py-2.5 px-3">Salary Month</th>
                        <th className="py-2.5 px-3">Personnel Name</th>
                        <th className="py-2.5 px-3 text-right">Standard Base</th>
                        <th className="py-2.5 px-3 text-right">Bonus Allowance</th>
                        <th className="py-2.5 px-3 text-right text-red-500">Deductions</th>
                        <th className="py-2.5 px-3 text-right">Salary Paid</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {employees.map(emp => {
                        // Demo data since salaries nested structure mapped in Express
                        return (
                          <tr key={emp.id} className="hover:bg-slate-55">
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-700">May 2026</td>
                            <td className="py-2.5 px-3 font-bold text-slate-800">{emp.name}</td>
                            <td className="py-2.5 px-3 text-right font-mono">৳{emp.salary.toLocaleString()}</td>
                            <td className="py-2.5 px-3 text-right text-emerald-600 font-mono">+৳0</td>
                            <td className="py-2.5 px-3 text-right text-red-500 font-mono">-৳0</td>
                            <td className="py-2.5 px-3 text-right font-bold text-emerald-600 font-mono">
                              ৳{emp.salary.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Settle Payroll routine payouts */}
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-4 h-fit text-xs font-semibold text-slate-600">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 pb-2 border-b">Pay Salary coupon</h3>

                <form onSubmit={handleRoutinePayrollSettle} className="space-y-4">
                  <div>
                    <label className="block mb-1">Target Personnel *</label>
                    <select 
                      value={payEmployeeId}
                      onChange={e => setPayEmployeeId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-bold"
                    >
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name} (Base: ৳{emp.salary})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1">Target Salary Calendars Month *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. May 2026" 
                      value={payMonth}
                      onChange={e => setPayMonth(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1">Bonus allowance (৳)</label>
                      <input 
                        type="number" 
                        value={payBonus}
                        onChange={e => setPayBonus(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-emerald-600 font-mono text-right font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Late Deductions (৳)</label>
                      <input 
                        type="number" 
                        value={payDeduction}
                        onChange={e => setPayDeduction(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-red-500 font-mono text-right font-semibold"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg transition"
                  >
                    Dispatch routine salary sheet
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
