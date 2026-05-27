import { Request, Response } from "express";
import * as hrService from "../services/hr.service";

export async function getEmployees(req: Request, res: Response) {
  try {
    const list = await hrService.getAllEmployees();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function addEmployee(req: Request, res: Response) {
  try {
    const emp = await hrService.createEmployee(req.body);
    res.json(emp);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getAttendance(req: Request, res: Response) {
  try {
    const list = await hrService.getAllAttendance();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function addAttendance(req: Request, res: Response) {
  try {
    const entry = await hrService.createAttendance(req.body);
    res.json(entry);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function handleCheckout(req: Request, res: Response) {
  try {
    const updated = await hrService.processCheckout(req.params.id);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function addSalaryPayment(req: Request, res: Response) {
  try {
    const salary = await hrService.createSalaryPayment(req.body);
    res.json(salary);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
