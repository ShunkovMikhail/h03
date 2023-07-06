"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postVdChain = exports.blogVdChain = void 0;
const express_validator_1 = require("express-validator");
const data_1 = require("./data");
const urlRGX = new RegExp('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$');
const db = new data_1.DB();
const urlRGXValidation = (value) => {
    if (!urlRGX.test(value)) {
        throw new Error('Incorrect regex!');
    }
    return true;
};
const blogExists = (id) => {
    if (!db.exists(data_1.TABLE.BLOGS, id)) {
        throw new Error('blogId does not exist!');
    }
    return true;
};
exports.blogVdChain = [
    (0, express_validator_1.body)('name', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({ min: 1, max: 15 }).withMessage('Too many characters! (maxLength: 15)'),
    (0, express_validator_1.body)('description', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({ min: 1, max: 500 }).withMessage('Too many characters! (maxLength: 500)'),
    (0, express_validator_1.body)('websiteUrl', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({ min: 1, max: 100 }).withMessage('Too many characters! (maxLength: 100)')
        .bail()
        .custom(value => urlRGXValidation(value))
];
exports.postVdChain = [
    (0, express_validator_1.body)('blogId', 'Incorrect id!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({ min: 1, max: 64 })
        .bail()
        .custom(id => blogExists(id)),
    (0, express_validator_1.body)('title', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({ min: 1, max: 30 }).withMessage('Too many characters! (maxLength: 30)'),
    (0, express_validator_1.body)('shortDescription', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({ min: 1, max: 100 }).withMessage('Too many characters! (maxLength: 100)'),
    (0, express_validator_1.body)('content', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({ min: 1, max: 1000 }).withMessage('Too many characters! (maxLength: 1000)')
];
