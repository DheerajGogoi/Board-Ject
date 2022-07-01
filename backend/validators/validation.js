const { body, validationResult } = require('express-validator');

exports.projValidation = [
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
]