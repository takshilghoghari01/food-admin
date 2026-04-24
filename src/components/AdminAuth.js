import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminAuth = ({ setIsAuthenticated, setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regUsernameError, setRegUsernameError] = useState("");
  const [regEmailError, setRegEmailError] = useState("");
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username) => {
    return username.trim().length >= 2;
  };

  // Handlers for switching forms
  const switchToRegister = () => {
    setIsLogin(false);
    setLoginError("");
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setRegUsernameError("");
    setRegEmailError("");
  };

  // Login form submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setLoginError("Please enter a valid email address.");
      return;
    }
    setLoginError("");
    setLoading(true);
    try {
      await axios.post(
        "/api/admin/auth/login",
        { email, password },
        { withCredentials: true }
      );
      setIsAuthenticated(true);
      // Fetch user profile after login
      const profileResponse = await axios.get(
        "/api/admin/auth/profile",
        { withCredentials: true }
      );
      setUser(profileResponse.data);
      navigate("/dashboard");
    } catch (error) {
      setLoginError(error.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  // Register form submit with backend API
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    if (!validateUsername(regUsername)) {
      setRegUsernameError("Username must be at least 2 characters.");
      valid = false;
    } else {
      setRegUsernameError("");
    }
    if (!validateEmail(regEmail)) {
      setRegEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setRegEmailError("");
    }
    if (!valid) return;

    setLoading(true);
    try {
      await axios.post(
        "/api/admin/auth/register",
        { username: regUsername.trim(), email: regEmail.trim(), password },
        { withCredentials: true }
      );
      // After successful registration, auto login and fetch profile
      setIsAuthenticated(true);
      const profileResponse = await axios.get(
        "/api/admin/auth/profile",
        { withCredentials: true }
      );
      setUser(profileResponse.data);
      navigate("/dashboard");
    } catch (error) {
      setRegEmailError(error.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  // Modal button handlers
  const handleModalRegister = () => {
    setShowNewUserModal(false);
    setIsLogin(false);
    setRegEmail(email);
    setRegUsername("");
  };

  const handleModalCancel = () => {
    setShowNewUserModal(false);
    setEmail("");
  };

  return (
    <div
      className="access-container"
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "40px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <div className="panel-header" style={{ marginBottom: "30px" }}>
        <h2
          id="panel-title"
          style={{ color: "#333", fontSize: "1.8em", marginBottom: "5px" }}
        >
          {isLogin ? "Admin Login" : "Admin Registration"}
        </h2>
        <p id="panel-subtitle" style={{ color: "#6c757d", fontSize: "1em" }}>
          {isLogin ? "Log in to your admin panel." : ""}
        </p>
      </div>

      <div
        className="form-panel"
        style={{
          position: "relative",
          height: "400px",
          overflow: "hidden",
          margin: "0 -40px",
        }}
      >
        {/* Login Form */}
        <form
          onSubmit={handleLoginSubmit}
          className={`auth-form ${isLogin ? "active" : "hidden"}`}
          style={{
            transition: "opacity 0.3s ease, transform 0.3s ease",
            position: "absolute",
            width: "100%",
            maxWidth: "400px",
            left: 0,
            padding: "0 40px",
            opacity: 1,
            pointerEvents: "auto",
            transform: isLogin ? "translateX(0%)" : "translateX(-100%)",
            zIndex: isLogin ? 2 : 1,
          }}
        >
          <div
            className="form-group"
            style={{ marginBottom: "5px", textAlign: "left" }}
          >
            <label
              htmlFor="login-email"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                color: "#555",
                fontSize: "0.95em",
              }}
            >
              <i
                className="fas fa-envelope"
                style={{ marginRight: "8px", color: "#007bff" }}
              ></i>{" "}
              Email Address
            </label>
            <input
              type="email"
              id="login-email"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 15px",
                border: "1px solid #ced4da",
                borderRadius: "6px",
                fontSize: "1em",
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
            />
          </div>
          <div
            className="form-group"
            style={{ marginBottom: "10px", textAlign: "left" }}
          >
            <label
              htmlFor="login-password"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                color: "#555",
                fontSize: "0.95em",
              }}
            >
              Password
            </label>
            <input
              type="password"
              id="login-password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 15px",
                border: "1px solid #ced4da",
                borderRadius: "6px",
                fontSize: "1em",
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
            />
            <small
              className="error-text"
              style={{
                color: "#dc3545",
                fontSize: "0.85em",
                marginTop: "5px",
                height: "1.2em",
                display: "block",
              }}
            >
              {loginError}
            </small>
          </div>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "1.1em",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background-color 0.3s, transform 0.1s",
              marginTop: "10px",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p
            className="switch-link"
            style={{
              marginTop: "20px",
              fontSize: "0.9em",
              color: "#6c757d",
              overflow: "visible",
            }}
          >
            New admin?{" "}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                switchToRegister();
              }}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
                color: "#007bff",
                textDecoration: "none",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "inherit",
                fontFamily: "inherit",
              }}
            >
              Register here
            </button>
          </p>
        </form>

        {/* Register Form */}
        <form
          onSubmit={handleRegisterSubmit}
          className={`auth-form ${!isLogin ? "active" : "hidden"}`}
          style={{
            transition: "opacity 0.3s ease, transform 0.3s ease",
            position: "absolute",
            width: "100%",
            maxWidth: "400px",
            left: 0,
            padding: "0 40px",
            opacity: 1,
            pointerEvents: "auto",
            transform: !isLogin ? "translateX(0%)" : "translateX(100%)",
            zIndex: !isLogin ? 2 : 1,
          }}
        >
          <div
            className="form-group"
            style={{ marginBottom: "10px", textAlign: "left" }}
          >
            <label
              htmlFor="reg-username"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                color: "#555",
                fontSize: "0.95em",
              }}
            >
              <i
                className="fas fa-user"
                style={{ marginRight: "8px", color: "#007bff" }}
              ></i>{" "}
              Username
            </label>
            <input
              type="text"
              id="reg-username"
              placeholder="Enter your username"
              required
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 15px",
                border: "1px solid #ced4da",
                borderRadius: "6px",
                fontSize: "1em",
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
            />
            <small
              className="error-text"
              style={{
                color: "#dc3545",
                fontSize: "0.85em",
                marginTop: "5px",
                height: "1.2em",
                display: "block",
              }}
            >
              {regUsernameError}
            </small>
          </div>

          <div
            className="form-group"
            style={{ marginBottom: "5px", textAlign: "left" }}
          >
            <label
              htmlFor="reg-email"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                color: "#555",
                fontSize: "0.95em",
              }}
            >
              <i
                className="fas fa-envelope"
                style={{ marginRight: "8px", color: "#007bff" }}
              ></i>{" "}
              Email Address
            </label>
            <input
              type="email"
              id="reg-email"
              placeholder="Enter your email address"
              required
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 15px",
                border: "1px solid #ced4da",
                borderRadius: "6px",
                fontSize: "1em",
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
            />
            <small
              className="error-text"
              style={{
                color: "#dc3545",
                fontSize: "0.85em",
                marginTop: "5px",
                height: "1.2em",
                display: "block",
              }}
            >
              {regEmailError}
            </small>
          </div>
          <div
            className="form-group"
            style={{ marginBottom: "5px", textAlign: "left" }}
          >
            <label
              htmlFor="reg-password"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                color: "#555",
                fontSize: "0.95em",
              }}
            >
              Password
            </label>
            <input
              type="password"
              id="reg-password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 15px",
                border: "1px solid #ced4da",
                borderRadius: "6px",
                fontSize: "1em",
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
            />
          </div>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "1.1em",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background-color 0.3s, transform 0.1s",
              marginTop: "10px",
            }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <p
            className="switch-link"
            style={{ marginTop: "20px", fontSize: "0.9em", color: "#6c757d" }}
          >
            Already have an account?{" "}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                switchToLogin();
              }}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
                color: "#007bff",
                textDecoration: "none",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "inherit",
                fontFamily: "inherit",
              }}
            >
              Login here
            </button>
          </p>
        </form>
      </div>

      {/* New User Modal */}
      {showNewUserModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "8px",
              textAlign: "center",
              maxWidth: "350px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            <div
              className="modal-icon"
              style={{
                color: "#dc3545",
                fontSize: "3em",
                marginBottom: "15px",
              }}
            >
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <h3 style={{ marginBottom: "10px", color: "#333" }}>
              New Admin Detected!
            </h3>
            <p style={{ marginBottom: "25px", color: "#6c757d" }}>
              Your email is not in our system. Please register your details to
              continue.
            </p>
            <button
              id="modal-register-btn"
              className="modal-btn"
              onClick={handleModalRegister}
              style={{
                padding: "10px 20px",
                margin: "0 5px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: 600,
                backgroundColor: "#007bff",
                color: "white",
                transition: "background-color 0.3s",
              }}
            >
              Go to Registration
            </button>
            <button
              id="modal-cancel-btn"
              className="modal-btn cancel-btn"
              onClick={handleModalCancel}
              style={{
                padding: "10px 20px",
                margin: "0 5px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: 600,
                backgroundColor: "#6c757d",
                color: "white",
                transition: "background-color 0.3s",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuth;
