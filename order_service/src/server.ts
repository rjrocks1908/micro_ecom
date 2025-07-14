import app from "./app";
import { logger } from "./utils";

const PORT = process.env.PORT || 8001;

export const startServer = async () => {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });

  process.on("uncaughtException", async (error) => {
    logger.error(error);
    process.exit(1);
  });
};

startServer().then(() => {
  logger.info(`Server is UP`);
});
