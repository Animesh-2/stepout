import express from "express";
import mongoose from "mongoose";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import Booking from "../model/booking.js";
import Train from "../model/train.js"; // Adjust the import statement here

const router = express.Router();

router.post("/book", authenticateJWT, async (req, res) => {
  const { trainId, seatNumber } = req.body;
  const userId = req.user.userId;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const train = await Train.findById(trainId).session(session);
    if (!train) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ status: "error", message: "Train not found" });
    }

    if (!train.isSeatAvailable(seatNumber)) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ status: "error", message: "Seat already booked" });
    }

    if (!train.bookSeat(seatNumber)) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ status: "error", message: "Seat already booked" });
    }

    await train.save({ session });

    const booking = new Booking({
      trainId,
      seatNumber,
      bookedBy: userId,
    });

    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: "success",
      message: "Seat booked successfully",
      booking,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

router.get(`/bookings/:bookingId`, authenticateJWT, async (req, res) => {
  const { bookingId } = req.params;
  try {
    // const booking = await Booking.findById(bookingId).populate("train").exec();
    const booking = await Booking.findById(bookingId)
      .populate({
        path: "train",
        options: { strictPopulate: false },
      })
      .exec();

    if (!booking) {
      return res
        .status(404)
        .json({ status: "error", message: "Booking not found" });
    }

    // Ensure the booking belongs to the authenticated user (if required)
    // Example check: if (booking.bookedBy !== req.user.userId) { ... }

    res.status(200).json({ status: "success", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});
export default router;
