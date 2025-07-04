import express from "express";
import catalogRoutes from "./api/catalog.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", catalogRoutes);

export default app;
