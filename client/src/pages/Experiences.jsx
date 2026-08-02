import { useEffect, useState } from "react";
import api from "../api/axios";

const EMPTY_FORM = {
  company: "",
  role: "",
  difficulty: "Medium",
  offerReceived: false,
  rounds: [{ roundNo: 1, description: "" }],
};

export default function Experiences() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");

  const currentUsername = JSON.parse(localStorage.getItem("user") || "{}")?.username;

  const load = async (company) => {
    setLoading(true);
    setError("");
    try {
      const { data } = company
        ? await api.get(`/experiences/${company}`)
        : await api.get("/experiences");
      setExperiences(Array.isArray(data) ? data : data.experiences || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load experiences.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(search.trim());
  };

  const handleRoundChange = (index, field, value) => {
    const rounds = [...form.rounds];
    rounds[index] = { ...rounds[index], [field]: value };
    setForm({ ...form, rounds });
  };

  const addRoundField = () =>
    setForm({
      ...form,
      rounds: [...form.rounds, { roundNo: form.rounds.length + 1, description: "" }],
    });

  const removeRoundField = (index) =>
    setForm({ ...form, rounds: form.rounds.filter((_, i) => i !== index) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/experiences", form);
      setForm(EMPTY_FORM);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not post experience.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this experience?")) return;
    try {
      await api.delete(`/experiences/${id}`);
      setExperiences((prev) => prev.filter((x) => x._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete experience.");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Experiences</h1>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "+ Share an experience"}
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          placeholder="Filter by company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-secondary" type="submit">
          Search
        </button>
        {search && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setSearch("");
              load();
            }}
          >
            Clear
          </button>
        )}
      </form>

      {showForm && (
        <form className="card form-card" onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label>Company</label>
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Role</label>
              <input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div className="checkbox-row">
              <label>
                <input
                  type="checkbox"
                  checked={form.offerReceived}
                  onChange={(e) =>
                    setForm({ ...form, offerReceived: e.target.checked })
                  }
                />
                Offer received
              </label>
            </div>
          </div>

          <label>Rounds</label>
          {form.rounds.map((r, i) => (
            <div className="form-row round-input-row" key={i}>
              <input
                type="number"
                className="round-no-input"
                value={r.roundNo}
                onChange={(e) => handleRoundChange(i, "roundNo", e.target.value)}
              />
              <input
                placeholder="Describe this round"
                value={r.description}
                onChange={(e) => handleRoundChange(i, "description", e.target.value)}
              />
              {form.rounds.length > 1 && (
                <button
                  type="button"
                  className="btn btn-ghost btn-danger"
                  onClick={() => removeRoundField(i)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={addRoundField}>
            + Add round
          </button>

          <button className="btn btn-primary" type="submit">
            Post experience
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : experiences.length === 0 ? (
        <p className="empty-state">No experiences found.</p>
      ) : (
        <div className="experience-grid">
          {experiences.map((exp) => (
            <div className="card experience-card" key={exp._id}>
              <div className="page-header">
                <h3>
                  {exp.company} {exp.role ? `— ${exp.role}` : ""}
                </h3>
                <span className={`chip difficulty-${(exp.difficulty || "").toLowerCase()}`}>
                  {exp.difficulty}
                </span>
              </div>
              <p className="muted">
                {exp.offerReceived ? "✅ Offer received" : "❌ No offer"}
              </p>
              <ol className="rounds-list">
                {(exp.rounds || []).map((r, i) => (
                  <li key={i}>{r.description}</li>
                ))}
              </ol>
              {exp.postedBy?.username === currentUsername && (
                <button
                  className="btn btn-ghost btn-danger"
                  onClick={() => handleDelete(exp._id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
