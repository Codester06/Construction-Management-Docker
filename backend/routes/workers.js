const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');

// GET all workers
router.get('/', async (req, res) => {
  try {
    const workers = await Worker.find().populate('assignedProject', 'name').sort({ createdAt: -1 });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single worker
router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).populate('assignedProject');
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create worker
router.post('/', async (req, res) => {
  const worker = new Worker(req.body);
  try {
    const newWorker = await worker.save();
    res.status(201).json(newWorker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update worker
router.put('/:id', async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json(worker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE worker
router.delete('/:id', async (req, res) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json({ message: 'Worker deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
