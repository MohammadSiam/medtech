import { prisma } from "../models/db";

export async function getAllTests() {
  return await prisma.test.findMany({ orderBy: { code: "asc" } });
}

interface CreateTestDto {
  name: string;
  category: string;
  specimenType: string;
  price: any;
  turnaroundTime: string;
  normalRange: string;
}

export async function createTest(data: CreateTestDto) {
  const count = await prisma.test.count();
  const code = `TST-${(count + 1).toString().padStart(2, '0')}`;

  return await prisma.test.create({
    data: {
      code,
      name: data.name,
      category: data.category,
      specimenType: data.specimenType,
      price: parseFloat(data.price) || 0,
      turnaroundTime: data.turnaroundTime,
      normalRange: data.normalRange,
      status: "Active"
    }
  });
}

interface UpdateTestDto extends Partial<CreateTestDto> {
  status?: string;
}

export async function updateTest(id: string, data: UpdateTestDto) {
  return await prisma.test.update({
    where: { id },
    data: {
      name: data.name,
      category: data.category,
      specimenType: data.specimenType,
      price: data.price !== undefined ? parseFloat(data.price) || 0 : undefined,
      turnaroundTime: data.turnaroundTime,
      normalRange: data.normalRange,
      status: data.status
    }
  });
}

export async function deleteTest(id: string) {
  return await prisma.test.delete({ where: { id } });
}
