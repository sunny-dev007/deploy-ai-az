const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const auth = require('../middleware/auth');

// Customer routes
router.get('/customers', customerController.getAllCustomers);
router.get('/customers/:id', customerController.getCustomerById);
router.post('/customers', auth.authenticate, customerController.createCustomer);
router.put('/customers/:id', auth.authenticate, customerController.updateCustomer);
router.delete('/customers/:id', auth.authenticate, customerController.deleteCustomer);

// Test endpoint
router.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

module.exports = router; 