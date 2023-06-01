import * as LanguageResources from "../resources/laguageResource.js";
import Contact from "../models/contactModel.js";

export const userResource = async (req, res, next) => {
  try {
    const contact = await Contact.find({});
    res.locals.contact = contact;

    var lang = "ge";

    if (req.cookies.language) {
      lang = req.cookies.language;
    }

    switch (lang) {
      case "az":
        res.locals.resources = LanguageResources.langAz;
        res.locals.language = "az";
        break;
      case "ge":
        res.locals.resources = LanguageResources.langGe;
        break;
      default:
        res.locals.resources = LanguageResources.langAz;
        break;
    }

    next();
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};  