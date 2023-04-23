
const __dirnanme="../areas/admin/views/"


const getIndexPage = (req,res)=>{
    res.render(__dirnanme+"index",{
      title:"admin",user:{
        name:"Orik"
      }
    })  
}


export {getIndexPage};
