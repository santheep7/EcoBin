const Request = require('../model/Requestmodel');
const User = require('../model/Usermodel');
const Agent = require('../model/Agentmodel')
const message = require('../model/contactmodel')
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
// for display users
const getuser = async(req,res)=>{
  try{
    const user = await User.find()
    console.log("user",user)
    res.status(200).json(user);
  }catch(error){
    console.error('error fetcing users:',error.message)
    res.status(500).json({message:'Failed to fetch users'})
  }
};
// for geting message
const getmessage = async (req, res) => {
  try {
    const msg = await message.find();

    const analyzedMessages = msg.map(m => {
      const result = sentiment.analyze(m.message);
      return {
        ...m._doc,
        sentiment: result.score > 0 ? "Positive" : result.score < 0 ? "Negative" : "Neutral",
        score: result.score
      };
    });

    res.status(200).json(analyzedMessages);
  } catch (err) {
    console.log('error in fetching message', err.message);
    res.status(500).json({ message: 'Failed to fetch the message' });
  }
};
// for deleting message
const delmsg = async (req, res) => {
  try {
    const id = req.headers['userid'];              // match “userid”
    if (!id) return res.status(400).json({ message: "User ID header is required" });

    const deletedmsg = await message.findByIdAndDelete(id);
    if (!deletedmsg) return res.status(404).json({ message: "message not found" });

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error.message);
    res.status(500).json({ message: "Failed to delete message" });
  }
};
// for deleting user

const deluser = async (req, res) => {
  try {
    const id = req.headers['userid'];              // match “userid”
    if (!id) return res.status(400).json({ message: "User ID header is required" });

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Failed to delete user" });
  }
};
const getAgent = async(req,res)=>{
  try{
    const user = await Agent.find()
    console.log("user",user)
    res.status(200).json(user);
  }catch(error){
    console.error('error fetcing users:',error.message)
    res.status(500).json({message:'Failed to fetch users'})
  }
};
const delagent = async (req, res) => {
  try {
    const id = req.headers['userid'];              // match “userid”
    if (!id) return res.status(400).json({ message: "User ID header is required" });

    const deletedUser = await Agent.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "Agent not found" });

    res.status(200).json({ message: "Agent deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Failed to delete user" });
  }
};
const approveAgent = async (req, res) => {
    try {
        const { id } = req.params;
        const agent = await Agent.findByIdAndUpdate(id, { isApproved: true }, { new: true });
        if (!agent) {
            return res.status(404).json({ message: "Agent not found" });
        }
        res.status(200).json({ message: "Agent approved", agent });
    } catch (error) {
        res.status(500).json({ message: "Error approving agent" });
    }
}


//get card stats
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pickupRequests = await Request.countDocuments();
    const completedPickups = await Request.countDocuments({ isPickedUp: true });

    res.status(200).json({
      totalUsers,
      pickupRequests,
      completedPickups,
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({ message: "Failed to fetch statistics" });
  }
}

module.exports = {getuser,deluser,getAgent,delagent,approveAgent,getAdminStats,getmessage,delmsg}