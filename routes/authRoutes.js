const express = require('express');
const router = express.Router();
const {authenticateUser
}    = require('../middleware/authentication')

const  {
    register,
    LogIn,
    LogOut,
    verifyEmail,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');


router.route('/register').post(register)
router.route('/login').post(LogIn)
router.route('/logout').delete(authenticateUser, LogOut)
router.route('/verify-email').post(verifyEmail);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').post(resetPassword);






module.exports = router;