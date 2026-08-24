import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  // =========================
  // FILTER COURSES
  // =========================
  const filteredCourses = courses.filter((course) =>
    course.courseName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  // =========================
  // FETCH COURSES FROM BACKEND
  // =========================
  useEffect(() => {
    fetch("https://learnx-pxr0.onrender.com/api/courses")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Courses received from backend:", data);
        setCourses(data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  // =========================
  // OPEN COURSE
  // =========================
  const openCourse = (course) => {
    navigate(`/course/${course.id}`);
  };

  // =========================
  // COURSE ICON
  // =========================
  const getIcon = (name) => {
    const course = name?.toLowerCase() || "";

    if (course.includes("java")) return "☕";
    if (course.includes("sql")) return "🗄️";
    if (course.includes("html")) return "🌐";
    if (course.includes("css")) return "🎨";
    if (course.includes("javascript")) return "⚡";
    if (course.includes("react")) return "⚛️";

    return "📚";
  };

  // =========================
  // SCROLL TO COURSES
  // =========================
  const exploreCourses = () => {
    document.getElementById("courses")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="dashboard">

      {/* =========================
          NAVBAR
      ========================= */}
      <nav className="navbar">

        <div className="logo">
          <span className="logo-icon">L</span>

          <span>
            Learn<span>X</span>
          </span>
        </div>

        <div className="nav-links">

          <button
            onClick={() => navigate("/dashboard")}
            className="nav-active"
          >
            Dashboard
          </button>

        </div>

        <div className="nav-right">

          <button className="notification">
            🔔
            <span></span>
          </button>

          <div className="profile">

            <div className="avatar">
              S
            </div>

            <div className="profile-info">

              <strong>
                Student
              </strong>

              <small>
                Learner
              </small>

            </div>

          </div>

        </div>

      </nav>


      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main className="dashboard-content">

        {/* =========================
            HERO SECTION
        ========================= */}
        <section className="hero">

          <div className="hero-text">

            <p className="welcome">
              WELCOME BACK 👋
            </p>

            <h1>
              Continue your
              <span>
                {" "}learning journey.
              </span>
            </h1>

            <p className="hero-description">
              Learn new skills, practice what you know,
              and move closer to your goals.
            </p>

            <button
              className="hero-button"
              onClick={exploreCourses}
            >
              Explore Courses
              <span>→</span>
            </button>

          </div>


          {/* HERO ILLUSTRATION */}
          <div className="hero-illustration">

            <div className="floating-card card-one">
              <span>☕</span>
              Java
            </div>

            <div className="floating-card card-two">
              <span>⚛️</span>
              React
            </div>

            <div className="hero-circle">
              <span>🎓</span>
            </div>

          </div>

        </section>


        {/* =========================
            STAT CARDS
        ========================= */}
        <section className="stats">

          <div className="stat-card">

            <div className="stat-icon purple">
              📚
            </div>

            <div>

              <strong>
                {courses.length}
              </strong>

              <p>
                Available Courses
              </p>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon green">
              🎯
            </div>

            <div>

              <strong>
                0
              </strong>

              <p>
                Courses Completed
              </p>

            </div>

          </div>

        </section>


        {/* =========================
            COURSES SECTION
        ========================= */}
        <section
          className="course-section"
          id="courses"
        >

          {/* COURSE HEADER */}
          <div className="course-heading">

            <div>

              <p className="section-label">
                LEARN & GROW
              </p>

              <h2>
                Available Courses
              </h2>

              <p>
                Choose a course and start building
                your skills.
              </p>

            </div>


            {/* SEARCH */}
            <div className="search-box">

              <span>
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>


          {/* =========================
              EMPTY SEARCH
          ========================= */}
          {filteredCourses.length === 0 ? (

            <div className="empty">

              <span>
                🔍
              </span>

              <h3>
                No courses Found
              </h3>

              <p>
                {courses.length === 0
                  ? "No courses are available."
                  : `No courses match "${search}".`}
              </p>

              {search && (
                <button
                  className="clear-search"
                  onClick={() => setSearch("")}
                >
                  Clear Search
                </button>
              )}

            </div>

          ) : (

            /* =========================
               COURSE GRID
            ========================= */
            <div className="course-grid">

              {filteredCourses.map(
                (course, index) => (

                  <article
                    className="course-card"
                    key={course.id}
                    style={{
                      animationDelay:
                        `${index * 0.08}s`,
                    }}
                  >

                    {/* =========================
                        CARD TOP
                    ========================= */}
                    <div className="course-top">

                      <div className="course-icon">
                        {getIcon(course.courseName)}
                      </div>

                      <span className="course-badge">
                        COURSE
                      </span>

                    </div>


                    {/* =========================
                        COURSE BODY
                    ========================= */}
                    <div className="course-body">

                      <h3>
                        {course.courseName}
                      </h3>


                      {/* DETAILS */}
                      <div className="course-details">

                        {/* TRAINER */}
                        <div>

                          <span>
                            👨‍🏫
                          </span>

                          <div>

                            <small>
                              Trainer
                            </small>

                            <strong>
                              {course.trainer}
                            </strong>

                          </div>

                        </div>


                        {/* DURATION */}
                        <div>

                          <span>
                            ⏱️
                          </span>

                          <div>

                            <small>
                              Duration
                            </small>

                            <strong>
                              {course.duration}
                            </strong>

                          </div>

                        </div>

                      </div>


                      {/* =========================
                          PRICE
                      ========================= */}
                      <div className="course-price">

                        <div>

                          <small>
                            Course Fee
                          </small>

                          <strong>
                            ₹{course.fees}
                          </strong>

                        </div>

                        <div className="rating">
                          ⭐ 4.8
                        </div>

                      </div>

                    </div>


                    {/* =========================
                        CARD FOOTER
                    ========================= */}
                    <div className="course-footer">

                      <button
                        className="view-course"
                        onClick={() =>
                          openCourse(course)
                        }
                      >

                        View Course

                        <span>
                          →
                        </span>

                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

      </main>


      {/* =========================
          FOOTER
      ========================= */}
      <footer className="dashboard-footer">

        <div className="footer-logo">
          Learn<span>X</span>
        </div>

        <p>
          Learn. Practice. Grow.
        </p>

        <span>
          © 2026 LearnX
        </span>

      </footer>

    </div>
  );
}

export default Dashboard;