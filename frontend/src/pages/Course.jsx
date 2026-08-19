import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getVideos } from "../services/api";
import "./CourseDetails.css";

function Course() {
  const location = useLocation();
  const navigate = useNavigate();

  const { courseId, courseName } = location.state || {};

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [watched, setWatched] = useState([]);

  // NEW: Stores the video currently being watched
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    if (!courseId) return;

    getVideos(courseId)
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [courseId]);

  // =========================
  // WATCH VIDEO
  // =========================
  const watchVideo = (video) => {
    setSelectedVideo(video);

    if (!watched.includes(video.id)) {
      setWatched([...watched, video.id]);
    }
  };

  // =========================
  // CLOSE VIDEO
  // =========================
  const closeVideo = () => {
    setSelectedVideo(null);
  };

  // =========================
  // FULL SCREEN
  // =========================
  const makeFullScreen = () => {
    const iframe = document.querySelector(
      ".video-player-wrapper iframe"
    );

    if (iframe && iframe.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  // =========================
  // CONVERT YOUTUBE URL
  // =========================
  const getEmbedUrl = (url) => {
    if (!url) return "";

    if (url.includes("youtube.com/watch?v=")) {
      return url.replace(
        "https://www.youtube.com/watch?v=",
        "https://www.youtube.com/embed/"
      );
    }

    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];

      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    return url;
  };

  const progress =
    videos.length > 0
      ? Math.round((watched.length / videos.length) * 100)
      : 0;

  if (!courseId) {
    return (
      <div className="course-error">
        <h2>Course not found</h2>

        <button onClick={() => navigate("/dashboard")}>
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="course-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="course-header">

        <div>

          <span className="brand-small">
            LearnX
          </span>

          <h1>
            {courseName}
          </h1>

          <p>
            Learn at your own pace • Watch lessons • Take the quiz
          </p>

        </div>

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← All Courses
        </button>

      </header>


      {/* =========================
          PROGRESS SECTION
      ========================= */}

      <section className="progress-card">

        <div className="progress-info">

          <div>

            <span>
              Your Progress
            </span>

            <strong>
              {progress}%
            </strong>

          </div>

          <p>
            {watched.length} of {videos.length} lessons completed
          </p>

        </div>

        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          ></div>

        </div>

      </section>


      {/* =========================
          COURSE CONTENT
      ========================= */}

      <main className="course-content">


        {/* =========================
            VIDEO PLAYER
        ========================= */}

        {selectedVideo && (

          <div className="video-player-section">

            <div className="video-player-header">

              <div>

                <span>
                  NOW PLAYING
                </span>

                <h2>
                  {selectedVideo.title}
                </h2>

              </div>

              <button
                className="close-video-button"
                onClick={closeVideo}
              >
                ✕
              </button>

            </div>


            {/* VIDEO */}
            <div className="video-player-wrapper">

              <iframe
                src={getEmbedUrl(selectedVideo.url)}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              ></iframe>

            </div>


            {/* VIDEO ACTIONS */}
            <div className="video-player-actions">

              {/* FULL SCREEN */}
              <button
                className="fullscreen-video-button"
                onClick={makeFullScreen}
              >
                ⛶ Full Screen
              </button>


              {/* YOUTUBE */}
              <a
                className="youtube-button"
                href={selectedVideo.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                🔴 Watch on YouTube
              </a>

            </div>

          </div>

        )}


        {/* =========================
            SECTION HEADING
        ========================= */}

        <div className="section-heading">

          <div>

            <span className="section-label">
              LEARNING PATH
            </span>

            <h2>
              Course Videos
            </h2>

          </div>

          <span className="lesson-count">
            {videos.length} Lessons
          </span>

        </div>


        {/* =========================
            LOADING
        ========================= */}

        {loading ? (

          <div className="loading-container">

            <div className="loader"></div>

            <p>
              Loading your lessons...
            </p>

          </div>

        ) : videos.length === 0 ? (

          /* =========================
              NO VIDEOS
          ========================= */

          <div className="empty-state">

            <h3>
              No videos available
            </h3>

            <p>
              Lessons for this course haven't been added yet.
            </p>

          </div>

        ) : (

          /* =========================
             VIDEO LIST
          ========================= */

          <div className="video-list">

            {videos.map((video, index) => {

              const isWatched =
                watched.includes(video.id);

              const isCurrentlyPlaying =
                selectedVideo?.id === video.id;

              return (

                <div
                  className={`video-card ${
                    isWatched ? "completed" : ""
                  } ${
                    isCurrentlyPlaying ? "playing" : ""
                  }`}
                  key={video.id}
                >

                  {/* LESSON NUMBER */}

                  <div className="lesson-number">

                    {isWatched
                      ? "✓"
                      : String(index + 1).padStart(2, "0")}

                  </div>


                  {/* VIDEO ICON */}

                  <div className="video-icon">
                    ▶️
                  </div>


                  {/* VIDEO INFORMATION */}

                  <div className="video-info">

                    <span>
                      LESSON {index + 1}
                    </span>

                    <h3>
                      {video.title}
                    </h3>

                    <p>
                      {isWatched
                        ? "Lesson completed"
                        : "Continue learning"}
                    </p>

                  </div>


                  {/* WATCH BUTTON */}

                  <button
                    className={`watch-button ${
                      isWatched
                        ? "watched-button"
                        : ""
                    }`}
                    onClick={() =>
                      watchVideo(video)
                    }
                  >

                    {isCurrentlyPlaying
                      ? "▶️ Playing"
                      : isWatched
                      ? "✓ Watched"
                      : "Watch Video"}

                  </button>

                </div>

              );

            })}

          </div>

        )}


        {/* =========================
            QUIZ SECTION
        ========================= */}

        <section className="quiz-card">

          <div className="quiz-icon">
            🧠
          </div>

          <div className="quiz-text">

            <span>
              FINAL ASSESSMENT
            </span>

            <h2>
              Ready to test your knowledge?
            </h2>

            <p>
              Complete the quiz and see how well you understood
              this course.
            </p>

          </div>


          <button
            className="quiz-button"
            onClick={() =>
              navigate("/quiz", {
                state: {
                  courseId: courseId,
                  courseName: courseName,
                },
              })
            }
          >
            Start Quiz →
          </button>

        </section>

      </main>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="course-footer">

        <p>
          LearnX • Learn. Practice. Grow.
        </p>

      </footer>

    </div>
  );
}

export default Course;