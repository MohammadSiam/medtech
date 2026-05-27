import { Request, Response } from "express";
import * as appointmentService from "../services/appointment.service";

export async function getAppointments(req: Request, res: Response) {
  try {
    const list = await appointmentService.getAllAppointments();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function addAppointment(req: Request, res: Response) {
  try {
    const newAppt = await appointmentService.createAppointment(req.body);
    res.json(newAppt);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function modifyAppointmentStatus(req: Request, res: Response) {
  try {
    const { status } = req.body;
    const updated = await appointmentService.updateAppointmentStatus(req.params.id, status);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
