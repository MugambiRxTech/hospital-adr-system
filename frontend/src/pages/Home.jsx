import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex flex-col items-center justify-center text-white px-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold mb-4">🏥 ADR Reporting System</h1>
        <p className="text-xl text-blue-200 mb-2">Hospital Adverse Drug Reaction Management</p>
        <p className="text-blue-300 mb-10">
          A centralized platform for healthcare professionals to report, track, and analyze
          adverse drug reactions — improving patient safety across the facility.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/login" className="bg-white text-blue-800 font-semibold px-8 py-3 rounded-lg hover:bg-blue-100 transition">
            Login
          </Link>
          <Link to="/register" className="border border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-800 transition">
            Register
          </Link>
        </div>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <div className="bg-blue-800 bg-opacity-50 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="font-bold text-lg mb-2">Report ADRs</h3>
          <p className="text-blue-300 text-sm">Submit structured adverse drug reaction reports with clinical detail</p>
        </div>
        <div className="bg-blue-800 bg-opacity-50 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-bold text-lg mb-2">Track & Analyze</h3>
          <p className="text-blue-300 text-sm">Search and filter reports by drug, severity, and outcome</p>
        </div>
        <div className="bg-blue-800 bg-opacity-50 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="font-bold text-lg mb-2">Analytics</h3>
          <p className="text-blue-300 text-sm">Monitor ADR trends and identify high-risk drugs across the facility</p>
        </div>
      </div>
    </div>
  );
};

export default Home;