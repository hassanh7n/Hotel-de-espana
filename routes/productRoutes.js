const express = require('express');
const router = express.Router();
const {authenticateUser,
    authorizePermissions
    }    = require('../middleware/authentication')

const {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage
} = require('../controllers/ProductControllers');


router.route('/').get(getAllProducts);
router.route('/:id').get(getSingleProduct);
router.route('/').post(authenticateUser, authorizePermissions('admin'), createProduct);
router.route('/image').post(authenticateUser, authorizePermissions('admin'), uploadImage)
router.route('/:id').patch(authenticateUser, authorizePermissions('admin'), updateProduct);
router.route('/:id').delete(authenticateUser, authorizePermissions('admin'), deleteProduct);


module.exports = router;