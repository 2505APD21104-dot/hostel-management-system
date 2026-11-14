const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Using your exact cloud connection string
const CLOUD_URI = "mongodb+srv://2505a21104_db_user:Password123@cluster1.ik273g4.mongodb.net/hostel_db?retryWrites=true&w=majority";

mongoose.connect(CLOUD_URI)
  .then(async () => {
    console.log("🔌 Connected to Cloud DB...");
    
    // 1. Generate the hashed password for '123456'
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);
    
    // 2. Find the Admin user and update their password and role
    const updatedUser = await User.findOneAndUpdate(
      { email: "2505a21104@sru.edu.in" },
      { password: hashedPassword, role: 'admin' },
      { new: true, upsert: true } // upsert:true creates them if they don't exist
    );
    
    console.log("✅ Admin password reset successfully!");
    console.log(`✅ Email: ${updatedUser.email}`);
    console.log(`✅ New Password: 123456`);
    console.log(`✅ Role: ${updatedUser.role}`);
    
    mongoose.connection.close();
  })
  .catch(err => console.log("❌ Error:", err.message));
  