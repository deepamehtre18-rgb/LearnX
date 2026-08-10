import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const courses = [
    { id: 1, name: "Java Full Stack" },
    { id: 2, name: "SQL" },
    { id: 3, name: "HTML" },
    { id: 4, name: "CSS" },
    { id: 5, name: "JavaScript" },
    { id: 6, name: "React JS" }
  ];

  return (
    <div>
      <h1>Welcome to LearnX</h1>

      <p>Select a course and attend its quiz.</p>

      <h2>Available Courses</h2>

      {courses.map((course) => (
        <div key={course.id}>
          <h3>{course.name}</h3>

          <button
            onClick={() =>
              navigate("/quiz", {
                state: {
                  courseId: course.id,
                  courseName: course.name
                }
              })
            }
          >
            Start Quiz
          </button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;