import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { FaProjectDiagram, FaUsers, FaBoxes, FaExclamationTriangle } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import axios from '../api/axios';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalWorkers: 0,
    totalMaterials: 0,
    lowStockItems: 0,
    projectsByStatus: { ongoing: 0, completed: 0, delayed: 0 }
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projects, workers, materials] = await Promise.all([
        axios.get('/projects'),
        axios.get('/workers'),
        axios.get('/materials')
      ]);

      const projectsByStatus = {
        ongoing: projects.data.filter(p => p.status === 'Ongoing').length,
        completed: projects.data.filter(p => p.status === 'Completed').length,
        delayed: projects.data.filter(p => p.status === 'Delayed').length
      };

      const lowStock = materials.data.filter(m => m.quantity <= m.lowStockThreshold).length;

      setStats({
        totalProjects: projects.data.length,
        totalWorkers: workers.data.length,
        totalMaterials: materials.data.length,
        lowStockItems: lowStock,
        projectsByStatus
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const pieData = {
    labels: ['Ongoing', 'Completed', 'Delayed'],
    datasets: [{
      data: [
        stats.projectsByStatus.ongoing,
        stats.projectsByStatus.completed,
        stats.projectsByStatus.delayed
      ],
      backgroundColor: ['#0d6efd', '#198754', '#dc3545'],
    }]
  };

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="stat-card primary">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Total Projects</h6>
                  <h2>{stats.totalProjects}</h2>
                </div>
                <FaProjectDiagram size={40} className="text-primary" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="stat-card success">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Total Workers</h6>
                  <h2>{stats.totalWorkers}</h2>
                </div>
                <FaUsers size={40} className="text-success" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="stat-card warning">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Total Materials</h6>
                  <h2>{stats.totalMaterials}</h2>
                </div>
                <FaBoxes size={40} className="text-warning" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="stat-card danger">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Low Stock Alerts</h6>
                  <h2>{stats.lowStockItems}</h2>
                </div>
                <FaExclamationTriangle size={40} className="text-danger" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Project Status Distribution</Card.Title>
              <Pie data={pieData} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Quick Stats</Card.Title>
              <div className="mt-3">
                <div className="d-flex justify-content-between mb-3">
                  <span>Ongoing Projects:</span>
                  <strong className="text-primary">{stats.projectsByStatus.ongoing}</strong>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Completed Projects:</span>
                  <strong className="text-success">{stats.projectsByStatus.completed}</strong>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Delayed Projects:</span>
                  <strong className="text-danger">{stats.projectsByStatus.delayed}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Active Workers:</span>
                  <strong>{stats.totalWorkers}</strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
