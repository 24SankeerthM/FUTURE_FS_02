import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import PublicLead from './pages/PublicLead';
import ManageTeam from './pages/ManageTeam';
import TeamChat from './pages/TeamChat';
import Leaderboard from './pages/Leaderboard';
import QuoteGenerator from './components/QuoteGenerator';
import CustomerPortal from './pages/CustomerPortal';
import Layout from './components/Layout';
// import Layout from './components/LayoutSimple';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<PublicLead />} />
            <Route path="/portal/:id" element={<CustomerPortal />} />

            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/team" element={<ManageTeam />} />
                <Route path="/chat" element={<TeamChat />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/quotes" element={<div className="p-4"><QuoteGenerator /></div>} />
                <Route path="/profile" element={<Profile />} />
            </Route>
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
                <Toaster position="top-right" />
            </AuthProvider>
        </Router>
    );
}

export default App;
