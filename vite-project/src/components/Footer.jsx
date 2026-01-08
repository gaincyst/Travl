import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="site-footer glass-card">
      <div className="footer-container">
        {/* Column 1: Brand Info */}
        <div className="footer-col brand-info">
          <h2 className="footer-logo">TRAVL</h2>
          <p>Book your own Flights, Buses, Hotels</p>
           
          <p>  YOUR JOURNEY, OUR PASSION.
          </p>
          <div className="social-links">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul className="footer-links">
    <li><a href="#"><span>About Us</span></a></li>
    <li><a href="#"><span>Solutions</span></a></li>
    <li><a href="#"><span>Industries</span></a></li>
    <li><a href="#"><span>Book Your Tickets</span></a></li>
    <li><a href="#"><span>FAQ</span></a></li>
    </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div className="footer-col">
          <h3>Contact Info</h3>
          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />
            <span>123 Main St, Anytown, India</span>
          </div>
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <span>Travl.Tech.@gmail.com</span>
          </div>
          <div className="contact-item">
            <FaPhoneAlt className="contact-icon" />
            <span>+91 1234567890</span>
          </div>
          <p className="reply-note">We reply within 24 hours!</p>
        </div>

        {/* Column 4: Newsletter */}
        <div className="footer-col newsletter">
          <div className="newsletter-card">
            <h4>Stay Connected</h4>
            <p>Subscribe to our newsletter for latest updates.</p>
            <div className="subscribe-form">
              <input type="email" placeholder="Your Email" />
              <button type="button">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright © 2026, TRAVL.TECH. All Rights Reserved.</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;