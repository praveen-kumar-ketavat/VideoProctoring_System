import Session from "../models/Session.js";
import Violation from "../models/Violation.js";

// Start a session
export const startSession = async (req, res) => {
  try {
    const session = new Session({
      candidateId: req.user._id,   // ✅ from JWT
      startTime: new Date(),
    });

    await session.save();
    res.json(session);
  } catch (err) {
    console.error("Start session error:", err.message);
    res.status(500).json({ error: "Failed to start session" });
  }
};

// End a session
export const endSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Only the same user can end their session
    if (session.candidateId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to end this session" });
    }

    session.endTime = new Date();
    await session.save();

    res.json(session);
  } catch (err) {
    console.error("End session error:", err.message);
    res.status(500).json({ error: "Failed to end session" });
  }
};

// Admin: Get all sessions + violations
export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate("candidateId", "name email") // show candidate details
      .lean();

    // Attach violations for each session
    for (let s of sessions) {
      const violations = await Violation.find({ sessionId: s._id }).lean();
      s.violations = violations;
      s.totalViolations = violations.length;
    }

    res.json(sessions);
  } catch (err) {
    console.error("Fetch sessions error:", err.message);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

// Get a single session with violations
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("candidateId", "name email")
      .lean();

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const violations = await Violation.find({ sessionId: session._id }).lean();
    session.violations = violations;
    session.totalViolations = violations.length;

    res.json(session);
  } catch (err) {
    console.error("Get session error:", err.message);
    res.status(500).json({ error: "Failed to fetch session" });
  }
};
