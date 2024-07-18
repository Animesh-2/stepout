import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import './Home.css'; // Import CSS for styling

const Home = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [trains, setTrains] = useState([]);
  const [message, setMessage] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error("Error decoding JWT:", error);
        setMessage("Error decoding JWT token.");
      }
    } else {
      setMessage("You need to be logged in to search for trains.");
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get("http://localhost:5000/api/trains", {
        params: { source, destination },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTrains(response.data.trains);
      setMessage("");
    } catch (error) {
      setMessage(error.response.data.message || "Failed to fetch train data");
      setTrains([]);
    }
  };

  const handleBookSeat = async () => {
    if (!selectedTrain) {
      setMessage("Please select a train to book a seat.");
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        "http://localhost:5000/api/book",
        { trainId: selectedTrain, seatNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);

      // Update available seats dynamically
      setTrains((prevTrains) =>
        prevTrains.map((train) =>
          train.trainId === selectedTrain
            ? {
                ...train,
                availableSeats: train.availableSeats - 1,
              }
            : train
        )
      );

      setSeatNumber("");
    } catch (error) {
      setMessage(error.response.data.message || "Seat booking failed");
    }
  };

  return (
    <div className="home-container">
      <h1>Welcome to the Train Booking System</h1>
      <p>Book your train tickets easily and quickly.</p>
      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group">
          <label>Source</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>
        <button type="submit">Search</button>
      </form>
      {message && <p className="message">{message}</p>}
      <div className="train-results">
        {trains.map((train) => (
          <div
            key={train.trainId}
            className={`train-item ${selectedTrain === train.trainId ? 'selected' : ''}`}
            onClick={() => setSelectedTrain(train.trainId)}
          >
            <h3>{train.trainName}</h3>
            <p>Train Number: {train.trainNumber}</p>
            <p>Available Seats: {train.availableSeats}</p>
          </div>
        ))}
      </div>
      {selectedTrain && (
        <div className="seat-booking-form">
          <h3>Book a Seat</h3>
          <input
            type="text"
            value={seatNumber}
            onChange={(e) => setSeatNumber(e.target.value)}
            placeholder="Enter Seat Number"
            required
          />
          <button onClick={handleBookSeat}>Book Seat</button>
        </div>
      )}
    </div>
  );
};

export default Home;
