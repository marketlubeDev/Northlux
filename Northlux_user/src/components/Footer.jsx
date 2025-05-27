import React from "react";
import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import Logo from "../assets/LogoFoot.svg";
import { useCategories } from "../hooks/queries/categories";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const { data: categoriesData } = useCategories();
  useEffect(() => {
    setCategories(categoriesData?.envelop?.data);
  }, [categoriesData]);
  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="newsletter">
        <div className="newsletter-content">
          <div className="newsletter-content-text">
            <h2>Stay Exclusive</h2>
            <h3>Early Access & Special Offers!</h3>
            <p>
              Join our newsletter, stay ahead with the latest trends and <br />
              exclusive deals—straight to your inbox!
            </p>
          </div>
          <div className="newsletter-content-form">
            <input type="text" placeholder="Full name" />
            <input type="email" placeholder="Email address" />
            <button type="submit">Subscribe</button>
          </div>
        </div>
      </div>

      <div className="footer-divider"></div>

      {/* Main Footer */}
      <div className="footer-main">
        {/* Brand Section */}
        <div className="footer-brand">
          <img src={Logo} alt="Mill Store Logo" />
        </div>

        <div className="footer-links-group">
          {/* Categories */}
          <div className="footer-section">
            <h4>Categories</h4>
            <ul>
              {categories?.map((category) => (
                <li
                  key={category._id}
                  onClick={() =>
                    navigate(`/products`, {
                      state: { selectedCategory: category },
                    })
                  }
                  style={{ cursor: "pointer" }}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="footer-section2">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#" className="footer-link">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Gift vouchers
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Our policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section3">
            <h4>Contact</h4>
            <ul>
              <li>
                <a href="#">Contact us</a>
              </li>
              <li className="address">
                Balan K Nair Rd,
                <br />
                Koombara, Ashokapura,
                <br />
                Kozhikode, Kerala 673004
              </li>
              <li>
                <a href="mailto:northlux@gmail.com">northlux@gmail.com</a>
              </li>
              <li>
                <a href="#">Support & FAQ</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="social-links">
          {/* <a href="#">
            <FaTwitter />
          </a> */}
          <a href="https://www.facebook.com/" target="_blank">
            <FaFacebookF />
          </a>
          <a href="https://www.instagram.com/_northlux/" target="_blank">
            <FaInstagram />
          </a>
          <a href="https://www.youtube.com/" target="_blank">
            <FaYoutube />
          </a>
        </div>

        <p>© 2025 Northlux All rights reserved</p>

        <div className="legal-links">
          <a href="/terms">Terms & Condition</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
