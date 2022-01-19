'use strict';

const basicAuth = require('../../../src/auth/middleware/basic');

const {db, users} = require('../../../src/auth/models/index');

let userInfo = {
  admin: {username: 'admin-basic', password: 'password'},
};

//Pre load our database
beforeAll(async () => {
  await db.sync();
  await users.create(userInfo.admin)
});
afterAll(async () => {
  await db.drop();
})

describe('Auth Middleware', () => {

  // Mock the express req/res/next that we need for each middleware call
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res)
  }
  const next = jest.fn();

  basicAuth('user authentication', () => {

    it('fails a login for a user (admin) with the incorrect basic credentials', () => {

      // Change the request to match this test case
      req.headers = {
        authorization: 'Basic YWRtaW46Zm9v',
      };

      return middleware(req, res, next)
        .then(() => {
          expect(next).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(403);
        });

    });
  });
});