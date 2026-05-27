import { prisma } from "../models/db";

export async function getAllExpenses() {
  return await prisma.expense.findMany({ orderBy: { createdAt: "desc" } });
}

interface CreateExpenseDto {
  category: string;
  description: string;
  amount: any;
  recordedBy?: string;
}

export async function createExpense(data: CreateExpenseDto) {
  return await prisma.expense.create({
    data: {
      category: data.category,
      description: data.description,
      amount: parseFloat(data.amount) || 0,
      recordedBy: data.recordedBy || "Manager"
    }
  });
}
