const authController = require('../../controllers/authController/index.js');

const routes = [

    {
        method: 'POST',
        url: '/auth/google-signup',
        handler: authController.signUpWithGoogle
    },
    {
        method: 'POST',
        url: '/auth/signup',
        handler: authController.signup
    },
    {
        method: 'POST',
        url: '/auth/login',
        handler: authController.login
    }
]

module.exports = routes;