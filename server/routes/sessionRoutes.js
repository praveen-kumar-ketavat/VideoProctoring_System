import express from "express";
import { startSession, endSession , getAllSessions, getSessionById } from "../controllers/sessionController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/start", authMiddleware, startSession);
router.put("/end/:id", authMiddleware, endSession);

router.get("/all", authMiddleware, isAdmin, getAllSessions);

router.get("/:id", authMiddleware, isAdmin, getSessionById);



export default router;

