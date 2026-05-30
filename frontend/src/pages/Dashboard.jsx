import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import API from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportsRes = await API.get('/reports/');
        setRecentReports(reportsRes.data.slice(0, 5));
        if (user?.role === 'admin') {
          const statsRes = await API.get('/reports/analytics/summary');
          setStats(statsRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">Welcome, {user?.username} 👋</h1>
        <p className="text-gray-500 mb-8 capitalize">Role: {user?.role}</p>

        {user?.role === 'admin' && stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-blue-800 text-white rounded-xl p-4 text-center col-span-2 md:col-span-1">
              <p className="text-3xl font-bold">{stats.total_reports}</p>
              <p className="text-blue-200 text-sm">Total Reports</p>
            </div>
            {Object.entries(stats.severity_breakdown).map(([level, count]) => (
              <div key={level} className="bg-white rounded-xl p-4 text-center shadow">
                <p className="text-2xl font-bold text-blue-800">{count}</p>
                <p className="text-gray-500 text-sm capitalize">{level}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/reports/add" className="bg-blue-800 text-white rounded-xl p-6 hover:bg-blue-700 transition">
            <div className="text-3xl mb-2">📋</div>
            <h3 className="font-bold text-lg">Submit ADR Report</h3>
            <p className="text-blue-200 text-sm mt-1">Report a new adverse drug reaction</p>
          </Link>
          <Link to="/patients" className="bg-white rounded-xl p-6 shadow hover:shadow-md transition">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-bold text-lg text-blue-800">Patients</h3>
            <p className="text-gray-500 text-sm mt-1">View and manage patient records</p>
          </Link>
          <Link to="/drugs" className="bg-white rounded-xl p-6 shadow hover:shadow-md transition">
            <div className="text-3xl mb-2">💊</div>
            <h3 className="font-bold text-lg text-blue-800">Drugs</h3>
            <p className="text-gray-500 text-sm mt-1">View and search drug database</p>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-800">Recent Reports</h2>
            <Link to="/reports" className="text-blue-600 text-sm hover:underline">View all</Link>
          </div>
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : recentReports.length === 0 ? (
            <p className="text-gray-400">No reports yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">Patient</th>
                  <th className="pb-2">Drug</th>
                  <th className="pb-2">Severity</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{r.patient.name}</td>
                    <td className="py-2">{r.drug.name}</td>
                    <td className="py-2 capitalize">{r.severity}</td>
                    <td className="py-2">{new Date(r.report_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;