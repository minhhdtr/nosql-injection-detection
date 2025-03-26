const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user.routes');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));