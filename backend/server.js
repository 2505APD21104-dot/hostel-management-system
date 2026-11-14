const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const Hostel = require('./models/Hostel');
const Room = require('./models/Room');
const Request = require('./models/Request');
const Complaint = require('./models/Complaint');
const auth = require('./middleware/auth');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' })); // CORS fix applied here

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hostel_db')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err.message));

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, studentId, contact } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user = new User({ name, email, password: hashedPassword, role: 'student', studentId, contact });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials (User not found)' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials (Wrong password)' });

    const payload = { user: { id: user.id, role: user.role, name: user.name } };
    
    jwt.sign(payload, process.env.JWT_SECRET || 'supersecretkey123', { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        } 
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- HOSTELS ---
app.post('/api/hostels', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try { const hostel = new Hostel(req.body); await hostel.save(); res.status(201).json(hostel); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/hostels', auth, async (req, res) => {
  try { const hostels = await Hostel.find(); res.json(hostels); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/hostels/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try { 
    await Hostel.findByIdAndDelete(req.params.id); 
    await Room.deleteMany({ hostelId: req.params.id }); 
    res.json({ message: 'Hostel deleted successfully' }); 
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- ROOMS ---
app.post('/api/rooms', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try { const room = new Room(req.body); await room.save(); res.status(201).json(room); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/rooms/all', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try { const rooms = await Room.find().populate('hostelId', 'name'); res.json(rooms); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/rooms/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try { await Room.findByIdAndDelete(req.params.id); res.json({ message: 'Room deleted' }); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/rooms/available', auth, async (req, res) => {
  try { const rooms = await Room.find({ status: 'Available' }).populate('hostelId', 'name'); res.json(rooms); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

// --- REQUESTS ---
app.post('/api/requests', auth, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Only students can apply' });
  try {
    const { hostelId } = req.body;
    const existingRequest = await Request.findOne({ studentId: req.user.id, status: 'Pending' });
    if (existingRequest) return res.status(400).json({ message: 'You already have a pending request' });
    const request = new Request({ studentId: req.user.id, hostelId });
    await request.save();
    res.status(201).json(request);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/requests', auth, async (req, res) => {
  try {
    let requests;
    if (req.user.role === 'admin') {
      requests = await Request.find().populate('studentId', 'name email studentId').populate('hostelId', 'name').populate('roomId', 'roomNumber');
    } else {
      requests = await Request.find({ studentId: req.user.id }).populate('hostelId', 'name').populate('roomId', 'roomNumber');
    }
    res.json(requests);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/requests/:id/approve', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const { roomId } = req.body;
    const room = await Room.findById(roomId);
    if (!room || room.occupiedCount >= room.capacity) return res.status(400).json({ message: 'Room full or invalid' });
    room.occupiedCount += 1;
    if (room.occupiedCount >= room.capacity) room.status = 'Full';
    await room.save();
    const request = await Request.findById(req.params.id);
    request.status = 'Approved'; request.roomId = roomId;
    await request.save();
    res.json({ message: 'Request approved', request });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/requests/:id/reject', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try { const request = await Request.findByIdAndUpdate(req.params.id, { status: 'Rejected' }, { new: true }); res.json(request); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

// --- COMPLAINTS ---
app.post('/api/complaints', auth, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Access denied' });
  try { const complaint = new Complaint({ ...req.body, studentId: req.user.id }); await complaint.save(); res.status(201).json(complaint); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/complaints', auth, async (req, res) => {
  try {
    let complaints;
    if (req.user.role === 'admin') complaints = await Complaint.find().populate('studentId', 'name');
    else complaints = await Complaint.find({ studentId: req.user.id });
    res.json(complaints);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/complaints/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try { const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status: 'Resolved' }, { new: true }); res.json(complaint); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

// --- USER MANAGEMENT (STUDENTS) ---
app.get('/api/users/students', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const students = await User.find({ role: 'student' });
    res.json(students);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/users/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    await User.findByIdAndDelete(req.params.id);
    await Request.deleteMany({ studentId: req.params.id });
    await Complaint.deleteMany({ studentId: req.params.id });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));