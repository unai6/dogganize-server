
const controller = require('../../../controllers/todosController/index');
const mockUser = require('../mockData/mockUser.json');
const httpMock = require("node-mocks-http");
const User = require('../../../Models/User');
User.findById = jest.fn();


describe('controller.getTodos', () => {

    beforeEach(() => {
        User.findById.mockClear(); 
        req = httpMock.createRequest();
        res = httpMock.createResponse();
        req.jwtVerify = jest.fn().mockResolvedValue({})
        res.unauthorized = jest.fn().mockRejectedValue(res.status(401))
        res.internalServerError = jest.fn().mockRejectedValue(res.status(500))
    });

    it('should return User TODOs', async () => {
        req.params.userId = mockUser[0]._id;
        const userId = req.params.userId;
        User.findById.mockReturnValue(userId);

        await controller.getTodos(req, res);

        expect(User.findById).toHaveBeenCalledTimes(1);
        expect(User.findById).toHaveBeenCalledWith(userId)
    })
})