import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaProjectDiagram, FaUsers, FaBoxes, FaChartBar, FaBars, FaTimes } from 'react-icons/fa';
import './Navigation.css';

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-brand">
          <FaHome className="brand-icon" />
          Construction Management
        </Link>

        <button className="nav-toggle" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <FaHome className="nav-icon" /> Dashboard
          </Link>
          <Link 
            to="/projects" 
            className={`nav-link ${isActive('/projects') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <FaProjectDiagram className="nav-icon" /> Projects
          </Link>
          <Link 
            to="/workers" 
            className={`nav-link ${isActive('/workers') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <FaUsers className="nav-icon" /> Workers
          </Link>
          <Link 
            to="/materials" 
            className={`nav-link ${isActive('/materials') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <FaBoxes className="nav-icon" /> Materials
          </Link>
          <Link 
            to="/reports" 
            className={`nav-link ${isActive('/reports') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <FaChartBar className="nav-icon" /> Reports
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
