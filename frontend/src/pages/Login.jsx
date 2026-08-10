import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>LearnX</h1>
      <p>Online Learning & Quiz Platform</p>

      <h2>Login</h2>

      <form onSubmit={(e) => {
        e.preventDefault();
        navigate("/dashboard");
      }}>
        <input
          type="email"
          placeholder="Email"
        />

        <input
          type="password"
          placeholder="Password"
        />

        <button type="submit">
          Login
        </button>
      </form>

      <p>
        Don't have an account?{" "}
        <a href="/register">Register</a>
      </p>
    </div>
  );
}

export default Login;