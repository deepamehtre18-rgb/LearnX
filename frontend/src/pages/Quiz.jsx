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

  // =====================================================
  // LOAD QUESTIONS
  // =====================================================

  useEffect(() => {
    const loadQuestions = async () => {
      if (!courseId) {
        setError("Course information is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        console.log("Loading quiz for course:", courseId);

        const data = await getQuestions(courseId);

        console.log("Quiz data received:", data);

        // -----------------------------------------------
        // HANDLE BACKEND RESPONSE
        // -----------------------------------------------

        let questionData = data;

        if (data && Array.isArray(data.questions)) {
          questionData = data.questions;
        } else if (data && Array.isArray(data.data)) {
          questionData = data.data;
        }

        if (!Array.isArray(questionData)) {
          console.error("Unexpected quiz response:", data);

          throw new Error(
            "Quiz questions were received in an unexpected format."
          );
        }

        // -----------------------------------------------
        // NORMALIZE BACKEND DATA
        // -----------------------------------------------

        const normalizedQuestions = questionData
          .map((question) => {
            if (!question) {
              return null;
            }

            // Backend can return question or question_text
            const questionText =
              question.question ?? question.question_text;

            // Backend can return options array
            // OR individual option1, option2, option3, option4
            let options = [];

            if (Array.isArray(question.options)) {
              options = question.options;
            } else {
              options = [
                question.option1,
                question.option2,
                question.option3,
                question.option4,
              ].filter(
                (option) =>
                  option !== null &&
                  option !== undefined &&
                  String(option).trim() !== ""
              );
            }

            // Backend can return answer or correct_answer
            const correctAnswer =
              question.answer ?? question.correct_answer;

            if (
              !questionText ||
              options.length === 0 ||
              correctAnswer === undefined ||
              correctAnswer === null
            ) {
              return null;
            }

            return {
              id: question.id ?? question.question_id,
              question: questionText,
              options: options,
              answer: correctAnswer,
            };
          })
          .filter(Boolean);

        console.log(
          "Normalized quiz questions:",
          normalizedQuestions
        );

        if (normalizedQuestions.length === 0) {
          throw new Error(
            "No valid quiz questions were found."
          );
        }

        setQuestions(normalizedQuestions);
      } catch (err) {
        console.error("Quiz loading error:", err);

        setError(
          err.message || "Failed to load quiz questions."
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [courseId]);

  // =====================================================
  // SELECT ANSWER
  // =====================================================

  const handleAnswer = (answer) => {
    setSelectedAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion]: answer,
    }));
  };

  // =====================================================
  // NEXT QUESTION
  // =====================================================

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  };

  // =====================================================
  // PREVIOUS QUESTION
  // =====================================================

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    }
  };

  // =====================================================
  // CHECK ANSWER
  // =====================================================

  const isAnswerCorrect = (question, selectedAnswer) => {
    if (
      selectedAnswer === undefined ||
      selectedAnswer === null
    ) {
      return false;
    }

    const correctAnswer = String(question.answer)
      .trim()
      .toLowerCase();

    const selected = String(selectedAnswer)
      .trim()
      .toLowerCase();

    // Case 1:
    // Backend stores actual option text
    if (correctAnswer === selected) {
      return true;
    }

    // Case 2:
    // Backend stores A/B/C/D
    const answerIndex =
      ["a", "b", "c", "d"].indexOf(correctAnswer);

    if (
      answerIndex !== -1 &&
      question.options[answerIndex] !== undefined
    ) {
      return (
        String(question.options[answerIndex])
          .trim()
          .toLowerCase() === selected
      );
    }

    // Case 3:
    // Backend stores 1/2/3/4
    const numericIndex =
      parseInt(correctAnswer, 10) - 1;

    if (
      numericIndex >= 0 &&
      numericIndex < question.options.length
    ) {
      return (
        String(question.options[numericIndex])
          .trim()
          .toLowerCase() === selected
      );
    }

    return false;
  };

  // =====================================================
  // SUBMIT QUIZ
  // =====================================================

  const submitQuiz = () => {
    let totalScore = 0;

    questions.forEach((question, index) => {
      const selectedAnswer = selectedAnswers[index];

      if (
        isAnswerCorrect(
          question,
          selectedAnswer
        )
      ) {
        totalScore++;
      }
    });

    setScore(totalScore);
    setSubmitted(true);
  };

  // =====================================================
  // RESTART QUIZ
  // =====================================================

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  // =====================================================
  // LOADING
  // =====================================================

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

  // =====================================================
  // ERROR
  // =====================================================

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

  // =====================================================
  // NO QUESTIONS
  // =====================================================

  if (questions.length === 0) {
    return (
      <div className="quiz-page">
        <div className="quiz-error">
          <h2>No Questions Found</h2>

          <p>
            This course doesn't have any quiz questions yet.
          </p>

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

  // =====================================================
  // RESULT PAGE
  // =====================================================

  if (submitted) {
    const percentage = Math.round(
      (score / questions.length) * 100
    );

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
            <div
              className="brand"
              onClick={() => navigate("/dashboard")}
            >
              <span className="brand-icon">L</span>
              <span>LearnX</span>
            </div>
          </header>

          <div className="result-card">

            <div className="result-icon">
              {percentage >= 80
                ? "🏆"
                : percentage >= 60
                ? "👏"
                : "📚"}
            </div>

            <p className="result-label">
              QUIZ COMPLETED
            </p>

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
                <strong>
                  {questions.length - score}
                </strong>
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
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                Back to Courses →
              </button>

            </div>

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // CURRENT QUESTION
  // =====================================================

  const question =
    questions[currentQuestion];

  const selectedAnswer =
    selectedAnswers[currentQuestion];

  const progress = Math.round(
    ((currentQuestion + 1) /
      questions.length) *
      100
  );

  // =====================================================
  // QUIZ PAGE
  // =====================================================

  return (
    <div className="quiz-page">

      <div className="quiz-container">

        {/* HEADER */}

        <header className="quiz-header">

          <div
            className="brand"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <span className="brand-icon">
              L
            </span>

            <span>LearnX</span>
          </div>

          <button
            className="exit-btn"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Exit Quiz
          </button>

        </header>

        {/* COURSE INFO */}

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

        {/* PROGRESS */}

        <div className="progress-section">

          <div className="progress-text">

            <span>Your Progress</span>

            <strong>{progress}%</strong>

          </div>

          <div className="progress-track">

            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            ></div>

          </div>

        </div>

        {/* QUESTION CARD */}

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

          {/* OPTIONS */}

          <div className="options">

            {question.options.map(
              (option, index) => {

                const optionLetter =
                  String.fromCharCode(65 + index);

                const isSelected =
                  selectedAnswer === option;

                return (
                  <button
                    key={index}
                    type="button"
                    className={`option ${
                      isSelected
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleAnswer(option)
                    }
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
              }
            )}

          </div>

          {/* NAVIGATION */}

          <div className="quiz-navigation">

            <button
              type="button"
              className="previous-btn"
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
            >
              ← Previous
            </button>

            {currentQuestion ===
            questions.length - 1 ? (

              <button
                type="button"
                className="submit-btn"
                onClick={submitQuiz}
              >
                Submit Quiz ✓
              </button>

            ) : (

              <button
                type="button"
                className="next-btn"
                onClick={nextQuestion}
              >
                Next Question →
              </button>

            )}

          </div>

        </main>

        {/* QUESTION INDICATORS */}

        <div className="question-indicators">

          {questions.map((_, index) => (

            <button
              key={index}
              type="button"
              className={`
                question-dot
                ${
                  index === currentQuestion
                    ? "active"
                    : ""
                }
                ${
                  selectedAnswers[index] !==
                  undefined
                    ? "answered"
                    : ""
                }
              `}
              onClick={() =>
                setCurrentQuestion(index)
              }
            >
              {index + 1}
            </button>

          ))}

        </div>

        {/* FOOTER */}

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