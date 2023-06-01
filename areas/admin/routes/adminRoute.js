import express from "express";
import * as pageController from "../controllers/pageController.js";
import * as memberPageController from "../controllers/memberPageController.js"
import * as newsPageController from "../controllers/newsPageController.js"
import * as projectPageController from "../controllers/projectPageController.js"
import * as aboutController from "../controllers/aboutController.js"
import * as contactController from "../controllers/contactController.js"
import * as joinUsController from "../controllers/joinUsController.js"


const router = express.Router();

//index page
router.route("/").get(pageController.getIndexPage)

//members Page
router.route("/members").get(memberPageController.getMembersPage)
router.route("/members/:id").get(memberPageController.getMemberDetail)
router.route("/members/update/:id").get(memberPageController.getMemberUpdate)
router.route("/members/update/:id").post(memberPageController.memberUpdate)



//news
router.route("/news").get(newsPageController.getNewsPage)
router.route("/news/:id").get(newsPageController.getNewsDetail)
router.route("/news").post(newsPageController.createNews)
router.route("/news/delete/:id").post(newsPageController.deleteNews)
router.route("/news/update/:id").get(newsPageController.getUpdateNews)
router.route("/news/update/:id").post(newsPageController.updateNews)

//newsCategory
router.route("/newscat").post(newsPageController.createNewsCat);
router.route("/news/updateCat/:id").get(newsPageController.getUpdateCat)

router.route("/news/updateCat/:id").post(newsPageController.updateCat)


//project
router.route("/projects").get(projectPageController.getAllProject)
router.route("/projects").post(projectPageController.createProject)
router.route("/project/update/:id").get(projectPageController.getUpdateProject)
router.route("/project/update/:id").post(projectPageController.updateProject)
router.route("/project/delete/:id").post(projectPageController.deleteProject)
router.route("/project/:id").get(projectPageController.getProjectDetail)

//about
router.route("/about").get(aboutController.getAbout)
router.route("/about/update/:id").get(aboutController.getAboutUpdate);
router.route("/about/update/:id").post(aboutController.updateAbout);
router.route("/about").post(aboutController.createAbout)
router.route("/about/:id").get(aboutController.getAboutDetail)


//contact
router.route("/contact").get(contactController.getContact)
router.route("/contact/update/:id").get(contactController.getContactUpdate);
router.route("/contact/update/:id").post(contactController.updateContact);
router.route("/contact").post(contactController.createContact)
router.route("/contact/:id").get(contactController.getContactDetail)


//joinUs
router.route("/joinUs").get(joinUsController.getJoinUsPage)
router.route("/joinUs/update/:id").get(joinUsController.getUpdateJoinUs)
router.route("/joinUs/update/:id").post(joinUsController.updateJoinUs)
router.route("/joinUs/:id").get(joinUsController.getJoinUsDetail)
router.route("/joinUs").post(joinUsController.createJoinUs)














export default router 