import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../services/api';

const EditDrug = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    generic_name: '',
    category: '',
    manufacturer: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrug = async () => {
      try {
        const res = await API.get(`/drugs/${id}`);
        setFormData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDrug();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.put(`/drugs/${id}`, formData);
      navigate('/drugs');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update drug');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/drugs" className="text-blue-600 hover:underline text-sm">← Back</Link>
          <h1 className="text-3xl font-bold text-blue-800">Edit Drug</h1>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
              <input type="text" name="generic_name" value={formData.generic_name} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
              <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-800 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? 'Saving...' : 'Update Drug'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDrug;