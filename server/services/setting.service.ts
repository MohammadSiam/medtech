import { prisma } from "../models/db";

export async function getSettings() {
  let setting = await prisma.systemSetting.findFirst();
  if (!setting) {
    setting = await prisma.systemSetting.create({ data: { id: "default" } });
  }
  return setting;
}

interface UpdateSettingsDto {
  labName?: string;
  address?: string;
  hotline?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  termsNote?: string;
  footerNote?: string;
  vatPercent?: any;
  serviceChargeLimit?: any;
  maxDiscountLimit?: any;
  prefixInvoice?: string;
}

export async function updateSettings(data: UpdateSettingsDto) {
  return await prisma.systemSetting.upsert({
    where: { id: "default" },
    update: {
      labName: data.labName,
      address: data.address,
      hotline: data.hotline,
      email: data.email,
      website: data.website,
      openingHours: data.openingHours,
      termsNote: data.termsNote,
      footerNote: data.footerNote,
      vatPercent: data.vatPercent !== undefined ? parseFloat(data.vatPercent) || 5.0 : undefined,
      serviceChargeLimit: data.serviceChargeLimit !== undefined ? parseFloat(data.serviceChargeLimit) || 0 : undefined,
      maxDiscountLimit: data.maxDiscountLimit !== undefined ? parseFloat(data.maxDiscountLimit) || 20 : undefined,
      prefixInvoice: data.prefixInvoice
    },
    create: {
      id: "default",
      labName: data.labName || "",
      address: data.address || "",
      hotline: data.hotline || "",
      email: data.email || "",
      website: data.website || "",
      openingHours: data.openingHours || "",
      termsNote: data.termsNote || "",
      footerNote: data.footerNote || "",
      vatPercent: parseFloat(data.vatPercent) || 5.0,
      serviceChargeLimit: parseFloat(data.serviceChargeLimit) || 0,
      maxDiscountLimit: parseFloat(data.maxDiscountLimit) || 20,
      prefixInvoice: data.prefixInvoice || ""
    }
  });
}
