import { useLocation, useNavigate } from "react-router-dom";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    courseName,
    score,
    totalMarks
  } = location.state || {};

  if (!courseName) {
    return (
      <div>
        <h2>No Result Available</h2>

        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Result</h1>

      <h2>{courseName}</h2>

      <h3>
        Your Score: {score} / {totalMarks}
      </h3>

      <p>Quiz Completed!</p>

      <button onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>

      <button onClick={() => navigate("/courses")}>
        Take Another Quiz
      </button>
    </div>
  );
}

export default Result;