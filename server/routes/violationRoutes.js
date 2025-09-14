import express from "express";
import { logViolation, getViolations } from "../controllers/violationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, logViolation);
router.get("/:sessionId", authMiddleware, getViolations);

export default router;
