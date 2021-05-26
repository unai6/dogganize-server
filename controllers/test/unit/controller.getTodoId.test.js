const controller = require('../../../controllers/todosController/index');
const mockTodo = require('../mockData/mockTodo.json');
const httpMock = require("node-mocks-http");
const Todo = require('../../../Models/Todo');
Todo.findById = jest.fn();


describe("controller.getTodoById", () => {
    beforeEach(() => {
        Todo.findById.mockClear();
        req = httpMock.createRequest();
        res = httpMock.createResponse();
        req.body = { ...mockTodo }
        req.jwtVerify = jest.fn().mockResolvedValue({})
        res.unauthorized = jest.fn().mockRejectedValue(res.status(401))
        res.internalServerError = jest.fn().mockRejectedValue(res.status(500))
    });

    it('should find todo by id', async () => {
        req.params.todoId = mockTodo[0]._id;

        Todo.findById.mockResolvedValue(req.params.todoId);
        await controller.getTodoId(req, res)

        expect(Todo.findById).toHaveBeenCalledWith(req.params.todoId);
        expect(res._getData()).toEqual({ todo: mockTodo[0]._id });

    });
})