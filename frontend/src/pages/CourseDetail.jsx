import { useNavigate, useParams } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "Java Full Stack",
    description:
      "Learn Java programming, OOP, JDBC, Spring Boot, and full-stack development.",
    lessons: [
      {
        title: "Introduction to Java",
        videoUrl: "https://www.youtube.com/watch?v=eIrMbAQSU34",
      },
      {
        title: "Java OOP Concepts",
        videoUrl: "https://www.youtube.com/watch?v=BSVKUk58K6U",
      },
      {
        title: "Java Collections",
        videoUrl: "https://www.youtube.com/watch?v=GdAon80-0KA",
      },
      {
        title: "Introduction to Spring Boot",
        videoUrl: "https://www.youtube.com/watch?v=9SGDpanrc8U",
      },
    ],
  },

  {
    id: 2,
    title: "SQL",
    description:
      "Learn SQL fundamentals, queries, joins, functions, and database concepts.",
    lessons: [
      {
        title: "SQL Introduction",
        videoUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
      },
      {
        title: "SQL SELECT Queries",
        videoUrl: "https://www.youtube.com/watch?v=7S_tz1z_5bA",
      },
      {
        title: "SQL Joins",
        videoUrl: "https://www.youtube.com/watch?v=9yeOJ0ZMUYw",
      },
      {
        title: "SQL Functions",
        videoUrl: "https://www.youtube.com/watch?v=7mz73uXD9DA",
      },
    ],
  },

  {
    id: 3,
    title: "HTML",
    description:
      "Learn HTML from basics to creating structured and responsive web pages.",
    lessons: [
      {
        title: "HTML Introduction",
        videoUrl: "https://www.youtube.com/watch?v=qz0aGYrrlhU",
      },
      {
        title: "HTML Elements and Tags",
        videoUrl: "https://www.youtube.com/watch?v=UB1O30fR-EE",
      },
      {
        title: "HTML Forms",
        videoUrl: "https://www.youtube.com/watch?v=fNcJuPIZ2WE",
      },
    ],
  },

  {
    id: 4,
    title: "CSS",
    description:
      "Learn CSS styling, layouts, Flexbox, Grid, and responsive web design.",
    lessons: [
      {
        title: "CSS Introduction",
        videoUrl: "https://www.youtube.com/watch?v=1Rs2ND1ryYc",
      },
      {
        title: "CSS Flexbox",
        videoUrl: "https://www.youtube.com/watch?v=fYq5PXgSsbE",
      },
      {
        title: "CSS Grid",
        videoUrl: "https://www.youtube.com/watch?v=9zBsdzdE4sM",
      },
    ],
  },

  {
    id: 5,
    title: "JavaScript",
    description:
      "Learn JavaScript fundamentals, functions, arrays, objects, DOM, and events.",
    lessons: [
      {
        title: "JavaScript Introduction",
        videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
      },
      {
        title: "JavaScript Variables and Data Types",
        videoUrl: "https://www.youtube.com/watch?v=edlF8n7p6oE",
      },
      {
        title: "JavaScript Functions",
        videoUrl: "https://www.youtube.com/watch?v=N8ap4k_1QEQ",
      },
      {
        title: "JavaScript DOM",
        videoUrl: "https://www.youtube.com/watch?v=5fb2aPlgoys",
      },
    ],
  },

   {
      id: 6,
      title: "React JS",
      description:
        "Learn React, components, hooks, state management and modern frontend development.",
      lessons: [
        {
  title: "React Introduction",
  videoUrl: "https://www.youtube.com/embed/Ke90Tje7VS0"
},
        {
  title: "React Components",
  videoUrl: "https://www.youtube.com/embed/Ke90Tje7VS0"
},
        {
  title: "React Hooks",
  videoUrl: "https://www.youtube.com/embed/sZ3d52sLJqs"
},
      ]
    }
];

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const course = courses.find((item) => item.id === Number(id));

  // If course doesn't exist
  if (!course) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1>Course Not Found</h1>

        <button
          onClick={() => navigate("/courses")}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <button
          onClick={() => navigate("/courses")}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#555",
            color: "white",
            cursor: "pointer",
            marginBottom: "25px",
          }}
        >
          ← Back to Courses
        </button>

        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              marginBottom: "12px",
              color: "#222",
            }}
          >
            {course.title}
          </h1>

          <p
            style={{
              color: "#666",
              fontSize: "17px",
              lineHeight: "1.6",
            }}
          >
            {course.description}
          </p>

          <p
            style={{
              fontWeight: "bold",
              marginTop: "15px",
            }}
          >
            🎥 {course.lessons.length} Lessons
          </p>
        </div>

        {/* Lessons */}
        <h2
          style={{
            marginBottom: "20px",
            color: "#222",
          }}
        >
          Course Lessons
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          {course.lessons.map((lesson, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "15px",
                boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#777",
                    fontSize: "14px",
                  }}
                >
                  Lesson {index + 1}
                </p>

                <h3
                  style={{
                    margin: "6px 0 0",
                    color: "#222",
                  }}
                >
                  {lesson.title}
                </h3>
              </div>

              <button
                onClick={() => window.open(lesson.videoUrl, "_blank")}
                style={{
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                ▶️ Watch Video
              </button>
            </div>
          ))}
        </div>

        {/* Quiz Button */}
<div
  style={{
    textAlign: "center",
    marginTop: "35px",
  }}
>
  <button
    onClick={() =>
      navigate("/quiz", {
        state: {
          courseId: course.id,
          courseName: course.courseName,
        },
      })
    }
    style={{
      padding: "14px 35px",
      backgroundColor: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
    }}
  >
    📝 Start Quiz →
  </button>
</div>
      </div>
    </div>
  );
}

export default CourseDetail;