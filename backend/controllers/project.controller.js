const Project = require('../models/project.model');
const mongoose = require('mongoose');
const db_connect = require('../utils/db_connect');
const { body, validationResult } = require('express-validator');
require("dotenv").config();

exports.find_projects = (req, res) => {
    db_connect.connect(async ()=>{
        try {
            const project = await Project.find();
            res.status(200).json(project.reverse());

            mongoose.connection.close();
        } catch (error) {
            res.status(500).json(error);
        }
    })
}

exports.find_project_by_email = (req, res) => {
    db_connect.connect(async ()=>{
        try {
            const projects = await Project.find({ members: req.params.email });
            res.status(200).json(projects.reverse());

            mongoose.connection.close();
        } catch (error) {
            res.status(500).json(error);
        }
    })
}

exports.find_project_due_by_email = (req, res) => {
    db_connect.connect(async ()=>{
        try {
            const projects = await Project.find({ members: req.params.email }, 'name due status');
            res.status(200).json(projects);

            mongoose.connection.close();
        } catch (error) {
            res.status(500).json(error);
        }
    })
}

exports.find_project_by_id = (req, res) => {
    db_connect.connect(async () => {
        try {
            const projects = await Project.findOne({ id: req.params.card_id });
            res.status(200).json(projects);

            mongoose.connection.close();
        } catch (error) {
            res.status(500).json(error);
        }
    })
}

exports.update_project = (req, res) => {
    db_connect.connect(async () => {
        try {
            const updatedProject = await Project.findByIdAndUpdate( req.body._id, {
                name: req.body.name,
                desc: req.body.desc,
                members: req.body.members,
                status: req.body.status,
                due: req.body.due,
                thumbnail: req.body.thumbnail,
                thumbnailName: req.body.thumbnailName,
                todos: req.body.todos
            }, {new: true});
            !updatedProject && res.status(200).json(updatedProject);

            res.status(200).json(updatedProject);

            mongoose.connection.close();
        } catch (error) {
            res.status(500).json(error);
        }
    })
}

exports.delete_project_by_id = (req, res) => {
    db_connect.connect(async () => {
        Project.findByIdAndDelete(req.params.id).then((blog) => {
            if (!blog) {
                return res.status(404).send();
            }
            Project.find()
            .then((result) => {
                // console.log(result);
                res.status(200).json(result.reverse());

                mongoose.connection.close();
            })
            .catch(e => {
                console.log(e.message);
            })
        }).catch((error) => {
            res.status(500).send(error);
        })
    })
}

exports.add_project = async (req, res) => {
    db_connect.connect(async () => {
        const errors = validationResult(req);
    
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try {
            const newProject = new Project({
                id: req.body.id,
                name: req.body.name,
                desc: req.body.desc,
                members: req.body.members,
                status: req.body.status,
                due: req.body.due,
                thumbnail: req.body.thumbnail,
                thumbnailName: req.body.thumbnailName,
                todos: req.body.todos
            })
            const project = await newProject.save();
            res.status(200).json(project);
    
            mongoose.connection.close();
    
        } catch (error) {
            res.status(500).json(error);
        }
    })
}