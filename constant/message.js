const failureResponse=(message,res)=>{
    console.log(message);
    return res.status(400).json({ error: message })
}

const succesfullResponse=(response,message,res)=>{
    return res.status(200).json({
        success: true,
        msg: message,
        res: response,
    })
}

module.exports={failureResponse,succesfullResponse}