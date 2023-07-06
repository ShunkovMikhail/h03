import { Request, Response, Router } from 'express'
import { DB, TABLE } from '../data'
import {
    TypeOfRequestP, TypeOfRequestBody, TypeOfRequestP_Body,
    PostViewModel, PostInputModel
} from "../types/models"

import { admins } from "../data"
import basicAuth from "express-basic-auth"
import { Result, validationResult } from "express-validator";
import { postVdChain } from "../inputValidation";

export const postsRouter = Router({})

const db: DB = new DB()



postsRouter.post('/', basicAuth({users: admins}), postVdChain, (req: TypeOfRequestBody<PostInputModel>, res: Response) => {

    const result: Result = validationResult(req);

    if (result.isEmpty()) {

        const newEntry: PostViewModel = {
            id: db.nextID(TABLE.POSTS),
            blogId: req.body.blogId,
            blogName: db.getProperty(TABLE.BLOGS, req.body.blogId, 'name'),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content
        }

        db.create(TABLE.POSTS, newEntry)
        res.status(201).json(newEntry)
    } else {
        res.status(400).json({ errorsMessages: result.array().map(({ path, msg }) => ({ message: msg, field: path })) })
    }
})



postsRouter.get('/', (req: Request, res: Response<Array<object | null>>) => {
    res.status(200).json(db.getAll(TABLE.POSTS))
})



postsRouter.get('/:id', (req: TypeOfRequestP<{id: string}>, res: Response<object | null>) => {

    if (!db.exists(TABLE.POSTS, req.params.id)) {
        res.sendStatus(404)
    } else {
        res.status(200).json(db.get(TABLE.POSTS, req.params.id))
    }
})



postsRouter.put('/:id', basicAuth({users: admins}), postVdChain, (req: TypeOfRequestP_Body<{id: string},
    PostInputModel>, res: Response) => {
    if (!db.exists(TABLE.POSTS, req.params.id)) {
        res.sendStatus(404)
    } else {

        const result: Result = validationResult(req)

        if (result.isEmpty()) {

            const updateEntry: PostInputModel = {
                blogId: req.body.blogId,
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content
            }

            db.update(TABLE.POSTS, req.params.id, updateEntry)
            res.sendStatus(204)

        } else {
            res.status(400).json({ errorsMessages: result.array().map(({ path, msg }) => ({ message: msg, field: path })) })
        }
    }
})



postsRouter.delete('/:id', basicAuth({users: admins}), (req: TypeOfRequestP<{id: string}>, res: Response) => {
    res.sendStatus(db.delete(TABLE.POSTS, req.params.id))
})


