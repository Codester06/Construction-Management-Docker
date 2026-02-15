import React, { useState, useEffect } from 'react';
import { FaProjectDiagram, FaUsers, FaBoxes, FaExclamationTriangle } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import axios from '../api/axios';
import './Dashboard.css';

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
      backgroundColor: ['#1C4D8D', '#198754', '#dc3545'],
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="page-title">Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-content">
            <div className="stat-info">
              <h6 className="stat-label">Total Projects</h6>
              <h2 className="stat-value">{stats.totalProjects}</h2>
            </div>
            <div className="stat-icon">
              <FaProjectDiagram />
            </div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-content">
            <div className="stat-info">
              <h6 className="stat-label">Total Workers</h6>
              <h2 className="stat-value">{stats.totalWorkers}</h2>
            </div>
            <div className="stat-icon">
              <FaUsers />
            </div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-content">
            <div className="stat-info">
              <h6 className="stat-label">Total Materials</h6>
              <h2 className="stat-value">{stats.totalMaterials}</h2>
            </div>
            <div className="stat-icon">
              <FaBoxes />
            </div>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-content">
            <div className="stat-info">
              <h6 className="stat-label">Low Stock Alerts</h6>
              <h2 className="stat-value">{stats.lowStockItems}</h2>
            </div>
            <div className="stat-icon">
              <FaExclamationTriangle />
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Project Status Distribution</h3>
          <div className="chart-wrapper">
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Quick Stats</h3>
          <div className="quick-stats">
            <div className="quick-stat-item">
              <span>Ongoing Projects:</span>
              <strong className="text-primary">{stats.projectsByStatus.ongoing}</strong>
            </div>
            <div className="quick-stat-item">
              <span>Completed Projects:</span>
              <strong className="text-success">{stats.projectsByStatus.completed}</strong>
            </div>
            <div className="quick-stat-item">
              <span>Delayed Projects:</span>
              <strong className="text-danger">{stats.projectsByStatus.delayed}</strong>
            </div>
            <div className="quick-stat-item">
              <span>Active Workers:</span>
              <strong>{stats.totalWorkers}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
