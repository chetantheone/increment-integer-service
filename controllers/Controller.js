const axios = require("axios");
const Config = require("../config");
const userModel = require("../models/UserModel");
const counterModel = require("../models/CounterModel");
const utilityHelper = require("../helpers/UtilityHelper");

module.exports = {

    async home(req, res) {

        try {

            const {
                client_id: githubClientId
            } = Config.auth.github;

            // if user is authenticated
            if (req.user) {

                return res.render("index", {
                    auth: true,
                    layout: false,
                    name: req.user.username,
                    client_id: githubClientId
                });
            }

            // check if user come form github with code
            const requestToken = req.query.code;
            if (!requestToken) {

                return res.render("index", {
                    auth: false,
                    layout: false,
                    client_id: githubClientId
                });
            }

            // login with github
            const {
                client_id,
                client_secret
            } = Config.auth.github;

            const response = await axios({
                method: 'post',
                url: `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${requestToken}`,
                headers: {
                    accept: 'application/json'
                }
            });

            const accessToken = response.data.access_token;
            const githubUser = await axios('https://api.github.com/user', {
                headers: {
                    Authorization: 'token ' + accessToken
                }
            });

            const {
                login: username
            } = githubUser.data;

            let user = await userModel.findOne({
                username
            }).exec();
            if (!user) {

                // create user
                const userObj = new userModel({
                    username
                });
                user = await userObj.save();

                // create init counter value
                const counterObj = new counterModel({ user_id: user._id });
                await counterObj.save();
            }

            const token = await utilityHelper.createJWTToken({
                id: user._id,
            });

            res.cookie('token', token, {
                httpOnly: true
            });
            res.render("index", {
                auth: true,
                layout: false,
                name: user.username,
                client_id: githubClientId
            });
        } catch (err) {
            return res.render("index", {
                auth: false,
                layout: false,
                client_id: githubClientId
            });
        }
    },

    async nextCounter(req, res) {

        try {

            if (!req.user) {

                throw new Error("Invalid user");
            }

            const counterData = await counterModel.findOneAndUpdate({
                user_id: req.user._id,
            }, {
                $inc: {
                    counter: 1
                }
            }, {
                new: true,
                upsert: true
            }).exec();

            return res.send({
                status: true,
                data: {
                    counter: counterData.counter
                }
            });
        } catch (err) {

            return res.json({
                status: false,
                error: {
                    message: err.message || "Something went wrong"
                }
            });
        }
    },

    async currentCounter(req, res) {

        try {

            if (!req.user) {

                throw new Error("Invalid user");
            }

            const counterData = await counterModel.findOne({
                user_id: req.user._id,
            }).exec();

            return res.send({
                status: true,
                data: {
                    counter: counterData ? counterData.counter : 0
                }
            });
        } catch (err) {

            return res.json({
                status: false,
                error: {
                    message: err.message || "Something went wrong"
                }
            });
        }
    },

    async setCounter(req, res) {

        try {

            if (!req.user) {

                throw new Error("Invalid user");
            }

            let current =  req.body.current || 0;
            current = parseInt( current );

            if( !Number.isInteger( current ) || ( current < -1 ) ) {
                
                throw new Error("Invalid no");
            }

            const counterData = await counterModel.findOneAndUpdate({
                user_id: req.user._id,
            }, {
                $set: {
                    counter: current
                }
            }, {
                new: true,
            }).exec();

            return res.send({
                status: true,
                data: {
                    counter: counterData.counter
                }
            });
        } catch (err) {

            return res.json({
                status: false,
                error: {
                    message: err.message || "Something went wrong"
                }
            });
        }
    },

    async logout( req, res ) {

        const {
            client_id: githubClientId
        } = Config.auth.github;

        res.cookie('token', "", {
            httpOnly: true
        });

        return res.json({
            status: true
        });
    }
};