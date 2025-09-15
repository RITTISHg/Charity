require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();

// Middleware
app.use(cors({
    origin: config.CORS_ORIGIN,
    credentials: true
}));
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

mongoose.connect(process.env.MONGODB_URI)

  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  
const charitySchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,  
  location: String,
});

const pickupSchema = new mongoose.Schema({
  donorName: String,
  location: String,
  items: String,
  preferredDate: String,
  contact: String,
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'completed'],
    default: 'pending'
  },
  notes: String,
  charityId: mongoose.Schema.Types.ObjectId
});

const Charity = mongoose.model('Charity', charitySchema);
const Pickup = mongoose.model('Pickup', pickupSchema);

const formDataSchema = new mongoose.Schema({
  type: String,
  bags: Number,
  helpGroups: [String],
  location: String,
  organisation: String,
  street: String,
  city: String,
  postcode: String,
  phone: String,
  day: String,
  time: String,
  notes: String,
}, { collection: 'donation_data_fetched' });

const FormData = mongoose.model('FormData', formDataSchema);

app.post('/api/saveFormData', async (req, res) => {
  const formData = req.body;

  if (!formData) {
    return res.status(400).json({ message: 'No form data provided' });
  }

  try {
    // Save to FormData collection
    const newFormData = new FormData(formData);
    await newFormData.save();

    // Create a pickup record
    const pickup = new Pickup({
      donorName: formData.organisation || 'Anonymous',
      location: `${formData.street}, ${formData.city}, ${formData.postcode}`,
      items: `${formData.type} (${formData.bags} bags)`,
      preferredDate: `${formData.day} ${formData.time}`,
      contact: formData.phone,
      status: 'pending',
      notes: formData.notes
    });
    await pickup.save();

    console.log('Form data and pickup saved:', formData);
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Failed to save data' });
  }
});

// New Endpoint to Fetch Form Data for Admin
app.get('/api/getFormData', async (req, res) => {
  try {
    const data = await FormData.find({});
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching form data:', error);
    res.status(500).json({ message: 'Failed to fetch form data' });
  }
});

// Charity Authentication
app.post('/api/charity/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const charity = await Charity.findOne({ email });
    if (!charity) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // In production, use proper password comparison
    if (charity.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.status(200).json({ 
      id: charity._id,
      name: charity.name,
      email: charity.email,
      location: charity.location
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pickups for a charity
app.get('/api/charity/pickups', async (req, res) => {
  try {
    // First, let's check if we have any pickups
    const count = await Pickup.countDocuments();
    console.log(`Found ${count} pickups in database`);
    
    const pickups = await Pickup.find({});
    console.log('Pickups retrieved:', pickups);
    
    if (!pickups || pickups.length === 0) {
      // If no pickups found, create some sample data
      const samplePickups = [
        {
          donorName: 'John Doe',
          location: '123 Main St, Demo City, 12345',
          items: 'Clothes, Books',
          preferredDate: 'Monday 10:00 AM',
          contact: '555-0123',
          status: 'pending'
        },
        {
          donorName: 'Jane Smith',
          location: '456 Oak Ave, Demo City, 12345',
          items: 'Furniture, Electronics',
          preferredDate: 'Tuesday 2:00 PM',
          contact: '555-0124',
          status: 'scheduled'
        },
        {
          donorName: 'Bob Wilson',
          location: '789 Pine Rd, Demo City, 12345',
          items: 'Toys, Kitchen Items',
          preferredDate: 'Wednesday 3:00 PM',
          contact: '555-0125',
          status: 'completed'
        }
      ];

      const createdPickups = await Pickup.insertMany(samplePickups);
      console.log('Created sample pickups:', createdPickups);
      return res.status(200).json(createdPickups);
    }

    res.status(200).json(pickups);
  } catch (error) {
    console.error('Error fetching pickups:', error);
    res.status(500).json({ 
      message: 'Failed to fetch pickups',
      error: error.message 
    });
  }
});

// Update pickup status
app.patch('/api/charity/pickups/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const pickup = await Pickup.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup not found' });
    }
    
    res.status(200).json(pickup);
  } catch (error) {
    console.error('Error updating pickup:', error);
    res.status(500).json({ message: 'Failed to update pickup' });
  }
});



// Add sample data route
app.post('/api/sample-data', async (req, res) => {
  try {
    // Create sample charity
    const charity = new Charity({
      name: 'Demo Charity',
      email: 'charity@demo.com',
      password: 'charity123',
      location: 'Demo City'
    });
    await charity.save();

    // Create sample pickups
    const samplePickups = [
      {
        donorName: 'John Doe',
        location: '123 Main St, Demo City, 12345',
        items: 'Clothes, Books',
        preferredDate: 'Monday 10:00 AM',
        contact: '555-0123',
        status: 'pending',
        charityId: charity._id
      },
      {
        donorName: 'Jane Smith',
        location: '456 Oak Ave, Demo City, 12345',
        items: 'Furniture, Electronics',
        preferredDate: 'Tuesday 2:00 PM',
        contact: '555-0124',
        status: 'scheduled',
        charityId: charity._id
      },
      {
        donorName: 'Bob Wilson',
        location: '789 Pine Rd, Demo City, 12345',
        items: 'Toys, Kitchen Items',
        preferredDate: 'Wednesday 3:00 PM',
        contact: '555-0125',
        status: 'completed',
        charityId: charity._id
      }
    ];

    await Pickup.insertMany(samplePickups);
    
    res.status(200).json({ message: 'Sample data created successfully' });
  } catch (error) {
    console.error('Error creating sample data:', error);
    res.status(500).json({ message: 'Failed to create sample data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});