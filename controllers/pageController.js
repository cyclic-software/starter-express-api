import Project from "../models/projectModel.js"
import User from "../models/userModel.js"
import JoinUs from "../models/joinUsModel.js"
import * as aboutService from "../services/aboutService.js"
import * as projectService from "../services/projectService.js"
import mongoosePaginate from 'mongoose-paginate-v2';


const getIndexPage =async (req, res) => {
    const about = await aboutService.getAbout(req.cookies.language)
    res.render('index', {
        link: "index",
        about
    })
}
const getAboutPage = async (req, res) => {
    const about = await aboutService.getAbout(req.cookies.language)

    res.render('about', {
        link: "about",
        about
    })
  
}
const getJoinUsPage = async (req, res) => {
    const joinUs = await JoinUs.find({})
    res.render('joinUs', {
        link: "joinUs",
        joinUs
    })
}

const getMembersPage = async (req, res) => {
    const users = await User.find({ role: "reyaset_heyyyeti_uzvleri" });
    res.render('members', {
        link: "members",
        users
    })
}
const getAllMembersPage = async (req, res) => {
    const roles = ['heqiqi_uzvler', 'assosiasiyali_uzvler', 'fexri_uzvler', 'komekci_uzvler']; // İstenen rolleri bir dizi içinde belirtin

    const users = await User.find({ role: { $in: roles } }); // Belirtilen rolleri içeren kullanıcıları alın

    res.render('allMembers', {
        link: "allMembers",
        users
    });
}
const getProjectsPage = async (req, res) => {
    const pageNumber = req.query.page || 1; // İstek parametresinden sayfa numarasını alın
    const limit = 2; // Her sayfada kaç projenin görüntüleneceğini belirtin
    const language = req.cookies.language; // Dil bilgisini alın veya uygun şekilde elde edin
  
    try {
      const { projects, totalPages } = await projectService.getProjects(pageNumber, limit, language);
  
      res.render('projects', {
        link: 'projects',
        projects,
        currentPage: pageNumber,
        totalPages,
      });
    } catch (error) {
      res.status(500).json({
        succeeded: false,
        error,
      });
    }
  };



const getRegisterPage = (req, res) => {
    res.render('register', {
        link: "register"
    })
}

const getLoginPage = (req, res) => {
  const data= req.session.data
   req.session.data = undefined
    res.render('login', {
        link: "login",
        data
    })
}

const getLogout = (req, res) => {

    res.cookie("jwt", "", {
        maxAge: 1,
    });
    res.redirect('/')
}



export { getIndexPage, getJoinUsPage, getProjectsPage, getAboutPage, getMembersPage, getAllMembersPage, getRegisterPage, getLoginPage, getLogout };