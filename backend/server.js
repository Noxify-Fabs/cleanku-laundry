const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createOrder, getOrderByNumber, getAllOrders, updateOrderStatus, togglePaymentStatus } = require('./routes/orders');
const { submitContact } = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS with dynamic origin
const allowedOrigins = [
  'http://localhost:3000',
  'https://cleanku-laundry.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only .jpg, .jpeg, and .png files are allowed'));
    }
  }
});

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'CleanKu Laundry API',
    version: '1.0.0',
    endpoints: {
      orders: {
        'POST /api/orders': 'Create new order',
        'GET /api/orders': 'Get all orders',
        'GET /api/orders/:orderNumber': 'Get order by number',
        'PUT /api/orders/:orderNumber': 'Update order status'
      },
      contact: {
        'POST /api/contact': 'Submit contact form'
      }
    }
  });
});

// Order routes
app.post('/api/orders', upload.single('paymentProof'), createOrder);
app.get('/api/orders', getAllOrders);
app.get('/api/orders/:orderNumber', getOrderByNumber);
app.put('/api/orders/:orderNumber', updateOrderStatus);
app.put('/api/orders/:orderNumber/payment-status', togglePaymentStatus);

// Contact routes
app.post('/api/contact', submitContact);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CleanKu Laundry API running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/`);
});
