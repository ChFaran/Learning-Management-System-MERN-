const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { ensureDefaultAdmin } = require("./utils/ensureDefaultAdmin");
require("dotenv").config();

const app = express();

// Secure headers & middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lms";
        await mongoose.connect(mongoUri);
        console.log(`MongoDB connected: ${mongoUri.includes("mongodb+srv") ? "Atlas" : "Community Edition"}`);
        await ensureDefaultAdmin();
    } catch (error) {
        console.error("MongoDB connection fail:", error);
        process.exit(1);
    }
};

connectDB();

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/courses", require("./routes/course"));
app.use("/api/modules", require("./routes/module"));
app.use("/api/teams", require("./routes/team"));
app.use("/api/projects", require("./routes/project"));
app.use("/api/tasks", require("./routes/task"));

// Welcome route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Secure LMS API" });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Socket.io for real-time collaboration
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST", "PUT"] }
});

io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    socket.on("join_board", (roomId) => {
        socket.join(roomId);
        console.log(`Socket joined board: ${roomId}`);
    });

    socket.on("update_task", (data) => {
        socket.to(data.roomId).emit("task_updated", data);
    });

    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});
