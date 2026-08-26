const API_URL = "https://learnx-pxr0.onrender.com";

// =====================================================
// GET COURSES
// =====================================================

export const getCourses = async () => {
  const response = await fetch(`${API_URL}/api/courses`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch courses: ${response.status}`
    );
  }

  return response.json();
};


// =====================================================
// GET VIDEOS
// =====================================================

export const getVideos = async (courseId) => {
  const response = await fetch(
    `${API_URL}/api/videos/${courseId}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch videos: ${response.status}`
    );
  }

  return response.json();
};


// =====================================================
// GET QUESTIONS
// =====================================================

export const getQuestions = async (courseId) => {
  console.log(
    "Fetching questions for course:",
    courseId
  );

  const response = await fetch(
    `${API_URL}/api/questions/${courseId}`
  );

  console.log("Questions response status:",
    response.status);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch questions: ${response.status}`);}

  const data = await response.json();

  console.log(
    "Questions received:",
    data
  );

  return data;
};