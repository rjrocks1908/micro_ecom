import express, { Request, Response } from "express";
import cors from "cors";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import { httpLogger, HandleErrorWithLogger } from "./utils";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);

app.use("/api", cartRoutes);
app.use("/api", orderRoutes);

app.use("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello from Order Service" });
});

app.use(HandleErrorWithLogger);

export default app;
