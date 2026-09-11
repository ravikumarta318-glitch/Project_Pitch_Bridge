import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './i18n';
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import FounderDashboard from './pages/founder/FounderDashboard';
import StartupProfilePage from './pages/founder/StartupProfilePage';
import InvestorDashboard from './pages/investor/InvestorDashboard';
import InvestorProfileSetup from './pages/investor/InvestorProfileSetup';
import AIAgentPage from './pages/founder/AIAgentPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/:role/login" element={<AuthPage />} />
          <Route path="/founder/dashboard" element={<FounderDashboard />} />
          <Route path="/founder/startup-profile" element={<StartupProfilePage />} />
          <Route path="/founder/ai-agent" element={<AIAgentPage />} />
          <Route path="/investor/dashboard" element={<InvestorDashboard />} />
          <Route path="/investor/profile-setup" element={<InvestorProfileSetup />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
