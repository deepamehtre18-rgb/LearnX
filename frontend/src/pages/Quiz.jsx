import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();

  const { courseId, courseName } = location.state || {};

  const questionBank = {
    1: [
      {
        question: "Which access modifier is visible everywhere?",
        options: ["public", "private", "protected", "default"],
        answer: "public"
      },
      {
        question: "Java supports?",
        options: ["OOP", "POP", "Functional only", "None"],
        answer: "OOP"
      },
      {
        question: "Which interface is implemented by ArrayList?",
        options: ["List", "Set", "Map", "Queue"],
        answer: "List"
      }
    ],

    2: [
      {
        question: "Which command retrieves data?",
        options: ["SELECT", "INSERT", "UPDATE", "DELETE"],
        answer: "SELECT"
      },
      {
        question: "Primary key is?",
        options: ["Unique", "Duplicate", "Null", "Optional"],
        answer: "Unique"
      }
    ],

    3: [
      {
        question: "Which language is used to structure web pages?",
        options: ["HTML", "CSS", "SQL", "Java"],
        answer: "HTML"
      },
      {
        question: "Which HTML tag is used for the largest heading?",
        options: ["<h1>", "<h6>", "<head>", "<heading>"],
        answer: "<h1>"
      },
      {
        question: "Which tag is used to create a hyperlink?",
        options: ["<a>", "<link>", "<href>", "<url>"],
        answer: "<a>"
      }
    ],

    4: [
      {
        question: "Which language is used to style web pages?",
        options: ["CSS", "HTML", "Java", "SQL"],
        answer: "CSS"
      },
      {
        question: "Which property changes text color?",
        options: ["color", "font", "text-color", "background"],
        answer: "color"
      },
      {
        question: "Which CSS property changes the background color?",
        options: ["background-color", "color", "bgcolor", "background-style"],
        answer: "background-color"
      }
    ],

    5: [
      {
        question: "Which keyword declares a variable that cannot be reassigned?",
        options: ["const", "let", "var", "static"],
        answer: "const"
      },
      {
        question: "Which method converts JSON text into a JavaScript object?",
        options: [
          "JSON.parse()",
          "JSON.stringify()",
          "JSON.convert()",
          "JSON.object()"
        ],
        answer: "JSON.parse()"
      },
      {
        question: "Which symbol is used for strict equality?",
        options: ["===", "=", "==", "!="],
        answer: "==="
      }
    ],

    6: [
      {
        question: "React is mainly used for?",
        options: [
          "Building user interfaces",
          "Managing databases",
          "Writing SQL",
          "Creating operating systems"
        ],
        answer: "Building user interfaces"
      },
      {
        question: "Which hook is used to manage state in a React component?",
        options: ["useState", "useRoute", "usePage", "useComponent"],
        answer: "useState"
      },
      {
        question: "Which syntax is commonly used to write React components?",
        options: ["JSX", "SQL", "XML only", "PHP"],
        answer: "JSX"
      }
    ]
  };

  const questions = questionBank[courseId] || [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);

  if (!courseName || questions.length === 0) {
    return (
      <div>
        <h2>Please select a course first.</h2>

        <button onClick={() => navigate("/courses")}>
          Back to Courses
        </button>
      </div>
    );
  }

  const handleNext = () => {
    if (!selectedAnswer) {
      alert("Please select an answer.");
      return;
    }

    let newScore = score;

    if (selectedAnswer === questions[currentQuestion].answer) {
      newScore = score + 1;
      setScore(newScore);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
    } else {
      navigate("/result", {
        state: {
          courseId: courseId,
          courseName: courseName,
          score: newScore,
          totalMarks: questions.length
        }
      });
    }
  };

  const question = questions[currentQuestion];

  return (
    <div>
      <h1>{courseName} Quiz</h1>

      <h3>
        Question {currentQuestion + 1} / {questions.length}
      </h3>

      <h2>{question.question}</h2>

      {question.options.map((option) => (
        <div key={option}>
          <label>
            <input
              type="radio"
              name="answer"
              value={option}
              checked={selectedAnswer === option}
              onChange={(e) => setSelectedAnswer(e.target.value)}
            />

            {" "}{option}
          </label>
        </div>
      ))}

      <br />

      <button onClick={handleNext}>
        {currentQuestion === questions.length - 1
          ? "Submit Quiz"
          : "Next"}
      </button>
    </div>
  );
}

export default Quiz;