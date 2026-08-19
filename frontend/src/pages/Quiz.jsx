import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getQuestions } from "../services/api";
import "./Quiz.css";

function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();

  const courseId = location.state?.courseId;
  const courseName = location.state?.courseName || "Course";

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!courseId) {
      setError("Course information is missing.");
      setLoading(false);
      return;
    }

    getQuestions(courseId)
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load quiz questions.");
        setLoading(false);
      });
  }, [courseId]);

  const handleAnswer = (answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answer,
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = () => {
    let totalScore = 0;

    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        totalScore++;
      }
    });

    setScore(totalScore);
    setSubmitted(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  if (loading) {
    return (
      <div className="quiz-page">
        <div className="quiz-loading">
          <div className="loading-spinner"></div>
          <h2>Preparing your quiz...</h2>
          <p>Getting your questions ready</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-page">
        <div className="quiz-error">
          <div className="error-icon">!</div>
          <h2>Oops!</h2>
          <p>{error}</p>

          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-page">
        <div className="quiz-error">
          <h2>No Questions Found</h2>
          <p>This course doesn't have any quiz questions yet.</p>

          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Courses
          </button>
        </div>
      </div>
    );
  }

  // ==============================
  // RESULT PAGE
  // ==============================

  if (submitted) {
    const percentage = Math.round((score / questions.length) * 100);

    let message = "Keep practicing!";
    if (percentage >= 80) {
      message = "Excellent work! 🎉";
    } else if (percentage >= 60) {
      message = "Great job! 👏";
    }

    return (
      <div className="quiz-page">
        <div className="quiz-container">

          <header className="quiz-header">
            <div className="brand">
              <span className="brand-icon">L</span>
              <span>LearnX</span>
            </div>
          </header>

          <div className="result-card">

            <div className="result-icon">
              {percentage >= 80 ? "🏆" : percentage >= 60 ? "👏" : "📚"}
            </div>

            <p className="result-label">QUIZ COMPLETED</p>

            <h1>{message}</h1>

            <p className="result-course">
              {courseName}
            </p>

            <div className="score-circle">
              <div>
                <strong>{percentage}%</strong>
                <span>Score</span>
              </div>
            </div>

            <div className="score-details">
              <div>
                <strong>{score}</strong>
                <span>Correct</span>
              </div>

              <div>
                <strong>{questions.length - score}</strong>
                <span>Incorrect</span>
              </div>

              <div>
                <strong>{questions.length}</strong>
                <span>Total</span>
              </div>
            </div>

            <div className="result-actions">
              <button
                className="secondary-btn"
                onClick={restartQuiz}
              >
                ↻ Try Again
              </button>

              <button
                className="primary-btn"
                onClick={() => navigate("/dashboard")}
              >
                Back to Courses →
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  const progress = Math.round(
    ((currentQuestion + 1) / questions.length) * 100
  );

  return (
    <div className="quiz-page">

      <div className="quiz-container">

        {/* ================= HEADER ================= */}

        <header className="quiz-header">

          <div
            className="brand"
            onClick={() => navigate("/dashboard")}
          >
            <span className="brand-icon">L</span>
            <span>LearnX</span>
          </div>

          <button
            className="exit-btn"
            onClick={() => navigate("/dashboard")}
          >
            Exit Quiz
          </button>

        </header>

        {/* ================= COURSE INFO ================= */}

        <div className="course-info">

          <div>
            <span className="course-label">
              CURRENT COURSE
            </span>

            <h1>{courseName}</h1>
          </div>

          <div className="question-count">
            <strong>
              {currentQuestion + 1}
            </strong>

            <span>
              / {questions.length}
            </span>
          </div>

        </div>

        {/* ================= PROGRESS ================= */}

        <div className="progress-section">

          <div className="progress-text">
            <span>Your Progress</span>
            <strong>{progress}%</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

        </div>

        {/* ================= QUESTION CARD ================= */}

        <main className="question-card">

          <div className="question-top">

            <span className="question-badge">
              Question {currentQuestion + 1}
            </span>

            <span className="points">
              +1 Point
            </span>

          </div>

          <h2 className="question-text">
            {question.question}
          </h2>

          <p className="choose-text">
            Choose the correct answer
          </p>

          {/* ================= OPTIONS ================= */}

          <div className="options">

            {question.options.map((option, index) => {

              const optionLetter =
                String.fromCharCode(65 + index);

              const isSelected =
                selectedAnswer === option;

              return (
                <button
                  key={index}
                  className={`option ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => handleAnswer(option)}
                >

                  <span className="option-letter">
                    {optionLetter}
                  </span>

                  <span className="option-text">
                    {option}
                  </span>

                  <span className="option-check">
                    {isSelected ? "✓" : ""}
                  </span>

                </button>
              );
            })}

          </div>

          {/* ================= NAVIGATION ================= */}

          <div className="quiz-navigation">

            <button
              className="previous-btn"
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
            >
              ← Previous
            </button>

            {currentQuestion === questions.length - 1 ? (

              <button
                className="submit-btn"
                onClick={submitQuiz}
              >
                Submit Quiz ✓
              </button>

            ) : (

              <button
                className="next-btn"
                onClick={nextQuestion}
              >
                Next Question →
              </button>

            )}

          </div>

        </main>

        {/* ================= QUESTION INDICATORS ================= */}

        <div className="question-indicators">

          {questions.map((_, index) => (

            <button
              key={index}
              className={`
                question-dot
                ${index === currentQuestion ? "active" : ""}
                ${selectedAnswers[index] ? "answered" : ""}
              `}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </button>

          ))}

        </div>

        <footer className="quiz-footer">
          <p>
            LearnX • Learn. Practice. Grow.
          </p>
        </footer>

      </div>
    </div>
  );
}

export default Quiz;