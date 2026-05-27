import { Request, Response } from "express";
import * as expenseService from "../services/expense.service";

export async function getExpenses(req: Request, res: Response) {
  try {
    const list = await expenseService.getAllExpenses();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function addExpense(req: Request, res: Response) {
  try {
    const expense = await expenseService.createExpense(req.body);
    res.json(expense);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
