import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import axios from '../api/axios';

function Reports() {
  const [projects, setProjects] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, workersRes, materialsRes] = await Promise.all([
        axios.get('/projects'),
        axios.get('/workers'),
        axios.get('/materials')
      ]);
      setProjects(projectsRes.data);
      setWorkers(workersRes.data);
      setMaterials(materialsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const workersByRole = workers.reduce((acc, worker) => {
    acc[worker.role] = (acc[worker.role] || 0) + 1;
    return acc;
  }, {});

  const workerChartData = {
    labels: Object.keys(workersByRole),
    datasets: [{
      label: 'Workers by Role',
      data: Object.values(workersByRole),
      backgroundColor: '#0d6efd',
    }]
  };

  const materialsByCategory = materials.reduce((acc, material) => {
    acc[material.category] = (acc[material.category] || 0) + 1;
    return acc;
  }, {});

  const materialChartData = {
    labels: Object.keys(materialsByCategory),
    datasets: [{
      label: 'Materials by Category',
      data: Object.values(materialsByCategory),
      backgroundColor: '#198754',
    }]
  };

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSalaries = workers.reduce((sum, w) => sum + w.salary, 0);

  return (
    <div>
      <h2 className="mb-4">Reports & Analytics</h2>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <h6 className="text-muted">Total Project Budget</h6>
              <h2 className="text-primary">${totalBudget.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h6 className="text-muted">Total Worker Salaries</h6>
              <h2 className="text-success">${totalSalaries.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h6 className="text-muted">Active Projects</h6>
              <h2 className="text-warning">{projects.filter(p => p.status === 'Ongoing').length}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Worker Distribution by Role</Card.Title>
              <Bar data={workerChartData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Material Distribution by Category</Card.Title>
              <Bar data={materialChartData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Project Summary</Card.Title>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Status</th>
                    <th>Budget</th>
                    <th>Start Date</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project._id}>
                      <td>{project.name}</td>
                      <td>{project.status}</td>
                      <td>${project.budget.toLocaleString()}</td>
                      <td>{new Date(project.startDate).toLocaleDateString()}</td>
                      <td>{project.location}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Reports;
