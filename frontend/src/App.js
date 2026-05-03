import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/shared/Layout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// CEO
import CeoDashboard from './pages/ceo/DashboardPage';
import CeoAnomalies from './pages/ceo/AnomaliesPage';
import CeoRecommendations from './pages/ceo/RecommendationsPage';
import CeoRisks from './pages/ceo/RisksPage';

// Manager
import ManagerDashboard from './pages/manager/DashboardPage';
import ManagerScan from './pages/manager/NetworkScanPage';
import ManagerAssets from './pages/manager/AssetsPage';
import ManagerAnomalies from './pages/manager/AnomaliesPage';
import ManagerRisks from './pages/manager/RisksPage';
import ManagerReviews from './pages/manager/AssessmentReviewPage';
import ManagerCopilot from './pages/manager/CopilotPage';

// Employee
import EmployeeAssessment from './pages/employee/AssessmentPage';
import EmployeeChatbot from './pages/employee/ChatbotPage';
import EmployeeGame from './pages/employee/Game';
import ProfilePage from './pages/shared/ProfilePage';

import { ROLE_HOME } from './utils/roles';
import './styles/global.css';

const Loading = () => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg-primary)' }}>
    <div style={{ textAlign:'center' }}>
      <div style={{ width:48, height:48, border:'2px solid var(--accent-cyan)', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }}></div>
      <p style={{ color:'var(--text-secondary)', fontFamily:'var(--font-mono)', fontSize:12 }}>INITIALIZING...</p>
    </div>
  </div>
);

const PrivateRoute = ({ children, allowed }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" />;
  if (allowed && !allowed.includes(user.role)) return <Navigate to={ROLE_HOME[user.role] || '/login'} />;
  return children;
};

const RoleRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <LandingPage />;
  return <Navigate to={ROLE_HOME[user.role] || '/login'} />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* CEO area */}
          <Route element={<PrivateRoute allowed={['ceo']}><Layout /></PrivateRoute>}>
            <Route path="/ceo/dashboard" element={<CeoDashboard />} />
            <Route path="/ceo/anomalies" element={<CeoAnomalies />} />
            <Route path="/ceo/recommendations" element={<CeoRecommendations />} />
            <Route path="/ceo/risks" element={<CeoRisks />} />
            <Route path="/ceo/profile" element={<ProfilePage />} />
          </Route>

          {/* Manager area */}
          <Route element={<PrivateRoute allowed={['manager']}><Layout /></PrivateRoute>}>
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/manager/scan" element={<ManagerScan />} />
            <Route path="/manager/assets" element={<ManagerAssets />} />
            <Route path="/manager/anomalies" element={<ManagerAnomalies />} />
            <Route path="/manager/risks" element={<ManagerRisks />} />
            <Route path="/manager/reviews" element={<ManagerReviews />} />
            <Route path="/manager/copilot" element={<ManagerCopilot />} />
            <Route path="/manager/profile" element={<ProfilePage />} />
          </Route>

          {/* Employee area */}
          <Route element={<PrivateRoute allowed={['employee']}><Layout /></PrivateRoute>}>
            <Route path="/employee/assessment" element={<EmployeeAssessment />} />
            <Route path="/employee/chatbot" element={<EmployeeChatbot />} />
            <Route path="/employee/training" element={<EmployeeGame />} />
            <Route path="/employee/profile" element={<ProfilePage />} />
          </Route>

          {/* Root: redirect by role */}
          <Route path="/" element={<RoleRedirect />} />
          <Route path="*" element={<RoleRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
