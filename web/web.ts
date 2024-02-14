import express, { Request, Response } from "express";
const db = require("./../DB/educraft-c6756.js");

const webApp = express.Router();
// db 0=chapitres
//    1=courses:
//    2=intructors:
//    3=modules
//    4=tests:
//    5=utilisateurs
webApp.get("/", (req: Request, res: Response) => {
  res.send("Hiii to my Web app server");
});

webApp.get("/isuser/:email/:password", async (req: Request, res: Response) => {


  const userEmail = req.params.email;
  const userPass = req.params.password;

  for (const i of Object.keys(db.utilisateurs)) {
    if (
      db.utilisateurs[i].email === userEmail &&
      db.utilisateurs[i].password === userPass
    )
      res.json({ ...db.utilisateurs[i], id: i });
    // console.log({ ...db.utilisateurs[i], id: i });
  }
  res.status(404).end();
});

webApp.get(
  "/courses/:instructor_id?",
  async (req: Request, res: Response) => {}
);

webApp.get("/modules/:course_id", async (req: Request, res: Response) => {
  const courseID = req.params.course_id;
  const userModules = [];
  for (const i of Object.keys(db.modules)) {
    if (db.modules[i].course == courseID) {
      userModules.push(db.modules[i]);
    }
  }

  if (userModules.length > 0) res.send(userModules);
  else res.status(404).end();
});

webApp.get("/chapters/:module_id", async (req: Request, res: Response) => {
  // data =[{"id":2,"title":"Types de réseaux","module_id":1}]

  const moduleID = req.params.module_id;

  const userChapters = [];

  for (const i of Object.keys(db.chapters)) {
    if (db.chapters[i].module_id == moduleID) {
      userChapters.push(db.chapters[i]);
    }
  }
  if (userChapters.length > 0) res.send(userChapters);
  else res.status(404).end();
});

webApp.get("/tests/:chapter_id", async (req: Request, res: Response) => {
const chapterId = req.params.chapter_id
if(chapterId in db.tests)
  res.json(db.tests[chapterId])
  else res.status(404).end();

});
webApp.get("*", async (req: Request, res: Response) => {
  res.status(404).end();
});

module.exports = webApp;
