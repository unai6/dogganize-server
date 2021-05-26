
const controller = require('../../../controllers/todosController/index');
const mockTodo = require('../mockData/mockTodo.json');
const mockUser = require('../mockData/mockUser.json');
const httpMock = require("node-mocks-http");
const Todo = require('../../../Models/Todo');
const User = require('../../../Models/User');
User.findByIdAndUpdate = jest.fn();
Todo.findByIdAndUpdate = jest.fn();
Todo.create = jest.fn()
Todo.findOne = jest.fn();

describe("controller.createTodo", () => {
    beforeEach(() => {

        User.findByIdAndUpdate.mockClear();
        Todo.findByIdAndUpdate.mockClear();
        Todo.findOne.mockClear();
        Todo.create.mockClear();
        req = httpMock.createRequest();
        res = httpMock.createResponse();
        req.body = { ...mockTodo }
        req.jwtVerify = jest.fn().mockResolvedValue({})
        res.unauthorized = jest.fn().mockRejectedValue(res.status(401))
        res.internalServerError = jest.fn().mockRejectedValue(res.status(500))
    });


    it('editTodo should be a function', () => {
        expect(typeof controller.editTodo).toBe("function")
    });

    it('should edit new Todo', async () => {
        req.params.userId = mockUser[0]._id;
        req.params.todoId = mockTodo[0]._id

        let toUpdate = { ...mockTodo[0], info: 'updatedTodo' }
        req.body = { ...toUpdate }
        Todo.findOne.mockReturnValue(false);
        User.findByIdAndUpdate.mockReturnValue({ ...mockUser[0], ...toUpdate })
        Todo.findByIdAndUpdate.mockReturnValue(toUpdate)
        await controller.editTodo(req, res);
        expect(res.statusCode).toBe(200);
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(req.params.userId, { updatedTodo: toUpdate }, { new: true });
        expect(Todo.findByIdAndUpdate).toHaveBeenCalled();
        expect(res._getData()).toHaveProperty("todo");
        expect(res._getData()).toEqual({ todo: toUpdate })
    })
})