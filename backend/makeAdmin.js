const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

// CHANGE THIS TO YOUR ADMIN EMAIL
const emailToPromote = "admin@test.com"; 

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hostel_db')
  .then(async () => {
    console.log("Connected to DB. Updating user...");
    
    const updatedUser = await User.findOneAndUpdate(
      { email: emailToPromote },
      { role: 'admin' },
      { new: true }
    );

    if (updatedUser) {
      console.log(`✅ SUCCESS: ${updatedUser.name} (${updatedUser.email}) is now an Admin!`);
    } else {
      console.log("❌ ERROR: Could not find a user with that email address.");
    }
    
    mongoose.connection.close();
  })
  .catch(err => console.log("DB Error:", err));