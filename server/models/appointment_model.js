import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  // the email will be the key.
  email: {
    type: String,
    trim: true,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    trim: true,
    required: true,
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
