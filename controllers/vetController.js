import Vet from "../models/Vet.js";
import generateJWT from "../helpers/generateJWT.js";
import generateId from "../helpers/generateId.js"
import emailRegister from "../helpers/emailRegister.js";
import emailForgotPass from "../helpers/emailForgotPass.js";

const register = async (req, res) => {

    const {email, name} = req.body;

    // Prevent dub
    const dubUser = await Vet.findOne({email});

    if(dubUser){
        const error = new Error('This user is already registered');
        return res.status(400).json({msg: error.message});
    }

    try {
        // Save a new Vet
        const vet = new Vet(req.body);
        const saveVet = await vet.save();

        //* Send Email to confirm the account
        emailRegister({
            email,
            name,
            token: saveVet.token
        });

        res.json({saveVet}); //! delete
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

const profile = (req, res) => {
    const {vet} = req;
    res.json(vet);
}

const confirmFun = async (req, res) => {
    const {token} = req.params;

    const userExist = await Vet.findOne({token});

    if(!userExist){
        const error = new Error('Invalid Token');
        return res.status(404).json({msg: error.message});
    }
    try {
        userExist.token = null;
        userExist.confirmUser = true;

        await userExist.save();

        res.json({msg: 'This user has been confirmed, thank you!'});
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

const auth = async (req, res) => {
    const {email, password} = req.body;
    const checkUser = await Vet.findOne({email});

    try {
        // Check if the users exist
        if(!checkUser){
            const error = new Error(`This user doesn't exists`);
            return res.status(404).json({msg: error.message});
        }
        // Check if the user is confirm
        if(!checkUser.confirmUser){
            const error = new Error(`This user is no confirm`);
            return res.status(401).json({msg: error.message});
        }

        // Auth the user
        if(await checkUser.checkPass(password)){
            res.json({
                _id: checkUser._id,
                name: checkUser.name,
                email: checkUser.email,
                token: generateJWT(checkUser.id),
                msg: 'Login..'
            });
        } else{
            const error = new Error(`Incorrect password`);
            return res.status(401).json({msg: error.message});
        }
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

const forgotPass = async (req, res) => {
    const {email} = req.body;

    const existVet = await Vet.findOne({email});

    try {
        if(!existVet){
            const error = new Error('This email is not registered in our database');
            return res.status(404).json({msg: error.message});

        } else if(!existVet.confirmUser){
            const error = new Error('Confirm your account before resetting your password');
            return res.status(404).json({msg: error.message});
        }
        existVet.token = 'PPTD' + generateId();
        await existVet.save();

        //* Send email with instructions
        emailForgotPass({
            email,
            name: existVet.name,
            token: existVet.token
        });

        res.json({msg: 'We have sent an email with the instructions'});

    } catch (error) {
        console.log(`Error: ${error}`)
    }
}

const checkToken = async (req, res) => {
    const {token} = req.params;   
    
    try {
        if(token.startsWith('PPTD')){ 
            const existUser = await Vet.findOne({token})
                .select('-password -token -phone -confirmUser');
    
            if(!existUser){
                const error = new Error('Expired or invalid Token');
                return res.status(404).json({msg: error.message});
            }

            res.json({msg: 'The password has been changed', user: existUser});
        } else{
            const error = new Error('Invalid Token');
            return res.status(404).json({msg: error.message});
        }
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

const newPass = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;

    const vet = await Vet.findOne({token});

    if(!vet){
        const error = new Error('There was a problem, please try again');
        return res.status(400).json({msg: error.message});
    }
    try {
        vet.token = null;
        vet.password = password;
        await vet.save();
        
        res.json({msg: 'The password has been changed successfully'});
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

const updateProfile = async (req, res) => {
    if(!req.params.id) return res.status(400).json({msg: 'No ID found'});

    try {
        const vet = await Vet.findById(req.params.id)
            .select('name email _id __v');

        if(!vet){
            return res.status(400).json({ msg: 'Invalid ID' });
        }
        
        vet.name = req.body.name
        vet.email = req.body.email

        const updateVet = await vet.save();
        res.json({msg: 'Profile has been updated', vet: updateVet});
        
    } catch (error) {
        res.status(500).json({ msg: 'Invalid ID' });
    }
}

const changePass = async (req, res) => {
    if(!req.params.id) return res.status(400).json({msg: 'No ID found'});

    try {
        const vet = await Vet.findById(req.params.id);
            // .select('name email _id __v');

        if(!vet){
            return res.status(400).json({ msg: 'Invalid ID' });
        }
        if(!await vet.checkPass(req.body.pass)) return res.status(400).json({ msg: 'Wrong password' });

        vet.password = req.body.newPass;

        const updateVet = await vet.save();
        res.json({msg: 'Password has been updated'});
        
    } catch (error) {
        res.status(500).json({ msg: 'Invalid ID' });
    }
}
export{
    register,
    profile,
    confirmFun,
    auth,
    forgotPass,
    checkToken,
    newPass,
    updateProfile,
    changePass
}