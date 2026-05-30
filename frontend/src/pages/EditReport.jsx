import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../services/api';

const EditReport = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    patient_id: '',
    drug_id: '',
    description: '',
    severity: 'mild',
    outcome: 'recovered',
    causality: 'possible',
    action_taken: 'none',
    onset_date: '',
    symptom_ids: []
  });
  const [patients, setPatients] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rRes, pRes, dRes, sRes] = await Promise.all([
          API.get(`/reports/${id}`),
          API.get('/patients/'),
          API.get('/drugs/'),
          API.get('/symptoms/')
        ]);
        const r = rRes.data;
        setFormData({
          patient_id: r.patient_id,
          drug_id: r.drug_id,
          description: r.description,
          severity: r.severity,
          outcome: r.outcome,
          causality: r.causality,
          action_taken: r.action_taken,
          onset_date: r.onset_date,
          symptom_ids: r.symptoms.map((s) => s.id)
        });
        setPatients(pRes.data);
        setDrugs(dRes.data);
        setSymptoms(sRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSymptomToggle = (sid) => {
    const ids = formData.symptom_ids.includes(sid)
      ? formData.symptom_ids.filter((s) => s !== sid)
      : [...formData.symptom_ids, sid];
    setFormData({ ...formData, symptom_ids: ids });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.put(`/reports/${id}`, formData);
      navigate(`/reports/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/reports" className="text-blue-600 hover:underline text-sm">← Back</Link>
          <h1 className="text-3xl font-bold text-blue-800">Edit Report</h1>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <select name="patient_id" value={formData.patient_id} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — {p.hospital_number}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Suspected Drug</label>
              <select name="drug_id" value={formData.drug_id} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select drug</option>
                {drugs.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} ({d.generic_name})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select name="severity" value={formData.severity} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
                <option value="fatal">Fatal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
              <select name="outcome" value={formData.outcome} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="recovered">Recovered</option>
                <option value="recovering">Recovering</option>
                <option value="not_recovered">Not Recovered</option>
                <option value="fatal">Fatal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Causality</label>
              <select name="causality" value={formData.causality} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="certain">Certain</option>
                <option value="probable">Probable</option>
                <option value="possible">Possible</option>
                <option value="unlikely">Unlikely</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action Taken</label>
              <select name="action_taken" value={formData.action_taken} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="drug_withdrawn">Drug Withdrawn</option>
                <option value="dose_reduced">Dose Reduced</option>
                <option value="none">No Action</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Onset Date</label>
              <input type="date" name="onset_date" value={formData.onset_date} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms Observed</label>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((s) => (
                  <button type="button" key={s.id} onClick={() => handleSymptomToggle(s.id)}
                    className={`px-3 py-1 rounded-full text-sm border transition ${
                      formData.symptom_ids.includes(s.id)
                        ? 'bg-blue-800 text-white border-blue-800'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                    }`}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-800 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? 'Saving...' : 'Update Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditReport;