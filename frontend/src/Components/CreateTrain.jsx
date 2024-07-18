import React, { useState } from 'react';
import axios from 'axios';

const CreateTrain = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [trainNumber, setTrainNumber] = useState('');
  const [trainName, setTrainName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin/train', {
        source,
        destination,
        totalSeats,
        trainNumber,
        trainName,
      });
      setMessage(response.data.message);
      if (response.data.status === 'success') {
        // Optionally redirect or show success message
      }
    } catch (error) {
      setMessage(error.response.data.message || 'Train creation failed');
    }
  };

  return (
    <div className="create-train-container">
      <h2>Create Train</h2>
      <form onSubmit={handleSubmit} className="create-train-form">
        <div className="form-group">
          <label>Source</label>
          <input type="text" value={source} onChange={(e) => setSource(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Destination</label>
          <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Total Seats</label>
          <input type="number" value={totalSeats} onChange={(e) => setTotalSeats(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Train Number</label>
          <input type="text" value={trainNumber} onChange={(e) => setTrainNumber(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Train Name</label>
          <input type="text" value={trainName} onChange={(e) => setTrainName(e.target.value)} required />
        </div>
        <button type="submit">Create Train</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateTrain;
