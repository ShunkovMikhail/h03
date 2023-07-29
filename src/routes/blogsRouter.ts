import { Request, Response, Router } from 'express'
import { DB, admins } from '../repositories/mongo-repository'
import {
    TypeOfRequestP, TypeOfRequestBody, TypeOfRequestP_Body,
    BlogViewModel, BlogInputModel
} from "../types/models"

import basicAuth from "express-basic-auth"
import {Result, validationResult} from "express-validator";
import { blogVdChain } from "../inputValidation";

export const blogsRouter = Router({})



blogsRouter.post('/', basicAuth({users: admins}), blogVdChain, async (req: TypeOfRequestBody<BlogInputModel>, res: Response) => {

    const result: Result = validationResult(req)

    if (result.isEmpty()) {

        const newEntry: BlogViewModel = {
            id: await DB.newID('blogs'),
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        await DB.create('blogs', newEntry)
        res.status(201).json(newEntry)

    } else {
        res.status(400).json({errorsMessages: result.array().map(({path, msg}) => ({message: msg, field: path}))})
    }
})



blogsRouter.get('/', async (req: Request, res: Response<Array<object | null>>) => {
    res.status(200).json(await DB.getAll('blogs'))
})



blogsRouter.get('/:id', async (req: TypeOfRequestP<{ id: string }>, res: Response<object | null>) => {

    if (!await DB.exists('blogs', req.params.id)) {
        res.sendStatus(404)
    } else {
        res.status(200).json(await DB.get('blogs', req.params.id))
    }
})



blogsRouter.put('/:id', basicAuth({users: admins}), blogVdChain, async (req: TypeOfRequestP_Body<{ id: string },
    BlogInputModel>, res: Response) => {
    if (!await DB.exists('blogs', req.params.id)) {
        res.sendStatus(404)
    } else {

        const result: Result = validationResult(req)

        if (result.isEmpty()) {

            const updateEntry: BlogInputModel = {
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl
            }

            await DB.update('blogs', req.params.id, updateEntry)
            res.sendStatus(204)

        } else {
            res.status(400).json({errorsMessages: result.array().map(({path, msg}) => ({message: msg, field: path}))})
        }
    }
})



blogsRouter.delete('/:id', basicAuth({users: admins}), async (req: TypeOfRequestP<{ id: string }>, res: Response) => {
    res.sendStatus(await DB.delete('blogs', req.params.id))
})


