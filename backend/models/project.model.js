const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    id: {
        type: String
    },
    name: {
        type: String
    },
    desc: {
        type: String
    },
    members: {
        type: Array
    },
    status: {
        type: String
    },
    due: {
        type: String
    },
    thumbnail: {
        type: String
    },
    thumbnailName: {
        type: String
    },
    todos: {
        type: Array
    },
    project_admins: {
        type: Array
    }
}, {timestamps: true});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;