import Patient from "../models/Patient.js";

const addPatient = async (req, res) => {
    const patient = new Patient(req.body);
    patient.vet = req.vet._id;
    try {
        const savePatient = await patient.save();
        res.json(savePatient);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

const getPatients = async (req, res) => {
    const patients = await Patient
        .find()
        .where('vet')
        .equals(req.vet._id);

    res.json(patients);
}

const getPatient = async (req, res) => {
    const {id} = req.params;

    try {        
        const patient = await Patient.findById(id);

        if(!patient){
            const error = new Error('Patient not found');
            return res.status(404).json({msg: error.message});
        }
        if(patient.vet._id.toString() !== req.vet._id.toString()){
            return res.json({msg: 'Access denied'});
        }
        res.json(patient);

    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

const updatePatient = async (req, res) => {
    const {id} = req.params;
    
    try {        
        const patient = await Patient.findById(id);
    
        if(!patient){
            const error = new Error('Patient not found');
            return res.status(404).json({msg: error.message});
        }
        if(patient.vet._id.toString() !== req.vet._id.toString()){
            return res.json({msg: 'Access denied'});
        }

        // Updating the Patient
        patient.name = req.body.name || patient.name;
        patient.owner = req.body.owner || patient.owner;
        patient.email = req.body.email || patient.email;
        patient.symptom = req.body.symptom || patient.symptom;
        patient.date = req.body.date || patient.date;

        const updatedPatient = await patient.save();
        res.json(updatedPatient);
    
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

const deletePatient = async (req, res) => {
    const {id} = req.params;

    try {        
        const patient = await Patient.findById(id);

        if(!patient){
            const error = new Error('Patient not found');
            return res.status(404).json({msg: error.message});
        }
        if(patient.vet._id.toString() !== req.vet._id.toString()){
            return res.json({msg: 'Access denied'});
        }
        await patient.deleteOne();
        res.json({msg: 'Patient was deleted'});
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

export{
    addPatient,
    getPatients,
    getPatient,
    updatePatient,
    deletePatient
}