import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaHome, FaProjectDiagram, FaUsers, FaBoxes, FaChartBar } from 'react-icons/fa';

function Navigation() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <FaHome className="me-2" />
          Construction Management
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              <FaHome className="me-1" /> Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/projects">
              <FaProjectDiagram className="me-1" /> Projects
            </Nav.Link>
            <Nav.Link as={Link} to="/workers">
              <FaUsers className="me-1" /> Workers
            </Nav.Link>
            <Nav.Link as={Link} to="/materials">
              <FaBoxes className="me-1" /> Materials
            </Nav.Link>
            <Nav.Link as={Link} to="/reports">
              <FaChartBar className="me-1" /> Reports
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
