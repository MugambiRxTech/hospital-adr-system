import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import AddPatient from './pages/AddPatient';
import EditPatient from './pages/EditPatient';
import Drugs from './pages/Drugs';
import AddDrug from './pages/AddDrug';
import EditDrug from './pages/EditDrug';
import Reports from './pages/Reports';
import ReportDetail from './pages/ReportDetail';
import AddReport from './pages/AddReport';
import EditReport from './pages/EditReport';
import Analytics from './pages/Analytics';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
          <Route path="/patients/add" element={<ProtectedRoute><AddPatient /></ProtectedRoute>} />
          <Route path="/patients/edit/:id" element={<ProtectedRoute><EditPatient /></ProtectedRoute>} />
          <Route path="/drugs" element={<ProtectedRoute><Drugs /></ProtectedRoute>} />
          <Route path="/drugs/add" element={<ProtectedRoute><AddDrug /></ProtectedRoute>} />
          <Route path="/drugs/edit/:id" element={<ProtectedRoute><EditDrug /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/reports/:id" element={<ProtectedRoute><ReportDetail /></ProtectedRoute>} />
          <Route path="/reports/add" element={<ProtectedRoute><AddReport /></ProtectedRoute>} />
          <Route path="/reports/edit/:id" element={<ProtectedRoute><EditReport /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute adminOnly={true}><Analytics /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;