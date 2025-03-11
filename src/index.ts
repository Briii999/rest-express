import express, { Application, Request, Response } from "express";
import { UserRouter } from "./routers/user.router";

const PORT: number = 8000;

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).send({
    status: "success",
    message: "Welcome to the rest-express API",
  });
});

const userRouter = new UserRouter();
app.use("/api/users", userRouter.getRouter());

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
