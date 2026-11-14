const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to DB to find the ID
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hostel_db');

const Hostel = require('./models/Hostel'); // Import your Hostel model

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNmFmODA1MTRiZjdkMzEwOTY2NzMzYjYyIiwicm9sZSI6ImFkbWluIiwibmFtZSI6IkFkbWluIFVzZXIifSwiaWF0IjoxNzk0NjQwODI2LCJleHAiOjE3OTQ3MjcyMjZ9.Yl_cR2yXcroWoilXD_HflKk0T5C4ERkfUagDeeiWymg";

async function addRoomsToHostelB() {
  try {
    // Find the specific hostel by name
    const targetHostel = await Hostel.findOne({ name: "Boys Hostel--B" });
    
    if (!targetHostel) {
      console.log("❌ Could not find a hostel named 'Boys Hostel--B'. Check the exact name.");
      return process.exit();
    }

    console.log(`Found ${targetHostel.name}! ID is ${targetHostel._id}. Creating 100 rooms...`);

    for (let i = 1; i <= 100; i++) {
      const roomData = {
        hostelId: targetHostel._id,
        roomNumber: `B-${i}`, // Naming them B-1, B-2 for Hostel B
        type: "Single",           
        capacity: 1               
      };

      await axios.post('http://localhost:5000/api/rooms', roomData, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      });
      console.log(`✅ Room B-${i} created`);
    }
    console.log("🎉 All done!");
    process.exit();
  } catch (err) {
    console.log("Error:", err.message);
    process.exit();
  }
}

addRoomsToHostelB();