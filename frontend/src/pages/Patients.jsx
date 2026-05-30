import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await API.get('/patients/');
        setPatients(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    try {
      await API.delete(`/patients/${id}`);
      setPatients(patients.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">Patients</h1>
          <Link to="/patients/add" className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + Add Patient
          </Link>
        </div>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : patients.length === 0 ? (
          <p className="text-gray-400">No patients found.</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Hospital No.</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Age</th>
                  <th className="px-4 py-3 text-left">Gender</th>
                  <th className="px-4 py-3 text-left">Ward</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p, i) => (
                  <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3">{p.hospital_number}</td>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3">{p.age}</td>
                    <td className="px-4 py-3">{p.gender}</td>
                    <td className="px-4 py-3">{p.ward}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <Link to={`/patients/edit/${p.id}`}
                        className="bg-yellow-400 text-white px-3 py-1 rounded text-xs hover:bg-yellow-500">
                        Edit
                      </Link>
                      {user?.role === 'admin' && (
                        <button onClick={() => handleDelete(p.id)}
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

export default Patients;