import { Request, Response } from "express";
import * as settingService from "../services/setting.service";

export async function getSystemSettings(req: Request, res: Response) {
  try {
    const setting = await settingService.getSettings();
    res.json(setting);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateSystemSettings(req: Request, res: Response) {
  try {
    const setting = await settingService.updateSettings(req.body);
    res.json(setting);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
