import { Request, Response } from "express";
import * as billingService from "../services/billing.service";

export async function getBillingInvoices(req: Request, res: Response) {
  try {
    const list = await billingService.getAllBillingInvoices();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function addBillingInvoice(req: Request, res: Response) {
  try {
    const invoice = await billingService.createBillingInvoice(req.body);
    res.json({ success: true, invoice });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function handleDuePayment(req: Request, res: Response) {
  try {
    const { amountPaid } = req.body;
    const updated = await billingService.processDuePayment(req.params.id, amountPaid);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function handlePayCommission(req: Request, res: Response) {
  try {
    const { commissionPaid } = req.body;
    const updated = await billingService.payCommission(req.params.id, commissionPaid);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function handleDeliverReport(req: Request, res: Response) {
  try {
    const { deliveredBy } = req.body;
    const updated = await billingService.deliverReport(req.params.id, deliveredBy);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function handleStatusUpdate(req: Request, res: Response) {
  try {
    const { reportStatus } = req.body;
    const updated = await billingService.updateReportStatus(req.params.id, reportStatus);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
