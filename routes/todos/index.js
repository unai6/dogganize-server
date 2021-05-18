const todosController = require('../../controllers/todosController/index.js');

const routes = [
    {
        method: 'GET',
        url: '/user/:userId/todos',
        handler: todosController.getTodos,

    },
    {
        method: 'GET',
        url: '/user/:todoId/details',
        handler: todosController.getTodoId
    },

    {
        method: 'POST',
        url: '/user/:userId/create-todo',
        handler: todosController.createTodo
    },
    {
        method: 'PUT',
        url: '/user/:userId/:todoId/edit',
        handler: todosController.editTodo
    },
    {
        method: 'DELETE',
        url: '/user/:userId/:todoId/delete',
        handler: todosController.deleteTodo
    }
];



module.exports = routes;