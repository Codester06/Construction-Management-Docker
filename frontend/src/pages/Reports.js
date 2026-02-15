import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from '../api/axios';
import './Reports.css';

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

  // Color palette for bars
  const barColors = [
    '#C9B59C', // beige-dark
    '#D9CFC7', // beige-medium
    '#EFE9E3', // beige-light
    '#86C5A8', // success
    '#E8B86D', // warning
    '#E88B7D', // danger
    '#8BA8C9', // info
    '#a89885', // text-light
  ];

  const workersByRole = workers.reduce((acc, worker) => {
    acc[worker.role] = (acc[worker.role] || 0) + 1;
    return acc;
  }, {});

  const workerRoles = Object.keys(workersByRole);
  const workerChartData = {
    labels: workerRoles,
    datasets: [{
      label: 'Workers by Role',
      data: Object.values(workersByRole),
      backgroundColor: workerRoles.map((_, index) => barColors[index % barColors.length]),
      borderColor: workerRoles.map((_, index) => barColors[index % barColors.length]),
      borderWidth: 2,
    }]
  };

  const materialsByCategory = materials.reduce((acc, material) => {
    acc[material.category] = (acc[material.category] || 0) + 1;
    return acc;
  }, {});

  const materialCategories = Object.keys(materialsByCategory);
  const materialChartData = {
    labels: materialCategories,
    datasets: [{
      label: 'Materials by Category',
      data: Object.values(materialsByCategory),
      backgroundColor: materialCategories.map((_, index) => barColors[index % barColors.length]),
      borderColor: materialCategories.map((_, index) => barColors[index % barColors.length]),
      borderWidth: 2,
    }]
  };

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSalaries = workers.reduce((sum, w) => sum + w.salary, 0);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#D9CFC7',
          font: {
            size: 12,
            family: 'Poppins'
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#D9CFC7',
          font: {
            family: 'Poppins'
          }
        },
        grid: {
          color: 'rgba(217, 207, 199, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#D9CFC7',
          font: {
            family: 'Poppins'
          }
        },
        grid: {
          color: 'rgba(217, 207, 199, 0.1)'
        }
      }
    }
  };

  return (
    <div className="reports-container">
      <h2 className="page-title">Reports & Analytics</h2>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Total Project Budget</p>
              <h2 className="stat-value">${totalBudget.toLocaleString()}</h2>
            </div>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Total Worker Salaries</p>
              <h2 className="stat-value">${totalSalaries.toLocaleString()}</h2>
            </div>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Active Projects</p>
              <h2 className="stat-value">{projects.filter(p => p.status === 'Ongoing').length}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Worker Distribution by Role</h3>
          <div className="chart-wrapper">
            <Bar data={workerChartData} options={chartOptions} />
          </div>
        </div>
        <div className="chart-card">
          <h3 className="chart-title">Material Distribution by Category</h3>
          <div className="chart-wrapper">
            <Bar data={materialChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="table-section">
        <div className="table-card">
          <h3 className="table-title">Project Summary</h3>
          <div className="table-container">
            <table>
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
                    <td>
                      <span className={`status-badge status-${project.status.toLowerCase()}`}>
                        {project.status}
                      </span>
                    </td>
                    <td>${project.budget.toLocaleString()}</td>
                    <td>{new Date(project.startDate).toLocaleDateString()}</td>
                    <td>{project.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
