import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/stats/personal");
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load stats.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <h1>My stats</h1>
      {error && <div className="alert-error">{error}</div>}

      {stats && (
        <>
          <h2>By status</h2>
          <div className="stats-grid">
            {(stats.bystatus || []).length === 0 ? (
              <p className="empty-state">No applications yet.</p>
            ) : (
              stats.bystatus.map((s) => (
                <StatCard key={s._id} label={s._id} value={s.count} />
              ))
            )}
          </div>

          <h2>By type</h2>
          <div className="stats-grid">
            {(stats.byType || []).length === 0 ? (
              <p className="empty-state">No applications yet.</p>
            ) : (
              stats.byType.map((t) => (
                <StatCard key={t._id} label={t._id} value={t.count} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
