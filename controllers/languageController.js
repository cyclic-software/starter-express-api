export const changeLanguage=(req,res)=>{

    const { lang ,returnUrl} = req.query;

    const splitValues =lang.split("=");
    const language = splitValues[1];
    // Set the language cookie
    res.cookie('language', lang, { maxAge: 900000, httpOnly: true });
  
    // Redirect the user to the desired page or send a response
    res.redirect(returnUrl);
}