import { Request, Response } from "express";
import * as financeService from "../services/finance.service";

export async function getRefunds(req: Request, res: Response) {
  try {
    const list = await financeService.getAllRefunds();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function addRefund(req: Request, res: Response) {
  try {
    const refund = await financeService.createRefund(req.body);
    res.json(refund);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
