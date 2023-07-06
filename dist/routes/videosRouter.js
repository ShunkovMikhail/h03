"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const data_1 = require("../data");
const inputValidation_1 = require("../inputValidation");
exports.videosRouter = (0, express_1.Router)({});
const db = new data_1.DB();
const validate = new inputValidation_1.Validate();
exports.videosRouter.post('/', (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
    }
    else {
        const result = validate.CreateVideo(req.body);
        if (result.Success) {
            const newEntry = {
                id: db.nextID(data_1.TABLE.VIDEOS),
                title: req.body.title,
                author: req.body.author,
                canBeDownloaded: false,
                minAgeRestriction: null,
                createdAt: new Date().toISOString(),
                publicationDate: new Date(Date.now() + 86400000).toISOString(),
                availableResolutions: req.body.availableResolutions
            };
            db.create(data_1.TABLE.VIDEOS, newEntry);
            res.status(result.HTTPStatus).json(newEntry);
        }
        else {
            res.status(result.HTTPStatus).json(result.Response);
        }
    }
});
exports.videosRouter.post('/:id', (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
    }
    else {
        const result = validate.CreateVideo(req.body);
        if (result.Success) {
            const newEntry = {
                id: db.nextID(data_1.TABLE.VIDEOS),
                title: req.body.title,
                author: req.body.author,
                canBeDownloaded: false,
                minAgeRestriction: null,
                createdAt: new Date().toISOString(),
                publicationDate: new Date(Date.now() + 86400000).toISOString(),
                availableResolutions: req.body.availableResolutions
            };
            db.createAtID(data_1.TABLE.VIDEOS, +req.params.id, newEntry);
            res.status(result.HTTPStatus).json(newEntry);
        }
        else {
            res.status(result.HTTPStatus).json(result.Response);
        }
    }
});
exports.videosRouter.get('/', (req, res) => {
    res.status(200).json(db.getAll(data_1.TABLE.VIDEOS));
});
exports.videosRouter.get('/:id', (req, res) => {
    if (!db.exists(data_1.TABLE.VIDEOS, +req.params.id)) {
        res.sendStatus(404);
    }
    else {
        res.status(200).json(db.get(data_1.TABLE.VIDEOS, +req.params.id));
    }
});
exports.videosRouter.put('/:id', (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
    }
    else if (!db.exists(data_1.TABLE.VIDEOS, +req.params.id)) {
        res.sendStatus(404);
    }
    else {
        const result = validate.UpdateVideo(req.body);
        if (result.Success) {
            const updateEntry = {
                title: req.body.title,
                author: req.body.author,
                canBeDownloaded: req.body.canBeDownloaded,
                minAgeRestriction: req.body.minAgeRestriction,
                publicationDate: req.body.publicationDate,
                availableResolutions: req.body.availableResolutions
            };
            db.update(data_1.TABLE.VIDEOS, +req.params.id, updateEntry);
            res.sendStatus(result.HTTPStatus);
        }
        else {
            res.status(result.HTTPStatus).json(result.Response);
        }
    }
});
exports.videosRouter.delete('/:id', (req, res) => {
    res.sendStatus(db.delete(data_1.TABLE.VIDEOS, +req.params.id));
});
