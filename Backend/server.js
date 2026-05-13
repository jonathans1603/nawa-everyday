const path = require('path');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.js'); // Pastikan path benar sesuai gambar sebelumnya
const app = express();
const menuRoutes = require('./routes/menu.js');
const tableRoutes = require('./routes/table.js'); // ← tambah
const feedbackRoutes = require('./routes/feedback.js'); // ← tambah
const reservasiRoutes = require('./routes/reservasi.js'); // ← tambah
const orderRoutes = require('./routes/order.js');
const aboutRoutes = require('./routes/About');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://nawa-everyday-frontend.vercel.app',
    'https://nawa-everyday-admin.vercel.app',
  ],
  credentials: true,
}));
app.use(express.json());

// Hubungkan rute auth
app.use('/api', authRoutes); 
app.use('/api', menuRoutes);
app.use('/api', tableRoutes);       
app.use('/api', feedbackRoutes);                        // ← tambah
app.use('/api', reservasiRoutes);          
app.use('/api', orderRoutes);            // ← tambah
app.use('/api', aboutRoutes);            // ← tambah

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.listen(5000, () => console.log('Server running on port 5000'));