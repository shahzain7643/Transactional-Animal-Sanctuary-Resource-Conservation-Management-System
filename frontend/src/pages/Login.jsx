import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      if (!res.data.token) {
        alert("Invalid response from server");
        return;
      }

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      // ✅ Decode token
      const payload = JSON.parse(atob(res.data.token.split(".")[1]));

      // ✅ Save role properly
      const role = payload.role;
      localStorage.setItem("role", role);

      // ✅ SIMPLE & CORRECT REDIRECT
      navigate("/dashboard");

    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed";

      console.error("Login Error:", message);
      alert(message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>

      <form onSubmit={login}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}