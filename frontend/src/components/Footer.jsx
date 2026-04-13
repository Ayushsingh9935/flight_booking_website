import React from "react";
import "../App.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col">
          <h4>About IndiGo</h4>
          <p>About Us</p>
          <p>Careers</p>
          <p>Press</p>
        </div>

        <div className="footer-col">
          <h4>Travel Info</h4>
          <p>Book Flights</p>
          <p>Check-in</p>
          <p>Flight Status</p>
        </div>

        <div className="footer-col">
          <h4>Services</h4>
          <p>BluChip</p>
          <p>Offers</p>
          <p>Add-ons</p>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <p>Contact Us</p>
          <p>FAQs</p>
          <p>Feedback</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 IndiGo. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
