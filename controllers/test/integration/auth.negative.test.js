const request = require('supertest');
const fastify = require('../../../index.js');
const mongoose = require('mongoose');


describe('positive scenarios', () => {

    beforeEach(async () => {
        await mongoose
            .connect(process.env.MONGODB_URI, {
                useUnifiedTopology: true,
                keepAlive: true,
                useNewUrlParser: true,
                useFindAndModify: false
            })
    });

    afterEach(async () => {
        // await mongoose.connection.collections.users.drop()
        await mongoose.disconnect()

    })

    it('should return 404 if no user', async () => {

        const token = await fastify.jwt.sign({ id: '123124125214' }, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });

        const loggedUser = await request(fastify.server)
            .post('/auth/login')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userEmail: 'usertest@notfound.com',
                password: 'userpasswordnotfound'
            })
        expect(loggedUser.statusCode).toEqual(404);
    })

    it('should catch exception while creating user', async () => {

        const token = await fastify.jwt.sign({ id: '123124125214' }, { expiresIn: process.env.TOKEN_EXPIRATION_TIME })

        const createdUser = await request(fastify.server)
            .post('/auth/signup')
            .set('Authorization', `Bearer ${token}`)

        expect(createdUser.statusCode).toBe(500);

    })
});