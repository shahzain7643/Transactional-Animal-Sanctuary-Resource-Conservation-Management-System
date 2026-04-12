import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      if (!res.data.token) {
        setError("Invalid response from server");
        return;
      }

      // Save token
      localStorage.setItem("token", res.data.token);

      // Decode token
      const payload = JSON.parse(atob(res.data.token.split(".")[1]));

      //  Save role
      localStorage.setItem("role", payload.role);

      //  Redirect
      navigate("/dashboard");

    } catch (err) {
      const message =
        err.response?.data?.msg ||   // from backend
        err.response?.data?.message ||
        "Login failed";

      console.error("Login Error:", message);
      setError(message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>Login</h2>

      <form onSubmit={login}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>

      {/* ERROR MESSAGE */}
      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
      )}

      {/*  REGISTER LINK */}
      <p style={{ marginTop: "15px" }}>
        Don’t have an account?{" "}
        <span
          style={{ color: "#58a6ff", cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          Register here
        </span>
      </p>
    </div>
  );
}