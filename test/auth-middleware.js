const { expect } = require("chai");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");

const authMiddleware = require("./../middleware/is-auth");

describe("Auth middleware", () => {
  it("Should throw an error if no authorization is present", () => {
    const req = {
      get: function () {
        return null;
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not authenticated"
    );
  });

  it("Should throw an error if the token cannot be verified", () => {
    const req = {
      get: function () {
        return "Bearer xyz";
      },
    };

    sinon.stub(jwt, "verify");

    jwt.verify = () => {
        return { userId: 1};
    }

    jwt.verify.returns({ userId: "1"});
    expect(req).to.not.have.property("userId");
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });
});
