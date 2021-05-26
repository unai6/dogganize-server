
const controller = require('../../../controllers/todosController/index');
const mockTodo = require('../mockData/mockTodo.json');
const mockUser = require('../mockData/mockUser.json');
const httpMock = require("node-mocks-http");
const Todo = require('../../../Models/Todo');
const User = require('../../../Models/User');

Todo.findByIdAndDelete = jest.fn();
User.findById = jest.fn();
User.findByIdAndUpdate = jest.fn();
Todo.findById = jest.fn();

describe('controller.deleteTodo', () => {
    beforeEach(() => {
        Todo.findByIdAndDelete.mockClear();
        Todo.findById.mockClear();
        User.findById.mockClear();
        User.findByIdAndUpdate.mockClear();
        req = httpMock.createRequest();
        res = httpMock.createResponse();
        req.jwtVerify = jest.fn().mockResolvedValue({})
        res.unauthorized = jest.fn().mockRejectedValue(res.status(401))
        res.internalServerError = jest.fn().mockRejectedValue(res.status(500))
    });

    it('should be a function', () => {
        expect(typeof controller.deleteTodo).toBe("function");
    });

    it('should delete todo and update user', async () => {
        req.params.userId = mockUser[0]._id;
        req.params.todoId = mockTodo[0]._id;

        Todo.findByIdAndDelete.mockResolvedValue(req.params.todoId);
        Todo.findById.mockReturnValue(req.params.todoId)

        await controller.deleteTodo(req, res);
        expect(Todo.findByIdAndDelete).toHaveBeenCalledWith(req.params.todoId);
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(req.params.userId, { $pull: { todos: mockTodo[0]._id } }, { new: true })
        expect(res._getData()).toEqual({ message: 'Todo deleted successfully' })
        



    })
})