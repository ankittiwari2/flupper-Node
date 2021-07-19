var express = require('express');
var router = express.Router();
const userControlers = require('../controllers/userControlers')
const DIR = './public/images/';
const Auth = require('../services/auth')

let path = require('path')
var multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

var Upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
});

/* GET users listing. */



router.post('/signup',userControlers.signup)


router.post('/login',userControlers.login)


router.post('/createProduct',Auth,userControlers.createproduct)



router.post('/likeProductWishlist',Auth,userControlers.likeProductWishlist)



router.post('/UnlikeProductWishlist',Auth,userControlers.UnlikeProductWishlist)



router.get('/getWishList',Auth,userControlers.getWishList)



router.post('/createCategory',Auth,userControlers.createCategory)


router.post('/getCombineDataOfProductAndCategory',Auth,userControlers.getCombineDataOfProductAndCategory)



router.get('/getLikeCount/:productId',Auth,userControlers.getLikeCount)

module.exports = router;
