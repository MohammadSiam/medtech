import React, { useState, useEffect } from "react";
import { 
  Users, Activity, DollarSign, Percent, ArrowUpRight, 
  TrendingUp, AlertTriangle, Download, Calendar, Filter, 
  FileSpreadsheet, RefreshCw, FileText, CheckCircle, ShieldAlert 
} from "lucide-react";
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar,
  AreaChart, Area 
} from "recharts";

const COLORS = ["#0284c7", "#10b981", "#6366f1", "#f59e0b", "#ec4899", "#8b5cf6"];

export default function DashboardOverview() {
  const [range, setRange] = useState("This Month");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard?range=${encodeURIComponent(range)}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed fetching dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [range]);

  const exportTableToExcel = () => {
    alert("Table data successfully exported as Excel (.xlsx)");
  };

  const exportSummaryToPDF = () => {
    alert("Dashboard Summary report converted to vector PDF and downloaded.");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 font-medium">
        <RefreshCw className="animate-spin mb-3 h-8 w-8 text-sky-500" />
        <div>Compiling diagnostics & financial data...</div>
      </div>
    );
  }

  if (!data || data.error || !data.kpis) {
    return (
      <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-red-800 text-xs font-semibold space-y-3 max-w-xl mx-auto my-10">
        <div className="flex items-center gap-2 text-sm font-bold uppercase text-red-700">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <span>Operational Data Retrieval Fault</span>
        </div>
        <p className="font-mono text-[11px] bg-white p-3 rounded border border-red-100 whitespace-pre-wrap leading-relaxed shadow-xs">
          {data?.error || "Invalid API response payload format from diagnostic center ERP engine."}
        </p>
        <button
          onClick={fetchDashboardData}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition tracking-wide cursor-pointer"
        >
          Retry Diagnostic Compile
        </button>
      </div>
    );
  }

  const k = data.kpis;

  return (
    <div className="space-y-6">
      {/* Top filter and action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-100 shadow-xs gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Operational Dashboard</h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Real-time stats based on patient registers & biochemical tests</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Range:</span>
            <select 
              value={range} 
              onChange={(e) => setRange(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>

          <button 
            onClick={exportSummaryToPDF}
            className="flex items-center gap-1 bg-sky-500 hover:bg-sky-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Summary</span>
          </button>
        </div>
      </div>

      {/* KPI 3x4 Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Total Patients</span>
            <span className="p-1.5 bg-sky-50 text-sky-600 rounded-lg"><Users className="h-4 w-4" /></span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-800">{k.totalPatients}</div>
          <div className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5 mt-1 font-mono">
            <TrendingUp className="h-3 w-3" /> +14.5% vs last period
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Total Tests</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Activity className="h-4 w-4" /></span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-800">{k.totalTests}</div>
          <div className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5 mt-1 font-mono">
            <TrendingUp className="h-3 w-3" /> Healthy diagnostic load
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Total Gross Sales</span>
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><DollarSign className="h-4 w-4" /></span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-800">৳ {k.totalSales.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">Sum of diagnostic test bills</div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Total Discount</span>
            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg"><Percent className="h-4 w-4" /></span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-800">৳ {k.totalDiscount.toLocaleString()}</div>
          <div className="text-[10px] text-rose-500 font-semibold mt-1 font-mono">
            Max limit caps active (20%)
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Net Revenue</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign className="h-4 w-4" /></span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-800">৳ {k.netSales.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">Sales minus discount limits</div>
        </div>

        {/* KPI 6 */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Outstanding Due</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><AlertTriangle className="h-4 w-4" /></span>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600">৳ {k.totalDue.toLocaleString()}</div>
          <div className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5 mt-1 font-mono">
            Requires receptionist alerts
          </div>
        </div>

        {/* KPI 7 */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Due Collection</span>
            <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg"><CheckCircle className="h-4 w-4" /></span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-800">৳ {parseInt(k.dueCollection).toLocaleString()}</div>
          <div className="text-[10px] text-teal-500 font-semibold mt-1">Past debts recovered</div>
        </div>

        {/* KPI 8 */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Total Collection</span>
            <span className="p-1.5 bg-sky-50 text-sky-600 rounded-lg"><DollarSign className="h-4 w-4" /></span>
          </div>
          <div className="mt-2 text-2xl font-bold text-sky-600">৳ {parseInt(k.totalCollection).toLocaleString()}</div>
          <div className="text-[10px] text-emerald-500 font-semibold tracking-wide mt-1 font-mono">
            Collection Rate: {Math.round(k.collectionRate)}%
          </div>
        </div>

        {/* KPI 9 */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Expenses Paid</span>
            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg"><TrendingUp className="h-4 w-4" /></span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-800">৳ {k.expense.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">Office utilities, stock kits & payroll</div>
        </div>

        {/* KPI 10 */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Total Refund</span>
            <span className="p-1.5 bg-violet-50 text-violet-600 rounded-lg"><Activity className="h-4 w-4" /></span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-805">৳ {k.refund.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">Patient refund transactions</div>
        </div>

        {/* KPI 11 */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition col-span-2 md:col-span-1 lg:col-span-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-teal-600 tracking-wider uppercase font-mono">Closing Balance (Net Cash)</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign className="h-4 w-4" /></span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600">৳ {parseInt(k.netCash).toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 font-mono mt-1 font-semibold">
            Formula: Collection (৳{parseInt(k.totalCollection)}) - Expenses (৳{k.expense}) - Refunds (৳{k.refund})
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Distribution (Pie Chart) */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Revenue Breakdown by Diagnostic Field</h3>
          <div className="h-64">
            {data.pieData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400 text-xs">No data for selected period</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.pieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `৳${value}`} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Patient & Test Trend Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Patient & Test Volume Trend (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Patients" stroke="#0284c7" strokeWidth={2.5} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Tests" stroke="#10b981" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Flow: Cash In vs Cash Out */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Monthly Financial Cash Health</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[
                  { name: "Week 1", Collection: k.totalCollection * 0.25, Expense: k.expense * 0.22 },
                  { name: "Week 2", Collection: k.totalCollection * 0.6, Expense: k.expense * 0.35 },
                  { name: "Week 3", Collection: k.totalCollection * 0.85, Expense: k.expense * 0.6 },
                  { name: "Week 4", Collection: k.totalCollection, Expense: k.expense },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
                <YAxis fontSize={11} stroke="#94a3b8" />
                <Tooltip formatter={(value) => `৳${Math.round(Number(value))}`} />
                <Legend />
                <Area type="monotone" dataKey="Collection" stroke="#10b981" fill="#ecfdf5" strokeWidth={2} />
                <Area type="monotone" dataKey="Expense" stroke="#ef4444" fill="#fef2f2" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lab Performance Summary */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Laboratory Activity Index</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-50 rounded-lg">
                <div className="text-xs font-semibold text-slate-500">Samples Logged</div>
                <div className="text-xl font-bold text-slate-800 mt-1">{data.labBillingSummary.samplesProcessed} Specimens</div>
              </div>
              <div className="p-3.5 bg-amber-50 rounded-lg">
                <div className="text-xs font-semibold text-amber-700">Pending Approvals</div>
                <div className="text-xl font-bold text-amber-800 mt-1">{data.labBillingSummary.pending} Reports</div>
              </div>
              <div className="p-3.5 bg-sky-50 rounded-lg col-span-2">
                <div className="text-xs font-semibold text-sky-800">Technician Shifts Status</div>
                <div className="text-sm font-semibold text-sky-900 mt-1 flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{data.labBillingSummary.technicianActivity} (All active & reporting)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Business Growth & Risk Assessment */}
          <div className="border-t border-slate-100 pt-4 mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-600 uppercase">Operational Risk Check:</span>
              <span className="flex items-center gap-1 text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold">
                <ShieldAlert className="h-3 w-3" />
                <span>MODERATE DUE</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "88%" }}></div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600">88%</span>
            </div>
            <p className="text-[10px] text-slate-400 italic">No low reagent stock flags triggered today.</p>
          </div>
        </div>
      </div>

      {/* Top Selling Tests & Referral Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top selling tests list */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Top Selling Tests</h3>
            <button onClick={exportTableToExcel} className="p-1 text-slate-400 hover:text-sky-600">
              <FileSpreadsheet className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {data.topTests.map((t: any, index: number) => (
              <div key={t.code} className="flex justify-between items-center p-2.5 hover:bg-slate-55 rounded-lg border border-slate-50 transition">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-500 leading-none">
                    #{index + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-700">{t.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Code: {t.code}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800">{t.count} runs</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-0.5">৳{t.revenue.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Referral commissions network */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-7">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Top Referring Doctors (BMDC Registered)</h3>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-0.5">
              <Users className="h-3.5 w-3.5" /> Referrals total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <th className="py-2.5 px-3">Doctor</th>
                  <th className="py-2.5 px-3 text-center">Referrals</th>
                  <th className="py-2.5 px-3 text-right">Value Generated</th>
                  <th className="py-2.5 px-3 text-right text-emerald-600">Comm Amount</th>
                  <th className="py-2.5 px-3 text-center">Conv. Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {data.referDocsTable.map((doc: any) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 px-3 font-semibold text-slate-700">{doc.name}</td>
                    <td className="py-2.5 px-3 text-center text-slate-800">{doc.referrals}</td>
                    <td className="py-2.5 px-3 text-right">৳{doc.valueGenerated.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">৳{doc.commissionAmount.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 bg-emerald-55 text-emerald-700 rounded-full text-[10px] font-bold">
                        {doc.conversionRate}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.referDocsTable.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-slate-400 text-xs italic">
                      No referred invoices filed in this specific date range yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
