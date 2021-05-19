require("dotenv").config();

const fastify = require('fastify')();
fastify.register(require('fastify-cors'), {
    origin: ["http://localhost:8080", "http://www.fontawesome.com", "https://dogganize.netlify.app", process.env.PUBLIC_DOMAIN],
    credentials: true
})
fastify.register(require('fastify-formbody'));
fastify.register(require('fastify-jwt'), {
    secret: "SECRET_KEY_TEST_TODO_!123asd$$5&&_sadsdad--2",
});

const PORT = process.env.PORT || 4000
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
        await fastify.listen(PORT);
        console.log(`server Listening on Port ${PORT}`)
    } catch (error) {
        console.log(error)
    }
};

connectToDB();
initServer();