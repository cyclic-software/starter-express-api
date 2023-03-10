const {
    createProduct,
    getProduct,
    getProductId,
    updateId,
    deleteId,
} = require("../repositories/product.repository");

exports.create = async (req, res) => {
    try {
        console.log("entrou aq", req.body);
        const product = await createProduct(req.body);
        res.status(200).send(product);
    } catch (error) {
        console.log("deu erro", error);
        res.status(400).send(error);
    }
};

exports.getAll = async (req, res) => {
    try {
        const product = await getProduct();
        res.status(200).send(product);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.productId = async (req, res) => {
    try {
        const product = await getProductId(req.params.id);
        res.status(200).send(product);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.updateId = async (req, res) => {
    try {
        const product = await updateId(req.params.id, req.body);
        res.status(200).send(product);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.deleteById = async (req, res) => {
    try {
        const product = await deleteId(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).send(error);
    }
};
