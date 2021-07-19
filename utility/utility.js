const bcrypt = require('bcrypt');


exports.generateHash = (text) => {
    return bcrypt.hashSync(text, 12)
  }
  
  
  exports.comparePassword = (text, password) => {
    return bcrypt.compareSync(text, password)
  }