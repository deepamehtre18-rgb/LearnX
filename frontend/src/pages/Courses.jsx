import { useNavigate } from "react-router-dom";

function Courses() {
  const navigate = useNavigate();

  const courses = [
    { id: 1, name: "Java Full Stack" },
    { id: 2, name: "SQL" },
    { id: 3, name: "HTML" },
    { id: 4, name: "CSS" },
    { id: 5, name: "JavaScript" },
    { id: 6, name: "React JS" }
  ];

  const startQuiz = (course) => {
    navigate("/quiz", {
      state: {
        courseId: course.id,
        courseName: course.name
      }
    });
  };

  return (
    <div>
      <h1>Available Courses</h1>

      {courses.map((course) => (
        <div key={course.id}>
          <h3>{course.name}</h3>

          <button onClick={() => startQuiz(course)}>
            Start Quiz
          </button>
        </div>
      ))}
    </div>
  );
}

export default Courses;