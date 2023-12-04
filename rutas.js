const express = require('express');
const router = express.Router();

//rutas 
router.get("/", (req, res) => {
    res.render("index",{titulo : "Carreton ULV"})
})

//ruta sercicios 
router.get("/servicios",(req,res)=>{
    res.render("servicios",{tituloServicios : "Estas en la pagina de servicios"})
})


module.exports = router;