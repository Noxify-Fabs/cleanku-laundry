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

// POST /api/contact - Submit contact form
async function submitContact(req, res) {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Please provide all required fields: name, email, message'
      });
    }

    const db = await readDB();
    
    const newContact = {
      id: Date.now().toString(),
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    };

    if (!db.contacts) {
      db.contacts = [];
    }
    
    db.contacts.push(newContact);
    await writeDB(db);

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      contact: newContact
    });
  } catch (error) {
    console.error('Error submitting contact:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to submit contact form'
    });
  }
}

module.exports = {
  submitContact
};
