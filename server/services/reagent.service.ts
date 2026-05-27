import { prisma } from "../models/db";

export async function getAllReagents() {
  return await prisma.reagent.findMany({ orderBy: { expiryDate: "asc" } });
}

interface CreateReagentDto {
  name: string;
  supplier: string;
  brandModel: string;
  machineName: string;
  purchasePrice: any;
  stockQty: any;
  lowStockAlert: any;
  expiryDate: any;
  lotNumber: string;
}

export async function createReagent(data: CreateReagentDto) {
  return await prisma.reagent.create({
    data: {
      name: data.name,
      supplier: data.supplier,
      brandModel: data.brandModel,
      machineName: data.machineName,
      purchasePrice: parseFloat(data.purchasePrice) || 0,
      stockQty: parseFloat(data.stockQty) || 0,
      lowStockAlert: parseFloat(data.lowStockAlert) || 0,
      expiryDate: new Date(data.expiryDate),
      lotNumber: data.lotNumber
    }
  });
}
