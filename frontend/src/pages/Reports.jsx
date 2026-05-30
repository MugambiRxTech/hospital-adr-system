import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../services/api';
import SeverityBadge from '../components/SeverityBadge';
import { useAuth } from '../context/AuthContext';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await API.get('/reports/');
        setReports(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report?')) return;
    try {
      await API.delete(`/reports/${id}`);
      setReports(reports.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">ADR Reports</h1>
          <Link to="/reports/add" className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + New Report
          </Link>
        </div>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : reports.length === 0 ? (
          <p className="text-gray-400">No reports found.</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Patient</th>
                  <th className="px-4 py-3 text-left">Drug</th>
                  <th className="px-4 py-3 text-left">Severity</th>
                  <th className="px-4 py-3 text-left">Outcome</th>
                  <th className="px-4 py-3 text-left">Reporter</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium">{r.patient.name}</td>
                    <td className="px-4 py-3">{r.drug.name}</td>
                    <td className="px-4 py-3"><SeverityBadge severity={r.severity} /></td>
                    <td className="px-4 py-3 capitalize">{r.outcome}</td>
                    <td className="px-4 py-3">{r.reporter}</td>
                    <td className="px-4 py-3">{new Date(r.report_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <Link to={`/reports/${r.id}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600">
                        View
                      </Link>
                      <Link to={`/reports/edit/${r.id}`}
                        className="bg-yellow-400 text-white px-3 py-1 rounded text-xs hover:bg-yellow-500">
                        Edit
                      </Link>
                      {user?.role === 'admin' && (
                        <button onClick={() => handleDelete(r.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600">
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;