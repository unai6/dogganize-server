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

    afterAll(async () => {
            await mongoose.disconnect();

    })

    it('should signup new user in db', async () => {
            const token = await fastify.jwt.sign({ id: '123124125214' }, { expiresIn: process.env.TOKEN_EXPIRATION_TIME })

            const createdUser = await request(fastify.server)
                .post('/auth/signup')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userName: "signuptest1",
                    userEmail: "signuptest@testmail.com",
                    password: "test"
                })

            expect(createdUser.statusCode).toBe(200);
    })

    it('should login properly created user', async () => {

            const token = await fastify.jwt.sign({ id: '123124125214' }, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });
            const createdUser = await request(fastify.server)
                .post('/auth/signup')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userName: "signup2test",
                    userEmail: "signup2test@testmail.com",
                    password: "test"
                })


            const loggedUser = await request(fastify.server)
            .post('/auth/login')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userEmail: createdUser.body.user.userEmail,
                password: createdUser.body.user.password
            })

            expect(createdUser.password).toEqual(loggedUser.password)

    })
});