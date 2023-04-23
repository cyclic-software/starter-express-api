import Slide from "../models/slideModel.js";
import { about, service, blogMain, blogItem, mainQualifield, itemQualifield, icons, sliderData, socials } from "../dataConfig/data.js"


const data = {
    about,
    service,
    blogItem,
    blogMain,
    mainQualifield,
    itemQualifield,
    icons,
    sliderData,
    socials,
    link: "index",
}

const getIndexPage = (req, res) => {
    res.render("index", { ...data})
}


const getAboutPage = async (req, res) => {
    try {
        const slides = await Slide.find({})
        res.status(200).render("about", {
            slides,
            link: "about",
            about: about
        });

    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}



const getRegisterPage = (req, res) => {
    res.render("register", {
        link: "register"
    })

}
const getLoginPage = (req, res) => {
    res.render("login", {
        link: "login"
    })

}

const getLogout = (req, res) => {
    res.cookie("jwt", "", {
        maxAge: 1
    });
    res.redirect("/")
};

export { getIndexPage, getAboutPage, getRegisterPage, getLoginPage, getLogout };
