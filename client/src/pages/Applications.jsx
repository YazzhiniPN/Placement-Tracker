import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";

const STATUSES = ["Applied", "OA", "Interview", "Offer", "Rejected"];
const EMPTY_FORM = {
  company: "",
  role: "",
  type: "intern",
  appliedDate: "",
  notes: "",
};

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filter, setFilter] = useState("All");

  const loadApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/applications");
      setApplications(Array.isArray(data) ? data : data.applications || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/applications", form);
      setForm(EMPTY_FORM);
      setShowForm(false);
      loadApplications();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add application.");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/applications/${id}`, { status });
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Could not update status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await api.delete(`/applications/${id}`);
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete application.");
    }
  };

  const filtered =
    filter === "All"
      ? applications
      : applications.filter((a) => a.status === filter);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Applications</h1>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "+ Add application"}
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {showForm && (
        <form className="card form-card" onSubmit={handleAdd}>
          <div className="form-row">
            <div>
              <label>Company</label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Role</label>
              <input name="role" value={form.role} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="intern">Intern</option>
                <option value="placement">Placement</option>
              </select>
            </div>
            <div>
              <label>Applied date</label>
              <input
                type="date"
                name="appliedDate"
                value={form.appliedDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <label>Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} />
          <button className="btn btn-primary" type="submit">
            Save application
          </button>
        </form>
      )}

      <div className="filter-bar">
        {["All", ...STATUSES].map((s) => (
          <button
            key={s}
            className={`chip ${filter === s ? "chip-active" : ""}`}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="empty-state">No applications yet. Add your first one above.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Type</th>
                <th>Applied</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app._id}>
                  <td>
                    <Link to={`/applications/${app._id}`}>{app.company}</Link>
                  </td>
                  <td>{app.role || "-"}</td>
                  <td>{app.type || "-"}</td>
                  <td>
                    {app.appliedDate
                      ? new Date(app.appliedDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      className="status-select"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <StatusBadge status={app.status} />
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-danger"
                      onClick={() => handleDelete(app._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
