import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function Result() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const score = searchParams.get("score");
  const total = searchParams.get("total");

  if (score === null || total === null) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.icon}>⚠️</div>
          <h1 style={styles.title}>No Result Available</h1>
          <p style={styles.subtitle}>
            Please complete a quiz first to see your result.
          </p>

          <button
            style={styles.primaryButton}
            onClick={() => navigate("/dashboard")}
          >
            🏠 Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const scoreNumber = Number(score);
  const totalNumber = Number(total);
  const percentage = Math.round((scoreNumber / totalNumber) * 100);
  const wrong = totalNumber - scoreNumber;

  let message = "";
  let emoji = "";

  if (percentage >= 80) {
    message = "Excellent work! 🎉";
    emoji = "🏆";
  } else if (percentage >= 50) {
    message = "Good job! Keep practicing! 💪";
    emoji = "👏";
  } else {
    message = "Keep learning and try again! 📚";
    emoji = "💡";
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.emoji}>{emoji}</div>

        <h1 style={styles.title}>Quiz Completed!</h1>

        <p style={styles.subtitle}>{message}</p>

        {/* Score Circle */}
        <div
          style={{
            ...styles.scoreCircle,
            background: `conic-gradient(#16a34a ${percentage * 3.6}deg, #e5e7eb 0deg)`,
          }}
        >
          <div style={styles.innerCircle}>
            <span style={styles.percentage}>{percentage}%</span>
            <span style={styles.percentText}>Score</span>
          </div>
        </div>

        {/* Score */}
        <h2 style={styles.score}>
          {scoreNumber} <span>/ {totalNumber}</span>
        </h2>

        <p style={styles.description}>
          You answered <strong>{scoreNumber}</strong> out of{" "}
          <strong>{totalNumber}</strong> questions correctly.
        </p>

        {/* Statistics */}
        <div style={styles.statsContainer}>
          <div style={styles.statBox}>
            <div style={styles.statIcon}>✅</div>
            <strong>{scoreNumber}</strong>
            <span>Correct</span>
          </div>

          <div style={styles.statBox}>
            <div style={styles.statIcon}>❌</div>
            <strong>{wrong}</strong>
            <span>Wrong</span>
          </div>

          <div style={styles.statBox}>
            <div style={styles.statIcon}>📊</div>
            <strong>{totalNumber}</strong>
            <span>Total</span>
          </div>
        </div>

        {/* Buttons */}
        <div style={styles.buttonContainer}>

          <button
            style={styles.primaryButton}
            onClick={() => navigate("/quiz")}
          >
            🔄 Retake Quiz
          </button>

          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/courses")}
          >
            📚 Back to Courses
          </button>

          <button
            style={styles.dashboardButton}
            onClick={() => navigate("/dashboard")}
          >
            🏠 Dashboard
          </button>

        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "650px",
    background: "white",
    borderRadius: "24px",
    padding: "45px 35px",
    textAlign: "center",
    boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
  },

  emoji: {
    fontSize: "45px",
    marginBottom: "5px",
  },

  title: {
    fontSize: "36px",
    margin: "10px 0",
    color: "#111827",
  },

  subtitle: {
    fontSize: "18px",
    color: "#6b7280",
    marginBottom: "30px",
  },

  scoreCircle: {
    width: "170px",
    height: "170px",
    borderRadius: "50%",
    margin: "0 auto 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  innerCircle: {
    width: "135px",
    height: "135px",
    borderRadius: "50%",
    background: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  percentage: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#16a34a",
  },

  percentText: {
    fontSize: "14px",
    color: "#6b7280",
  },

  score: {
    fontSize: "30px",
    margin: "5px 0",
    color: "#111827",
  },

  description: {
    color: "#6b7280",
    fontSize: "16px",
    marginBottom: "30px",
  },

  statsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "35px",
    flexWrap: "wrap",
  },

  statBox: {
    minWidth: "130px",
    padding: "18px 10px",
    borderRadius: "14px",
    background: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  statIcon: {
    fontSize: "22px",
  },

  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "350px",
    margin: "auto",
  },

  primaryButton: {
    padding: "13px 20px",
    border: "none",
    borderRadius: "10px",
    background: "#16a34a",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "13px 20px",
    border: "1px solid #2563eb",
    borderRadius: "10px",
    background: "white",
    color: "#2563eb",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  dashboardButton: {
    padding: "13px 20px",
    border: "none",
    borderRadius: "10px",
    background: "#f1f5f9",
    color: "#334155",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Result;