const utility = require("../utility/utility");
const user = require("../models/userModel");
const jwtservice = require("../services/jwtServices");
const product = require("../models/productModel");
const wishList = require("../models/wishListModel");
const category = require("../models/productCategoryModel");
var mongoose = require('mongoose');
const Joi = require("@hapi/joi");

exports.signup = async (req, res, next) => {
  try {

    const validationSchema = Joi.object().keys({
        email: Joi.string()
          .required()
          .error(() => {
            return { message: "Please enter Email" };
          }),
        password: Joi.string()
          .required()
          .error(() => {
            return { message: "Please enter password" };
          }),
        userName: Joi.string()
          .required()
          .error(() => {
            return { message: "Please enter userName" };
          })
      });
  
      const validationResult = validationSchema.validate(req.body, validationSchema);
  
      if (validationResult.error) {
        return res.status(400).json({ message: validationResult.error.details[0].message });
      }
  
  
    let recordExists = await user.findOne({ email: validationResult.value.email });

    if (recordExists) {
      return res
        .status(200)
        .json({ message: "email already exists", status: 400 });
    }

    let hashPassword = utility.generateHash(validationResult.value.password);

    validationResult.value.password = hashPassword;

    await user.create(validationResult.value);

    return res.status(200).json({ message: "Sucess", status: 200 });
  } catch (err) {
    return res.status(500).json({ message: err.message, status: err.status });
  }
};

exports.login = async (req, res, next) => {
  try {
    const validationSchema = Joi.object().keys({
      email: Joi.string()
        .required()
        .error(() => {
          return { message: "Please enter Email" };
        }),
      password: Joi.string()
        .required()
        .error(() => {
          return { message: "Please enter password" };
        })
    });

    const validationResult = Joi.validate(req.body, validationSchema);

    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.error.details[0].message });
    }


    let userData = await user.findOne({ email: validationResult.value.email });

    if (!userData) {
      return res.status(400).json({ message: "No record found", status: 400 });
    }
    let hashPassword = utility.comparePassword(
      validationResult.value.password,
      userData.password
    );

    let newToken;
    if (hashPassword) {
      newToken = jwtservice.newToken(userData._id, "user", userData.email);
    }

    return res
      .status(200)
      .json({ message: "Sucess", status: 200, data: newToken });
  } catch (err) {
    return res.status(500).json({ message: err.message, status: err.status });
  }
};

exports.createproduct = async (req, res, next) => {
  try {
    const validationSchema = Joi.object().keys({
      productName: Joi.string()
        .required()
        .error(() => {
          return { message: "Please enter product Name" };
        }),
        productCategory: Joi.string()
        .required()
        .error(() => {
          return { message: "Please enter Product Category" };
        }),
        quantity: Joi.string()
          .required()
          .error(() => {
            return { message: "Please enter quantity" };
          })
    });

    const validationResult = Joi.validate(req.body, validationSchema);

    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.error.details[0].message });
    }

    let userid = req.loggedInUser._id;

    validationResult.value.createdBy = userid;

    let productData = await product.create(validationResult.value);

    return res.status(200).json({ message: "Sucess", status: 200 });
  } catch (err) {
    return res.status(500).json({ message: err.message, status: err.status });
  }
};

exports.likeProductWishlist = async (req, res, next) => {
  try {
    const validationSchema = Joi.object().keys({
      productId: Joi.string()
        .required()
        .error(() => {
          return { message: "Please enter product" };
        })
    });

    const validationResult = Joi.validate(req.body, validationSchema);

    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.error.details[0].message });
    }

    let userid = req.loggedInUser._id;

    validationResult.value.userId = userid;

    //check for already liked product
    let productList = await wishList.find({
      userId: userid,
      productId: validationResult.value.productId,
    });

    if (productList.length > 0) {
      return res
        .status(200)
        .json({ message: "You already liked this product", status: 200 });
    }

    let productData = await wishList.create(validationResult.value);

    return res.status(200).json({ message: "Sucess", status: 200 });
  } catch (err) {
    return res.status(500).json({ message: err.message, status: err.status });
  }
};

exports.UnlikeProductWishlist = async (req, res, next) => {
  try {
    const validationSchema = Joi.object().keys({
      productId: Joi.string()
        .required()
        .error(() => {
          return { message: "Please enter product" };
        })
    });

    const validationResult = Joi.validate(req.body, validationSchema);

    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.error.details[0].message });
    }
    let userid = req.loggedInUser._id;

    validationResult.value.userId = userid;

    //check for already liked product
    let productList = await wishList.findOneAndDelete({
      userId: userid,
      productId: validationResult.value.productId,
    });

    if (productList.length > 0) {
      return res
        .status(200)
        .json({ message: "You already liked this product", status: 200 });
    }

    let productData = await wishList.create(validationResult.value);

    return res.status(200).json({ message: "Sucess", status: 200 });
  } catch (err) {
    return res.status(500).json({ message: err.message, status: err.status });
  }
};

exports.getWishList = async (req, res, next) => {
  try {
    let userId = req.loggedInUser._id;

    let wishListData = await wishList.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $lookup: {
          from: "product",
          localField: "productId",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $unwind: "$productInfo",
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user_Info",
        },
      },
      {
        $unwind: "$user_Info",
      },
      {
        $project: {
          _id: 1,
          email: "$user_Info.email",
          productName: "$productInfo.productName",
          quantity: "$productInfo.quantity",
        },
      },
    ]);

    return res
      .status(200)
      .json({ message: "Sucess", status: 200, data: wishListData });
  } catch (err) {
    return res.status(500).json({ message: err.message, status: err.status });
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const validationSchema = Joi.object().keys({
      name: Joi.string()
        .required()
        .error(() => {
          return { message: "Please enter Name" };
        })
    });

    const validationResult = Joi.validate(req.body, validationSchema);

    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.error.details[0].message });
    }
   
    let wishListData = await category.create(validationResult.value);

    return res.status(200).json({ message: "Sucess", status: 200 });
  } catch (err) {
    return res.status(500).json({ message: err.message, status: err.status });
  }
};

exports.getCombineDataOfProductAndCategory = async (req, res, next) => {
  try {
    let wishListData = await category.aggregate([
      {
        $lookup: {
          from: "product",
          localField: "_id",
          foreignField: "productCategory",
          as: "combineData",
        },
      },
    ]);

    return res
      .status(200)
      .json({ message: "Sucess", status: 200, data: wishListData });
  } catch (err) {
    return res.status(500).json({ message: err.message, status: err.status });
  }
};

exports.getLikeCount = async (req, res, next) => {
  try {
    let productId = req.params.productId;
    let newid = mongoose.Types.ObjectId(productId);
    let wishListcount = await wishList.aggregate([
      { $match: { productId: newid } },
      { $group: { _id: "$productId", count: { $sum: 1 } } },
    ]);

    return res
      .status(200)
      .json({ message: "Sucess", status: 200, data: wishListcount });
  } catch (err) {
    return res.status(500).json({ message: err.message, status: err.status });
  }
};
