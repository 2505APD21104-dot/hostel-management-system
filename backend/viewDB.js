const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/hostel_db')
  .then(async () => {
    console.log("🔌 Connected to MongoDB!");
    
    // Get all students
    const students = await User.find({ role: 'student' });
    
    console.log(`\n=== TOTAL STUDENTS IN MONGODB: ${students.length} ===\n`);
    
    // Print the first 5 students to show they are real
    console.log("Here is a sample of the students saved in your database:");
    students.slice(0, 5).forEach((s, index) => {
      console.log(`${index + 1}. Name: ${s.name} | Email: ${s.email} | Student ID: ${s.studentId}`);
    });
    
    mongoose.connection.close();
  })
  .catch(err => console.log(err));