const router = require('express').Router();
const Project = require('../models/project.model');
const { body, validationResult } = require('express-validator');
const ProjectController = require('../controllers/project.controller');
const { verifyToken } = require('../utils/jwtUtils');

router.route('/all').get(verifyToken, ProjectController.find_projects);

router.route('/all/:email').get(verifyToken, ProjectController.find_project_by_email);

router.route('/get_projects/:email').get(verifyToken, ProjectController.find_project_due_by_email);

router.route('/find-project/:card_id').get(verifyToken, ProjectController.find_project_by_id);

router.route('/add').post([
    body('name')
        .notEmpty()
        .withMessage('Project Title cannot be empty'),
    body('desc')
        .notEmpty()
        .withMessage('Please enter a description for the project'),
    body('status')
        .notEmpty()
        .withMessage('Status cannot be empty'),
    body('due')
        .notEmpty()
        .withMessage('Due date cannot be empty'),
], verifyToken, ProjectController.add_project);

router.route('/find/project/:proj_id').get(verifyToken, ProjectController.find_project);

router.route('/get_projects_stats/:email').get(verifyToken, ProjectController.get_proj_stats);

router.route('/update/project').put(verifyToken, ProjectController.update_project);

router.route('/remove/member').put(verifyToken, ProjectController.remove_member);

router.route('/add/admin').put(verifyToken, ProjectController.add_admin);

router.route('/remove/admin').put(verifyToken, ProjectController.remove_admin);

router.route('/delete/project/:id').delete(verifyToken, ProjectController.delete_project_by_id);

module.exports = router;