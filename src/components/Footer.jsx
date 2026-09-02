import { Link } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import './Footer.css';

const LOGO_URL = 'https://res.cloudinary.com/dwmjz9csc/image/upload/v1788164449/2de7b896-dddc-427f-ab62-cad4a7498b52.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo" aria-label="Clean America home">
            <img src={LOGO_URL} alt="Clean America" className="footer-logo-image" />
          </Link>
          <p>Dallas's #1 on-demand home cleaning & professional services platform. Book House Cleaning, Plumbing, HVAC & more — instantly.</p>
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
          <Link to="#">Dallas Service Areas</Link>
          <Link to="#">Terms & Conditions</Link>
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Satisfaction Guarantee</Link>
          <Link to="#">Careers</Link>
        </div>

        <div className="footer-col">
          <h4>For Customers</h4>
          <Link to="/browse">Browse Services</Link>
          <Link to="/customer/upcoming">Upcoming Jobs</Link>
          <Link to="/customer/orders">My Bookings</Link>
          <Link to="/customer/quotes">Request Quote</Link>
          <Link to="/customer/profile">My Account</Link>
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
