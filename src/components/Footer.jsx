import { Link } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import './Footer.css';

const LOGO_URL = 'https://res.cloudinary.com/dwmjz9csc/image/upload/v1788115820/67d7f845-394b-4216-80b8-2a2548de8cab.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo" aria-label="Clean America home">
            <img src={LOGO_URL} alt="Clean America" className="footer-logo-image" />
          </Link>
          <p>India's #1 on-demand construction vehicle booking platform. Book JCBs, Cranes, Tippers & more — instantly.</p>
          <div className="footer-social">
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <Link to="#">About Us</Link>
          <Link to="#">Investor Relations</Link>
          <Link to="#">Terms & Conditions</Link>
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Anti-discrimination Policy</Link>
          <Link to="#">Careers</Link>
        </div>

        <div className="footer-col">
          <h4>For Customers</h4>
          <Link to="/browse">Browse Vehicles</Link>
          <Link to="/customer/orders">My Orders</Link>
          <Link to="#">Clean America Reviews</Link>
          <Link to="#">Categories Near You</Link>
          <Link to="#">Contact Us</Link>
        </div>

        <div className="footer-col">
          <h4>For Professionals</h4>
          <Link to="/worker/signup">Register as Operator</Link>
          <Link to="/worker/signin">Operator Sign In</Link>
          <Link to="#">Partner with Us</Link>
          <Link to="#">Operator App</Link>
          <Link to="#">Safety Guidelines</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>* As on December 31, 2024</p>
        <p>© Copyright 2026 Clean America. All rights reserved.</p>
      </div>
    </footer>
  );
}
