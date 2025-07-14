import express from "express";
import catalogRoutes from "./api/catalog.routes";
import { HandleErrorWithLogger, httpLogger } from "./utils";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);

app.use("/api", catalogRoutes);

app.use(HandleErrorWithLogger);

export default app;
