require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userModel = require('./User_model');
const dishModel = require('./Mat_rätter_model');
const { sendReceiptEmail } = require('./emailService');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
};

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Mat API running' });
});

// ==================== USERS ROUTES ====================

// GET all users
app.get('/api/users', async (req, res, next) => {
  try {
    const users = await userModel.getUser();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

// GET single user by username
app.get('/api/users/:userName', async (req, res, next) => {
  try {
    const user = await userModel.getUserByName(req.params.userName);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

// CREATE user
app.post('/api/users', async (req, res, next) => {
  try {
    const user = await userModel.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// UPDATE user
app.put('/api/users/:userName', async (req, res, next) => {
  try {
    const user = await userModel.updateUser(req.params.userName, req.body);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

// DELETE user
app.delete('/api/users/:userName', async (req, res, next) => {
  try {
    const result = await userModel.deleteUser(req.params.userName);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// LOGIN user
app.post('/api/login', async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await userModel.loginUser(userName, password);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

// ==================== DISHES ROUTES ====================

// GET all dishes
app.get('/api/dishes', async (req, res, next) => {
  try {
    const dishes = await dishModel.getDishes();
    res.status(200).json(dishes);
  } catch (err) {
    next(err);
  }
});

// GET single dish by name
app.get('/api/dishes/:matNamn', async (req, res, next) => {
  try {
    const dish = await dishModel.getDishByName(req.params.matNamn);
    res.status(200).json(dish);
  } catch (err) {
    next(err);
  }
});

// CREATE dish
app.post('/api/dishes', async (req, res, next) => {
  try {
    const dish = await dishModel.createDish(req.body);
    res.status(201).json(dish);
  } catch (err) {
    next(err);
  }
});

// UPDATE dish
app.put('/api/dishes/:matNamn', async (req, res, next) => {
  try {
    const dish = await dishModel.updateDish(req.params.matNamn, req.body);
    res.status(200).json(dish);
  } catch (err) {
    next(err);
  }
});

// DELETE dish
app.delete('/api/dishes/:matNamn', async (req, res, next) => {
  try {
    const result = await dishModel.deleteDish(req.params.matNamn);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// ==================== EMAIL ROUTES ====================

// SEND receipt email
app.post('/api/send-receipt', async (req, res, next) => {
  try {
    const { customerEmail, customerName, cartItems, totalAmount, orderId } = req.body;

    if (!customerEmail || !customerName || !cartItems || !totalAmount) {
      return res.status(400).json({ error: 'Missing required fields: customerEmail, customerName, cartItems, totalAmount' });
    }

    const result = await sendReceiptEmail(
      customerEmail,
      customerName,
      cartItems,
      totalAmount,
      orderId || `ORD-${Date.now()}`
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// Error handling
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`app running on port: ${port}.`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server terminated');
    process.exit(0);
  });
});