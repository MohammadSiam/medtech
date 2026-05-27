import { Request, Response } from "express";
import { getDashboardData } from "../services/dashboard.service";

export async function getDashboardOverview(req: Request, res: Response) {
  try {
    const range = (req.query.range as string) || "This Month";
    const data = await getDashboardData(range);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
