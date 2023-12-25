const expressAsyncHandler = require("express-async-handler");
const { getDB } = require("../dbs/init.mongodb")
const { createJWT } = require("../middlewares/authAction");
const bcrypt = require("bcryptjs");


const updateMyProfile = expressAsyncHandler(async (req, res) => {
    const Users = await getDB().collection("users")
    const user = await Users.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
        }

        const updatedUser = await user.save();
        res.send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: createJWT(updatedUser),
        });
    } else {
        res.status(404).send({ message: "User not found" });
    }
})

const getUsers = expressAsyncHandler(async (req, res) => {
    const Users = await getDB().collection("users")
    const users = await Users.find({});
    res.send(users);
})
const getUser = expressAsyncHandler(async (req, res) => {
    const Users = await getDB().collection("users")
    const user = await Users.findById(req.params.id);
    if (user) {
        res.send(user);
    } else {
        res.status(404).send({ message: "User Not Found" });
    }
})
const updateUser = expressAsyncHandler(async (req, res) => {
    const Users = await getDB().collection("users")
    const user = await Users.findById(req.params.id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);
        const updatedUser = await user.save();
        res.send({ message: "User Updated", user: updatedUser });
    } else {
        res.status(404).send({ message: "User Not Found" });
    }
})
const deleteUser = expressAsyncHandler(async (req, res) => {
    const Users = await getDB().collection("users")
    const user = await Users.findById(req.params.id);
    if (user) {
        if (user.email === "admin@gmail.com") {
            res.status(400).send({ message: "Can Not Delete Admin Users" });
            return;
        }
        await user.remove();
        res.send({ message: "User Deleted" });
    } else {
        res.status(404).send({ message: "User Not Found" });
    }
})
const signin = expressAsyncHandler(async (req, res) => {
    const db = await getDB()
    const Users = db.collection("users")
    const user = await Users.findOne({ email: req.body.email });
    if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            res.send({
                token: createJWT({ email: user.email, name: user.name, _id: user._id, isAdmin: user?.isAdmin || false }),
            });
            return;
        }
    }
    res.status(401).send({ message: "Invalid email or password" });
})
const signup = expressAsyncHandler(async (req, res) => {
    const db = await getDB()
    const Users = db.collection("users")
    console.log('req.body', req.body)
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
    };
    const user = await Users.insertOne(newUser);
    res.send({
        token: createJWT(newUser),
    });
})
module.exports = {
    updateMyProfile,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    signin,
    signup
}