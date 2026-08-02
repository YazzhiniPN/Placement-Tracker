const mongoose = require("mongoose");
const Application = require("../models/Application");
const { application } = require("express");

async function addApplication(req,res){
    try {
        if(!req.body.company || !req.body.type){
            return res.status(400).json({err: "Insufficient credentials"})
        }

        const userId = req.user.id;
        if(!userId){
            return res.status(401).json({err: "User not authenticated"});
        }

        const newApplication = new Application({
            company: req.body.company,
            type: req.body.type,
            status: req.body.status,
            user: userId,
            role: req.body.role,
            appliedDate: req.body.appliedDate,
            notes: req.body.notes,
            rounds: req.body.rounds
        })//any value not gn in req.body - undefined , mongoose doesn't store undefined

        await newApplication.save();

        return res.json({msg: "Application added", application: newApplication});
    } catch (err) {
        return res.json({err: err.message});
    }
}

async function getApplications(req,res){
    try {
        const userId = req.user?.id; // if req.user exists get id

        if(!userId){
            return res.status(401).json({err: "User not authenticated"});
        }

        const applications = await Application.find({user: userId});

        return res.json({applications: applications});

    } catch (err) {
        return res.status(500).json({err: err.message});
    }
}

async function  getApplication(req,res) {
    try {
        const userId = req.user?.id; // if req.user exists get id

        if(!userId){
            return res.status(401).json({err: "User not authenticated"});
        }

        const application = await Application.findOne({_id: req.params.id, user: userId});

        if(!application){
            return res.status(404).json({err: "Application not found"});
        }

        return res.json({msg: "Application found", application: application});
    } catch (err) {
        return res.status(500).json({err: err.message});
    }
}

async function updateApplication(req,res){ //to change notes, status
    try {

        if(req.body.notes === undefined && req.body.status===undefined){
            return res.status(400).json({err: "No fields to update"})
        }

        const userId = req.user?.id; // if req.user exists get id

        if(!userId){
            return res.status(401).json({err: "User not authenticated"});
        }

        const application = await Application.findOne({_id: req.params.id, user: userId});

        if(!application){
            return res.status(404).json({err: "Application not found"});
        }

        if(req.body.notes !== undefined){
            application.notes= req.body.notes;
        }

        if(req.body.status !== undefined){
            application.status = req.body.status;
        }

        await application.save();

        return res.json({msg:"Application changed", updatedApplication: application})

    } catch (err) {
        return res.status(500).json({err: err.message});
    }
}

async function deleteApplication(req, res){
    try {
        const userId = req.user?.id; // if req.user exists get id

        if(!userId){
            return res.status(401).json({err: "User not authenticated"});
        }

        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({err: "Invalid application id"});
        }
        const application = await Application.findOneAndDelete({_id: req.params.id, user: userId});

        if(!application){
            return res.status(404).json({err: "Application not found"});
        }

        return res.json({msg: "Application deleted", deletedApplication: application});


    } catch (err) {
        return res.status(500).json({err: err.message});
    }
}

async function getRounds(req,res){
    try {
        const userId = req.user?.id; // if req.user exists get id

        if(!userId){
            return res.status(401).json({err: "User not authenticated"});
        }

        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({err: "Invalid application id"});
        }
        const application = await Application.findOne({_id: req.params.id, user: userId});

        if(!application){
            return res.status(404).json({err: "Application not found"});
        }

        const rounds = application.rounds;

        return res.json({rounds: rounds});

    } catch (err) {
        return res.status(500).json({err: err.message});
    }
}


async function addRound(req,res){
    try {

        if(!req.body.roundName){
            return res.status(400).json({err: "RoundName is required"});
        }

        const userId = req.user?.id; // if req.user exists get id

        if(!userId){
            return res.status(401).json({err: "User not authenticated"});
        }

        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({err: "Invalid application id"});
        }
        const application = await Application.findOne({_id: req.params.id, user: userId});

        if(!application){
            return res.status(404).json({err: "Application not found"});
        }

        const round = {
            roundNo: (application.rounds?.length || 0)+1,
            roundName: req.body.roundName,
            date: req.body.date
        }

        application.rounds.push(round);
        await application.save();

        return res.status(201).json({msg: "Round Added", addedRound: round}) //201 - new resource added

    } catch (err) {
        return res.status(500).json({err: err.message});
    }
}

async function updateRound(req,res){ //update status of the round
    try {
        const userId = req.user?.id; // if req.user exists get id

        if(!userId){
            return res.status(401).json({err: "User not authenticated"});
        }

        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({err: "Invalid application id"});
        }
        const application = await Application.findOne({_id: req.params.id, user: userId});

        if(!application){
            return res.status(404).json({err: "Application not found"});
        }

        let round = application.rounds.find(r=> r.roundNo == req.params.roundNo);
            //this points to the round in the mongodb, not a copy, but a ref

        if(!round){
            return res.status(404).json({err: "Round not found"});
        }

        round.status = req.body.status;

        await application.save();

        return res.json({msg: "Status updated", round: round});

    } catch (err) {
        return res.status(500).json({err: err.message});
    }
}

async function deleteRound(req,res){
    try {
        const userId = req.user?.id; // if req.user exists get id

        if(!userId){
            return res.status(401).json({err: "User not authenticated"});
        }

        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({err: "Invalid application id"});
        }
        const application = await Application.findOne({_id: req.params.id, user: userId});

        if(!application){
            return res.status(404).json({err: "Application not found"});
        }

        const roundExists = application.rounds.find(r=> r.roundNo == req.params.roundNo);
        if(!roundExists){
            return res.status(404).json({err: "Round not found"});
        }

        application.rounds = application.rounds.filter(r=> r.roundNo != req.params.roundNo);
        await application.save();

        return res.json({msg: "Round deleted"});

    } catch (err) {
        return res.status(500).json({err: err.message});
    }
}

module.exports = {addApplication, getApplications, getApplication, updateApplication, deleteApplication, getRounds, addRound, updateRound, deleteRound};