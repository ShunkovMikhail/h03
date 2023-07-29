"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postVdChain = exports.blogVdChain = void 0;
const express_validator_1 = require("express-validator");
const mongo_repository_1 = require("./repositories/mongo-repository");
const urlRGX = new RegExp('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$');
const urlRGXValidation = (value) => {
    if (!urlRGX.test(value)) {
        throw new Error('Incorrect regex!');
    }
    return true;
};
const blogExists = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield mongo_repository_1.DB.exists('blogs', id))) {
        throw new Error('blogId does not exist!');
    }
    return true;
});
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
