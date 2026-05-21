import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import Dashboard from "./pages/Dashboard";
import SparePart from "./pages/SparePart";
import StockIn from "./pages/StockIn";
import StockOut from "./pages/StockOut";
import StockOutHistory from "./pages/StockOutHistory";
import Reports from "./pages/Reports";
import Login from "./pages/Login";

function AppContent() {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && (
          <nav className="bg-blue-600 shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-white text-xl font-bold">SIMS - Stock Inventory Management</h1>
                </div>
                <div className="flex space-x-4 items-center">
                  <Link to="/dashboard" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150">
                    Dashboard
                  </Link>
                  <Link to="/sparepart" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150">
                    Spare Parts
                  </Link>
                  <Link to="/stockin" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150">
                    Stock In
                  </Link>
                  <Link to="/stockout" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150">
                    Stock Out
                  </Link>
                  <Link to="/stockout-history" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150">
                    History
                  </Link>
                  <Link to="/reports" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150">
                    Reports
                  </Link>
                  <button onClick={handleLogout} className="text-white hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/sparepart" element={<PrivateRoute><SparePart /></PrivateRoute>} />
          <Route path="/stockin" element={<PrivateRoute><StockIn /></PrivateRoute>} />
          <Route path="/stockout" element={<PrivateRoute><StockOut /></PrivateRoute>} />
          <Route path="/stockout-history" element={<PrivateRoute><StockOutHistory /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
