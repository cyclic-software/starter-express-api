const sequelize = require("../utils/database");

const ProductController = require("../controller/product");
const { DESCRIBE } = require("sequelize/types/query-types");
const { json } = require("sequelize");
const { expect } = require("chai");

describe("Product controller", () => {
  it("should send a response with product details", (done) => {
    const req = {
      get: function () {
        return null;
      },
    };

    sequelize
      .sync()
      .then(() => {
        const req = {
          userId: "1",
          params: {
            id: 1,
          },
        };

        const res = {
          statusCode: 500,
          userStatus: null,
          status: function (code) {
            this.statusCode = code;
            return this;
          },
          json: function (data) {
            
          },
        };
        ProductController.getProduct(req, res, () => {}).then(() => {
          expect(res.statusCode).to.be.equal(200);
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
  });
});