const Project = require('../models/project.model');
const Conversation  = require('../models/conversation.model');
const Message = require('../models/message.model');
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

exports.get_proj_stats = (req, res) => {
    db_connect.connect(async () => {
        Project.find({ members: req.params.email }, 'due status createdAt updatedAt')
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            res.status(500).json(error);
        })
        .finally(() => {
            mongoose.connection.close();
        })
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

exports.find_project = (req, res) => {
    db_connect.connect(async () => {
        try {
            const project = await Project.findById(req.params.proj_id);
            res.status(200).json(project);

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
                todos: req.body.todos,
                project_admins: req.body.project_admins
            })
            const project = await newProject.save();
            res.status(200).json(project);
    
            mongoose.connection.close();
    
        } catch (error) {
            res.status(500).json(error);
        }
    })
}

exports.remove_member = async (req, res) => {
    db_connect.connect(async () => {
        Project.findByIdAndUpdate(req.body.proj_id, {
            members: req.body.members.filter(user => user !== req.body.email)
        }, {new: true})
        .then(result => {
            console.log("Project Update", result);
            Conversation.findOneAndUpdate({ "project.project_id": req.body.proj_id }, {
                members: result.members
            }, {new: true})
            .then(response => {
                console.log("Conversation Updated", response);
                res.status(200).json(result);
            })
            .catch(e => {
                res.status(500).json(e);
            })
            .finally(() => {
                mongoose.connection.close();
            })
        })
        .catch(error => {
            res.status(500).json(error);
        })
    })
}

exports.add_admin = async (req, res) => {
    db_connect.connect(async () => {
        Project.findByIdAndUpdate(req.body.proj_id, {
            project_admins: [...req.body.current_admins, req.body.new_admin]
        }, { new: true })
        .then(result => {
            console.log("New admin added!", result);
            //add a notification
            res.status(200).json(result);
        })
        .catch(error => {
            res.status(500).json(error);
        })
        .finally(() => {
            mongoose.connection.close();
        })
    })
}

exports.remove_admin = async (req, res) => {
    db_connect.connect(async () => {
        Project.findByIdAndUpdate(req.body.proj_id, {
            project_admins: req.body.current_admins.filter(admin => admin !== req.body.to_remove)
        }, { new: true })
        .then(result => {
            console.log("Admin Removed!", result);
            //add a notification
            res.status(200).json(result);
        })
        .catch(error => {
            res.status(500).json(error);
        })
        .finally(() => {
            mongoose.connection.close();
        })
    })
}