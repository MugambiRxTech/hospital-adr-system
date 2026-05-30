import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../services/api';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/reports/analytics/summary');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-8">Analytics Dashboard</h1>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : !stats ? (
          <p className="text-gray-400">No data available.</p>
        ) : (
          <>
            <div className="bg-blue-800 text-white rounded-xl p-6 mb-6 text-center">
              <p className="text-6xl font-bold">{stats.total_reports}</p>
              <p className="text-blue-200 text-lg mt-2">Total ADR Reports Submitted</p>
            </div>
            <h2 className="text-xl font-bold text-blue-800 mb-4">Reports by Severity</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {Object.entries(stats.severity_breakdown).map(([level, count]) => {
                const colors = {
                  mild: 'bg-green-100 text-green-800 border-green-200',
                  moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                  severe: 'bg-orange-100 text-orange-800 border-orange-200',
                  fatal: 'bg-red-100 text-red-800 border-red-200',
                };
                return (
                  <div key={level} className={`rounded-xl p-6 text-center border ${colors[level]}`}>
                    <p className="text-4xl font-bold">{count}</p>
                    <p className="capitalize font-medium mt-1">{level}</p>
                  </div>
                );
              })}
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-blue-800 mb-4">Severity Distribution</h2>
              <div className="space-y-3">
                {Object.entries(stats.severity_breakdown).map(([level, count]) => {
                  const total = stats.total_reports || 1;
                  const percent = Math.round((count / total) * 100);
                  const colors = {
                    mild: 'bg-green-400',
                    moderate: 'bg-yellow-400',
                    severe: 'bg-orange-400',
                    fatal: 'bg-red-500',
                  };
                  return (
                    <div key={level}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize font-medium">{level}</span>
                        <span className="text-gray-500">{count} ({percent}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-4">
                        <div className={`${colors[level]} h-4 rounded-full transition-all`}
                          style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;