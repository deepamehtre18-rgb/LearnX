import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Videos() {
  const location = useLocation();
  const navigate = useNavigate();

  const courseId = location.state?.courseId;
  const courseName = location.state?.courseName;

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (!courseId) {
          setError("Course not selected.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:8080/api/videos/${courseId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }

        const data = await response.json();

        setVideos(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load videos.");
        setLoading(false);
      }
    };

    fetchVideos();
  }, [courseId]);

  if (loading) {
    return <h2>Loading videos...</h2>;
  }

  if (error) {
    return (
      <div>
        <h2>{error}</h2>

        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="videos-page">

      <h1>LearnX</h1>

      <h2>{courseName}</h2>

      <p>Course Videos</p>

      {videos.length === 0 ? (
        <h3>No videos available for this course.</h3>
      ) : (
        <div className="videos-container">

          {videos.map((video) => (
            <div className="video-card" key={video.id}>

              <h3>{video.title}</h3>

              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button>Watch Video</button>
              </a>

            </div>
          ))}

        </div>
      )}

      <br />

      <button
        onClick={() =>
          navigate("/quiz", {
            state: {
              courseId: courseId,
              courseName: courseName,
            },
          })
        }
      >
        Start Quiz
      </button>

    </div>
  );
}

export default Videos;