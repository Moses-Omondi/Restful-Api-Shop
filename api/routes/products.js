const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProductController = require('../controllers/products');


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        cb(null, new Date() + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg or .png files are accepted'), false);
    }
};

const upload = multer({ storage: storage, limit: {
    filesize: 1024 * 1024 * 50000
}, fileFilter: fileFilter});

router.get('/', ProductController.products_get_all);

router.post("/", checkAuth, upload.single('productImage'), ProductController.products_post_product);

router.get('/:productId', ProductController.products_get_one_product);

router.patch('/:productId', checkAuth, ProductController.products_update_one_product);

router.delete('/:productId', checkAuth, ProductController.products_delete_one_product);

module.exports = router;