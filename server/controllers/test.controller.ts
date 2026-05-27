import { Request, Response } from "express";
import * as testService from "../services/test.service";

export async function getTests(req: Request, res: Response) {
  try {
    const list = await testService.getAllTests();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function addTest(req: Request, res: Response) {
  try {
    const newTest = await testService.createTest(req.body);
    res.json(newTest);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function modifyTest(req: Request, res: Response) {
  try {
    const updated = await testService.updateTest(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function removeTest(req: Request, res: Response) {
  try {
    await testService.deleteTest(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
