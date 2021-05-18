
const User = require('../../Models/User');
const UserToken = require('../../Models/UserToken');
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const saltRounds = 10;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const auth = {
    signUpWithGoogle: async (req, res) => {

        try {
            const { googleToken } = req.body;

            const response = await client.verifyIdToken({ idToken: googleToken, audience: process.env.GOOGLE_CLIENT_ID });
            const { name, email } = response.payload;
            const user = await User.findOne({ userEmail: email });

            if (!user) {
                const user = await User.create({ userName: name, userEmail: email });
                const token = await res.jwtSign({ id: user._id }, { expiresIn: '1h' });

                res.status(200).send({
                    user: {
                        userId: user.id,
                        email: user.userEmail,
                        userToken: token
                    }
                });
            } else {
                const token = await res.jwtSign({ id: user._id }, { expiresIn: '1h' });

                res.status(200).send({
                    user: {
                        userId: user.id,
                        email: user.userEmail,
                        userToken: token
                    }
                });
            }
        } catch (error) {
            console.log(error)
        }
    },
    signup: async (req, res) => {
        const { userName, userEmail, password } = req.body;
        const user = await User.findOne({ userEmail });

        try {

            if (user) {
                res.status(401).send({
                    message: "User already exists in DB"
                })
            } else {

                const salt = bcrypt.genSaltSync(saltRounds);
                const hashPass = bcrypt.hashSync(password, salt);
                const newUser = await User.create({ userEmail, password: hashPass, userName });
                const emailToken = await UserToken.create({ _userId: newUser._id, token: crypto.randomBytes(16).toString('hex') });

                const token = await res.jwtSign({ id: newUser._id }, { expiresIn: '1h' });
                res.status(200).send({
                    user: {
                        userId: newUser.id,
                        email: newUser.userEmail,
                        userToken: token,
                        emailToken
                    }
                });
            }
        } catch (err) {

            console.log('ERROR', err)
        }
    },

    login: async (req, res) => {
        const { userEmail, password } = req.body;

        try {

            const user = await User.findOne({ userEmail });
            const token = await res.jwtSign({ id: user._id }, { expiresIn: '1h' });


            if (!user) return res.status(404).send({ mssg: 'User not found' });

            const passCorrect = bcrypt.compareSync(password, user.password);

            if (!passCorrect) {
                return res.status(401).send({ msg: 'Email or password not valid' })

            } else if (passCorrect) {

                res.status(200).send({
                    user: {
                        userId: user.id,
                        email: user.userEmail,
                        userToken: token
                    }
                });
            }
        } catch (err) {
            console.log(err);
            res.send({ msg: "Error while authenticating", err });
        }
    }
}

module.exports = auth;