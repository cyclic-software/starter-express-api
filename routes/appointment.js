const express = require('express')
const router = express.Router()


const Doctor = require('../models/doctorsModel')
const User = require('../models/userModel')
const Appointment = require('../models/appointmentModel')
const auth = require('../middleware/auth')
const role = require('../middleware/roles')
const { ROLES } = require('../constant/constant')

router.post('/bookAppointment/:doctorId', auth, role.check(ROLES.PATIENT), async (req, res) => {
    try {
        const { doctorId } = req.params
        const { appointmentMethod } = req.body

        const existDoctor=await Doctor.findById(doctorId)

        if(!existDoctor){
            return res.status(400).json({ error: 'No such doctor exsist' })
        }

        const existAppointment = await Appointment.findOne({
            '$or': [
                { doctor: doctorId },
                { user: req.user.id }
            ]
        })

        if (existAppointment) {
            return res.status(400).json({ error: 'Appointment With this doctor already exist' })
        }

        const newAppointment = new Appointment({
            appointmentMethod: appointmentMethod,
            doctor: doctorId,
            user: req.user.id,
        })

        await newAppointment.save()

        return res.status(200).send({
            status: 'success',
            message: "Your Appointment booked succesfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'server error' })
    }
})

router.put('/cancelAppointment/:appointmentId',auth,role.check(ROLES.PATIENT,ROLES.DOCTOR),async(req,res)=>{
    try {
        const {appointmentId}=req.params

        const existAppointment= await Appointment.findById(appointmentId)
        if(!existAppointment){
            return res.status(400).json({ error: 'No such appointment exsist' })
        }
        await Appointment.findByIdAndDelete(appointmentId)
        
        return res.status(200).send({
            status: 'success',
            message: "Your Appointment deleted succesfully"
        })
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'server error' })
    }
})



module.exports = router