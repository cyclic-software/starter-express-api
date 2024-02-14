import express, { Request, Router , Response } from 'express';
const {
  getUsers,
  getCourses,
  isUser,
  getModules,
  getChapters,
  getTests,
} = require("../DB/dbServer.js");

const mobileApp : Router = express.Router();

mobileApp.get("/", (req: Request, res: Response) => {
  res.send("Hiii to my Mobile app server");
});

mobileApp.get("/users", async (req: Request, res: Response) => {
  const users = await getUsers();
  res.json(users);
});

mobileApp.get("/isuser/:email/:password", async (req: Request, res: Response) => {
  const email = req.params.email;
  const password = req.params.password;
  const result = await isUser(email, password);
  if (result.found === true) res.json(result);
  else res.status(404).end();
});

mobileApp.get("/courses/:instructor_id?", async (req: Request, res: Response) => {
  const inst_id = req.params.instructor_id;
  let courses;
  if (inst_id) courses = await getCourses(inst_id);
  else courses = await getCourses();
  res.json(courses);
});

mobileApp.get("/modules/:course_id", async (req: Request, res: Response) => {
  let courseId = req.params.course_id;
  var modules;
  if (courseId) {
    modules = await getModules(courseId);
    if (modules) {
      res.json(modules);
    }
  } else res.status(404).end();
});

mobileApp.get("/chapters/:module_id", async (req: Request, res: Response) => {
  let moduleId = req.params.module_id;

  let chapters = await getChapters(moduleId);

  if(chapters)
  res.json(chapters);
else res.status(404).end()
});

mobileApp.get("/tests/:chapter_id", async (req: Request, res: Response) => {
  let chapter_id = req.params.chapter_id;
  let tests = await getTests(chapter_id);

  res.json(tests || null);
});


module.exports = mobileApp;
