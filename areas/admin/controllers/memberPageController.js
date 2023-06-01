import User from "../../../models/userModel.js"



const getMembersPage =async(req,res)=>{
    const users = await User.find({});
    res.render('../areas/admin/views/members/members',{
        users
    })
}

const getMemberDetail = async(req,res)=>{
    try {
        const user = await User.findById({_id:req.params.id});
        res.status(200).render('../areas/admin/views/members/detail',{
            user,
            
        })
    } catch (error) {
        res.status(500).json({
            succeded:false,
            error
        })
    }
}

const getMemberUpdate = async(req, res) => {
    const roles = await User.distinct('role');
    const user = await User.findById(req.params.id)
    res.status(200).render("../areas/admin/views/members/update", {
      roles,
      user:{id:user._id,role:user.role},
      user
    });
  }

  const memberUpdate = async (req,res) => {
    try {
  
     const user = await User.findById(req.params.id)
  
    user.role = req.body.role;
    await user.save();
  
     res.status(200).redirect("/admin/members")
    } catch (error) {
      res.status(500).json({
        succeded: false,
        error
      })
    }
  }

export  {getMembersPage,getMemberDetail,getMemberUpdate,memberUpdate};