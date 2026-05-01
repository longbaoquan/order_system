const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/order_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('Order Management System Backend');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});