import * as uuid from "uuid";
import { Response, Request } from "express";
import { Route } from "./route.interface";
import InMemoryGeniallyRepository from "../../contexts/core/genially/infrastructure/InMemoryGeniallyRepository";
import MongoGeniallyRepository from "../../contexts/core/genially/infrastructure/MongoGeniallyRepository";
//This could be directly exported from a repository provider, I did it here just to simplify the test
const selectedRepo = process.env.REPO_MODE === "mongodb" ? MongoGeniallyRepository : InMemoryGeniallyRepository;
import CreateGeniallyService from "../../contexts/core/genially/application/CreateGeniallyService";
import DeleteGeniallyService from "../../contexts/core/genially/application/DeleteGeniallyService";
import RenameGeniallyService from "../../contexts/core/genially/application/RenameGeniallyService";
import GetGeniallyService from "../../contexts/core/genially/application/GetGeniallyService";
const BASE_PATH = "/genially";
const create = async (req: Request, res: Response) => {
    const service = new CreateGeniallyService(new InMemoryGeniallyRepository());

    const { id = uuid.v4() , name , description } = req.body;

    const result = await service.execute({ id, name, description });
    return result instanceof Error ?
        res.status(400).send({ status: "ko", message: result.message }) :
        res.status(200).send(result);
};

 const remove = async (req: Request, res: Response) => {
     const {id} = req.body;
     const service = new DeleteGeniallyService(new selectedRepo());
     const result = await service.execute({id});

     return result instanceof Error ?
         res.status(400).send({ status: "ko", message: result.message }) :
         res.status(200).send({status: "ok"});
 };

const rename = async (req: Request, res: Response) => {
    const {id, name} = req.body;
    const service = new RenameGeniallyService(new selectedRepo());
    const result = await service.execute({id, name});

    return result instanceof Error ?
        res.status(400).send({status: "ko", message: result.message}) :
        res.status(200).send(result);
};

const getList = async (req: Request, res: Response) => {
    const service = new GetGeniallyService(new selectedRepo());

    const size = req.query.size ? parseInt(req.query.size.toString()) : 5;
    const page = req.query.page ? parseInt(req.query.page.toString()) : 1;

    const result = await service.execute({ size, page });
    return res.status(200).send(result);
};

const controllers: Route[] = [
    { method: "get" , path: `${BASE_PATH}`, controller: getList },
    { method: "post" , path: `${BASE_PATH}`, controller: create },
    { method: "delete", path: `${BASE_PATH}`, controller: remove },
    { method: "patch", path: `${BASE_PATH}`, controller: rename }
];

export default controllers;