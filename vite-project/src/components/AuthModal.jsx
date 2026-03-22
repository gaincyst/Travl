import { useState, useEffect } from "react";
import "../styles/AuthModal.css";
import API_BASE_URL from "../utils/api.js";
import { setAuthSession } from "../utils/auth";

const AuthModal = ({ onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  useEffect(() => {
    // 🔒 Disable background scroll when modal opens
    document.body.style.overflow = "hidden";

    return () => {
      // 🔓 Enable scroll back when modal closes
      document.body.style.overflow = "auto";
    };
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(""); // Clear error when user types
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store user data and token
        setAuthSession({
          token: data.data.token,
          user: {
          userId: data.data.userId,
          name: data.data.name,
          email: data.data.email
          }
        });

        setSuccess("Login successful! Redirecting...");
        
        // Close modal after successful login
        setTimeout(() => {
          onClose();
          if (onAuthSuccess) {
            onAuthSuccess(); // Update navbar state without reload
          } else {
            window.location.reload(); // Fallback to reload
          }
        }, 1000);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms of Service");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store user data and token
        setAuthSession({
          token: data.data.token,
          user: {
          userId: data.data.userId,
          name: data.data.name,
          email: data.data.email
          }
        });

        setSuccess("Registration successful! Redirecting...");
        
        // Close modal after successful signup
        setTimeout(() => {
          onClose();
          if (onAuthSuccess) {
            onAuthSuccess(); // Update navbar state without reload
          } else {
            window.location.reload(); // Fallback to reload
          }
        }, 1000);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "login") {
      handleLogin(e);
    } else {
      handleSignup(e);
    }
  };

  // Reset form when switching modes
  const switchMode = (newMode) => {
    setMode(newMode);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    setAgreeTerms(false);
    setError("");
    setSuccess("");
  };
  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-wrapper" onClick={(e) => e.stopPropagation()}>

        <span className="auth-close" onClick={onClose}>✕</span>

        <div className="auth-left">
          <h4 className="brand">✈ TRAVEL</h4>
          <h1>EXPLORE <br /> HORIZONS</h1>
          <p className="tagline">
            Where Your Dream Destinations <br /> Become Reality.
          </p>
          <p className="desc">
            Embark on a journey where every corner <br />
            of the world is within your reach.
          </p>
        </div>

       <div className={`auth-card ${mode}`}>

          <h2 className="auth-heading">
            {mode === "login" ? "Sign In" : "Register"}
          </h2>

          <form onSubmit={handleSubmit}>
            {/* ERROR MESSAGE */}
            {error && (
              <div style={{
                padding: "10px",
                marginBottom: "15px",
                backgroundColor: "#fee",
                color: "#c33",
                borderRadius: "5px",
                fontSize: "14px",
                textAlign: "center"
              }}>
                {error}
              </div>
            )}

            {/* SUCCESS MESSAGE */}
            {success && (
              <div style={{
                padding: "10px",
                marginBottom: "15px",
                backgroundColor: "#efe",
                color: "#3c3",
                borderRadius: "5px",
                fontSize: "14px",
                textAlign: "center"
              }}>
                {success}
              </div>
            )}

            {/* NAME (SIGNUP ONLY) */}
            {mode === "signup" && (
              <>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </>
            )}

            {/* EMAIL */}
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
            />

            {/* PASSWORD */}
            <label>Password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
              />

              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  /* 👁️ eye open */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  /* 🚫 eye off (CROSSED – like your screenshot) */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.06-6.94" />
                    <path d="M1 1l22 22" />
                    <path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5a3.5 3.5 0 0 0 2.47-.97" />
                  </svg>
                )}
              </span>
            </div>

            {/* CONFIRM PASSWORD (SIGNUP ONLY) */}
            {mode === "signup" && (
              <>
                <label>Confirm Password</label>
                <div className="password-field">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="********"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                  />

                  <span
                    className="eye-icon"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.06-6.94" />
                        <path d="M1 1l22 22" />
                        <path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5a3.5 3.5 0 0 0 2.47-.97" />
                      </svg>
                    )}
                  </span>
                </div>

                <div className="terms">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    disabled={loading}
                  />
                  <span>
                    I agree with the <b>Terms Of Service</b>.
                  </span>
                </div>
              </>
            )}

            {/* LOGIN ONLY */}
            {mode === "login" && (
              <div className="forgot">Forgot password?</div>
            )}

            <button type="submit" className="signin-btn" disabled={loading}>
              {loading
                ? "Processing..."
                : mode === "login"
                ? "SIGN IN"
                : "REGISTER"}
            </button>
          </form>

          <div className="auth-divider">
            <span></span>
            <p>or</p>
            <span></span>
          </div>

          <button className="google-btn" disabled={loading}>
            <img src="./google.png" alt="Google" className="google-icon" />
            <span>
              {mode === "login"
                ? "Sign in with Google"
                : "Sign up with Google"}
            </span>
          </button>

          <p className="signup-text">
            {mode === "login" ? (
              <>
                Are you new?{" "}
                <span onClick={() => switchMode("signup")}>
                  Create an Account
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span onClick={() => switchMode("login")}>
                  Sign In
                </span>
              </>
            )}
          </p>

        </div>
      </div>
    </div>
  );
};

export default AuthModal;
