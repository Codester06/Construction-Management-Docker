import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaBoxes, FaDollarSign, FaTruck, FaExclamationTriangle } from 'react-icons/fa';
import axios from '../api/axios';
import './Materials.css';

function Materials() {
  const [materials, setMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Other',
    quantity: '',
    unit: 'pieces',
    pricePerUnit: '',
    supplier: '',
    lowStockThreshold: 10
  });

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get('/materials');
      setMaterials(response.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMaterial) {
        await axios.put(`/materials/${editingMaterial._id}`, formData);
      } else {
        await axios.post('/materials', formData);
      }
      fetchMaterials();
      handleClose();
    } catch (error) {
      console.error('Error saving material:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await axios.delete(`/materials/${id}`);
        fetchMaterials();
      } catch (error) {
        console.error('Error deleting material:', error);
      }
    }
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name,
      category: material.category,
      quantity: material.quantity,
      unit: material.unit,
      pricePerUnit: material.pricePerUnit,
      supplier: material.supplier || '',
      lowStockThreshold: material.lowStockThreshold
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingMaterial(null);
    setFormData({
      name: '',
      category: 'Other',
      quantity: '',
      unit: 'pieces',
      pricePerUnit: '',
      supplier: '',
      lowStockThreshold: 10
    });
  };

  const isLowStock = (material) => {
    return material.quantity <= material.lowStockThreshold;
  };

  const lowStockCount = materials.filter(isLowStock).length;

  return (
    <div className="materials-container">
      <div className="page-header">
        <h2 className="page-title">Materials</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Material
        </button>
      </div>

      {lowStockCount > 0 && (
        <div className="alert-warning">
          <FaExclamationTriangle />
          <span><strong>{lowStockCount}</strong> material(s) are running low on stock!</span>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="table-container desktop-only">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Price/Unit</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map(material => (
              <tr key={material._id} className={isLowStock(material) ? 'low-stock-row' : ''}>
                <td>{material.name}</td>
                <td>{material.category}</td>
                <td>{material.quantity}</td>
                <td>{material.unit}</td>
                <td>${material.pricePerUnit}</td>
                <td>{material.supplier || 'N/A'}</td>
                <td>
                  {isLowStock(material) ? (
                    <span className="status-badge status-danger">Low Stock</span>
                  ) : (
                    <span className="status-badge status-success">In Stock</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => handleEdit(material)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(material._id)}
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
        {materials.map(material => (
          <div key={material._id} className={`material-card ${isLowStock(material) ? 'low-stock' : ''}`}>
            <div className="card-header">
              <div className="material-info">
                <FaBoxes className="material-icon" />
                <div>
                  <h3>{material.name}</h3>
                  <p className="material-category">{material.category}</p>
                </div>
              </div>
              {isLowStock(material) ? (
                <span className="status-badge status-danger">Low Stock</span>
              ) : (
                <span className="status-badge status-success">In Stock</span>
              )}
            </div>
            <div className="card-body">
              <div className="card-info">
                <FaBoxes className="info-icon" />
                <span>{material.quantity} {material.unit}</span>
              </div>
              <div className="card-info">
                <FaDollarSign className="info-icon" />
                <span>${material.pricePerUnit} per {material.unit}</span>
              </div>
              <div className="card-info">
                <FaTruck className="info-icon" />
                <span>{material.supplier || 'No Supplier'}</span>
              </div>
            </div>
            <div className="card-actions">
              <button
                className="btn btn-edit"
                onClick={() => handleEdit(material)}
              >
                <FaEdit /> Edit
              </button>
              <button
                className="btn btn-delete"
                onClick={() => handleDelete(material._id)}
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
              <h3>{editingMaterial ? 'Edit Material' : 'Add New Material'}</h3>
              <button className="btn-close" onClick={handleClose}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Material Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Cement">Cement</option>
                  <option value="Steel">Steel</option>
                  <option value="Bricks">Bricks</option>
                  <option value="Sand">Sand</option>
                  <option value="Wood">Wood</option>
                  <option value="Paint">Paint</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  >
                    <option value="kg">kg</option>
                    <option value="ton">ton</option>
                    <option value="pieces">pieces</option>
                    <option value="bags">bags</option>
                    <option value="liters">liters</option>
                    <option value="meters">meters</option>
                    <option value="sqft">sqft</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Price Per Unit</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.pricePerUnit}
                  onChange={(e) => setFormData({...formData, pricePerUnit: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Supplier</label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Low Stock Threshold</label>
                <input
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({...formData, lowStockThreshold: e.target.value})}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMaterial ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Materials;
