const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ========== MIDDLEWARE ==========
app.use(cors({
  origin: '*', // Allow all origins (for local development)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== ROUTES ==========
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'ASHI Fashion API is running ✅' });
});

// ========== MONGODB CONNECTION ==========
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`✅ API ready at http://localhost:${PORT}/api`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('\n⚠️  Make sure MongoDB is installed and running!');
    console.log('   Run: mongod (in a separate terminal)');
    process.exit(1);
  });