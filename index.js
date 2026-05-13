const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const sessionRoutes = require('./routes/sessions');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

connectDB();

app.use('/api/sessions', sessionRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'Typing Speed Detector API', version: '1.0.0' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
