const request = require('supertest');
const fastify = require('../../../index.js');
const mongoose = require('mongoose');


describe('negative scenarios', () => {
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
        await mongoose.disconnect()
    });

    it('should return 401 if not authorization at CREATE TODO', async () => {
        try {
            const token = await fastify.jwt.sign({ id: '123124125214' }, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });

            const createdUser = await request(fastify.server)
                .post('/auth/signup')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "userName": "negativetest1",
                    "userEmail": "negativetest@testmail.com",
                    "password": "test"
                })

            const createdTodo = await request(fastify.server)
                .post(`/user/${createdUser.body.user.userId}/create-todo`)
                .send({
                    "name": "todo1",
                    "info": "info1"
                })
            expect(createdTodo.statusCode).toBe(401);


        } catch (err) {
            console.log(err)
        }
    })

    it('should return 500 if no payload at CREATE TODO', async () => {

        try {
            const token = await fastify.jwt.sign({ id: '123124125214' }, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });

            const createdUser = await request(fastify.server)
                .post('/auth/signup')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "userName": "negativetest1500",
                    "userEmail": "negativetest500@testmail.com",
                    "password": "test"
                })
            const createdTodo = await request(fastify.server)
                .post(`/user/${createdUser.body.user.userId}/create-todo`)
                .set('Authorization', `Bearer ${token}`)


            expect(createdTodo.statusCode).toBe(500);


        } catch (err) {
            console.log(err)
        }
    })

    it('should return 401 if not authorization at GET USER TODOS', async () => {
        try {
            const token = await fastify.jwt.sign({ id: '123124125214' }, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });

            const createdUser = await request(fastify.server)
                .post('/auth/signup')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "userName": "negativetest2",
                    "userEmail": "negativetest2@testmail.com",
                    "password": "test"
                })

            await request(fastify.server)
                .post(`/user/${createdUser.body.user.userId}/create-todo`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "name": "gettodo1",
                    "info": "getTodoinfo1"
                })

            const fetchedUser = await request(fastify.server)
                .get(`/user/${createdUser.body.user.userId}/todos`)

            expect(fetchedUser.statusCode).toBe(401);

        } catch (err) {
            console.log(err)
        }
    });

    it('should return 500 if no created TODO to retrieve at GET TODO ID', async () => {
        try {
            const token = await fastify.jwt.sign({ id: '123124125214' }, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });
            const createdUser = await request(fastify.server)
                .post('/auth/signup')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "userName": "negativetest3500",
                    "userEmail": "negativetest3500@testmail.com",
                    "password": "test"
                })

            const todo = await request(fastify.server)
                .get(`/user/11233244/details`)
                .set('Authorization', `Bearer ${token}`)

            expect(todo.statusCode).toBe(500);

        } catch (err) {
            console.log(err)
        }
    });


    it('should return 401 if unauthorized at DELETE TODO', async () => {
        try {
            const token = await fastify.jwt.sign({ id: '123124125214' }, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });
            const createdUser = await request(fastify.server)
                .post('/auth/signup')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "userName": "negativetest4",
                    "userEmail": "negativetest4@testmail.com",
                    "password": "test"
                })

            const createdTodo = await request(fastify.server)
                .post(`/user/${createdUser.body.user.userId}/create-todo`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "name": "gettodo1",
                    "info": "getTodoinfo1"
                })


            const deletedTodo = await request(fastify.server)
                .delete(`/user/${createdUser.body.user.userId}/${createdTodo.body.userTodos[0]}/delete`)


            expect(deletedTodo.statusCode).toBe(401);
        } catch (err) {
            console.log(err)
        }
    })
    it('should return 500 if exception thrown because no created todo at DELETE TODO', async () => {
        try {
            const token = await fastify.jwt.sign({ id: '123124125214' }, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });
            const createdUser = await request(fastify.server)
                .post('/auth/signup')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "userName": "negativetest4500",
                    "userEmail": "negativetest4500@testmail.com",
                    "password": "test"
                })

            const deletedTodo = await request(fastify.server)
                .delete(`/user/${createdUser.body.user.userId}/123123444/delete`)
                .set('Authorization', `Bearer ${token}`)


            expect(deletedTodo.statusCode).toBe(500);
        } catch (err) {
            console.log(err)
        }
    })

    it('should return 401 if unauthorized at EDIT TODO', async () => {
        try {
            const token = await fastify.jwt.sign({ id: '123124125214' }, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });
            const createdUser = await request(fastify.server)
                .post('/auth/signup')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "userName": "negativetest5",
                    "userEmail": "negativetest5@testmail.com",
                    "password": "test"
                })

            const createdTodo = await request(fastify.server)
                .post(`/user/${createdUser.body.user.userId}/create-todo`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "name": "gettodo5",
                    "info": "getTodoinfo5"
                })

            const editedTodo = await request(fastify.server)
                .put(`/user/${createdUser.body.user.userId}/${createdTodo.body.userTodos[0]}/edit`)
                .send({
                    "name": "editedTodoNameTest",
                    "info": "editedTodoinfoTest"
                })

            expect(editedTodo.statusCode).toBe(401);

        } catch (err) {
            console.log(err)
        }
    })
    it('should return 500 if exception thrown because no todo created at EDIT TODO', async () => {
        try {
            const token = await fastify.jwt.sign({ id: '123124125214' }, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });
            const createdUser = await request(fastify.server)
                .post('/auth/signup')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "userName": "negativetest5500",
                    "userEmail": "negativetest5500@testmail.com",
                    "password": "test"
                })


            const editedTodo = await request(fastify.server)
                .put(`/user/${createdUser.body.user.userId}/1231233/edit`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "name": "editedTodoNameTest",
                    "info": "editedTodoinfoTest"
                })

            expect(editedTodo.statusCode).toBe(500);

        } catch (err) {
            console.log(err)
        }
    })

});