import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Badge, Alert } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import axios from '../api/axios';

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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Materials</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" />
          Add Material
        </Button>
      </div>

      {lowStockCount > 0 && (
        <Alert variant="warning" className="d-flex align-items-center">
          <FaExclamationTriangle className="me-2" />
          <strong>{lowStockCount}</strong> material(s) are running low on stock!
        </Alert>
      )}

      <Card>
        <Card.Body>
          <Table responsive hover>
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
                <tr key={material._id} className={isLowStock(material) ? 'table-warning' : ''}>
                  <td>{material.name}</td>
                  <td>{material.category}</td>
                  <td>{material.quantity}</td>
                  <td>{material.unit}</td>
                  <td>${material.pricePerUnit}</td>
                  <td>{material.supplier || 'N/A'}</td>
                  <td>
                    {isLowStock(material) ? (
                      <Badge bg="danger">Low Stock</Badge>
                    ) : (
                      <Badge bg="success">In Stock</Badge>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(material)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(material._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingMaterial ? 'Edit Material' : 'Add New Material'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Material Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
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
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Unit</Form.Label>
              <Form.Select
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
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price Per Unit</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.pricePerUnit}
                onChange={(e) => setFormData({...formData, pricePerUnit: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Supplier</Form.Label>
              <Form.Control
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({...formData, supplier: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Low Stock Threshold</Form.Label>
              <Form.Control
                type="number"
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({...formData, lowStockThreshold: e.target.value})}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleClose} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingMaterial ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Materials;
