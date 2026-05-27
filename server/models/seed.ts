import { prisma } from "./db";

// --- Database Auto-Seeding Helper ---
export async function ensureSeedData() {
  const settingCount = await prisma.systemSetting.count();
  if (settingCount > 0) return; // already seeded

  console.log("Seeding rich initial data for Diagnostic Center Management...");

  // 1. System Settings
  await prisma.systemSetting.create({
    data: {
      labName: "CarePath Clinical Diagnostics",
      address: "12/A Green Road, Dhanmondi, Dhaka",
      hotline: "+880 1711-223344",
      email: "info@carepath.com",
      website: "www.carepath.com",
      openingHours: "07:00 AM - 11:00 PM",
      termsNote: "Report validity 30 days from date of specimen publication.",
      footerNote: "Certified ISO 9001:2015 Diagnostic Center",
      vatPercent: 5.0,
      serviceChargeLimit: 100.0,
      maxDiscountLimit: 25.0,
      prefixInvoice: "LAB/2026/",
    }
  });

  // 2. Doctors
  const doc1 = await prisma.doctor.create({
    data: {
      code: "DOC-01",
      name: "Prof. Dr. M. A. Sayem",
      type: "Consultant",
      specialization: "General Hematology & Pathology",
      bmdcNumber: "A-54321",
      contact: "01711-889900",
      status: "Active",
      commissionCategory: "Per Test",
      commissionValue: 15, // 15% Comm
    }
  });

  const doc2 = await prisma.doctor.create({
    data: {
      code: "DOC-02",
      name: "Dr. Sabiha Tabassum",
      type: "Referral",
      specialization: "Preventive Cardiology Specialist",
      bmdcNumber: "A-87521",
      contact: "01922-334455",
      status: "Active",
      commissionCategory: "Per Patient",
      commissionValue: 200, // Fixed 200 BDT
    }
  });

  const doc3 = await prisma.doctor.create({
    data: {
      code: "DOC-03",
      name: "Dr. Fahim Shahriar",
      type: "Lab Doctor",
      specialization: "Diagnostic Imaging & USG",
      bmdcNumber: "A-66442",
      contact: "01533-332211",
      status: "Active",
      commissionCategory: "Per Test",
      commissionValue: 10, // 10%
    }
  });

  // 3. Tests
  const test1 = await prisma.test.create({
    data: {
      code: "TST-01",
      name: "Complete Blood Count (CBC)",
      category: "Pathology",
      specimenType: "EDTA Blood",
      price: 450,
      turnaroundTime: "4 Hours",
      normalRange: "Hb: 12-16 g/dL, WBC: 4-11k/uL, Platelets: 150-450k/uL",
      status: "Active"
    }
  });

  const test2 = await prisma.test.create({
    data: {
      code: "TST-02",
      name: "Serum Creatinine",
      category: "Biochemistry",
      specimenType: "Serum",
      price: 350,
      turnaroundTime: "3 Hours",
      normalRange: "Male: 0.6-1.2 mg/dL, Female: 0.5-1.1 mg/dL",
      status: "Active"
    }
  });

  const test3 = await prisma.test.create({
    data: {
      code: "TST-03",
      name: "Lipid Profile (Combined)",
      category: "Biochemistry",
      specimenType: "Serum Fasting",
      price: 1200,
      turnaroundTime: "6 Hours",
      normalRange: "Cholesterol: <200mg/dL, Triglycerides: <150mg/dL",
      status: "Active"
    }
  });

  const test4 = await prisma.test.create({
    data: {
      code: "TST-04",
      name: "Chest X-Ray PA View",
      category: "Radiology",
      specimenType: "None (Imaging)",
      price: 800,
      turnaroundTime: "2 Hours",
      normalRange: "Lungs & Heart appear completely normal",
      status: "Active"
    }
  });

  const test5 = await prisma.test.create({
    data: {
      code: "TST-05",
      name: "Whole Abdomen USG with Pregnancy Check",
      category: "USG",
      specimenType: "None (Imaging)",
      price: 1500,
      turnaroundTime: "3 Hours",
      normalRange: "Normal size viscera, baby details inside report if positive",
      status: "Active"
    }
  });

  const test6 = await prisma.test.create({
    data: {
      code: "TST-06",
      name: "12-Lead Standard ECG",
      category: "ECG",
      specimenType: "None (Electrophysiology)",
      price: 400,
      turnaroundTime: "1 Hour",
      normalRange: "Sinus Rhythm, Normal Axis, No ST changes",
      status: "Active"
    }
  });

  // 4. Patients
  const pat1 = await prisma.patient.create({
    data: { name: "Tanjim Ahmed", phone: "01811-123456", age: 34, gender: "Male" }
  });
  const pat2 = await prisma.patient.create({
    data: { name: "Nusrat Jahan", phone: "01722-654321", age: 28, gender: "Female" }
  });
  const pat3 = await prisma.patient.create({
    data: { name: "Kamal Hossain", phone: "01633-889900", age: 48, gender: "Male" }
  });
  const pat4 = await prisma.patient.create({
    data: { name: "Shakil Al Hassan", phone: "01944-775533", age: 31, gender: "Male" }
  });

  // 5. Reagents
  await prisma.reagent.create({
    data: {
      name: "Cellpack Diluent (20L)",
      supplier: "Sysmex Asia Pacific",
      brandModel: "Cellpack-DST",
      machineName: "Sysmex XN-350",
      purchasePrice: 4200,
      stockQty: 85,
      lowStockAlert: 20,
      expiryDate: new Date("2027-12-15"),
      lotNumber: "LOT-XN982"
    }
  });

  await prisma.reagent.create({
    data: {
      name: "Creatinine Reagent Kit (R1+R2)",
      supplier: "Roche Diagnostics",
      brandModel: "Cobas C311",
      machineName: "Cobas Biochemical Analyzer",
      purchasePrice: 6500,
      stockQty: 18,
      lowStockAlert: 10,
      expiryDate: new Date("2026-11-20"),
      lotNumber: "LOT-RH110"
    }
  });

  // 6. Employees
  const emp1 = await prisma.employee.create({
    data: { name: "Saima Rahman", role: "Receptionist", phone: "01788-111222", salary: 22000, shiftType: "Morning" }
  });
  const emp2 = await prisma.employee.create({
    data: { name: "Sumon K. Dey", role: "Lab Technician", phone: "01988-333444", salary: 32000, shiftType: "Evening" }
  });
  const emp3 = await prisma.employee.create({
    data: { name: "Shakil Islam", role: "Accountant", phone: "01655-444555", salary: 28000, shiftType: "Morning" }
  });

  // 7. Dummy Attendance
  const dates = ["2026-05-25", "2026-05-26", "2026-05-27"];
  for (const emp of [emp1, emp2, emp3]) {
    for (const d of dates) {
      await prisma.attendance.create({
        data: {
          employeeId: emp.id,
          checkIn: new Date(`${d}T08:30:00Z`),
          checkOut: new Date(`${d}T16:30:00Z`),
          status: "Present",
          date: d
        }
      });
    }
  }

  // 8. Appointments
  await prisma.appointment.create({
    data: {
      appNo: "APP-1001",
      patientId: pat1.id,
      doctorId: doc1.id,
      date: new Date("2026-05-27T10:00:00Z"),
      preferredTime: "10:30 AM",
      status: "Completed",
      priority: "Normal",
      type: "Offline",
      notes: "Routine health assessment checkup"
    }
  });

  await prisma.appointment.create({
    data: {
      appNo: "APP-1002",
      patientId: pat2.id,
      doctorId: doc2.id,
      date: new Date("2026-05-28T11:00:00Z"),
      preferredTime: "11:30 AM",
      status: "Pending",
      priority: "Urgent",
      type: "Online"
    }
  });

  // 9. Billing Invoices
  // Invoice 1 - Completed & Fully Paid
  const inv1 = await prisma.billingInvoice.create({
    data: {
      invoiceNo: "LAB/2026/0001",
      patientId: pat1.id,
      referredByDoctorId: doc1.id,
      discountType: "Percentage",
      discountValue: 10,
      discountAmount: 80.0,
      vatPercent: 5,
      vatAmount: 36.0,
      serviceCharge: 50.0,
      totalAmount: 800.0, // test CBC (450) + Creatinine (350)
      netAmount: 806.0, // (800 - 80) + 36 + 50
      totalPaid: 806.0,
      totalDue: 0,
      paymentStatus: "Paid",
      paymentMethod: "Cash",
      reportStatus: "Delivered",
      deliveredBy: "Saima Rahman",
      deliveredAt: new Date(),
      createdAt: new Date("2026-05-26T09:00:00Z")
    }
  });
  await prisma.invoiceItem.createMany({
    data: [
      { invoiceId: inv1.id, testId: test1.id, price: 450 },
      { invoiceId: inv1.id, testId: test2.id, price: 350 },
    ]
  });

  // Invoice 2 - Partially Paid (Has Due)
  const inv2 = await prisma.billingInvoice.create({
    data: {
      invoiceNo: "LAB/2026/0002",
      patientId: pat2.id,
      referredByDoctorId: doc2.id,
      discountType: "None",
      discountValue: 0,
      discountAmount: 0,
      vatPercent: 5,
      vatAmount: 75.0,
      serviceCharge: 100.0,
      totalAmount: 1500.0, // Abdomen USG
      netAmount: 1675.0, // 1500 + 75 + 100
      totalPaid: 1000.0,
      totalDue: 675.0,
      paymentStatus: "Partially Paid",
      paymentMethod: "Mixed",
      reportStatus: "Ready",
      createdAt: new Date("2026-05-27T11:00:00Z")
    }
  });
  await prisma.invoiceItem.create({
    data: { invoiceId: inv2.id, testId: test5.id, price: 1500 }
  });

  // Invoice 3 - Lipids and ECG paid with bKash
  const inv3 = await prisma.billingInvoice.create({
    data: {
      invoiceNo: "LAB/2026/0003",
      patientId: pat3.id,
      referredByDoctorId: doc2.id,
      discountType: "Fixed",
      discountValue: 100,
      discountAmount: 100,
      vatPercent: 5,
      vatAmount: 75.0,
      serviceCharge: 50.0,
      totalAmount: 1600.0, // Fasting lipids + ECG
      netAmount: 1625.0, // (1600-100) + 75 + 50
      totalPaid: 1625.0,
      totalDue: 0,
      paymentStatus: "Paid",
      paymentMethod: "Mobile Banking",
      reportStatus: "Processing",
      createdAt: new Date("2026-05-27T14:30:00Z")
    }
  });
  await prisma.invoiceItem.createMany({
    data: [
      { invoiceId: inv3.id, testId: test3.id, price: 1200 },
      { invoiceId: inv3.id, testId: test6.id, price: 400 },
    ]
  });

  // 10. Expenses
  await prisma.expense.create({
    data: {
      category: "Utility",
      description: "Electricity bill May-2026",
      amount: 4500,
      recordedBy: "Shakil Islam"
    }
  });
  await prisma.expense.create({
    data: {
      category: "Consumables",
      description: "Disposable gloves & alcohol swab purchase",
      amount: 1200,
      recordedBy: "Sumon K. Dey"
    }
  });

  console.log("Database Auto-Seeding completed successfully.");
}
