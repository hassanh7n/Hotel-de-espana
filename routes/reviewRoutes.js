const express = require('express');
const router = express.Router();
const {authenticateUser,
    authorizePermissions
    }    = require('../middleware/authentication')
const {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');


router.route('/').post(authenticateUser, createReview);
router.route('/:id').get(getSingleReview);
router.route('/').get(getAllReviews);
router.route('/:id').patch(authenticateUser, updateReview);
router.route('/:id').delete(authenticateUser, deleteReview);


module.exports = router;