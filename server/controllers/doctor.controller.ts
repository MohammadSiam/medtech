import { Request, Response } from "express";
import * as doctorService from "../services/doctor.service";

export async function getDoctors(req: Request, res: Response) {
  try {
    const list = await doctorService.getAllDoctors();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function addDoctor(req: Request, res: Response) {
  try {
    const newDoc = await doctorService.createDoctor(req.body);
    res.json(newDoc);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function modifyDoctor(req: Request, res: Response) {
  try {
    const updated = await doctorService.updateDoctor(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function removeDoctor(req: Request, res: Response) {
  try {
    await doctorService.deleteDoctor(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
