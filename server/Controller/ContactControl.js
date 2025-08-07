const ContactModel = require('../model/contactmodel')
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const createmessage = async(req,res)=>{
    try{
        const {name,email,message} = req.body;
        const newcontact = new ContactModel({name,email,message});
        await newcontact.save();
        res.status(201).json({success:true,message:'message sent suucessfully!'})

    }catch(error){
        res.status(500).json({success:false,message:'something went wrong',error})
    }
};


// Existing getmessage (already done by you)
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

// ✅ New logic for frontend homepage – happy users count
const getHappyUsers = async (req, res) => {
  try {
    const allMessages = await ContactModel.find();
    const happyUsers = allMessages.filter(m => sentiment.analyze(m.message).score > 0).length;

    res.status(200).json({ happyUsers });
  } catch (err) {
    console.error("Error calculating happy users:", err.message);
    res.status(500).json({ message: "Failed to calculate happy users" });
  }
};
const getSatisfactionRate = async (req, res) => {
  try {
    const messages = await ContactModel.find();

    const positive = messages.filter(m => sentiment.analyze(m.message).score > 0).length;
    const total = messages.length;
    const percentage = total > 0 ? Math.round((positive / total) * 100) : 0;

    res.status(200).json({ percentage });
  } catch (err) {
    console.error('Error calculating satisfaction rate:', err.message);
    res.status(500).json({ message: 'Failed to calculate satisfaction rate' });
  }
};

module.exports = {
  createmessage,
  getmessage,
  getHappyUsers,
  getSatisfactionRate
};
