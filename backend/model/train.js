

import mongoose from 'mongoose';

const trainSchema = new mongoose.Schema({
  trainNumber: {
    type: String,
    required: true,
    unique: true
  },
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 0
  },
  bookedSeats: {
    type: Number,
    default: 0
  }
});

trainSchema.methods.isSeatAvailable = function(seatNumber) {
  // Example logic to check if seat is available
  return this.bookedSeats < this.totalSeats;
};

trainSchema.methods.bookSeat = function(seatNumber) {
  // Example logic to book a seat
  if (this.isSeatAvailable(seatNumber)) {
    this.bookedSeats++;
    return true;
  }
  return false;
};

const Train = mongoose.model('Train', trainSchema);

export default Train;

