import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import communityRoutes from "./routes/CommunityFourmRoutes.js";
import MedRouter from "./routes/MedRouter.js";
import petRoutes from "./routes/petRoutes.js";
import petMateRoutes from "./routes/petMateRoutes.js";
import VetArticleRoute from "./routes/VetArticleRoute.js";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io"; // Corrected import
import callController from "./controller/callController/CallController.js";
import UserModel from "./models/User/UserSchema.js"; // Ensure you import UserModel
import cors from "cors";

const app = express();
dotenv.config({ path: "../.env" });

// Create HTTP server
const server = http.createServer(app);
const io = new Server(server); // Create Socket.IO instance

app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const mongooseConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
};

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("New user connected", socket.id);

  // Save socketId to MongoDB when user logs in
  socket.on("saveUserId", async (userId) => {
    try {
      await UserModel.findByIdAndUpdate(userId, { socketId: socket.id });
    } catch (err) {
      console.error("Error updating user socket ID:", err);
    }
  });

  // Notify User B when User A initiates a call
  socket.on("initiateCall", (data) => {
    const { receiverId, callerId } = data;

    // Fetch receiver's socketId from MongoDB
    UserModel.findById(receiverId, (err, receiver) => {
      if (err) {
        console.error("Error fetching receiver:", err);
        return;
      }
      if (receiver && receiver.socketId) {
        io.to(receiver.socketId).emit("incomingCall", { callerId });
      }
    });
  });

  // Disconnect handling (clean up)
  socket.on("disconnect", async () => {
    console.log("User disconnected", socket.id);
    try {
      await UserModel.updateOne(
        { socketId: socket.id },
        { $unset: { socketId: 1 } }
      ); // Remove socketId when user disconnects
    } catch (err) {
      console.error("Error removing socket ID on disconnect:", err);
    }
  });
});

// Routes
app.post("/generate-agora-token", callController); // Route to generate token

mongooseConnection();
app.use("/api/auth", authRoutes);
app.use(communityRoutes);
app.use(petRoutes);
// app.use(MedRouter);
app.use(VetArticleRoute);

app.use(petMateRoutes);

// Start the server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
