import Violation from "../models/Violation.js";

export const logViolation = async (req, res) => {
  try {
    const { sessionId, type, timestamp } = req.body;

    const violation = new Violation({
      sessionId,
      type,
      timestamp: timestamp || new Date(),
    });

    await violation.save();
    res.json(violation);
  } catch (err) {
    res.status(500).json({ error: "Failed to log violation" });
  }
};

export const getViolations = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const violations = await Violation.find({ sessionId }).sort({ timestamp: 1 });
    res.json(violations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch violations" });
  }
};
