require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');


connectDB();

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: 'https://mind-well-three.vercel.app',
    methods: ['GET', 'POST']
  }
});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/admin', require('./routes/admin'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/journal', require('./routes/journal'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/report', require('./routes/report'));

app.get('/', (req, res) => {
  res.send('MindWell API is running 🚀');
});


io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


app.set('socketio', io);


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});