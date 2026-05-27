import { prisma } from "../models/db";

export async function getAllDoctors() {
  return await prisma.doctor.findMany({ orderBy: { createdAt: "desc" } });
}

interface CreateDoctorDto {
  name: string;
  type: string;
  specialization: string;
  bmdcNumber: string;
  contact: string;
  commissionCategory: string;
  commissionValue: any;
}

export async function createDoctor(data: CreateDoctorDto) {
  const docCount = await prisma.doctor.count();
  const code = `DOC-${(docCount + 1).toString().padStart(2, '0')}`;

  return await prisma.doctor.create({
    data: {
      code,
      name: data.name,
      type: data.type,
      specialization: data.specialization,
      bmdcNumber: data.bmdcNumber,
      contact: data.contact,
      status: "Active",
      commissionCategory: data.commissionCategory,
      commissionValue: parseFloat(data.commissionValue) || 0
    }
  });
}

interface UpdateDoctorDto extends Partial<CreateDoctorDto> {
  status?: string;
}

export async function updateDoctor(id: string, data: UpdateDoctorDto) {
  return await prisma.doctor.update({
    where: { id },
    data: {
      name: data.name,
      type: data.type,
      specialization: data.specialization,
      bmdcNumber: data.bmdcNumber,
      contact: data.contact,
      status: data.status,
      commissionCategory: data.commissionCategory,
      commissionValue: data.commissionValue !== undefined ? parseFloat(data.commissionValue) || 0 : undefined
    }
  });
}

export async function deleteDoctor(id: string) {
  return await prisma.doctor.delete({ where: { id } });
}
