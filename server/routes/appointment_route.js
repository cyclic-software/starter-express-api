import express from "express";
import {
  getAppointments,
  getAppointmentsByDate,
  insertAppointment,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointment_controller.js";
const router = express.Router();

router.get("/", getAppointments);
router.get("/:date", getAppointmentsByDate);
router.post("/", insertAppointment);
router.put("/", updateAppointment);
router.delete("/:id", deleteAppointment);

export default router;
