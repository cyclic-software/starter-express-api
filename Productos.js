const express = require('express');
const router = express.Router();

const Producto = require('../models/producto');

router.get('/', async (req, res) => {

        try{

            const ArrayProductosDB = await Producto.find()
           res.render("Productos", {
            ArrayProductos: ArrayProductosDB
            })

        } catch (error) {
            console.log(error)
        }   
})
//ruta  rear 
router.get('/crear', (req,res)=>{

    res.render('crear')
})
// crear un producto
router.post('/', async(req,res)=>{
    const body= req.body
    try {
        const productoDB = new Producto(body)
        await productoDB.save()
        res.redirect('/productos')
    } catch (error) {
        console.log('error', error)
    }
})
//leer unico documento (producto)
router.get('/:id', async(req,res)=>{

    const id= req.params.id
    try{

        //mongo db siempre tiene los id cpn "_" guion bajo 
        const productosDB = await Producto.findOne({ _id: id })
        console.log(productosDB)
        res.render('detalle', {
            productos: productosDB,
            error: false 
        })

    } catch(error) {
        console.log(error)

        res.render('detalle', {
            error: true,
            mensaje: 'no se encuentra el id'
        })

    }
})
//eliminar
router.delete('/:id',async (req,res)=>{
    const id= req.params.id
    try {
        const productoDB = await Producto.findByIdAndDelete({_id: id })
        if(productoDB){
            res.json({
                estado: true,
                mensaje:'Eliminado!!!'
            })
        }else{
            res.json({
                estado: false,
                mensaje:'No se pudo eliminar!'
            })
        }
    } catch (error) {
        console.log(error)
    }
})
//editar un documento se usa el metodo put no el post que se usa paea crear 
router.put('/:id', async(req,res)=>{
    const id = req.params.id
    const body =  req.body
    try {

        const productoDB = await Producto.findByIdAndUpdate(id,body, { useFindAndModify: false })
        console.log(productoDB)

        res.json({
            estado: true,
            mensaje: 'Editado'
        })
        
    } catch (error) {
        console.log(error)

        res.json({
            estado: false,
            mensaje: 'No se pudo Editar'
        })
    }
})
module.exports = router;