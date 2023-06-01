import About from "../models/aboutModel.js"

export const getAbout=async(language)=>{
    const about = await About.findOne({})
    let mappedAbout;
    switch (language) {
        case 'az':
            mappedAbout = {
                ...about._doc,
                title: about.titleAz,
                description: about.descriptionAz
            }
            break;
        case 'ge':
            mappedAbout = {
                ...about._doc,
                title: about.titleGe,
                description: about.descriptionGe
            }
            break;
        default:
            mappedAbout = {
                ...about._doc,
                title: about.titleAz,
                description: about.descriptionAz
            }
            break;
    }

    return await mappedAbout;
}