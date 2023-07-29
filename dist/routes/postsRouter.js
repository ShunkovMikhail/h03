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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const mongo_repository_1 = require("../repositories/mongo-repository");
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const express_validator_1 = require("express-validator");
const inputValidation_1 = require("../inputValidation");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.post('/', (0, express_basic_auth_1.default)({ users: mongo_repository_1.admins }), inputValidation_1.postVdChain, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    if (result.isEmpty()) {
        const newEntry = {
            id: yield mongo_repository_1.DB.newID('posts'),
            blogId: req.body.blogId,
            blogName: yield mongo_repository_1.DB.getProperty('blogs', req.body.blogId, 'name'),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            createdAt: new Date().toISOString()
        };
        yield mongo_repository_1.DB.create('posts', newEntry);
        res.status(201).json(newEntry);
    }
    else {
        res.status(400).json({ errorsMessages: result.array().map(({ path, msg }) => ({ message: msg, field: path })) });
    }
}));
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json(yield mongo_repository_1.DB.getAll('posts'));
}));
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield mongo_repository_1.DB.exists('posts', req.params.id))) {
        res.sendStatus(404);
    }
    else {
        res.status(200).json(yield mongo_repository_1.DB.get('posts', req.params.id));
    }
}));
exports.postsRouter.put('/:id', (0, express_basic_auth_1.default)({ users: mongo_repository_1.admins }), inputValidation_1.postVdChain, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield mongo_repository_1.DB.exists('posts', req.params.id))) {
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
            yield mongo_repository_1.DB.update('posts', req.params.id, updateEntry);
            res.sendStatus(204);
        }
        else {
            res.status(400).json({ errorsMessages: result.array().map(({ path, msg }) => ({ message: msg, field: path })) });
        }
    }
}));
exports.postsRouter.delete('/:id', (0, express_basic_auth_1.default)({ users: mongo_repository_1.admins }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendStatus(yield mongo_repository_1.DB.delete('posts', req.params.id));
}));
