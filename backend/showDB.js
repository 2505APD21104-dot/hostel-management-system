const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/hostel_db')
  .then(async () => {
    const users = await User.find({});
    console.log("=== USERS SAVED IN MONGODB ===");
    users.forEach(u => console.log(`Email: ${u.email} | Role: ${u.role}`));
    mongoose.connection.close();
  });