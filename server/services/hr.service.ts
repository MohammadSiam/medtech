import { prisma } from "../models/db";

export async function getAllEmployees() {
  return await prisma.employee.findMany({
    include: { attendance: true, salaries: true }
  });
}

interface CreateEmployeeDto {
  name: string;
  role: string;
  phone: string;
  email?: string;
  salary: any;
  shiftType: string;
}

export async function createEmployee(data: CreateEmployeeDto) {
  return await prisma.employee.create({
    data: {
      name: data.name,
      role: data.role,
      phone: data.phone,
      email: data.email,
      salary: parseFloat(data.salary) || 0,
      shiftType: data.shiftType
    }
  });
}

export async function getAllAttendance() {
  return await prisma.attendance.findMany({
    include: { employee: true },
    orderBy: { checkIn: "desc" }
  });
}

interface CreateAttendanceDto {
  employeeId: string;
  status: string;
  date: string;
}

export async function createAttendance(data: CreateAttendanceDto) {
  return await prisma.attendance.create({
    data: {
      employeeId: data.employeeId,
      checkIn: new Date(),
      status: data.status,
      date: data.date
    }
  });
}

export async function processCheckout(id: string) {
  return await prisma.attendance.update({
    where: { id },
    data: { checkOut: new Date() }
  });
}

interface CreateSalaryPaymentDto {
  employeeId: string;
  month: string;
  baseSalary: any;
  bonus: any;
  deduction: any;
  netPaid: any;
}

export async function createSalaryPayment(data: CreateSalaryPaymentDto) {
  return await prisma.salaryPayment.create({
    data: {
      employeeId: data.employeeId,
      month: data.month,
      baseSalary: parseFloat(data.baseSalary) || 0,
      bonus: parseFloat(data.bonus) || 0,
      deduction: parseFloat(data.deduction) || 0,
      netPaid: parseFloat(data.netPaid) || 0,
      type: "Routine"
    }
  });
}
