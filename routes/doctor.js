const express = require('express')
const router = express.Router()
const axios = require('axios')
const { DOCTOR_REGISTER_URL, DOCTOR_STATUS, ROLES, } = require('../constant/constant')

const Doctor = require('../models/doctorsModel')
const DoctorInformation = require('../models/doctorInformationModel')
const User = require('../models/userModel')
const auth = require('../middleware/auth')
const role = require('../middleware/roles')


// update your user state of doctorUser after registering as a doctor so that their roles and other information can get updated
router.post('/registerDoctor', auth, async (req, res) => {
    try {
        const { doctorRegisterNo, fullName } = req.body

        const existUser = await Doctor.findOne({ '$or': [{ fullName: fullName }, { doctorRegisterNo: doctorRegisterNo }] })
        if (existUser) {
            return res.status(400).json({ error: 'Doctor already exist' })
        }

        const doctorData = await GetDoctorData(doctorRegisterNo)
        const foundDoctor = findDoctor(fullName, doctorData)

        try {
            const newDoctor = new Doctor({
                fullName: fullName,
                tenure: foundDoctor.yearInfo,
                doctorRegisterNo: doctorRegisterNo,
                phoneNumber: foundDoctor.phoneNo,
                email: foundDoctor.emailId,
                doctorDegree: foundDoctor.doctorDegree,
                address: foundDoctor.address,
                stateMedCouncil: foundDoctor.smcName,
                isActive: true,
                status: DOCTOR_STATUS.APPROVED,
                dateOfBirth: foundDoctor.birthDateStr
            })
            const saveDoctor = await newDoctor.save()

            await User.updateOne({ _id: req.user.id }, {
                phoneNumber: saveDoctor.phoneNumber,
                role: ROLES.DOCTOR,
                doctor: saveDoctor.id
            })

            return res.status(200).send({
                status: 'sucess',
                msg: 'doctor registered view information',
                doctorInfo: saveDoctor,
            })
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error: 'pls verify that you have already registered with Indian Medical Registry' })
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'server error' })
    }
})

// {
//     "fullName":"Pooja Susan Cherian",
//     "doctorRegisterNo":"66343", 
//     "email":"ss6239620@gmail.com",
//     "doctorDegree":"MBBS", 
//     "stateMedCouncil":"Travancore Cochin Medical Council, Trivandrum",
//     "dateOfBirth":"13/12/1988"
//   }
router.post('/manualRegister', auth, async (req, res) => {
    try {
        const { fullName, doctorRegisterNo, email, doctorDegree, stateMedCouncil, dateOfBirth } = req.body;

        const existDoctor = await Doctor.findOne({ '$or': [{ fullName: fullName }, { doctorRegisterNo: doctorRegisterNo }] })

        if (existDoctor) {
            return res.status(400).json({ error: 'Doctor already exist' })
        }
        const newDoctor = new Doctor({
            fullName: fullName,
            doctorRegisterNo: doctorRegisterNo,
            email: email,
            doctorDegree: doctorDegree,
            stateMedCouncil: stateMedCouncil,
            dateOfBirth: dateOfBirth
        })
        await newDoctor.save()


        await User.updateOne({ _id: req.user.id }, {
            role: ROLES.DOCTOR,
            doctor: newDoctor._id,
        })

        return res.status(200).send({
            success: true,
            msg: "Wait until our team verfies your registration Id With Indian Medical Registry you will get email soon"
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'server error' })
    }
})

router.put('/approveDoctor/:id', auth, role.check(ROLES.ADMIN), async (req, res) => {
    try {
        const manualRegisterDoctorId = req.params.id;
        const existDoctor = await Doctor.findOne({ _id: manualRegisterDoctorId })
        if (!existDoctor) {
            return res.status(400).send({ error: "No Doctor Require ManualRegistration" })
        }
        const doctorData = await GetDoctorData(existDoctor.doctorRegisterNo)
        // return res.status(400).json({ doctorData })
        const foundDoctor = ApproveDoctorFilter(doctorData, existDoctor.fullName, existDoctor.stateMedCouncil, existDoctor.dateOfBirth)

        if (!foundDoctor) {
            return res.status(400).json({ error: 'No Doctor exist at Indian Medical Registry' })
        }
        await Doctor.updateOne({ _id: manualRegisterDoctorId }, {
            fullName: foundDoctor[0].firstName,
            tenure: foundDoctor[0].yearInfo,
            doctorRegisterNo: foundDoctor[0].registrationNo,
            phoneNumber: foundDoctor[0].phoneNo,
            doctorDegree: foundDoctor[0].doctorDegree,
            address: foundDoctor[0].address,
            stateMedCouncil: foundDoctor[0].smcName,
            isActive: true,
            status: DOCTOR_STATUS.APPROVED,
            dateOfBirth: foundDoctor[0].birthDateStr,
        })
        const doctor = await Doctor.findById(existDoctor._id)
        // console.log(doctor);

        return res.status(200).send({
            success: 'true',
            msg: "Thanks for Waiting you have been approved by us",
            data: doctor,

        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'server error' })
    }
})

router.post('/doctorLogin', async (req, res) => {
    try {
        const { fullName, dateOfBirth, doctorRegisterNo, stateMedCouncil } = req.body
        const existUser = await Doctor.findOne({
            '$or': [
                { fullName: fullName },
                { dateOfBirth: dateOfBirth },
                { doctorRegisterNo: doctorRegisterNo },
                { stateMedCouncil: stateMedCouncil },
            ]
        })
        if (!existUser) {
            return res.status(400).send({ error: "No such doctor exsist" })
        }

        return res.status(200).json({
            success: 'true',
            msg: 'Logged in successfully',
            data: existUser,
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'server error' })
    }
})

router.post('/fillAdditionalInfo', auth, role.check(ROLES.DOCTOR), async (req, res) => {
    try {
        const { experience, category, perAppointmentCharges } = req.body
        const alreadyFilledInfo= await DoctorInformation.findOne({doctor:req.user.id})
        if(alreadyFilledInfo){
            return res.status(400).send({ error: "Already filled additional information" })
        }
        const createInfo = new DoctorInformation({
            doctor: req.user.id,
            experience: experience,
            category: category,
            perAppointmentCharges: perAppointmentCharges
        })
        await createInfo.save()
        return res.status(200).send({
            success:'true',
            message:"your information have been saved succesfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'server error' })
    }
})





module.exports = router

function findDoctor(name, array) {
    return array.find(doctor => doctor.firstName === name)
}

function ApproveDoctorFilter(array, fullName, stateMedCouncil, dob) {
    return array.filter(doctor => doctor.firstName === fullName || doctor.smcName === stateMedCouncil || doctor.birthDateStr === dob)
}

async function GetDoctorData(doctorRegisterNo) {
    const response = await axios.default.post(`${DOCTOR_REGISTER_URL}`, { 'registrationNo': doctorRegisterNo })
    try {
        return response.data
    } catch (error) {
        return error
    }
}


router.post('/check', auth, async (req, res) => {
    console.log(req.user.id);
})