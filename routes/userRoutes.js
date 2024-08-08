const express = require('express');
const router = express.Router();

const {authenticateUser,
    authorizePermissions
    }    = require('../middleware/authentication')
const {
    getAllUser,
    singleUser,
    showMe,
    forgotPassword,
    updateUser
} = require('../controllers/userControllers');


router.route('/').get(authenticateUser, authorizePermissions('admin'),getAllUser)
router.route('/showMe').get(authenticateUser, showMe)
router.route('/updatePassword').patch(authenticateUser, forgotPassword)
router.route('/userUpdate').patch(authenticateUser, updateUser)
router.route('/:id').get(authenticateUser, singleUser)




module.exports = router;