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
const db = require("./../DB/educraft-c6756.js");
const webApp = express_1.default.Router();
// db 0=chapitres
//    1=courses:
//    2=intructors:
//    3=modules
//    4=tests:
//    5=utilisateurs
webApp.get("/", (req, res) => {
    res.send("Hiii to my Web app server");
});
webApp.get("/isuser/:email/:password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = req.params.email;
    const userPass = req.params.password;
    for (const i of Object.keys(db.utilisateurs)) {
        if (db.utilisateurs[i].email === userEmail &&
            db.utilisateurs[i].password === userPass)
            res.json(Object.assign(Object.assign({}, db.utilisateurs[i]), { id: i }));
        // console.log({ ...db.utilisateurs[i], id: i });
    }
    res.status(404).end();
}));
webApp.get("/courses/:instructor_id?", (req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
webApp.get("/modules/:course_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseID = req.params.course_id;
    const userModules = [];
    for (const i of Object.keys(db.modules)) {
        if (db.modules[i].course == courseID) {
            userModules.push(db.modules[i]);
        }
    }
    if (userModules.length > 0)
        res.send(userModules);
    else
        res.status(404).end();
}));
webApp.get("/chapters/:module_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // data =[{"id":2,"title":"Types de réseaux","module_id":1}]
    const moduleID = req.params.module_id;
    const userChapters = [];
    for (const i of Object.keys(db.chapters)) {
        if (db.chapters[i].module_id == moduleID) {
            userChapters.push(db.chapters[i]);
        }
    }
    if (userChapters.length > 0)
        res.send(userChapters);
    else
        res.status(404).end();
}));
webApp.get("/tests/:chapter_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chapterId = req.params.chapter_id;
    if (chapterId in db.tests)
        res.json(db.tests[chapterId]);
    else
        res.status(404).end();
}));
webApp.get("*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(404).end();
}));
module.exports = webApp;
