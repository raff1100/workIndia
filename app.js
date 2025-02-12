require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const authRoutes = require('./routes/auth');
const trainRoutes = require('./routes/train');
const bookingRoutes = require('./routes/booking');


app.use(express.json()); 

app.use('/auth', authRoutes);
app.use('/trains', trainRoutes);
app.use('/bookings', bookingRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});