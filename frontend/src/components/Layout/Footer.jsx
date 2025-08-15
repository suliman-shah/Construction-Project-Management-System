import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Add or remove animation class based on visibility
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          } else {
            entry.target.classList.remove("animate");
          }
        });
      },
      {
        threshold: 0.2, // 20% of the footer must be visible
        rootMargin: "50px", // Adds margin to trigger animation earlier
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    // Cleanup observer on component unmount
    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <footer ref={footerRef} className="footer footer-glass">
      <div className="container">
        <div className="footer-content">
          {/* Logo and About Section */}
          <div className="footer-section" style={{ "--section-index": 0 }}>
            <Link to="/" className="footer-logo">
              CPMS
            </Link>
            <p className="footer-description">
              Providing professional construction management solutions with
              excellence and innovation.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section" style={{ "--section-index": 1 }}>
            <h5>Quick Links</h5>
            <ul className="footer-links">
              <li>
                <Link to="/projects">Projects</Link>
              </li>
              <li>
                <Link to="/tasks">Tasks</Link>
              </li>
              <li>
                <Link to="/employees">Employees</Link>
              </li>
              <li>
                <Link to="/inventory">Inventory</Link>
              </li>
            </ul>
          </div>

          {/* Services Section */}
          <div className="footer-section" style={{ "--section-index": 2 }}>
            <h5>Services</h5>
            <ul className="footer-links">
              <li>
                <Link to="/inventory">Inventory Management</Link>
              </li>
              {/* <li>
                <Link to="/suppliers">Supplier Network</Link>
              </li> */}
              <li>
                <Link to="/expenses">Financial Tracking</Link>
              </li>
              <li>
                <Link to="/ProjectResources">Resource Planning</Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-section" style={{ "--section-index": 3 }}>
            <h5>Contact Us</h5>
            <div className="contact-info">
              <i className="bi bi-geo-alt"></i>
              <span>
                Near University of Malakand, Batkhela, Malakand Division, KPK,
                Pakistan
              </span>
            </div>
            <div className="contact-info">
              <i className="bi bi-envelope"></i>
              <span>contact@CPMS.com</span>
            </div>
            <div className="contact-info">
              <i className="bi bi-telephone"></i>
              <span>+1 234 567 890</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="social-links">
            <a href="#" className="footer-icon">
              <i className="bi bi-linkedin"></i>
            </a>
            <a href="#" className="footer-icon">
              <i className="bi bi-twitter"></i>
            </a>
            <a href="#" className="footer-icon">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="footer-icon">
              <i className="bi bi-instagram"></i>
            </a>
          </div>
          <div className="copyright">
            <p>&copy; {new Date().getFullYear()} CPMS. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
