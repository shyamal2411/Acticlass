const express = require('express');
const router = express.Router();
const userRoutes = require('../controllers/users/index.routes');

router.use('/users', userRoutes);

module.exports = router;
