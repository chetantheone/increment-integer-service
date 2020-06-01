const Config = require('../config');
const jwt = require('jsonwebtoken');
const userModel = require("../models/UserModel");

module.exports = {

	createJWTToken: async( userDetails ) => { 

		const { sign_key, algorithm, ttl } = Config.jwt;
  		return jwt.sign(userDetails, sign_key, {

			algorithm, 
			expiresIn: ttl 
		});
    },

    authriseToken( req, res, next ) {
        if(!req.cookies.token) {
            req.user = null;
            return next();
        }
    
        const decoded = jwt.verify( req.cookies.token, Config.jwt.sign_key);
        userModel.findOne({
            _id: decoded.id
        }, ( err, user )=> {

            req.user = (err || !user) ? null: user;
            next();
        });
    },
}