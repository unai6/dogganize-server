require("dotenv").config();

const fastify = require('fastify')();

const PUBLIC_DOMAIN = "https://dogganize.netlify.app" || process.env.PUBLIC_DOMAIN;
fastify.register(require('fastify-cors'), {
    origin: [PUBLIC_DOMAIN, "http://www.fontawesome.com", 'http://localhost:8080'],
    credentials: true
});
fastify.register(require('fastify-formbody'));
fastify.register(require('fastify-jwt'), {
    secret: process.env.SECRET_KEY,
});
fastify.register(require('fastify-sensible'));


const connectToDB = require('./DB/db');
const PORT = process.env.PORT;

const routes = require('./routes/index.js');
routes.todosRouter.forEach((route) => {
    fastify.route(route);
});
routes.authRoutes.forEach((route) => {
    fastify.route(route);
});

const server = async () => {
    try {
        await fastify.listen(PORT, '0.0.0.0');
        console.log(`server Listening on Port ${PORT}`)
    } catch (error) {
        console.log('Error while connecting to server', error)
    }
};

connectToDB();
server();

module.exports = fastify