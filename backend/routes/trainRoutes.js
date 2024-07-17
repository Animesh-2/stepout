// routes/trainRoutes.js
import express from "express";
import Train from "../model/train.js"; // Adjust the path as necessary
import { authenticateJWT } from "../middleware/authenticateJWT.js";

const trainRouter = express.Router();

// Endpoint to get trains based on source and destination
trainRouter.get("/trains", authenticateJWT, async (req, res) => {
  try {
    const { source, destination } = req.query;

    let query = {};

    if (source) {
      query.source = source;
    }
    if (destination) {
      query.destination = destination;
    }

    const trains = await Train.find(query);

    if (trains.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No trains found between the specified stations",
      });
    }

    // Prepare the response data
    const response = trains.map((train) => {
      let availableSeats = 0;

      if (train.coaches && Array.isArray(train.coaches)) {
        train.coaches.forEach((coach) => {
          // Check if coach.seats is defined and is an array
          if (coach.seats && Array.isArray(coach.seats)) {
            coach.seats.forEach((seat) => {
              if (!seat.isBooked) {
                availableSeats += 1;
              }
            });
          }
        });
      }

      return {
        trainId: train._id,
        trainName: train.trainName,
        trainNumber: train.trainNumber,
        availableSeats: train.totalSeats,
      };
    });

    res.status(200).json({
      status: "success",
      trains: response,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

export default trainRouter;
