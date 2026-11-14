const mongoose = require('mongoose');
const User = require('./models/User');

const CLOUD_URI = "mongodb+srv://2505a21104_db_user:Password123@cluster1.ik273g4.mongodb.net/hostel_db?retryWrites=true&w=majority";

mongoose.connect(CLOUD_URI)
  .then(async () => {
    console.log("✅ Connected to CLOUD MongoDB.");
    
    const emailToPromote = "2505a21104@sru.edu.in"; 
    
    const updatedUser = await User.findOneAndUpdate(
      { email: emailToPromote },
      { role: 'admin', name: 'Admin User' },
      { new: true, upsert: true } // upsert:true creates the admin if it doesn't exist
    );

    console.log(`🎉 SUCCESS: ${updatedUser.email} is now an Admin in the cloud!`);
    mongoose.connection.close();
  })
  .catch(err => console.log("❌ Error:", err.message));