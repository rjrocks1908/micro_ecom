import express from "express";
import { router } from "./routes/authRoutes";

const app = express();

const PORT = process.env.PORT || 8003;

app.use("/auth", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
