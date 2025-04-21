import express from "express";
import { getCases, addCase } from "../controllers/caseController";

const router = express.Router();

router.get("/", getCases);
router.post("/", addCase);

export default router;