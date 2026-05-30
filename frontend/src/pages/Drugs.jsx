import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Drugs = () => {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [fdaResults, setFdaResults] = useState([]);
  const [fdaLoading, setFdaLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const res = await API.get('/drugs/');
        setDrugs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDrugs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this drug?')) return;
    try {
      await API.delete(`/drugs/${id}`);
      setDrugs(drugs.filter((d) => d.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  };

  const handleFdaSearch = async () => {
    if (!searchQuery) return;
    setFdaLoading(true);
    setFdaResults([]);
    try {
      const res = await API.get(`/drugs/search-fda?q=${searchQuery}`);
      setFdaResults(res.data);
    } catch (err) {
      alert('No results found from OpenFDA');
    } finally {
      setFdaLoading(false);
    }
  };

  const handleSaveFda = async (drug) => {
    try {
      await API.post('/drugs/save-fda', drug);
      const res = await API.get('/drugs/');
      setDrugs(res.data);
      alert(`${drug.name} saved to database!`);
    } catch (err) {
      alert(err.response?.data?.error || 'Save failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">Drugs</h1>
          <Link to="/drugs/add" className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + Add Drug
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-bold text-blue-800 mb-3">🔍 Search Drug from OpenFDA</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand name e.g. Amoxil"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleFdaSearch} disabled={fdaLoading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50">
              {fdaLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {fdaResults.length > 0 && (
            <div className="mt-4 space-y-3">
              {fdaResults.map((drug, i) => (
                <div key={i} className="flex justify-between items-center border rounded-lg p-3 bg-gray-50">
                  <div>
                    <p className="font-semibold">{drug.name}</p>
                    <p className="text-sm text-gray-500">{drug.generic_name} — {drug.manufacturer}</p>
                  </div>
                  <button onClick={() => handleSaveFda(drug)}
                    className="bg-blue-800 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-700">
                    Save to DB
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : drugs.length === 0 ? (
          <p className="text-gray-400">No drugs found.</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Generic Name</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Manufacturer</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drugs.map((d, i) => (
                  <tr key={d.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium">{d.name}</td>
                    <td className="px-4 py-3">{d.generic_name}</td>
                    <td className="px-4 py-3">{d.category}</td>
                    <td className="px-4 py-3">{d.manufacturer}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <Link to={`/drugs/edit/${d.id}`}
                        className="bg-yellow-400 text-white px-3 py-1 rounded text-xs hover:bg-yellow-500">
                        Edit
                      </Link>
                      {user?.role === 'admin' && (
                        <button onClick={() => handleDelete(d.id)}
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

export default Drugs;