import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSessionById } from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./ReportPage.css";

function ReportsPage() {
  const { id } = useParams();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const res = await getSessionById(id);
      setSession(res);
    };
    fetchSession();
  }, [id]);

  if (!session) return <p>Loading report...</p>;

  // Duration calculation
  const start = new Date(session.startTime);
  const end = session.endTime ? new Date(session.endTime) : new Date();
  const durationMs = end - start;
  const durationMinutes = Math.floor(durationMs / 60000);
  const durationSeconds = Math.floor((durationMs % 60000) / 1000);

  // Integrity score calculation
  let score = 100;
  session.violations.forEach((v) => {
    if (v.type.includes("No Face") || v.type.includes("Looking Away")) {
      score -= 5;
    } else {
      score -= 10;
    }
  });
  if (score < 0) score = 0;

  // ✅ Generate PDF
  const downloadPDF = () => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Interview Report", 105, 20, { align: "center" });

  // Candidate info
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Candidate: ${session.candidateId?.name} (${session.candidateId?.email})`, 14, 40);
  doc.text(`Start: ${start.toLocaleString()}`, 14, 50);
  doc.text(`End: ${session.endTime ? end.toLocaleString() : "Ongoing"}`, 14, 60);
  doc.text(`Duration: ${durationMinutes}m ${durationSeconds}s`, 14, 70);
  doc.text(`Total Violations: ${session.totalViolations}`, 14, 80);

  // Integrity Score highlighted
  doc.setFontSize(14);
  doc.setTextColor(score >= 70 ? "green" : "red");
  doc.text(`Final Integrity Score: ${score}/100`, 14, 95);
  doc.setTextColor("black");

  // Violations Table
  const tableData = session.violations.map((v, idx) => [
    idx + 1,
    v.type,
    new Date(v.timestamp).toLocaleString(),
  ]);

  autoTable(doc, {   // ✅ use autoTable function instead of doc.autoTable
    head: [["#", "Violation Type", "Timestamp"]],
    body: tableData,
    startY: 110,
    theme: "grid",
    headStyles: { fillColor: [0, 123, 255], textColor: 255, fontStyle: "bold" },
    bodyStyles: { textColor: 50 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });

  doc.save(`Interview_Report_${session.candidateId?.name || "Candidate"}.pdf`);
};


  return (
    <div className="report-container">
      <h2>📑 Interview Report</h2>
      <h3>
        Candidate: {session.candidateId?.name} ({session.candidateId?.email})
      </h3>
      <p>
        <b>Start:</b> {start.toLocaleString()}
      </p>
      <p>
        <b>End:</b> {session.endTime ? end.toLocaleString() : "Ongoing"}
      </p>
      <p>
        <b>Duration:</b> {durationMinutes}m {durationSeconds}s
      </p>
      <p>
        <b>Total Violations:</b> {session.totalViolations}
      </p>
      <p>
        <b>Final Integrity Score:</b> {score}/100
      </p>

      <h4>🚨 Violations:</h4>
      <ul className="violations-list">
        {session.violations.map((v, idx) => (
          <li key={idx}>
            {v.type} at {new Date(v.timestamp).toLocaleTimeString()}
          </li>
        ))}
      </ul>

      <button onClick={downloadPDF} className="download-btn">
        ⬇️ Download Report (PDF)
      </button>
    </div>
  );
}

export default ReportsPage;
