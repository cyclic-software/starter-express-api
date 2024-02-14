"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { getUsers, getCourses, isUser, getModules, getChapters, getTests, } = require("../DB/dbServer.js");
const mobileApp = express_1.default.Router();
mobileApp.get("/", (req, res) => {
    res.send("Hiii to my Mobile app server");
});
mobileApp.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield getUsers();
    res.json(users);
}));
mobileApp.get("/isuser/:email/:password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.email;
    const password = req.params.password;
    const result = yield isUser(email, password);
    if (result.found === true)
        res.json(result);
    else
        res.status(404).end();
}));
mobileApp.get("/courses/:instructor_id?", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const inst_id = req.params.instructor_id;
    let courses;
    if (inst_id)
        courses = yield getCourses(inst_id);
    else
        courses = yield getCourses();
    res.json(courses);
}));
mobileApp.get("/modules/:course_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let courseId = req.params.course_id;
    var modules;
    if (courseId) {
        modules = yield getModules(courseId);
        if (modules) {
            res.json(modules);
        }
    }
    else
        res.status(404).end();
}));
mobileApp.get("/chapters/:module_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let moduleId = req.params.module_id;
    let chapters = yield getChapters(moduleId);
    if (chapters)
        res.json(chapters);
    else
        res.status(404).end();
}));
mobileApp.get("/tests/:chapter_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let chapter_id = req.params.chapter_id;
    let tests = yield getTests(chapter_id);
    res.json(tests || null);
}));
module.exports = mobileApp;
