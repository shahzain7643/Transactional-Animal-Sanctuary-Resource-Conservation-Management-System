import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Animals() {
  const [animals, setAnimals] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const role = localStorage.getItem("role");

  // FETCH ANIMALS
  const fetchAnimals = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/animals?search=${search}&status=${status}`
      );

      setAnimals(res.data.data || []);
    } catch (err) {
      console.log("FETCH ERROR:", err.response?.data || err.message);

      // HANDLE 403 PROPERLY
      if (err.response?.status === 403) {
        alert("You are not authorized to view animals");
      } else {
        alert("Error fetching animals");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  useEffect(() => {
    fetchAnimals();
  }, [search, status]);

  // ADD ANIMAL (Admin only)
  const addAnimal = async () => {
    try {
      await API.post("/animals", { name });
      setName("");
      fetchAnimals();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding animal");
    }
  };

  // DELETE
  const deleteAnimal = async (id) => {
    try {
      await API.delete(`/animals/${id}`);
      fetchAnimals();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting animal");
    }
  };

  // UPDATE
  const updateAnimal = async () => {
    try {
      await API.put(`/animals/${editId}`, { name: editName });
      setEditId(null);
      setEditName("");
      fetchAnimals();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating animal");
    }
  };

  // APPLY FOR ADOPTION
  const applyForAdoption = async (animalId) => {
    try {
      const res = await API.post("/adoptions/apply", {
        animal_id: animalId
      });

      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Error applying");
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: "700px", margin: "40px auto" }}>
        <h2>Animals</h2>

        <p>Total Animals: {animals.length}</p>

        {/* 🔵 ADMIN ONLY */}
        {role === "Admin" && (
          <div style={{ marginBottom: "10px" }}>
            <input
              placeholder="Animal name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button onClick={addAnimal}>Add</button>
          </div>
        )}

        {/* SEARCH */}
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* FILTER */}
        <select onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="Available">Available</option>
          <option value="Adopted">Adopted</option>
          <option value="Medical">Medical</option>
        </select>

        {loading && <p>Loading...</p>}

        <ul>
          {animals.map((a) => (
            <li key={a.animal_id} style={{ marginBottom: "10px" }}>
              {editId === a.animal_id ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <button onClick={updateAnimal}>Save</button>
                </>
              ) : (
                <>
                  <strong>{a.name}</strong> ({a.adoption_status})

                  {/* 🔵 ADMIN CONTROLS */}
                  {role === "Admin" && (
                    <>
                      <button
                        onClick={() => {
                          setEditId(a.animal_id);
                          setEditName(a.name);
                        }}
                      >
                        Edit
                      </button>

                      <button onClick={() => deleteAnimal(a.animal_id)}>
                        Delete
                      </button>
                    </>
                  )}

                  {/* 🟢 ADOPTER BUTTON */}
                  {role === "Adopter" &&
                    a.adoption_status === "Available" && (
                      <button
                        onClick={() =>
                          applyForAdoption(a.animal_id)
                        }
                      >
                        Apply
                      </button>
                    )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}