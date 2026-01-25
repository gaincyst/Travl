import { useState, useEffect } from "react";
import "../styles/AuthModal.css";

const AuthModal = ({ onClose }) => {
  const [mode, setMode] = useState("login");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
useEffect(() => {
  // 🔒 Disable background scroll when modal opens
  document.body.style.overflow = "hidden";

  return () => {
    // 🔓 Enable scroll back when modal closes
    document.body.style.overflow = "auto";
  };
}, []);
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

          {/* NAME (SIGNUP ONLY) */}
          {mode === "signup" && (
            <>
              <label>Name</label>
              <input type="text" placeholder="Enter Full Name" />
            </>
          )}

          {/* EMAIL */}
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />

          {/* PASSWORD */}
          <label>Password</label>
<div className="password-field">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="********"
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


          {/* CONFIRM PASSWORD (SIGNUP ONLY, ONLY ONCE) */}
          {mode === "signup" && (
            <>
             <label>Confirm Password</label>
<div className="password-field">
  <input
    type={showConfirm ? "text" : "password"}
    placeholder="********"
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
                <input type="checkbox" />
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

          <button className="signin-btn">
            {mode === "login" ? "SIGN IN" : "REGISTER"}
          </button>

          <div className="auth-divider">
            <span></span>
            <p>or</p>
            <span></span>
          </div>

          <button className="google-btn">
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
                <span onClick={() => setMode("signup")}>
                  Create an Account
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span onClick={() => setMode("login")}>
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
