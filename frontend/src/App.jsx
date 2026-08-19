import { BrowserRouter, Routes, Route } from "react-router-dom";

import Videos from "./pages/Videos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import CourseDetail from "./pages/CourseDetail";
import Course from "./pages/Course";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN / REGISTER */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* COURSES */}
        <Route path="/courses" element={<Courses />} />

        {/* COURSE DETAILS */}
        <Route path="/course/:id" element={<CourseDetail />} />

        {/* COURSE PAGE */}
        <Route path="/course" element={<Course />} />

        {/* QUIZ */}
        <Route path="/quiz" element={<Quiz />} />

        {/* RESULT */}
        <Route path="/result" element={<Result />} />

        {/* VIDEOS */}
        <Route path="/videos" element={<Videos />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;