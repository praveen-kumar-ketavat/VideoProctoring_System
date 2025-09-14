import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as faceDetection from "@mediapipe/face_detection";
import * as cam from "@mediapipe/camera_utils";
import { startSession, endSession, logViolation } from "../services/api";
import "./InterviewPage.css";

function InterviewPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [logs, setLogs] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [stream, setStream] = useState(null);
  const navigate = useNavigate();

  // timers
  const noFaceStart = useRef(null);
  const lookAwayStart = useRef(null);

  const addLog = (msg) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${msg}`]);
  };

  const recordViolation = async (type, forcedSessionId = null) => {
    const activeSessionId = forcedSessionId || sessionId;
    if (!activeSessionId) return;

    try {
      await logViolation({
        sessionId: activeSessionId,
        type,
        timestamp: new Date().toISOString(),
      });
      addLog(`🚨 Violation: ${type}`);
    } catch (err) {
      addLog(`❌ Failed to log violation: ${type}`);
    }
  };

  // Start Interview
  const handleStartInterview = async () => {
    try {
      const res = await startSession();

      if (!res._id) {
        addLog("❌ Failed to start interview session");
        return;
      }

      setSessionId(res._id);
      const currentSessionId = res._id; // local reference

      setIsInterviewStarted(true);
      addLog("✅ Interview started");

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const detector = new faceDetection.FaceDetection({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
      });
      detector.setOptions({ model: "short", minDetectionConfidence: 0.6 });

      detector.onResults((results) => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(
          results.image,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        const detections = results.detections;

        // === No Face >10s ===
        if (detections.length === 0) {
          if (!noFaceStart.current) {
            noFaceStart.current = Date.now();
          } else if (Date.now() - noFaceStart.current > 10000) {
            recordViolation("No Face Detected >10s", currentSessionId);
            noFaceStart.current = null;
          }
        } else {
          noFaceStart.current = null;
        }

        // === Multiple Faces (instant) ===
        if (detections.length > 1) {
          recordViolation("Multiple Faces Detected", currentSessionId);
        }

        // === Looking Away >5s ===
        if (detections.length === 1) {
          const box = detections[0].boundingBox;
          const centerX = box?.xCenter ?? 0.5;
          if (centerX < 0.35 || centerX > 0.65) {
            if (!lookAwayStart.current) {
              lookAwayStart.current = Date.now();
            } else if (Date.now() - lookAwayStart.current > 5000) {
              recordViolation("Looking Away >5s", currentSessionId);
              lookAwayStart.current = null;
            }
          } else {
            lookAwayStart.current = null;
          }
        }
      });

      const camera = new cam.Camera(videoRef.current, {
        onFrame: async () => {
          await detector.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });

      camera.start();
    } catch (err) {
      addLog("❌ Failed to start interview");
    }
  };

  // End Interview
  const handleEndInterview = async () => {
    try {
      if (sessionId) {
        await endSession(sessionId);
        addLog("✅ Interview ended");
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setIsInterviewStarted(false);
      setSessionId(null);
      navigate("/");
    } catch (err) {
      addLog("❌ Failed to end interview");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="interview-container">
      <h1>🎥 Candidate Interview</h1>
      <div className="buttons">
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>

        {!isInterviewStarted ? (
          <button className="start-btn" onClick={handleStartInterview}>
            ▶️ Start Interview
          </button>
        ) : (
          <button className="end-btn" onClick={handleEndInterview}>
            ⏹ End Interview
          </button>
        )}
      </div>

      {isInterviewStarted && (
        <>
          <div className="video-logs-container">
            <div className="video-wrapper">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ display: "none" }}
              />
              <canvas
                ref={canvasRef}
                width="640"
                height="480"
                className="canvas-box"
              />
            </div>

            <div className="logs-container">
              <h3>📑 Detection Logs</h3>
              <div className="logs-box">
                {logs.map((log, idx) => (
                  <p key={idx}>{log}</p>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default InterviewPage;
