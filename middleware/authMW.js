import jwt from 'jsonwebtoken';
import Vet from '../models/Vet.js';

const checkAuth = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.vet = await Vet.findById(decoded.id)
                .select('-password -token -phone -confirmUser');

            return next();
        } catch(e) {
            console.log(`Error: ${e}`)

            const error = new Error(`Invalid Token o doesn't exist`);
            return res.status(403).json({msg: error.message});
        }
    }
    if(!token){
        const error = new Error(`Invalid Token o doesn't exist`);
        res.status(403).json({msg: error.message});
    }
    next();
}
export default checkAuth;