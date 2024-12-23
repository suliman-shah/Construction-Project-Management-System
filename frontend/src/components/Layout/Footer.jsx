import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.css"; // Make sure to import your custom CSS

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const footerElement = document.getElementById("footer");
    if (footerElement) {
      const rect = footerElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Check if the footer is in the viewport
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        setIsVisible(true);
      } else {
        setIsVisible(false); // Fade out when not in view
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <footer
      id="footer"
      className={`footer bg-dark text-white py-4 mt-auto ${
        isVisible ? "footer-fade-in" : "footer-fade-out"
      }`}
    >
      <div className="container">
        <div className="row">
          {/* Column 1: About */}
          <div className="col-md-4 mb-4">
            <h5>About Us</h5>
            <p>
              We are a leading construction project management company,
              dedicated to delivering high-quality projects with a focus on
              client satisfaction and innovation.
            </p>
          </div>
          {/* Column 2: Quick Links */}
          <div className="col-md-4 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/projects" className="text-white">
                  Projects
                </a>
              </li>
              <li>
                <a href="/tasks" className="text-white">
                  Tasks
                </a>
              </li>
              <li>
                <a href="/employees" className="text-white">
                  Employees
                </a>
              </li>
              <li>
                <a href="/inventory" className="text-white">
                  Inventory
                </a>
              </li>
              <li>
                <a href="/expenses" className="text-white">
                  Expenses
                </a>
              </li>
            </ul>
          </div>
          {/* Column 3: Contact Us */}
          <div className="col-md-4 mb-4">
            <h5>Contact Us</h5>
            <p>
              <i className="bi bi-envelope-fill"></i> info@construction.com
            </p>
            <p>
              <i className="bi bi-phone-fill"></i> +1 234 567 890
            </p>
            <p>
              <i className="bi bi-geo-alt-fill"></i> 123 Main St, City, Country
            </p>
          </div>
        </div>
        {/* Social Media Icons */}
        <div className="row text-center">
          <div className="col-12">
            <a href="#" className="text-white mx-2 footer-icon">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="text-white mx-2 footer-icon">
              <i className="bi bi-twitter"></i>
            </a>
            <a href="#" className="text-white mx-2 footer-icon">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="#" className="text-white mx-2 footer-icon">
              <i className="bi bi-linkedin"></i>
            </a>
          </div>
        </div>
        <div className="row mt-4\5">
          <div className="col-12 ">
            <img src="/logo.png" alt="logo" width={300} height={300} />
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="row mt-4">
          <div className="col-12 text-center">
            <p>
              &copy; {new Date().getFullYear()} Construction Company. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
