import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'], 
    default: 'user', 
  },
  dateOfCreation: {
    type: Date,
    default: Date.now,
  },
});

const Users = mongoose.model('Users', userSchema);

export default Users;
