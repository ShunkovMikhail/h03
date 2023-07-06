"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const data_1 = require("../data");
const data_2 = require("../data");
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const express_validator_1 = require("express-validator");
const inputValidation_1 = require("../inputValidation");
exports.postsRouter = (0, express_1.Router)({});
const db = new data_1.DB();
exports.postsRouter.post('/', (0, express_basic_auth_1.default)({ users: data_2.admins }), inputValidation_1.postVdChain, (req, res) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (result.isEmpty()) {
        const newEntry = {
            id: db.nextID(data_1.TABLE.POSTS),
            blogId: req.body.blogId,
            blogName: db.getProperty(data_1.TABLE.BLOGS, req.body.blogId, 'name'),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content
        };
        db.create(data_1.TABLE.POSTS, newEntry);
        res.status(201).json(newEntry);
    }
    else {
        res.status(400).json({ errorsMessages: result.array().map(({ path, msg }) => ({ message: msg, field: path })) });
    }
});
exports.postsRouter.get('/', (req, res) => {
    res.status(200).json(db.getAll(data_1.TABLE.POSTS));
});
exports.postsRouter.get('/:id', (req, res) => {
    if (!db.exists(data_1.TABLE.POSTS, req.params.id)) {
        res.sendStatus(404);
    }
    else {
        res.status(200).json(db.get(data_1.TABLE.POSTS, req.params.id));
    }
});
exports.postsRouter.put('/:id', (0, express_basic_auth_1.default)({ users: data_2.admins }), inputValidation_1.postVdChain, (req, res) => {
    if (!db.exists(data_1.TABLE.POSTS, req.params.id)) {
        res.sendStatus(404);
    }
    else {
        const result = (0, express_validator_1.validationResult)(req);
        if (result.isEmpty()) {
            const updateEntry = {
                blogId: req.body.blogId,
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content
            };
            db.update(data_1.TABLE.POSTS, req.params.id, updateEntry);
            res.sendStatus(204);
        }
        else {
            res.status(400).json({ errorsMessages: result.array().map(({ path, msg }) => ({ message: msg, field: path })) });
        }
    }
});
exports.postsRouter.delete('/:id', (0, express_basic_auth_1.default)({ users: data_2.admins }), (req, res) => {
    res.sendStatus(db.delete(data_1.TABLE.POSTS, req.params.id));
});
