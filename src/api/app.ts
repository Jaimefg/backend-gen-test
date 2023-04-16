import bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import lusca from "lusca";

// Controllers (route handlers)
import healthController from "./controllers/health";
import geniallyController from "./controllers/genially";

const apiControllers = [healthController, geniallyController];

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

//Adding all routes dynamically
apiControllers.forEach((apiController) => apiController.forEach((controllers) => {
    const { method, path, controller} = controllers;
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    app[method](path, controller);
}));

export default app;
