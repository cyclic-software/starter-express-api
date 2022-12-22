import User from "../models/user_model.js";
import Appointment from "../models/appointment_model.js";

export const getAppointments = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.email });
    if (!user) {
      return res.status(200).json({ errorMessage: "User isn't exists" });
    }

    res.status(200).json(user.appointments);
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorMessage: e.message });
  }
};

export const getAppointmentsByDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    const user = await User.findOne({ email: req.email });
    if (!user) {
      return res.status(200).json({ errorMessage: "User isn't exists" });
    }

    var appointments = user.appointments.filter((appointment) => appointment.date === date);
    res.status(200).json(appointments);
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorMessage: e.message });
  }
};

export const insertAppointment = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.email });
    if (!user) {
      return res.status(200).json({ errorMessage: "User isn't exists" });
    }

    const appointment = new Appointment({
      email: req.email,
      ...req.body,
    });

    user.appointments.push(appointment);
    await user.save();

    res.status(200).json(user.appointments);
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorMessage: e.message });
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.email });
    if (!user) {
      return res.status(200).json({ errorMessage: "User isn't exists" });
    }
    user.appointments = user.appointments.map((appointment) => {
      if (appointment._id.toString() === req.body.id) {
        appointment.name = req.body.name;
        appointment.phone = req.body.phone;
        appointment.date = req.body.date;
        appointment.time = req.body.time;
      }
      return appointment;
    });
    await user.updateOne(user);

    res.status(200).json(user.appointments);
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorMessage: e.message });
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ email: req.email });
    if (!user) {
      return res.status(200).json({ errorMessage: "User isn't exists" });
    }
    user.appointments = user.appointments.filter((appointment) => appointment._id.toString() !== id);
    await user.save();

    res.status(200).json(user.appointments);
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorMessage: e.message });
  }
};
