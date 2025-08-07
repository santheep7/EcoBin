
const Agent = require('../model/Agentmodel')
const jwt = require('jsonwebtoken')
const agentRegisteration =async(req,res)=>{
    try{
        const {agentname,email,password,phone,adharid,place} =req.body;
        const existingAgent = await Agent.findOne({adharid});
        if(existingAgent){
            return res.status(400).json({message:"Agent already exist"})
        }
        const data = await Agent({
            agentname,
            phone,
            adharid,
            email,
            place,
            password
        })
        await data.save();
        res.status(200).json({message:"Agent registeration successful"})
    }catch (error) {
    console.error("Agent registration error:", error);
    res.status(500).json({ message: "error in registeration" });
    }
}
const AgentLogin = async(req,res)=>{
    try{
        const {email,password}= req.body;
        const logadmin = await Agent.findOne({email:email})
        if(logadmin){
            if(logadmin.password ==password){
                const token = jwt.sign({id:logadmin._id},process.env.jwt_secret_key,{expiresIn:"1hr"})
                console.log("Login success:", logadmin);


                res.json({message:"Agent logged in success",status:200,token,agentId:logadmin._id,agentname:logadmin.agentname,isApproved:logadmin.isApproved})
            }else{
                res.json({message:"Invalid Credentials",status:400})
            }
        }else{
            res.json({message:"Agent Registeration failed",status:400})
        }
    }catch(error){
         console.error("Agent Login error:", error);
    res.status(500).json({ message: "error in Login " });
    }
}
const getAgentProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await Agent.findById(id).select('-password'); // exclude password

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({ message: "Error fetching agent profile" });
  }
};


module.exports = {agentRegisteration,AgentLogin,getAgentProfile}