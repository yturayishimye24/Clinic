import Notification from "../models/notificationsModal.js";

export const createPatient = async (req, res) => {

    const patient = await Patient.create(req.body);

    await Notification.create({
        title: "New Patient",
        message: `${patient.firstName} ${patient.lastName} has been added.`,
        type: "patient"
    });

    res.status(201).json(patient);
};

export const getNotifications = async (req, res) => {

    try {

        const notifications = await Notification.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            notifications
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};