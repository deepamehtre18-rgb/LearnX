import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../services/api";
import "./Dashboard.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await getCourses();

      console.log("Courses API response:", response);

      // Handles both:
      // getCourses() returning an array
      // OR Axios returning { data: [...] }
      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];

      setCourses(data);
    } catch (error) {
      console.error("Failed to load courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const openCourse = (course) => {
    navigate("/course", {
      state: {
        courseId: course.id,
        courseName: course.courseName,
      },
    });
  };

  const filteredCourses = courses.filter((course) =>
    course.courseName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const getIcon = (name) => {
    const courseName = name?.toLowerCase();

    if (courseName?.includes("java")) return "☕";
    if (courseName?.includes("sql")) return "🗄️";
    if (courseName?.includes("html")) return "🌐";
    if (courseName?.includes("css")) return "🎨";
    if (courseName?.includes("javascript")) return "⚡";
    if (courseName?.includes("react")) return "⚛️";

    return "📚";
  };

  return (
    <div className="dashboard">

      {/* NAVBAR */}
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
          >
            Dashboard
          </button>

          <button className="nav-active">
            My Courses
          </button>

          <button
            onClick={() => navigate("/progress")}
          >
            Progress
          </button>

        </div>

        <div className="nav-right">

          <button className="notification">
            🔔
            <span></span>
          </button>

          <div className="profile">
            <div className="avatar">S</div>

            <div className="profile-info">
              <strong>Student</strong>
              <small>Learner</small>
            </div>
          </div>

        </div>

      </nav>

      {/* MAIN */}
      <main className="dashboard-content">

        {/* COURSE SECTION */}
        <section className="course-section">

          <div className="course-heading">

            <div>
              <p className="section-label">
                LEARN & GROW
              </p>

              <h2>
                Available Courses
              </h2>

              <p>
                Choose a course and start building your skills.
              </p>
            </div>

            <div className="search-box">

              <span>⌕</span>

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

          {/* LOADING */}
          {loading ? (

            <div className="loading">
              <div className="spinner"></div>
              <p>Loading courses...</p>
            </div>

          ) : filteredCourses.length === 0 ? (

            <div className="empty">
              <span>🔍</span>

              <h3>
                No courses found
              </h3>

              <p>
                Try searching for another course.
              </p>
            </div>

          ) : (

            /* COURSE GRID */
            <div className="course-grid">

              {filteredCourses.map((course, index) => (

                <article
                  className="course-card"
                  key={course.id}
                  style={{
                    animationDelay: `${index * 0.08}s`,
                  }}
                >

                  {/* CARD TOP */}
                  <div className="course-top">

                    <div className="course-icon">
                      {getIcon(course.courseName)}
                    </div>

                    <span className="course-badge">
                      COURSE
                    </span>

                  </div>

                  {/* COURSE BODY */}
                  <div className="course-body">

                    <h3>
                      {course.courseName}
                    </h3>

                    <p className="course-description">
                      Build practical skills and strengthen
                      your knowledge with this course.
                    </p>

                    <div className="course-details">

                      <div>
                        <span>👨‍🏫</span>

                        <div>
                          <small>Trainer</small>

                          <strong>
                            {course.trainer}
                          </strong>
                        </div>
                      </div>

                      <div>
                        <span>⏱️</span>

                        <div>
                          <small>Duration</small>

                          <strong>
                            {course.duration}
                          </strong>
                        </div>
                      </div>

                    </div>

                    <div className="course-price">

                      <div>
                        <small>Course Fee</small>

                        <strong>
                          ₹{course.fees}
                        </strong>
                      </div>

                      <div className="rating">
                        ⭐ 4.8
                      </div>

                    </div>

                  </div>

                  {/* BUTTON */}
                  <div className="course-footer">

                    <button
                      className="view-course"
                      onClick={() =>
                        openCourse(course)
                      }
                    >
                      View Course
                      <span>→</span>
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>

      {/* FOOTER */}
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

export default Courses;