import React from 'react';
import { MapPin, Phone, Instagram, Facebook, Youtube } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  const date = new Date().getFullYear();

  return (
    <footer className="bg-white text-black font-outfit">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          {/* Column 1: Logo and Contact Info */}
          <div>
            <div className="flex items-center mb-4">
              <MapPin className="w-6 h-6 mr-2 text-gray-600" />
              <h3 className="text-lg font-medium">Bloxic</h3>
            </div>
            <p className="mb-2">
              4517 Washington Ave, Manchester, Kentucky 39495
            </p>
            <p className="mb-2 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-600" />
              254 Lillian Blvd, Holbrook
            </p>
            <p className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-gray-600" />
              1-800-654-3210
            </p>
          </div>

          {/* Column 2: Furniture Categories (Unclickable) */}
          <div>
            <h3 className="text-lg font-medium mb-4">Furniture Categories</h3>
            <ul className="space-y-4">
              <li>Sofas & Couches</li>
              <li>Dining Tables & Chairs</li>
              <li>Beds & Bedroom Sets</li>
              <li>Outdoor Furniture</li>
            </ul>
          </div>

          {/* Column 3: Navigation Links */}
          <div>
            <h3 className="text-lg font-medium mb-4">Navigation</h3>
            <ul className="space-y-4">
              <li>
                <NavLink to="/" className={({ isActive }) => isActive ? "underline" : "hover:underline"}>Home</NavLink>
              </li>
              <li>
                <NavLink to="/about" className={({ isActive }) => isActive ? "underline" : "hover:underline"}>About</NavLink>
              </li>
              <li>
                <NavLink to="/manufacturing" className={({ isActive }) => isActive ? "underline" : "hover:underline"}>Manufacturing</NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={({ isActive }) => isActive ? "underline" : "hover:underline"}>Contact</NavLink>
              </li>
            </ul>
          </div>

          {/* Column 4: Service Us (Unclickable) */}
          <div>
            <h3 className="text-lg font-medium mb-4">Service Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <span className="w-2 h-2 mr-2 rounded-full bg-gray-400"></span>
                Support Center
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 mr-2 rounded-full bg-gray-400"></span>
                Term & Conditions
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 mr-2 rounded-full bg-gray-400"></span>
                Shipping
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 mr-2 rounded-full bg-gray-400"></span>
                Privacy Policy
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
     <div className="border-t bg-white py-4">
  <div className="container mx-auto px-4 flex justify-center items-center text-sm text-center">
    &copy; {date}{" "}
    <a
      href="https://bmtechx.in"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline mx-1"
    >
      BMTechx.in
    </a>
    All rights reserved.
  </div>
</div>

    </footer>
  );
};

export default Footer;