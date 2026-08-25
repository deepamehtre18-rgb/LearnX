import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    // Validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill all fields.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    // Create timeout controller
    const controller = new AbortController();

    // Give Render enough time to wake up
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 90000);

    try {
      const response = await fetch(
        "https://learnx-pxr0.onrender.com/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      // Try to read the response safely
      let data = {};

      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Invalid server response:", jsonError);
      }

      if (!response.ok) {
        setError(
          data.error ||
            data.message ||
            "Registration failed. Please try again."
        );
        return;
      }

      // Registration successful
      alert("Registration successful! You can now login.");

      navigate("/login");

    } catch (error) {
      clearTimeout(timeoutId);

      console.error("Registration error:", error);

      if (error.name === "AbortError") {
        setError(
          "Server is taking too long to respond. Please try again."
        );
      } else {
        setError(
          "Unable to connect to server. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
      }}
    >
      <div
        style={{
          width: "380px",
          background: "white",
          padding: "35px",
          borderRadius: "12px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        {/* Logo / Heading */}
        <h1 style={{ marginBottom: "5px" }}>
          LearnX
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "25px",
          }}
        >
          Online Learning & Quiz Platform
        </p>

        <h2 style={{ marginBottom: "20px" }}>
          Create Account
        </h2>

        <form onSubmit={handleRegister}>

          {/* Name */}
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              boxSizing: "border-box",
              fontSize: "14px",
            }}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              boxSizing: "border-box",
              fontSize: "14px",
            }}
          />

          {/* Password */}
          <div
            style={{
              position: "relative",
              marginBottom: "15px",
            }}
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              style={{
                width: "100%",
                padding: "12px",
                paddingRight: "55px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                boxSizing: "border-box",
                fontSize: "14px",
              }}
            />

            {/* Eye button */}
            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "18px",
                padding: "4px",
              }}
              title={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? "🙈" : "show"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p
              style={{
                color: "red",
                fontSize: "14px",
                marginBottom: "15px",
              }}
            >
              {error}
            </p>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "6px",
              background: loading
                ? "#999"
                : "#2563eb",
              color: "white",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              fontSize: "16px",
            }}
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>
        </form>

        {/* Login Link */}
        <p style={{ marginTop: "20px" }}>
          Already have an account?{" "}

          <Link
            to="/login"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;