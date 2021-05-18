const User = require('../../Models/User');
const Todo = require('../../Models/Todo');
const tokenMaxAge = process.env.TOKEN_MAX_AGE;

const todos = {
    createTodo: async (req, res) => {
        await req.jwtVerify({ maxAge: tokenMaxAge });

        const { userId } = req.params;
        const { name, info } = req.body;

        try {
            const newTodo = await Todo.create({ name, info })
            const user = await User.findById(userId);
            const updatedUser = await User.findByIdAndUpdate(user, { $push: { userTodos: newTodo._id } }, { new: true })

            res.status(200).send({
                userTodos: updatedUser.userTodos
            })
        } catch (err) {
            console.log(err)
        }

    },

    getTodos: async (req, res) => {
        const { userId } = req.params
        try {
            const token = await req.jwtVerify({ maxAge: tokenMaxAge });

            if (!token) {
                console.log('Error, no token provided')
            }

            const user = await User.findById(userId).populate('userTodos')

            res.status(200).send({
                userTodos: user.userTodos,
            })
        } catch (err) {
            res.status(400).send({
                error: err,
            })
        }
    },

    getTodoId: async (req, res) => {

        const { todoId } = req.params;

        try {
            await req.jwtVerify({ maxAge: tokenMaxAge });
            const todo = await Todo.findById(todoId);

            res.status(200).send({
                todo
            })
        } catch (err) {
            res.status(400).send({
                error: err
            })
        }
    },

    editTodo: async (req, res) => {

        const { todoId, userId } = req.params;
        const { name, info } = req.body;

        try {

            await req.jwtVerify({ maxAge: tokenMaxAge });

            const updatedTodo = await Todo.findByIdAndUpdate(todoId, { $set: { name, info } }, { new: true })
            const updatedUser = await User.findByIdAndUpdate(userId, { updatedTodo }, { new: true })

            res.status(200).send({
                todo: updatedTodo,
                user: updatedUser
            })
        } catch (err) {
            console.log(err)
            res.status(400).send({
                error: err
            })
        }
    },

    deleteTodo: async (req, res) => {

        const { userId, todoId } = req.params;

        try {

            await req.jwtVerify({ maxAge: tokenMaxAge });
            const todo = await Todo.findById(todoId);
            await Todo.findByIdAndDelete(todo);
            const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { todos: todo } }, { new: true })

            res.status(200).send({
                message: 'Todo deleted successfully',
                updatedUser
            });


        } catch (err) {
            res.status(400).send({
                error: err
            })
        }

    }
}

module.exports = todos;