const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');

// Helper function to read database
async function readDB() {
  const data = await fs.readFile(DB_PATH, 'utf8');
  return JSON.parse(data);
}

// Helper function to write to database
async function writeDB(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// Generate unique order number
function generateOrderNumber() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CLK-${dateStr}-${random}`;
}

// POST /api/orders - Create new order
async function createOrder(req, res) {
  try {
    const { name, phone, address, services, weight, pickupDate, pickupTime, notes, paymentMethod, paymentType } = req.body;

    // Validation
    if (!name || !phone || !address || !services || services.length === 0 || !pickupDate || !pickupTime) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Please provide all required fields: name, phone, address, services, pickupDate, pickupTime'
      });
    }

    // Validate payment method
    if (!paymentMethod || !paymentType) {
      return res.status(400).json({ 
        error: 'Missing payment information',
        message: 'Please provide payment method and type'
      });
    }

    // Validate payment proof for non-cash payments
    if (paymentType === 'non-cash' && !req.file) {
      return res.status(400).json({ 
        error: 'Missing payment proof',
        message: 'Payment proof is required for non-cash payments'
      });
    }

    const db = await readDB();
    const orderNumber = generateOrderNumber();

    const newOrder = {
      id: orderNumber,
      name,
      phone,
      address,
      services: Array.isArray(services) ? services : [services],
      weight: weight || 0,
      pickupDate,
      pickupTime,
      notes: notes || '',
      status: 'Diterima',
      paymentMethod,
      paymentType,
      paymentProof: req.file ? req.file.filename : null,
      paymentStatus: paymentType === 'cash' ? 'paid' : 'unpaid',
      createdAt: new Date().toISOString()
    };

    db.orders.push(newOrder);
    await writeDB(db);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to create order'
    });
  }
}

// GET /api/orders/:orderNumber - Get order by order number
async function getOrderByNumber(req, res) {
  try {
    const { orderNumber } = req.params;
    const db = await readDB();
    
    const order = db.orders.find(o => o.id === orderNumber);

    if (!order) {
      return res.status(404).json({ 
        error: 'Order not found',
        message: `No order found with number: ${orderNumber}`
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch order'
    });
  }
}

// GET /api/orders - Get all orders
async function getAllOrders(req, res) {
  try {
    const db = await readDB();
    res.status(200).json({
      success: true,
      orders: db.orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch orders'
    });
  }
}

// PUT /api/orders/:orderNumber - Update order status
async function updateOrderStatus(req, res) {
  try {
    const { orderNumber } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ 
        error: 'Missing status field',
        message: 'Please provide the status to update'
      });
    }

    const validStatuses = ['Diterima', 'Dijemput', 'Dicuci', 'Disetrika', 'Siap Antar', 'Selesai'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status',
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const db = await readDB();
    const orderIndex = db.orders.findIndex(o => o.id === orderNumber);

    if (orderIndex === -1) {
      return res.status(404).json({ 
        error: 'Order not found',
        message: `No order found with number: ${orderNumber}`
      });
    }

    db.orders[orderIndex].status = status;
    await writeDB(db);

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order: db.orders[orderIndex]
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to update order'
    });
  }
}

// PUT /api/orders/:orderNumber/payment-status - Toggle payment status
async function togglePaymentStatus(req, res) {
  try {
    const { orderNumber } = req.params;
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        error: 'Missing payment status field',
        message: 'Please provide the payment status to update (paid/unpaid)'
      });
    }

    const validStatuses = ['paid', 'unpaid'];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        error: 'Invalid payment status',
        message: `Payment status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const db = await readDB();
    const orderIndex = db.orders.findIndex(o => o.id === orderNumber);

    if (orderIndex === -1) {
      return res.status(404).json({
        error: 'Order not found',
        message: `No order found with number: ${orderNumber}`
      });
    }

    db.orders[orderIndex].paymentStatus = paymentStatus;
    await writeDB(db);

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      order: db.orders[orderIndex]
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update payment status'
    });
  }
}

// DELETE /api/orders/:orderNumber - Delete order
async function deleteOrder(req, res) {
  try {
    const { orderNumber } = req.params;

    const db = await readDB();
    const orderIndex = db.orders.findIndex(o => o.id === orderNumber);

    if (orderIndex === -1) {
      return res.status(404).json({
        error: 'Order not found',
        message: `No order found with number: ${orderNumber}`
      });
    }

    db.orders.splice(orderIndex, 1);
    await writeDB(db);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete order'
    });
  }
}

// GET /api/orders/stats - Get order statistics
async function getOrderStats(req, res) {
  try {
    const db = await readDB();
    const orders = db.orders || [];
    const today = new Date().toISOString().slice(0, 10);

    const total = orders.length;
    const newOrders = orders.filter(o => o.status === 'Diterima').length;
    const inProgress = orders.filter(o =>
      ['Dijemput', 'Dicuci', 'Disetrika', 'Siap Antar'].includes(o.status)
    ).length;
    const completedToday = orders.filter(o =>
      o.status === 'Selesai' && o.createdAt && o.createdAt.startsWith(today)
    ).length;
    const unpaid = orders.filter(o => o.paymentStatus === 'unpaid').length;
    const paid = orders.filter(o => o.paymentStatus === 'paid').length;

    res.status(200).json({
      success: true,
      stats: {
        total,
        new: newOrders,
        inProgress,
        completedToday,
        unpaid,
        paid
      }
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch order statistics'
    });
  }
}

module.exports = {
  createOrder,
  getOrderByNumber,
  getAllOrders,
  updateOrderStatus,
  togglePaymentStatus,
  deleteOrder,
  getOrderStats
};
