"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const data_1 = require("../data");
const data_2 = require("../data");
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const express_validator_1 = require("express-validator");
const inputValidation_1 = require("../inputValidation");
exports.blogsRouter = (0, express_1.Router)({});
const db = new data_1.DB();
exports.blogsRouter.post('/', (0, express_basic_auth_1.default)({ users: data_2.admins }), inputValidation_1.blogVdChain, (req, res) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (result.isEmpty()) {
        const newEntry = {
            id: db.nextID(data_1.TABLE.BLOGS),
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        };
        db.create(data_1.TABLE.BLOGS, newEntry);
        res.status(201).json(newEntry);
    }
    else {
        res.status(400).json({ errorsMessages: result.array().map(({ path, msg }) => ({ message: msg, field: path })) });
    }
});
exports.blogsRouter.get('/', (req, res) => {
    res.status(200).json(db.getAll(data_1.TABLE.BLOGS));
});
exports.blogsRouter.get('/:id', (req, res) => {
    if (!db.exists(data_1.TABLE.BLOGS, req.params.id)) {
        res.sendStatus(404);
    }
    else {
        res.status(200).json(db.get(data_1.TABLE.BLOGS, req.params.id));
    }
});
exports.blogsRouter.put('/:id', (0, express_basic_auth_1.default)({ users: data_2.admins }), inputValidation_1.blogVdChain, (req, res) => {
    if (!db.exists(data_1.TABLE.BLOGS, req.params.id)) {
        res.sendStatus(404);
    }
    else {
        const result = (0, express_validator_1.validationResult)(req);
        if (result.isEmpty()) {
            const updateEntry = {
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl
            };
            db.update(data_1.TABLE.BLOGS, req.params.id, updateEntry);
            res.sendStatus(204);
        }
        else {
            res.status(400).json({ errorsMessages: result.array().map(({ path, msg }) => ({ message: msg, field: path })) });
        }
    }
});
exports.blogsRouter.delete('/:id', (0, express_basic_auth_1.default)({ users: data_2.admins }), (req, res) => {
    res.sendStatus(db.delete(data_1.TABLE.BLOGS, req.params.id));
});
