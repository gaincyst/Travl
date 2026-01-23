import "../styles/AuthModal.css";

const AuthModal = ({ onClose }) => {
  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-wrapper" onClick={(e) => e.stopPropagation()}>

        {/* Close */}
        <span className="auth-close" onClick={onClose}>✕</span>

        {/* LEFT CONTENT */}
        <div className="auth-left">
          <h4 className="brand">✈ TRAVEL</h4>
          <h1>
            EXPLORE <br /> HORIZONS
          </h1>
          <p className="tagline">
            Where Your Dream Destinations <br />
            Become Reality.
          </p>
          <p className="desc">
            Embark on a journey where every corner <br />
            of the world is within your reach.
          </p>
        </div>

        {/* RIGHT GLASS CARD */}
        <div className="auth-card">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />

          <label>Password</label>
          <input type="password" placeholder="********" />

          <div className="forgot">Forgot password?</div>

          <button className="signin-btn">SIGN IN</button>

          <div className="auth-divider">
            <span></span>
            <p>or</p>
            <span></span>
          </div>

          <button className="google-btn">
           
            Sign in with Google
          </button>

          <p className="signup-text">
            Are you new? <span>Create an Account</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
