import { prisma } from "../models/db";

export async function getAllBillingInvoices() {
  return await prisma.billingInvoice.findMany({
    include: {
      patient: true,
      referredBy: true,
      items: { include: { test: true } }
    },
    orderBy: { createdAt: "desc" }
  });
}

interface CreateBillingInvoiceDto {
  patientId?: string;
  patientName: string;
  patientPhone: string;
  patientAge: any;
  patientGender: string;
  doctorReferId?: string;
  testIds: string[];
  discountType: string;
  discountValue: any;
  paymentMethod: string;
  amountToPay: any;
}

export async function createBillingInvoice(data: CreateBillingInvoiceDto) {
  let targetPatientId = data.patientId;

  // Create a new patient on the fly if walk-in or not selected
  if (!targetPatientId) {
    const newPat = await prisma.patient.create({
      data: {
        name: data.patientName,
        phone: data.patientPhone,
        age: parseInt(data.patientAge) || 30,
        gender: data.patientGender || "Male"
      }
    });
    targetPatientId = newPat.id;
  }

  // Resolve Tests details
  const selectedTests = await prisma.test.findMany({
    where: { id: { in: data.testIds } }
  });

  const sumPrice = selectedTests.reduce((sum, t) => sum + t.price, 0);

  // Compute standard charges
  let discAmt = 0;
  const config = await prisma.systemSetting.findFirst() || { vatPercent: 5.0, serviceChargeLimit: 50.0 };
  if (data.discountType === "Percentage") {
    discAmt = (sumPrice * (parseFloat(data.discountValue) || 0)) / 100;
  } else if (data.discountType === "Fixed") {
    discAmt = parseFloat(data.discountValue) || 0;
  }

  const netChargeBeforeTax = sumPrice - discAmt;
  const vatAmt = (netChargeBeforeTax * (config.vatPercent || 5.0)) / 100;
  const serviceFee = config.serviceChargeLimit || 50.0;
  const totalPayable = netChargeBeforeTax + vatAmt + serviceFee;

  const paidInput = parseFloat(data.amountToPay) || 0;
  const dueAmt = Math.max(0, totalPayable - paidInput);

  let paymentStatus = "Unpaid";
  if (dueAmt === 0) {
    paymentStatus = "Paid";
  } else if (paidInput > 0) {
    paymentStatus = "Partially Paid";
  }

  // Auto Invoice No creator
  const invCount = await prisma.billingInvoice.count();
  const invoiceNo = `LAB/2026/${(invCount + 1).toString().padStart(4, '0')}`;

  // Record Billing Invoice
  const inv = await prisma.billingInvoice.create({
    data: {
      invoiceNo,
      patientId: targetPatientId,
      referredByDoctorId: data.doctorReferId || null,
      discountType: data.discountType || "None",
      discountValue: parseFloat(data.discountValue) || 0,
      discountAmount: discAmt,
      vatPercent: config.vatPercent || 5.0,
      vatAmount: vatAmt,
      serviceCharge: serviceFee,
      totalAmount: sumPrice,
      netAmount: totalPayable,
      totalPaid: paidInput,
      totalDue: dueAmt,
      paymentStatus,
      paymentMethod: data.paymentMethod || "Cash",
      reportStatus: "Pending"
    }
  });

  // Bulk write items
  const invoiceItems = selectedTests.map(t => ({
    invoiceId: inv.id,
    testId: t.id,
    price: t.price
  }));

  await prisma.invoiceItem.createMany({ data: invoiceItems });

  return await prisma.billingInvoice.findUnique({
    where: { id: inv.id },
    include: { patient: true, referredBy: true, items: { include: { test: true } } }
  });
}

export async function processDuePayment(id: string, amountPaid: any) {
  const invoice = await prisma.billingInvoice.findUnique({ where: { id } });
  if (!invoice) throw new Error("Invoice not found");

  const newPaidAmount = invoice.totalPaid + parseFloat(amountPaid);
  const newDueAmount = Math.max(0, invoice.netAmount - newPaidAmount);
  const newPaymentStatus = newDueAmount <= 0 ? "Paid" : "Partially Paid";

  return await prisma.billingInvoice.update({
    where: { id },
    data: {
      totalPaid: newPaidAmount,
      totalDue: newDueAmount,
      paymentStatus: newPaymentStatus
    },
    include: { patient: true }
  });
}

export async function payCommission(id: string, commissionPaid: any) {
  return await prisma.billingInvoice.update({
    where: { id },
    data: {
      referralPaid: true,
      referralCommPaid: parseFloat(commissionPaid) || 0
    }
  });
}

export async function deliverReport(id: string, deliveredBy: string) {
  return await prisma.billingInvoice.update({
    where: { id },
    data: {
      reportStatus: "Delivered",
      deliveredBy,
      deliveredAt: new Date()
    }
  });
}

export async function updateReportStatus(id: string, reportStatus: string) {
  return await prisma.billingInvoice.update({
    where: { id },
    data: { reportStatus }
  });
}
