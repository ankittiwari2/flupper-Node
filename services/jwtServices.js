const jwt = require("jsonwebtoken");


class AuthController {
    

  newToken(id, role, email){
    return jwt.sign(
      {
        id: id,
        role: role,
        email: email
      },
     "secret",
    );
  };


  setPassword(id){
    return jwt.sign(
      {
        id: id
      },
      {
        expiresIn: "5m"
      }
    );
  };
}

module.exports=new AuthController()