import express from "express";
import userRouter from "./routers/user";
import workerRouter from "./routers/worker";
const app = express();

app.use("/api/user", userRouter)
app.use("/api/worker", workerRouter)


app.listen(3000, () => {
    console.log("Server started on port 3000")
})