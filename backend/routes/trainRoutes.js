// routes/trainRoutes.js
import express from 'express';
import Train from '../model/train.js'; // Adjust the path as necessary

const trainRouter = express.Router();

// Endpoint to get trains based on source and destination
trainRouter.get('/trains', async (req, res) => {
  try {
    const { source, destination } = req.query;

    if (!source || !destination) {
      return res.status(400).json({
        status: 'error',
        message: 'Source and destination are required',
      });
    }

    // Find trains based on source and destination
    const trains = await Train.find({ source, destination });

    if (trains.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No trains found between the specified stations',
      });
    }

    // Prepare the response data
    const response = trains.map(train => {
      let availableSeats = 0;

      train.coaches.forEach(coach => {
        coach.seats.forEach(seat => {
          if (!seat.isBooked) {
            availableSeats += 1;
          }
        });
      });

      return {
        trainId: train._id,
        trainName: train.trainName,
        trainNumber: train.trainNumber,
        availableSeats,
      };
    });

    res.status(200).json({
      status: 'success',
      trains: response,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

export default trainRouter;
