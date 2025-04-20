import { Request, Response } from "express";
import Case from "../models/Case";

export const getCases = async (req: Request, res: Response) => {
  try {
    const cases = await Case.find();
    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cases" });
  }
};

export const addCase = async (req: Request, res: Response) => {
  try {
    const newCase = new Case(req.body);
    const savedCase = await newCase.save();
    res.status(201).json(savedCase);
  } catch (error) {
    res.status(500).json({ message: "Failed to add case" });
  }
};