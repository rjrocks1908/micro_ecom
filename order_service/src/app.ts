import express, { Request, Response } from "express";
import cors from "cors";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", cartRoutes);
app.use("/api", orderRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello from Order Service" });
});


export default app;
