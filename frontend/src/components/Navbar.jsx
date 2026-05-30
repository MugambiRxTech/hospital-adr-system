import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/dashboard" className="text-xl font-bold">
        🏥 ADR System
      </Link>
      <div className="flex gap-6 items-center">
        <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
        <Link to="/reports" className="hover:text-blue-200">Reports</Link>
        <Link to="/patients" className="hover:text-blue-200">Patients</Link>
        <Link to="/drugs" className="hover:text-blue-200">Drugs</Link>
        {user?.role === 'admin' && (
          <Link to="/analytics" className="hover:text-blue-200">Analytics</Link>
        )}
        <span className="text-blue-300 text-sm">
          {user?.username} ({user?.role})
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;