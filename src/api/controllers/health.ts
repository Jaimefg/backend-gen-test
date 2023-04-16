import { Response, Request } from "express";
import { Route } from "./route.interface";

const BASE_PATH = "/";
export const check = (req: Request, res: Response) => {
  res.status(200).send({ status: "ok" });
};

const controllers: Route[] = [
  { method: "get", path: `${BASE_PATH}`, controller: check}
];

export default controllers;