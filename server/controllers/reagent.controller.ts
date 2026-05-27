import { Request, Response } from "express";
import * as reagentService from "../services/reagent.service";

export async function getReagents(req: Request, res: Response) {
  try {
    const reagents = await reagentService.getAllReagents();
    res.json(reagents);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function addReagent(req: Request, res: Response) {
  try {
    const newReagent = await reagentService.createReagent(req.body);
    res.json(newReagent);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
