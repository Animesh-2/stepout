// routes/adminRoutes.js
import express from "express";
import { isAdmin } from "../middleware/Authmiddleware.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import Train from "../model/train.js";

const router = express.Router();

// Endpoint to add a new train
router.post("/train", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const { source, destination, totalSeats, trainNumber } = req.body;

    // Validate input
    if (!source || !destination || !totalSeats || !trainNumber) {
      return res
        .status(400)
        .json({ status: "error", message: "All fields are required" });
    }

    // Check if train number already exists
    const existingTrain = await Train.findOne({ trainNumber });
    if (existingTrain) {
      return res
        .status(400)
        .json({ status: "error", message: "Train number already exists" });
    }

    // Create a new train instance
    const newTrain = new Train({
      source,
      destination,
      totalSeats,
      trainNumber,
    });

    // Save the train to the database
    await newTrain.save();

    res
      .status(201)
      .json({ status: "success", message: "Train added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

export default router;
