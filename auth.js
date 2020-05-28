// const jwt = require('jsonwebtoken');
const savedToken = require('./config').token;

const verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    console.log('req.headers : ',req.headers.authorization);    
    console.log('saved token : ',savedToken);
    if (token) {
        
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
            }
            console.log('token : ',token);
            if(token === savedToken){
                next();
            }else{
                res.status(400).send('You are not authorized to make this request!');
            }
        // jwt.verify(token, config.secretKey, (err, decoded) => {
        //     if (err) {
        //     return res.json({
        //         success: false,
        //         message: 'Token is not valid'
        //     });
        //     } else {
        //     req.decoded = decoded;
        //     next();
        //     }
        // });
    } else {
      return res.json({
        success: false,
        message: 'Auth token is not supplied or invalid'
      });
    }
  };

  module.exports = {
      verifyToken,
  }