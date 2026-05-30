import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SeverityBadge from '../components/SeverityBadge';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const ReportDetail = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await API.get(`/reports/${id}`);
        setReport(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this report?')) return;
    try {
      await API.delete(`/reports/${id}`);
      navigate('/reports');
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><p className="p-8 text-gray-400">Loading...</p></div>;
  if (!report) return <div className="min-h-screen bg-gray-50"><Navbar /><p className="p-8 text-gray-400">Report not found.</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/reports" className="text-blue-600 hover:underline text-sm">← Back</Link>
          <h1 className="text-3xl font-bold text-blue-800">Report Detail</h1>
        </div>
        <div className="bg-white rounded-xl shadow p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{report.patient.name}</h2>
              <p className="text-gray-500 text-sm">{report.patient.ward} Ward • {report.patient.hospital_number}</p>
            </div>
            <SeverityBadge severity={report.severity} />
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Implicated Drug</p>
            <p className="font-bold text-blue-800 text-lg">{report.drug.name}</p>
            <p className="text-gray-500 text-sm">{report.drug.generic_name} — {report.drug.category}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Outcome</p>
              <p className="font-medium capitalize">{report.outcome}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Causality</p>
              <p className="font-medium capitalize">{report.causality}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Action Taken</p>
              <p className="font-medium capitalize">{report.action_taken.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Onset Date</p>
              <p className="font-medium">{new Date(report.onset_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Reported By</p>
              <p className="font-medium">{report.reporter}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Report Date</p>
              <p className="font-medium">{new Date(report.report_date).toLocaleDateString()}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Description</p>
            <p className="text-gray-800 bg-gray-50 rounded-lg p-4">{report.description}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Symptoms Observed</p>
            <div className="flex flex-wrap gap-2">
              {report.symptoms.map((s) => (
                <span key={s.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <Link to={`/reports/edit/${report.id}`}
              className="bg-yellow-400 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-500">
              Edit Report
            </Link>
            {user?.role === 'admin' && (
              <button onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600">
                Delete Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;