import app from "./app";
import * as process from "process";

/**
 * Error Handler. Provides full stack - remove for production
 */
if(process.env.NODE_ENV !== "production") {
  // This need to be ignored to avoid load dev packages on prod environment
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const errorHandler = require("errorhandler");
  app.use(errorHandler());
}

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});

export default server;
