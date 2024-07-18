import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./CreateTrain.css"; // Import the CSS file

const CreateTrain = () => {
  const [trainNumber, setTrainNumber] = useState("");
  const [trainName, setTrainName] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        setUserEmail(decodedToken.email);
      } catch (error) {
        console.error("Error decoding JWT:", error);
        setMessage("Error decoding JWT token.");
      }
    } else {
      setMessage("You need to be logged in to create a train.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        "http://localhost:5000/api/admin/train",
        {
          trainNumber,
          trainName,
          source,
          destination,
          totalSeats: parseInt(totalSeats),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      setTrainNumber("");
      setTrainName("");
      setSource("");
      setDestination("");
      setTotalSeats("");
    } catch (error) {
      setMessage(error.response.data.message || "Train creation failed");
    }
  };

  return (
    <div className="create-train-container">
      <h2>Create Train</h2>
      {userEmail === "animeshsingrol@gmail.com" ? (
        <form onSubmit={handleSubmit} className="create-train-form">
          <div className="form-group">
            <label>Train Number</label>
            <input
              type="text"
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Train Name</label>
            <input
              type="text"
              value={trainName}
              onChange={(e) => setTrainName(e.target.value)}
              required
            />
          </div>
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
          <div className="form-group">
            <label>Total Seats</label>
            <input
              type="number"
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
              required
            />
          </div>
          <button type="submit">Create Train</button>
        </form>
      ) : (
        <p className="message">
          Access denied. Only admins can create a train.
        </p>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CreateTrain;
