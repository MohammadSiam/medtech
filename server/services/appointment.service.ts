import { prisma } from "../models/db";

export async function getAllAppointments() {
  return await prisma.appointment.findMany({
    include: { patient: true, doctor: true },
    orderBy: { createdAt: "desc" }
  });
}

interface CreateAppointmentDto {
  patientId?: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  date: any;
  preferredTime: string;
  priority?: string;
  type?: string;
  notes?: string;
}

export async function createAppointment(data: CreateAppointmentDto) {
  let finalPatientId = data.patientId;

  if (!finalPatientId) {
    const rawPat = await prisma.patient.create({
      data: { name: data.patientName, phone: data.patientPhone, age: 30, gender: "Male" }
    });
    finalPatientId = rawPat.id;
  }

  const apptCount = await prisma.appointment.count();
  const appNo = `APP-${(apptCount + 1001).toString()}`;

  return await prisma.appointment.create({
    data: {
      appNo,
      patientId: finalPatientId,
      doctorId: data.doctorId,
      date: new Date(data.date),
      preferredTime: data.preferredTime,
      status: "Pending",
      priority: data.priority || "Normal",
      type: data.type || "Offline",
      notes: data.notes
    },
    include: { patient: true, doctor: true }
  });
}

export async function updateAppointmentStatus(id: string, status: string) {
  return await prisma.appointment.update({
    where: { id },
    data: { status }
  });
}
