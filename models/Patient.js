import mongoose from "mongoose";

const patientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    symptom: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    vet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vet'
    }
    },
    {
        timestamps: true
    }
);

const Patient = mongoose.model('Patient', patientSchema);

export default Patient