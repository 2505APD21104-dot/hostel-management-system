const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// EXACT URL WITH USERNAME AND NEW PASSWORD
const CLOUD_URI = "mongodb+srv://2505a21104_db_user:Password123@cluster1.ik273g4.mongodb.net/hostel_db?retryWrites=true&w=majority";

mongoose.connect(CLOUD_URI)
  .then(async () => {
    console.log("✅ SUCCESS: Connected to CLOUD MongoDB.");
    
    // Delete old data to prevent duplicate errors
    await User.deleteMany({});
    console.log("🧹 Cleared old users.");
    
    // Create 150 students
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const students = [];
    for (let i = 1; i <= 150; i++) {
      students.push({
        name: `Demo Student ${i}`,
        email: `student${i}@demo.com`,
        password: hashedPassword,
        role: 'student',
        studentId: `SRU${1000 + i}`,
        contact: `0170000${i.toString().padStart(4, '0')}`
      });
    }

    await User.insertMany(students);
    console.log("🎉 150 Students created successfully in the CLOUD!");
    mongoose.connection.close();
  })
  .catch(err => console.log("❌ Error:", err.message));