require("dotenv").config();
const { _secretKey } = require('./config.js');

const fastify = require('fastify')();
fastify.register(require('fastify-cors'), {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200
})
fastify.register(require('fastify-formbody'));
fastify.register(require('fastify-jwt'), {
    secret: _secretKey,
});


const connectToDB = require('./DB/db');
const routes = require('./routes/index.js');


routes.todosRouter.forEach((route, _) => {
    fastify.route(route);
});
routes.authRoutes.forEach((route, _) => {
    fastify.route(route)
});

const initServer = async () => {
    try {
        await fastify.listen(process.env.PORT);
        console.log(`server Listening on Port ${process.env.PORT}`)
    } catch (error) {
        console.log(error)
    }
};

connectToDB();
initServer();