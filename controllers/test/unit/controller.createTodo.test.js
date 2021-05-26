
const controller = require('../../../controllers/todosController/index');
const mockTodo = require('../mockData/mockTodo.json');
const mockUser = require('../mockData/mockUser.json');
const httpMock = require("node-mocks-http");
const Todo = require('../../../Models/Todo');
const User = require('../../../Models/User');
User.findById = jest.fn();
User.findByIdAndUpdate = jest.fn();
Todo.create = jest.fn();
Todo.findOne = jest.fn();


describe("controller.createTodo", () => {
    beforeEach(() => {
        User.findById.mockClear();
        User.findByIdAndUpdate.mockClear();
        Todo.create.mockClear();
        Todo.findOne.mockClear();
        req = httpMock.createRequest();
        res = httpMock.createResponse();
        req.jwtVerify = jest.fn().mockResolvedValue({});
        req.body = { ...mockTodo }
        res.unauthorized = jest.fn().mockRejectedValue(res.status(401))
        res.internalServerError = jest.fn().mockRejectedValue(res.status(500))
    });


    it('createTodo should be a function', () => {
        expect(typeof controller.createTodo).toBe("function")
    });

    it('should create new Todo', async () => {
        const createdTodo = { ...mockTodo[0] };
        req.params.userId = mockUser[0]._id;
        req.body = { ...createdTodo };
        Todo.create.mockReturnValue(createdTodo);
        Todo.findOne.mockReturnValue(false);
        User.findByIdAndUpdate.mockReturnValue({ ...mockUser[0], createdTodo });

        await controller.createTodo(req, res);
        expect(res.statusCode).toBe(200);
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(req.params.userId, { $push: { userTodos: createdTodo._id } }, { new: true });
        expect(Todo.create).toHaveBeenCalled()
    });

    it('should return 500 if exception', async () => {
        const createdTodo = { ...mockTodo[0] };
        req.params.userId = mockUser[0]._id;
        req.body = { ...createdTodo };
        Todo.create.mockRejectedValue('Rejected value for created todo');
        Todo.findOne(true);
        User.findByIdAndUpdate.mockRejectedValue('Rejected value for updated user');
        await controller.createTodo(req, res);
        expect(res.statusCode).toBe(500);

    });

})