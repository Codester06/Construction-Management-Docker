import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaUser, FaPhone, FaBriefcase, FaDollarSign } from 'react-icons/fa';
import axios from '../api/axios';
import './Workers.css';

function Workers() {
  const [workers, setWorkers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Labor',
    phone: '',
    email: '',
    assignedProject: '',
    salary: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchWorkers();
    fetchProjects();
  }, []);

  const fetchWorkers = async () => {
    try {
      const response = await axios.get('/workers');
      setWorkers(response.data);
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingWorker) {
        await axios.put(`/workers/${editingWorker._id}`, formData);
      } else {
        await axios.post('/workers', formData);
      }
      fetchWorkers();
      handleClose();
    } catch (error) {
      console.error('Error saving worker:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        await axios.delete(`/workers/${id}`);
        fetchWorkers();
      } catch (error) {
        console.error('Error deleting worker:', error);
      }
    }
  };

  const handleEdit = (worker) => {
    setEditingWorker(worker);
    setFormData({
      name: worker.name,
      role: worker.role,
      phone: worker.phone,
      email: worker.email || '',
      assignedProject: worker.assignedProject?._id || '',
      salary: worker.salary,
      status: worker.status
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingWorker(null);
    setFormData({
      name: '',
      role: 'Labor',
      phone: '',
      email: '',
      assignedProject: '',
      salary: '',
      status: 'Active'
    });
  };

  const getStatusClass = (status) => {
    const classes = {
      'Active': 'status-success',
      'Inactive': 'status-secondary',
      'On Leave': 'status-warning'
    };
    return classes[status] || 'status-secondary';
  };

  return (
    <div className="workers-container">
      <div className="page-header">
        <h2 className="page-title">Workers</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Worker
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="table-container desktop-only">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Assigned Project</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workers.map(worker => (
              <tr key={worker._id}>
                <td>{worker.name}</td>
                <td>{worker.role}</td>
                <td>{worker.phone}</td>
                <td>{worker.assignedProject?.name || 'Not Assigned'}</td>
                <td>${worker.salary.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(worker.status)}`}>
                    {worker.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => handleEdit(worker)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(worker._id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="cards-container mobile-only">
        {workers.map(worker => (
          <div key={worker._id} className="worker-card">
            <div className="card-header">
              <div className="worker-info">
                <FaUser className="worker-avatar" />
                <div>
                  <h3>{worker.name}</h3>
                  <p className="worker-role">{worker.role}</p>
                </div>
              </div>
              <span className={`status-badge ${getStatusClass(worker.status)}`}>
                {worker.status}
              </span>
            </div>
            <div className="card-body">
              <div className="card-info">
                <FaPhone className="info-icon" />
                <span>{worker.phone}</span>
              </div>
              <div className="card-info">
                <FaBriefcase className="info-icon" />
                <span>{worker.assignedProject?.name || 'Not Assigned'}</span>
              </div>
              <div className="card-info">
                <FaDollarSign className="info-icon" />
                <span>${worker.salary.toLocaleString()}</span>
              </div>
            </div>
            <div className="card-actions">
              <button
                className="btn btn-edit"
                onClick={() => handleEdit(worker)}
              >
                <FaEdit /> Edit
              </button>
              <button
                className="btn btn-delete"
                onClick={() => handleDelete(worker._id)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingWorker ? 'Edit Worker' : 'Add New Worker'}</h3>
              <button className="btn-close" onClick={handleClose}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="Engineer">Engineer</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Labor">Labor</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Mason">Mason</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Assigned Project</label>
                <select
                  value={formData.assignedProject}
                  onChange={(e) => setFormData({...formData, assignedProject: e.target.value})}
                >
                  <option value="">Not Assigned</option>
                  {projects.map(project => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Salary</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingWorker ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Workers;
