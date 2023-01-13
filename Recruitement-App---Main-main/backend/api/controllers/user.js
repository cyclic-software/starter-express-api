const mongoose = require("mongoose")
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
exports.signup = (req,res)=>{
  const {name,email,password} = req.body
  User.findOne({email})
    .then(async(user)=>{
      if(user){
        return res.status(403).json({
            success:false,
            message:"User already exits"
        })
      }
      else{
        bcrypt.hash(password,10,(err,hash)=>{
          if(err){
            return res.status(500).json({
              success:false,
            })
          }
          else{
            console.log(hash)
        const user = new User({
          _id: new mongoose.Types.ObjectId,
          name,
          email,
          password:hash
        })
          user
          .save()
              .then(()=>{
                return res.status(200).json({
                  success:true,
                  message:"User created"
                })
              })  
        }
        })
      }
    }).catch((err)=>{
      return res.status(500).json({
        success:false,
        error:err.toString()
      })
    })


}

exports.login = async (req, res) => {
	const { email , password } = req.body;
	await User.findOne({ email })
		.then(async (user) => {
			if (!user) {
				return res.status(404).json({
					success: false,
					message: "User not found",
				});
			}
      console.log(user)
			bcrypt.compare(password, user.password, (err, result) => {
				if (err) {
					return res.status(401).json({
						message: "Auth failed",
            error:err.toString()
					});
				}
				if (result) {
					const token = jwt.sign(
						{
							userId: user._id,
							phone: user.phone,
						},
						process.env.JWT_SECRET,
						{
							expiresIn: "30d",
						}
					);
					return res.status(200).json({
						success: true,
						userDetails: {
							userId: user._id,
							name: user.name,
							email: user.email
						},
						token: token,
					});
				} else {
					return res.status(400).json({
						success: false,
						message: "Incorrect credentials",
					});
				}
			});
		})
		.catch((e) => {
			res.status(500).json({
				success: false,
				error: e.toString(),
			});
		});
};

exports.getuser = async(req,res) => {
	const founduser =await User.find()
    console.log(founduser)
    return res.status(200).json({user: founduser})
}
