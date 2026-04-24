import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Dashboard from "./components/Dashboard";
import Customers from "./components/Customers";
import MenuItems from "./components/MenuItems";
import Orders from "./components/Orders";
import Payments from "./components/Payments";
import AdminAuth from "./components/AdminAuth";
import OrderHistory from "./components/OrderHistory";
import "./App.css";


// ✅ Set base URL (MAIN FIX)
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// Configure axios to send credentials with requests
axios.defaults.withCredentials = true;

function App() {
  const [showDetails, setShowDetails] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userResponse = await axios.get(
          "/api/admin/auth/profile"
        );
        setIsAuthenticated(true);
        setUser(userResponse.data);
      } catch (err) {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
    setShowDetails(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 via-yellow-500 to-red-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {isAuthenticated ? (
        <div className="flex h-screen overflow-hidden">
          <div className="bg-gradient-to-b from-blue-500 to-blue-400 text-white w-64 flex-shrink-0 hidden md:flex flex-col">
            <div className="p-6">
              <h1 className="text-2xl font-bold">
                Food <span className="text-yellow-300">Admin</span>
              </h1>
            </div>
            <nav className="flex-1 px-4 space-y-2">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition ${
                    isActive ? "bg-blue-600" : "hover:bg-blue-700"
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/customers"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition ${
                    isActive ? "bg-blue-600" : "hover:bg-blue-700"
                  }`
                }
              >
                Customers
              </NavLink>
              <NavLink
                to="/menu-items"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition ${
                    isActive ? "bg-blue-600" : "hover:bg-blue-700"
                  }`
                }
              >
                Menu Items
              </NavLink>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition ${
                    isActive ? "bg-blue-600" : "hover:bg-blue-700"
                  }`
                }
              >
                Orders
              </NavLink>
              <NavLink
                to="/order-history"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition ${
                    isActive ? "bg-blue-600" : "hover:bg-blue-700"
                  }`
                }
              >
                Order History
              </NavLink>
              <NavLink
                to="/payments"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition ${
                    isActive ? "bg-blue-600" : "hover:bg-blue-700"
                  }`
                }
              >
                Payments
              </NavLink>
            </nav>
            <div
              className="p-4 border-t border-blue-400/50 flex items-center cursor-pointer"
              onClick={() => setShowDetails(!showDetails)}
            >
              <img
                src="https://placehold.co/80x80?text=Admin"
                alt="Admin Profile"
                className="rounded-full w-10 h-10 mr-3"
              />
              <div>
                <p className="font-medium">{user?.username || "Admin User"}</p>
                <p className="text-xs text-blue-100">
                  {user?.email || "admin@foodwebsite.com"}
                </p>
              </div>
            </div>
            {showDetails && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white shadow-2xl rounded-lg p-6 w-96 max-w-md relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowDetails(false)}
                  >
                    ✕
                  </button>
                  <img
                    src="https://placehold.co/80x80?text=Admin"
                    alt="Admin Profile"
                    className="rounded-full w-16 h-16 mx-auto mb-4"
                  />
                  <h2 className="text-center text-xl font-bold text-gray-800 mb-2">
                    {user?.username || "Admin User"}
                  </h2>
                  <p className="text-center text-gray-600 mb-1">
                    {user?.email || "admin@foodwebsite.com"}
                  </p>
                  <p className="text-center text-sm text-gray-500 mb-4">
                    Last Login:{" "}
                    {user?.lastLogin
                      ? new Date(user.lastLogin).toLocaleString()
                      : "Never"}
                  </p>
                  <button
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                    onClick={async () => {
                      try {
                        await axios.post(
                          "/api/admin/auth/logout"
                        );
                      } catch (error) {
                        console.error("Logout error:", error);
                      }
                      setIsAuthenticated(false);
                      setShowDetails(false);
                      window.location.href = "/login";
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/menu-items" element={<MenuItems />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      ) : (
        <Routes>
          <Route
            path="/login"
            element={
              <AdminAuth
                setIsAuthenticated={setIsAuthenticated}
                setUser={setUser}
              />
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
