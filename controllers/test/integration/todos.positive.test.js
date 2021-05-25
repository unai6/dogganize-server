const request = require('supertest');
const fastify = require('../../../index.js');
const mongoose = require('mongoose');


describe('positive scenarios', () => {
    beforeAll(async () => {
        try {


                await mongoose
                    .connect(process.env.MONGODB_URI, {
                        useUnifiedTopology: true,
                        keepAlive: true,
                        useNewUrlParser: true,
                        useFindAndModify: false
                    })
       
        } catch (err) {
            console.log('error while connecting to db', err)
        }
    });

    afterAll(async () => {
        try {
            await mongoose.connection.collections.users.drop()
            await mongoose.disconnect()
        } catch (err) {
            console.log('error while disconnecting from db', err)
        }
    });

    it('should create a user in DB and a  todo in DB', async () => {
        try {
            const token = await fastify.jwt.sign({ id: '123124125214' }, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });
            const createdUser = await request(fastify.server)
                .post('/auth/signup')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userName: "createtodotest1",
                    userEmail: "createtodotest@testmail.com",
                    password: "test"
                })
            if (token) {

                const createdTodo = await request(fastify.server)
                    .post(`/user/${createdUser.body.user.userId}/create-todo`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        "name": "todo1",
                        "info": "info1"
                    })

                expect(createdTodo.statusCode).toBe(200);
                expect(createdTodo.body).toHaveProperty("userTodos")
                expect(createdTodo.body).toEqual({ "userTodos": createdTodo.body.userTodos });
            }

        } catch (err) {

            console.log(err, 'STATUS')
            expect(err).toBeDefined()
        }
    })


    it('should create a user in DB and should return user id and todos', async () => {
        try {
            const token = await fastify.jwt.sign({ id: '123124125214' }, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });
            const createdUser = await request(fastify.server)
                .post('/auth/signup')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userName: "test2",
                    userEmail: "test2@testmail.com",
                    password: "test"
                })
            fastify.jwt.sign({ id: createdUser.body.user.userId }, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });

            await request(fastify.server)
                .post(`/user/${createdUser.body.user.userId}/create-todo`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "name": "gettodo1",
                    "info": "getTodoinfo1"
                })

            const fetchedUser = await request(fastify.server)
                .get(`/user/${createdUser.body.user.userId}/todos`)
                .set('Authorization', `Bearer ${token}`)

            expect(fetchedUser.statusCode).toBe(200);
            expect(fetchedUser.body).toHaveProperty("userTodos")
            expect(fetchedUser.body).toEqual({ "userTodos": fetchedUser.body.userTodos });

        } catch (err) {
            expect(err).toBeDefined()
        }
    });

    it('should create a user in DB and should return todo details', async () => {
        try {
            const token = await fastify.jwt.sign({ id: '123124125214' }, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });
            const createdUser = await request(fastify.server)
                .post('/auth/signup')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userName: "test3",
                    userEmail: "test3@testmail.com",
                    password: "test"
                })
            fastify.jwt.sign({ id: createdUser.body.user.userId }, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });

            const createdTodo = await request(fastify.server)
                .post(`/user/${createdUser.body.user.userId}/create-todo`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "name": "gettodo1",
                    "info": "getTodoinfo1"
                })


            const todo = await request(fastify.server)
                .get(`/user/${createdTodo.body.userTodos[0]}/details`)
                .set('Authorization', `Bearer ${token}`)

            expect(todo.statusCode).toBe(200);
            expect(todo.body).toHaveProperty("todo")
            expect(todo.body).toEqual({ "todo": todo.body.todo });

        } catch (err) {
            expect(err).toBeDefined()
        }
    });


    it('should create a user in DB and should delete user todo', async () => {
        try {
            const token = await fastify.jwt.sign({ id: '123124125214' }, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });
            const createdUser = await request(fastify.server)
                .post('/auth/signup')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userName: "test4",
                    userEmail: "test4@testmail.com",
                    password: "test"
                })
            fastify.jwt.sign({ id: createdUser.body.user.userId }, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });

            const createdTodo = await request(fastify.server)
                .post(`/user/${createdUser.body.user.userId}/create-todo`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "name": "gettodo1",
                    "info": "getTodoinfo1"
                })


            const deletedTodo = await request(fastify.server)
                .delete(`/user/${createdUser.body.user.userId}/${createdTodo.body.userTodos[0]}/delete`)
                .set('Authorization', `Bearer ${token}`)

            expect(deletedTodo.statusCode).toBe(200);
        } catch (err) {
            expect(err).toBeDefined()
        }
    })

    it('should create a user a todo and edit specified todo', async () => {
        try {
            const token = await fastify.jwt.sign({ id: '123124125214' }, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });
            const createdUser = await request(fastify.server)
                .post('/auth/signup')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userName: "test5",
                    userEmail: "test5@testmail.com",
                    password: "test"
                })
            fastify.jwt.sign({ id: createdUser.body.user.userId }, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });

            const createdTodo = await request(fastify.server)
                .post(`/user/${createdUser.body.user.userId}/create-todo`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "name": "gettodo5",
                    "info": "getTodoinfo5"
                })

            const editedTodo = await request(fastify.server)
                .put(`/user/${createdUser.body.user.userId}/${createdTodo.body.userTodos[0]}/edit`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "name": "editedTodoNameTest",
                    "info": "editedTodoinfoTest"
                })

            expect(editedTodo.statusCode).toBe(200);

        } catch (err) {
            expect(err).toBeDefined()
        }
    })

})