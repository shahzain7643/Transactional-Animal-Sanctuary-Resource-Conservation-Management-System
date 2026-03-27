import { useEffect, useState } from "react";
import API from "../api/axios"; // ✅ USE YOUR AXIOS INSTANCE
import Navbar from "../components/Navbar";

export default function Animals() {
  const [animals, setAnimals] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  // 🔥 ADVANCED FEATURES
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // ✅ FETCH ANIMALS
  const fetchAnimals = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/animals?search=${search}&status=${status}`
      );

      setAnimals(res.data.data);
    } catch (err) {
      console.log("FETCH ERROR:", err.response?.data || err.message);
      alert("Error fetching animals");
    } finally {
      setLoading(false);
    }
  };

  // ✅ INITIAL LOAD
  useEffect(() => {
    fetchAnimals();
  }, []);

  // ✅ SEARCH + FILTER
  useEffect(() => {
    fetchAnimals();
  }, [search, status]);

  // ✅ ADD ANIMAL
  const addAnimal = async () => {
    try {
      await API.post("/animals", { name });

      setName("");
      fetchAnimals();
    } catch (err) {
      console.log("ADD ERROR:", err.response?.data || err.message);
      alert("Error adding animal");
    }
  };

  // ✅ DELETE ANIMAL
  const deleteAnimal = async (id) => {
    try {
      await API.delete(`/animals/${id}`);
      fetchAnimals();
    } catch (err) {
      console.log("DELETE ERROR:", err.response?.data || err.message);
      alert("Error deleting animal");
    }
  };

  // ✅ UPDATE ANIMAL
  const updateAnimal = async () => {
    try {
      await API.put(`/animals/${editId}`, { name: editName });

      setEditId(null);
      setEditName("");
      fetchAnimals();
    } catch (err) {
      console.log("UPDATE ERROR:", err.response?.data || err.message);
      alert("Error updating animal");
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: "600px", margin: "40px auto" }}>
        <h2>Animals</h2>

        {/* ANALYTICS */}
        <p>Total Animals: {animals.length}</p>

        {/* ADD */}
        <div style={{ marginBottom: "10px" }}>
          <input
            placeholder="Animal name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={addAnimal}>Add</button>
        </div>

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
            <li key={a.animal_id}>
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
                  {a.name} ({a.adoption_status})
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
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}