import { useEffect, useState } from "react";
import API from "../api/axios";

export default function ApproveAdoption() {
  const [applications, setApplications] = useState([]);

  const fetchApps = async () => {
    const res = await API.get("/adoptions");
    setApplications(res.data.data);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const approve = async (id) => {
    await API.post("/adoptions/approve", { application_id: id });
    fetchApps();
  };

  const reject = async (id) => {
    await API.post("/adoptions/reject", { application_id: id });
    fetchApps();
  };

  return (
    <div>
      <h2>Adoption Applications</h2>

      {applications.map((app) => (
        <div key={app.application_id}>
          {app.animal_name} - {app.adopter_name} ({app.status})

          <button onClick={() => approve(app.application_id)}>
            Approve
          </button>

          <button onClick={() => reject(app.application_id)}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}