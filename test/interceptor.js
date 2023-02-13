module.exports = {
    mockRequest: function() {
        const req = {};
        req.body = jest.fn().mockReturnValue(req);
        req.params = jest.fn().mockReturnValue(req);

        console.log(req);

        return req;
    },

    mockResponse: function() {
        const res = {};
        res.send = jest.fn().mockReturnValue(res);
        req.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);

        console.log(res);

        return res;
    }
};