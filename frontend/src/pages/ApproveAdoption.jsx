import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/v1";

export default function ApproveAdoption() {
  const [applicationId, setApplicationId] = useState("");

  const approve = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/adoptions/approve`,
        { application_id: applicationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Adoption Approved (Transaction Success)");
    } catch (err) {
      alert("❌ Transaction Failed (Rollback occurred)");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Approve Adoption</h2>

      <input
        placeholder="Application ID"
        value={applicationId}
        onChange={(e) => setApplicationId(e.target.value)}
        style={{ padding: "8px", marginRight: "10px" }}
      />

      <button onClick={approve} style={{ padding: "8px 12px" }}>
        Approve
      </button>
    </div>
  );
}