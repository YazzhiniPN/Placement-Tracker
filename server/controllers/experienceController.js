const { default: mongoose } = require("mongoose");
const Experience = require("../models/Experience");

async function addExperience(req,res){
    try {
        if(!req.body.company){
            return res.status(404).json({err: "Company name is required"});
        }

        const userId = req.user?.id; // if req.user exists get id

        if(!userId){
            return res.status(401).json({err: "User not authenticated"});
        }

        const newExperience = new Experience({
            company: req.body.company,
            role: req.body.role,
            difficulty: req.body.difficulty,
            rounds: req.body.rounds,
            offerReceived: req.body.offerReceived,
            postedBy: userId
        })

        await newExperience.save();

        return res.json({msg: "Experience added", newExperience: newExperience});

    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

async function getExperiences(req,res){
    try {
        const experiences = await Experience.find()
                            .populate("postedBy", "name username");

                        //populate - used to replace an objectId ref with actual doc from another collec
                        //populate(field(objId), fields_to_include)
                        //populate not used in appController because the user views his/her own applications - why send their own username back

        return res.json({experiences});
    } catch (err) {
        return res.status(500).json({err: err.message});
    }
}

async function getExperience(req,res){
    try {
        const companyExperiences = await Experience.find({company: {
                                            $regex: req.params.company,
                                            $options: "i" //case insensitive
                                        }})
                                        .populate("postedBy", "name username");

        return res.json({company: req.params.company, companyExperiences});
                
    } catch (err) {
        return res.status(500).json({err: err.message});
    }
}

async function deleteExperience(req,res){
    try {
        
        const userId = req.user?.id; // if req.user exists get id

        if(!userId){
            return res.status(401).json({err: "User not authenticated"});
        }

        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({err: "Invalid id"});
        }

        const experience = await Experience.findOneAndDelete({postedBy: userId, _id: req.params.id});

        if(!experience){
            return res.status(404).json({err: "Experience not found or unauthorized"});
        }

        return res.json({msg: "Experience deleted", deletedExperience: experience});

    } catch (err) {
        return res.status(500).json({err: err.message});
    }
}

module.exports = {addExperience, getExperiences, getExperience, deleteExperience};