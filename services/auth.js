const jwt = require('jsonwebtoken');
const UserModel = require("../models/userModel")

let  Auth = async (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(401).send({ message: "Unauthorized" });
    } else {
        try {
            const decoded = jwt.verify(req.headers.authorization, "secret");
           
          
           const user = await UserModel.findById(decoded.id);

         
           req.loggedInUser = user;

           
            if (!user) {
                  return res.status(400).json({message:"Unauthorized access",status:400})
            }

            req.user = {
                _id: user._id
            };
            
            next();
        } catch (err) {
            console.log(err)
            res.status(401).send(err.message);
        }
    }
};

module.exports= Auth
