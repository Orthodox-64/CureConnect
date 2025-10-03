const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
    cors: {
        methods: ["GET", "POST"],
        credentials: true
    }
});

// WebSocket rooms storage
const rooms = {};

// Store socket instances for doctors
const doctorSockets = new Map();

// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (roomId) => {
        if (!rooms[roomId]) rooms[roomId] = [];
        if (rooms[roomId].length >= 2) {
            console.log(`Room ${roomId} is full.`);
            socket.emit("room-full");
            return;
        }

        rooms[roomId].push(socket.id);
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);

        if (rooms[roomId].length === 2) {
            console.log(`Both users are in room ${roomId}, signaling ready...`);
            io.to(roomId).emit("ready");
        }
    });

    socket.on("offer", ({ roomId, offer }) => {
        console.log(`Offer received from ${socket.id} for room ${roomId}`);
        socket.to(roomId).emit("offer", offer);
    });

    socket.on("answer", ({ roomId, answer }) => {
        console.log(`Answer received from ${socket.id} for room ${roomId}`);
        socket.to(roomId).emit("answer", answer);
    });

    socket.on("ice-candidate", ({ roomId, candidate }) => {
        console.log(`ICE Candidate received from ${socket.id} for room ${roomId}`);
        socket.to(roomId).emit("ice-candidate", candidate);
    });

    // Handle doctor connection
    socket.on("doctorConnect", (doctorId) => {
        doctorSockets.set(doctorId, socket);
    });

    // Handle emergency notifications
    socket.on("emergencyRequest", async (patientData) => {
        // Notify all connected doctors
        doctorSockets.forEach((doctorSocket) => {
            doctorSocket.emit("emergencyNotification", {
                patientName: patientData.name,
                roomId: "emergency"
            });
        });
    });

    socket.on("disconnect", () => {
        // Remove doctor socket on disconnect
        doctorSockets.forEach((value, key) => {
            if (value === socket) {
                doctorSockets.delete(key);
            }
        });
        console.log("User disconnected:", socket.id);
        for (const roomId in rooms) {
            rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
            if (rooms[roomId].length === 0) delete rooms[roomId];
        }
    });
});

// Chat rooms storage
const chatRooms = new Map();

io.of('/chat').on("connection", (socket) => {
    console.log("Chat user connected:", socket.id);
    
    socket.on("join-room", (roomId) => {
        if (!chatRooms.has(roomId)) {
            chatRooms.set(roomId, new Set([socket.id]));
        } else if (chatRooms.get(roomId).size < 2) {
            chatRooms.get(roomId).add(socket.id);
        } else {
            socket.emit("room-full");
            return;
        }

        socket.join(roomId);
        console.log(`Chat user ${socket.id} joined room ${roomId}`);
    });

    socket.on("user-message", ({ roomId, text }) => {
        io.of('/chat').to(roomId).emit("message", {
            text,
            sender: socket.id
        });
    });

    socket.on("disconnect", () => {
        console.log("Chat user disconnected:", socket.id);
        chatRooms.forEach((users, roomId) => {
            users.delete(socket.id);
            if (users.size === 0) {
                chatRooms.delete(roomId);
            }
        });
    });
});

// Middleware
// Add trust proxy to handle Cloudflare
app.set('trust proxy', true);

app.use(cors({
    origin: function(origin, callback) {
        callback(null, true); // allow all origins temporarily for debugging
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['set-cookie']
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI);

// Add after database connection and before routes
const Appointment = require('./models/appointmentModel');
const User = require('./models/userModel');
const sendReminder = require('./utils/sendReminder');

// Schedule reminders for existing appointments on server start
const scheduleReminders = async () => {
    try {
        const now = new Date();
        const appointments = await Appointment.find({
            status: 'confirmed',
        }).populate('patient doctor');

        appointments.forEach(appointment => {
            const appointmentDateTime = new Date(`${appointment.day}T${appointment.time}`);
            const reminderTime = new Date(appointmentDateTime.getTime() - 5 * 60000);

            if (reminderTime > now) {
                const timeoutDuration = reminderTime.getTime() - now.getTime();
                
                setTimeout(async () => {
                    try {
                        await sendReminder(appointment.patient, {
                            day: appointment.day,
                            time: appointment.time,
                            roomId: appointment.roomId,
                        });
                        await sendReminder(appointment.doctor, {
                            day: appointment.day,
                            time: appointment.time,
                            roomId: appointment.roomId,
                        });
                    } catch (error) {
                        console.error("Failed to send reminder:", error);
                    }
                }, timeoutDuration);
            }
        });
    } catch (error) {
        console.error("Failed to schedule reminders:", error);
    }
};

mongoose.connect(process.env.MONGODB_URI).then(() => {
    scheduleReminders();
});

// Routes
const user = require('./routes/userRoute');
app.use("/api/v1", user);

const appointment = require('./routes/appointmentRoutes');
app.use('/api/v1', appointment);

const pharmacy = require('./routes/pharmacyRoutes');
app.use('/api/v1', pharmacy);

const admin = require('./routes/adminRoutes');
app.use('/api/v1/admin', admin);

// 404 handler
app.use("/", (req, res, next) => {
    res.status(404).json({
        status: "fail",
        ok: false,
        message: "No such route founded in server...💣💣💣",
    });
});

// Make io accessible to routes
app.set('io', io);

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT,() => console.log(`Server running on port ${PORT}`));