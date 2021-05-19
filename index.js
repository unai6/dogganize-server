require("dotenv").config();

const fastify = require('fastify')({ logger: true });
const PUBLIC_DOMAIN = "https://dogganize.netlify.app" || process.env.PUBLIC_DOMAIN
fastify.register(require('fastify-cors'), {
    origin: [PUBLIC_DOMAIN, "http://www.fontawesome.com"],
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
        console.log('Error while connetcting to server', error)
    }
};

connectToDB();
initServer();