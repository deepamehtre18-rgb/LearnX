const API_URL = "http://localhost:8080";

export const getCourses = async () => {
  const response = await fetch(`${API_URL}/api/courses`);

  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }

  return response.json();
};

export const getVideos = async (courseId) => {
  const response = await fetch(
    `${API_URL}/api/videos/${courseId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch videos");
  }

  return response.json();
};

export const getQuestions = async (courseId) => {
  const response = await fetch(
    `${API_URL}/api/questions/${courseId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }

  return response.json();
};