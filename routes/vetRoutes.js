import express from "express";
import {
    register,
    profile,
    confirmFun,
    auth,
    forgotPass,
    checkToken,
    newPass,
    updateProfile,
    changePass
} from '../controllers/vetController.js'
import checkAuth from "../middleware/authMW.js";

const router = express.Router();

// public
router.post('/', register);
router.get('/confirm/:token', confirmFun);
router.post('/login', auth);
router.post('/forgot-password', forgotPass);
router.route('/forgot-password/:token').get(checkToken).post(newPass);

// private
router.get('/profile', checkAuth, profile);
router.put('/profile/:id', checkAuth, updateProfile);
router.put('/profile/change-password/:id', checkAuth, changePass);

export default router;