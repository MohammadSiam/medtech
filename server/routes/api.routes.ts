import { Router } from "express";

import { getDashboardOverview } from "../controllers/dashboard.controller";
import { getDoctors, addDoctor, modifyDoctor, removeDoctor } from "../controllers/doctor.controller";
import { getTests, addTest, modifyTest, removeTest } from "../controllers/test.controller";
import {
  getBillingInvoices,
  addBillingInvoice,
  handleDuePayment,
  handlePayCommission,
  handleDeliverReport,
  handleStatusUpdate
} from "../controllers/billing.controller";
import {
  getAppointments,
  addAppointment,
  modifyAppointmentStatus
} from "../controllers/appointment.controller";
import { getReagents, addReagent } from "../controllers/reagent.controller";
import { getExpenses, addExpense } from "../controllers/expense.controller";
import {
  getEmployees,
  addEmployee,
  getAttendance,
  addAttendance,
  handleCheckout,
  addSalaryPayment
} from "../controllers/hr.controller";
import { getRefunds, addRefund } from "../controllers/finance.controller";
import { getSystemSettings, updateSystemSettings } from "../controllers/setting.controller";

const router = Router();

// 1. Dashboard Routes
router.get("/dashboard", getDashboardOverview);

// 2. Doctor Routes
router.get("/doctors", getDoctors);
router.post("/doctors", addDoctor);
router.put("/doctors/:id", modifyDoctor);
router.delete("/doctors/:id", removeDoctor);

// 3. Test Routes
router.get("/tests", getTests);
router.post("/tests", addTest);
router.put("/tests/:id", modifyTest);
router.delete("/tests/:id", removeTest);

// 4. Billing Routes
router.get("/billing", getBillingInvoices);
router.post("/billing", addBillingInvoice);
router.put("/billing/:id/due-payment", handleDuePayment);
router.put("/billing/:id/pay-commission", handlePayCommission);
router.put("/billing/:id/deliver", handleDeliverReport);
router.put("/billing/:id/status", handleStatusUpdate);

// 5. Appointment Routes
router.get("/appointments", getAppointments);
router.post("/appointments", addAppointment);
router.put("/appointments/:id/status", modifyAppointmentStatus);

// 6. Reagent Routes
router.get("/reagents", getReagents);
router.post("/reagents", addReagent);

// 7. Expense Routes
router.get("/expenses", getExpenses);
router.post("/expenses", addExpense);

// 8. HR & Attendance Routes
router.get("/hr/employees", getEmployees);
router.post("/hr/employees", addEmployee);
router.get("/hr/attendance", getAttendance);
router.post("/hr/attendance", addAttendance);
router.put("/hr/attendance/:id/checkout", handleCheckout);
router.post("/hr/salaries", addSalaryPayment);

// 9. Finance & Refunds Routes
router.get("/refunds", getRefunds);
router.post("/refunds", addRefund);

// 10. Settings Routes
router.get("/settings", getSystemSettings);
router.post("/settings", updateSystemSettings);

export default router;
