import courses from "../data/courses";

function Learn() {
  return (
    <div>
      <h1>LearnX Courses</h1>

      <p>Select a course and start learning.</p>

      {courses.map((course) => (
        <div key={course.id}>
          <h2>{course.title}</h2>
          <p>{course.description}</p>

          <h3>Lessons</h3>

          {course.lessons.map((lesson, index) => (
            <div key={index}>
              <h4>{lesson.title}</h4>

              <a
                href={lesson.videoUrl}
                target="_blank"
                rel="noreferrer"
              >
                Watch Video
              </a>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Learn;