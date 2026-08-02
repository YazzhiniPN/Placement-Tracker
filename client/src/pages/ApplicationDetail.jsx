import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";

// roundNo is auto-assigned by the backend (application.rounds.length + 1),
// so we don't collect it here.
const EMPTY_ROUND = { roundName: "", date: "" };

export default function ApplicationDetail() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [roundForm, setRoundForm] = useState(EMPTY_ROUND);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [appRes, roundsRes] = await Promise.all([
        api.get(`/applications/${id}`),
        api.get(`/applications/${id}/rounds`),
      ]);
      setApplication(appRes.data.application || appRes.data);
      setRounds(roundsRes.data.rounds || roundsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load application.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleRoundChange = (e) =>
    setRoundForm({ ...roundForm, [e.target.name]: e.target.value });

  const handleAddRound = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/applications/${id}/rounds`, roundForm);
      setRoundForm(EMPTY_ROUND);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add round.");
    }
  };

  const handleUpdateRound = async (roundNo, changes) => {
    try {
      await api.put(`/applications/${id}/rounds/${roundNo}`, changes);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update round.");
    }
  };

  const handleDeleteRound = async (roundNo) => {
    if (!window.confirm("Delete this round?")) return;
    try {
      await api.delete(`/applications/${id}/rounds/${roundNo}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete round.");
    }
  };

  if (loading) return <div className="page">Loading...</div>;
  if (!application) return <div className="page">Application not found.</div>;

  return (
    <div className="page">
      <Link to="/applications" className="back-link">
        &larr; Back to applications
      </Link>

      {error && <div className="alert-error">{error}</div>}

      <div className="card">
        <div className="page-header">
          <h1>
            {application.company} {application.role ? `— ${application.role}` : ""}
          </h1>
          <StatusBadge status={application.status} />
        </div>
        <p className="muted">
          Type: {application.type || "-"} | Applied:{" "}
          {application.appliedDate
            ? new Date(application.appliedDate).toLocaleDateString()
            : "-"}
        </p>
        {application.notes && <p>{application.notes}</p>}
      </div>

      <h2>Rounds</h2>

      <form className="card form-card round-form" onSubmit={handleAddRound}>
        <div className="form-row">
          <div>
            <label>Round name</label>
            <input
              name="roundName"
              value={roundForm.roundName}
              onChange={handleRoundChange}
              placeholder="e.g. Technical Interview 1"
              required
            />
          </div>
          <div>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={roundForm.date}
              onChange={handleRoundChange}
            />
          </div>
        </div>
        <button className="btn btn-primary" type="submit">
          Add round
        </button>
        <p className="muted" style={{ marginTop: "0.4rem" }}>
          Note: the date won't save until the backend's addRound controller is
          fixed (it currently reads req.body.data instead of req.body.date).
        </p>
      </form>

      {rounds.length === 0 ? (
        <p className="empty-state">No rounds added yet.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Round</th>
                <th>Name</th>
                <th>Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rounds.map((r) => (
                <tr key={r.roundNo}>
                  <td>{r.roundNo}</td>
                  <td>{r.roundName}</td>
                  <td>{r.date ? new Date(r.date).toLocaleDateString() : "-"}</td>
                  <td>
                    <input
                      defaultValue={r.status || ""}
                      placeholder="e.g. Pending, Passed, Failed"
                      onBlur={(e) =>
                        e.target.value !== r.status &&
                        handleUpdateRound(r.roundNo, { status: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-danger"
                      onClick={() => handleDeleteRound(r.roundNo)}
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
