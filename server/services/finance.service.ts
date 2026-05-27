import { prisma } from "../models/db";

export async function getAllRefunds() {
  return await prisma.refundRequest.findMany({
    include: { invoice: { include: { patient: true } } },
    orderBy: { createdAt: "desc" }
  });
}

interface CreateRefundDto {
  invoiceId: string;
  amount: any;
  reason: string;
  refundMode: string;
}

export async function createRefund(data: CreateRefundDto) {
  const refund = await prisma.refundRequest.create({
    data: {
      invoiceId: data.invoiceId,
      amount: parseFloat(data.amount) || 0,
      reason: data.reason,
      status: "Approved",
      refundMode: data.refundMode
    }
  });

  // Update invoice status with info
  await prisma.billingInvoice.update({
    where: { id: data.invoiceId },
    data: { refundStatus: "Approved" }
  });

  return refund;
}
