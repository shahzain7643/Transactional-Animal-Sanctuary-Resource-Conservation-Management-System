import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const res = await API.get("/animals", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAnimals(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) fetchAnimals();
  }, [token]);

  return (
    <>
      <Navbar />

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h1>Dashboard</h1>

        {/* 🔥 FIXED NAVIGATION */}
        {role === "Admin" && (
          <>
            <button onClick={() => navigate("/animals")}>
              Manage Animals
            </button>

            <button onClick={() => navigate("/approve")}>
              Approve Adoptions
            </button>
          </>
        )}

        {/* ROLE PANELS */}
        {role === "Admin" && (
          <div>
            <h2>Admin Panel</h2>
            {animals.map((a) => (
              <div key={a.animal_id}>{a.name}</div>
            ))}
          </div>
        )}

        {role === "Veterinarian" && (
          <div>
            <h2>Medical Panel</h2>
            {animals.map((a) => (
              <div key={a.animal_id}>{a.name}</div>
            ))}
          </div>
        )}

        {role === "Adopter" && (
          <div>
            <h2>Adoption Panel</h2>
            {animals.map((a) => (
              <div key={a.animal_id}>{a.name}</div>
            ))}
          </div>
        )}

        {role === "Volunteer" && <h2>Volunteer Panel</h2>}
      </div>
    </>
  );
}