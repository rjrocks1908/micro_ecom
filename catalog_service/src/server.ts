import app from "./app";

const PORT = process.env.PORT || 8000;

export const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  process.on("uncaughtException", async (error) => {
    console.log(error);
    process.exit(1);
  });
};

startServer().then(() => {
  console.log(`Server is UP`);
});
